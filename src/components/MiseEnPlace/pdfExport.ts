import { formatQty } from './utils'
import type { MiseEventInput, MisePlan, StaffMember, WeeklyTotal } from './types'
import { STAFF_ROLE_LABEL } from './types'

interface ExportArgs {
    weekLabel: string
    inputs: MiseEventInput[]
    plan: MisePlan
    totals: WeeklyTotal[]
    staffByOrder: Record<string, StaffMember[]>
    instructions: string
    checked: Set<string>
}

const ACCENT: [number, number, number] = [230, 143, 55]

/**
 * PDF con el mismo formato que los documentos del cliente: encabezado de
 * semana, ficha por evento (día — cliente | personas | momento, lugar,
 * equipo, tabla Tarea · Cantidad · Hecho · Notas), y resumen de totales.
 * jspdf y jspdf-autotable se cargan recién al exportar.
 */
export async function exportMiseEnPlacePdf(args: ExportArgs): Promise<void> {
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
    ])
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const marginX = 14
    let y = 18

    const finalY = () => (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y
    const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - 14) {
            doc.addPage()
            y = 18
        }
    }

    // Encabezado
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.setTextColor(30, 30, 30)
    doc.text(`MISE EN PLACE — ${args.weekLabel.toUpperCase()}`, marginX, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text("Fuegos d'Azur · Equipo de cocina y logística", marginX, y)
    if (args.instructions) {
        y += 5
        doc.setTextColor(180, 90, 0)
        const lines = doc.splitTextToSize(`Actualizado: ${args.instructions}`, pageWidth - marginX * 2)
        doc.text(lines, marginX, y)
        y += lines.length * 4
    }
    y += 6

    const drawCheckbox = (data: { cell: { x: number; y: number; width: number; height: number }; section: string; column: { index: number } }, colIndex: number, isChecked: boolean) => {
        if (data.section !== 'body' || data.column.index !== colIndex) return
        const size = 3.4
        const x = data.cell.x + data.cell.width / 2 - size / 2
        const cy = data.cell.y + data.cell.height / 2 - size / 2
        doc.setDrawColor(90, 90, 90)
        doc.setLineWidth(0.3)
        doc.rect(x, cy, size, size)
        if (isChecked) {
            doc.setDrawColor(...ACCENT)
            doc.setLineWidth(0.6)
            doc.line(x + 0.6, cy + 1.8, x + 1.4, cy + 2.7)
            doc.line(x + 1.4, cy + 2.7, x + 2.9, cy + 0.7)
        }
    }

    args.inputs.forEach((input) => {
        const ev = args.plan.events.find((e) => e.orderId === input.orderId)
        if (!ev) return

        ensureSpace(30)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.setTextColor(...ACCENT)
        doc.text(`${input.dayLabel} — ${input.client} | ${input.guests} personas | ${input.moment}${input.time ? ` ${input.time}` : ''}`, marginX, y)
        y += 5
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(60, 60, 60)
        if (input.place) {
            doc.text(`Lugar: ${input.place}`, marginX, y)
            y += 4.5
        }
        const team = args.staffByOrder[input.orderId] || []
        if (team.length > 0) {
            doc.text(`Equipo: ${team.map((m) => `${m.name} (${STAFF_ROLE_LABEL[m.role]})`).join(', ')}`, marginX, y)
            y += 4.5
        }
        const menu = [...input.entrees, ...input.viandes, input.dessert].filter(Boolean).join(', ')
        if (menu) {
            const lines = doc.splitTextToSize(`Menú: ${menu}`, pageWidth - marginX * 2)
            doc.text(lines, marginX, y)
            y += lines.length * 4
        }
        y += 1

        const rows: { id: string; label: string; qty: string; note: string }[] = [
            ...ev.tasks.map((t) => ({ id: t.id, label: t.label, qty: t.toConfirm ? 'A confirmar' : formatQty(t.quantity, t.unit), note: t.note || '' })),
            ...ev.standardMaterial.map((m, i) => ({ id: `${input.orderId}-std-${i}`, label: m, qty: '1 un.', note: '' })),
            ...ev.specificMaterial.map((t) => ({ id: t.id, label: `Material: ${t.label}`, qty: t.toConfirm ? 'A confirmar' : formatQty(t.quantity, t.unit), note: t.note || '' })),
        ]

        autoTable(doc, {
            startY: y,
            margin: { left: marginX, right: marginX },
            head: [['Tarea', 'Cantidad', 'Hecho', 'Notas']],
            body: rows.map((r) => [r.label, r.qty, '', r.note]),
            styles: { fontSize: 9, cellPadding: 1.8, textColor: [40, 40, 40] },
            headStyles: { fillColor: ACCENT, textColor: 255, fontStyle: 'bold' },
            columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 30, halign: 'right' }, 2: { cellWidth: 16, halign: 'center' }, 3: { cellWidth: 'auto' } },
            didDrawCell: (data) => {
                const row = rows[data.row.index]
                if (row) drawCheckbox(data, 2, args.checked.has(row.id))
            },
        })
        y = finalY() + 3

        if (ev.pendingQuestions.length > 0) {
            ensureSpace(6 + ev.pendingQuestions.length * 4)
            doc.setFont('helvetica', 'italic')
            doc.setFontSize(8.5)
            doc.setTextColor(180, 90, 0)
            doc.text('A confirmar con el cliente:', marginX, y)
            y += 4
            ev.pendingQuestions.forEach((q) => {
                const lines = doc.splitTextToSize(`• ${q}`, pageWidth - marginX * 2 - 4)
                doc.text(lines, marginX + 2, y)
                y += lines.length * 3.8
            })
            doc.setFont('helvetica', 'normal')
        }
        y += 6
    })

    // Resumen de totales
    ensureSpace(30)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...ACCENT)
    doc.text('RESUMEN DE CANTIDADES TOTALES', marginX, y)
    y += 4
    autoTable(doc, {
        startY: y,
        margin: { left: marginX, right: marginX },
        head: [['Producto', 'Total', 'Detalle']],
        body: args.totals.map((t) => [
            t.label,
            formatQty(t.total, t.unit),
            t.breakdown.map((b) => `${b.client} ${formatQty(b.quantity, null)}`).join(' + '),
        ]),
        styles: { fontSize: 9, cellPadding: 1.8, textColor: [40, 40, 40] },
        headStyles: { fillColor: ACCENT, textColor: 255, fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }, 2: { cellWidth: 'auto', textColor: [110, 110, 110] } },
    })
    y = finalY() + 5

    if (args.plan.generalTasks.length > 0) {
        ensureSpace(20)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
        doc.text('Tareas generales de la semana', marginX, y)
        y += 3
        autoTable(doc, {
            startY: y,
            margin: { left: marginX, right: marginX },
            head: [['Tarea', 'Cantidad', 'Hecho']],
            body: args.plan.generalTasks.map((t) => [t.label + (t.note ? ` — ${t.note}` : ''), formatQty(t.quantity, t.unit), '']),
            styles: { fontSize: 9, cellPadding: 1.8 },
            headStyles: { fillColor: [120, 120, 120], textColor: 255 },
            columnStyles: { 1: { cellWidth: 30, halign: 'right' }, 2: { cellWidth: 16, halign: 'center' } },
            didDrawCell: (data) => drawCheckbox(data, 2, false),
        })
        y = finalY() + 5
    }

    if (args.plan.notes) {
        ensureSpace(12)
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8.5)
        doc.setTextColor(110, 110, 110)
        const lines = doc.splitTextToSize(`Nota: ${args.plan.notes}`, pageWidth - marginX * 2)
        doc.text(lines, marginX, y)
    }

    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`Página ${i} / ${pageCount}`, pageWidth - marginX, pageHeight - 8, { align: 'right' })
        doc.text("Generado por el panel de Fuegos d'Azur", marginX, pageHeight - 8)
    }

    const slug = args.weekLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    doc.save(`mise-en-place-${slug}.pdf`)
}
