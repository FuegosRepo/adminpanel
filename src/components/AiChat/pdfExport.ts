/**
 * Genera el PDF de la lista de compras con formato de verdad (títulos,
 * negrita, viñetas), en vez de volcar el texto crudo de la respuesta.
 * jsPDF no soporta markdown ni texto enriquecido en una sola llamada,
 * así que se arma línea por línea, midiendo el ancho de cada palabra
 * para el salto de renglón manual.
 */

interface Segment {
    text: string
    bold: boolean
}

const ACCENT: [number, number, number] = [230, 143, 55] // aprox. --primary del panel

function parseInlineSegments(line: string): Segment[] {
    return line
        .split(/(\*\*[^*]+\*\*)/g)
        .filter(Boolean)
        .map((part) =>
            part.startsWith('**') && part.endsWith('**')
                ? { text: sanitizeForPdf(part.slice(2, -2)), bold: true }
                : { text: sanitizeForPdf(part), bold: false }
        )
}

/**
 * A veces el modelo devuelve un título "decorativo" con un espacio entre
 * cada letra (ej: "L i s t a   d e   C o m p r a s"). Se detecta por la
 * proporción de palabras de una sola letra y se colapsa.
 */
function collapseLetterSpacing(text: string): string {
    const cleaned = text.replace(/['"]+$/, '').trim()
    const words = cleaned.split(/\s+/)
    const singleCharRatio = words.filter((w) => w.length === 1).length / words.length
    if (words.length >= 5 && singleCharRatio > 0.6) {
        return words.join('')
    }
    return cleaned
}

/**
 * La fuente helvetica de jsPDF solo soporta Latin-1 (WinAnsi) — cualquier
 * emoji o símbolo fuera de ese rango (✅, →, ⚠️...) rompe el renderizado de
 * TODA la línea (glifo faltante con ancho mal calculado, el texto sale
 * espaciado letra por letra). Primero se reemplazan los símbolos conocidos
 * por su equivalente en texto, y como red de seguridad se saca cualquier
 * carácter restante fuera de Latin-1.
 */
function sanitizeForPdf(text: string): string {
    return text
        .replace(/→/g, '->')
        .replace(/✅/g, '')
        .replace(/⚠️?/g, '[!]')
        // eslint-disable-next-line no-control-regex
        .replace(/[^\u0000-ÿ]/g, '')
}

function isTableRow(line: string): boolean {
    return line.startsWith('|') && line.endsWith('|')
}

function isTableSeparatorRow(line: string): boolean {
    if (!isTableRow(line)) return false
    const cells = line.slice(1, -1).split('|')
    return cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell.trim()))
}

function parseTableRow(line: string): string[] {
    return line
        .slice(1, -1)
        .split('|')
        .map((cell) => sanitizeForPdf(cell.replace(/\*\*/g, '').trim()))
}

export async function exportShoppingListPdf(text: string, fileSuffix?: string): Promise<void> {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()

    const marginX = 16
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const maxWidth = pageWidth - marginX * 2
    let y = 20

    const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - 16) {
            doc.addPage()
            y = 20
        }
    }

    // Encabezado
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(30, 30, 30)
    doc.text('Lista de Compras', marginX, y)
    y += 6.5
    doc.setFontSize(11)
    doc.setTextColor(...ACCENT)
    doc.text("Fuegos d'Azur", marginX, y)
    y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(130, 130, 130)
    doc.text(new Date().toLocaleDateString('es-AR'), marginX, y)
    y += 8
    doc.setDrawColor(...ACCENT)
    doc.setLineWidth(0.6)
    doc.line(marginX, y, pageWidth - marginX, y)
    y += 9

    /** Arma renglones respetando el ancho de página, con negrita por palabra. */
    const drawParagraph = (
        segments: Segment[],
        indent: number,
        fontSize: number,
        lineHeight: number,
        color: [number, number, number] = [40, 40, 40]
    ) => {
        doc.setFontSize(fontSize)
        const words: Segment[] = []
        segments.forEach((seg) => {
            seg.text.split(/(\s+)/).forEach((chunk) => {
                if (chunk !== '') words.push({ text: chunk, bold: seg.bold })
            })
        })

        const availableWidth = maxWidth - indent
        let currentLine: Segment[] = []
        let currentWidth = 0

        const flushLine = () => {
            if (currentLine.length === 0) return
            ensureSpace(lineHeight)
            let curX = marginX + indent
            currentLine.forEach((w) => {
                doc.setFont('helvetica', w.bold ? 'bold' : 'normal')
                doc.setTextColor(color[0], color[1], color[2])
                doc.text(w.text, curX, y)
                curX += doc.getTextWidth(w.text)
            })
            y += lineHeight
            currentLine = []
            currentWidth = 0
        }

        words.forEach((w) => {
            doc.setFont('helvetica', w.bold ? 'bold' : 'normal')
            const wWidth = doc.getTextWidth(w.text)
            if (currentWidth + wWidth > availableWidth && currentLine.length > 0) {
                flushLine()
            }
            currentLine.push(w)
            currentWidth += wWidth
        })
        flushLine()
    }

    const lines = text.split('\n')
    let i = 0
    while (i < lines.length) {
        const line = lines[i].trim()

        // Tabla Markdown: fila de encabezado, fila separadora (|---|---|), filas de datos.
        if (isTableRow(line) && isTableSeparatorRow((lines[i + 1] || '').trim())) {
            const head = [parseTableRow(line)]
            const body: string[][] = []
            let j = i + 2
            while (j < lines.length && isTableRow(lines[j].trim())) {
                body.push(parseTableRow(lines[j].trim()))
                j += 1
            }
            ensureSpace(14)
            autoTable(doc, {
                startY: y,
                head,
                body,
                margin: { left: marginX, right: marginX },
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fillColor: ACCENT, textColor: 255, fontStyle: 'bold' },
                theme: 'grid',
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            y = (doc as any).lastAutoTable.finalY + 6
            i = j
            continue
        }

        if (line === '') {
            y += 3
            i += 1
            continue
        }

        if (line === '---') {
            ensureSpace(6)
            doc.setDrawColor(225, 225, 225)
            doc.setLineWidth(0.2)
            doc.line(marginX, y, pageWidth - marginX, y)
            y += 6
            i += 1
            continue
        }

        const headerMatch = line.match(/^(#{1,4})\s+(.*)$/)
        if (headerMatch) {
            const level = headerMatch[1].length
            const content = sanitizeForPdf(collapseLetterSpacing(headerMatch[2]))
            ensureSpace(10)
            y += 3
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(level <= 2 ? 13 : 11.5)
            doc.setTextColor(...ACCENT)
            doc.text(content, marginX, y)
            y += level <= 2 ? 6.5 : 5.5
            i += 1
            continue
        }

        const bulletMatch = line.match(/^[-•]\s+(.*)$/)
        if (bulletMatch) {
            ensureSpace(6)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(10.5)
            doc.setTextColor(...ACCENT)
            doc.text('•', marginX + 2, y)
            drawParagraph(parseInlineSegments(bulletMatch[1]), 8, 10.5, 5.4)
            i += 1
            continue
        }

        const numberedMatch = line.match(/^(\d+[.)]\s+)(.*)$/)
        if (numberedMatch) {
            ensureSpace(6)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(10.5)
            doc.setTextColor(...ACCENT)
            doc.text(numberedMatch[1].trim(), marginX, y)
            drawParagraph(parseInlineSegments(numberedMatch[2]), 8, 10.5, 5.4)
            i += 1
            continue
        }

        drawParagraph(parseInlineSegments(collapseLetterSpacing(line)), 0, 10.5, 5.4)
        i += 1
    }

    const suffix = fileSuffix ? `${fileSuffix.replace(/\s+/g, '-').toLowerCase()}-` : ''
    doc.save(`lista-compras-${suffix}${new Date().toISOString().split('T')[0]}.pdf`)
}
