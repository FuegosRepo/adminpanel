import type { ReactNode } from 'react'

/**
 * Renderizador de markdown mínimo, a propósito sin librería nueva: cubre
 * justo lo que el modelo devuelve en las listas de compras (títulos con
 * #/##/###, negrita con **texto**, listas con "-" o "1.", separadores
 * "---"). No es un parser de markdown completo, es liviano y predecible.
 */

/**
 * A veces el modelo devuelve un título "decorativo" con un espacio entre
 * cada letra (ej: "L i s t a   d e   C o m p r a s"). Colapsarlo con
 * replace(/\s+/g, ' ') no alcanza porque cada espacio ya es único —
 * se detecta por la proporción de palabras de una sola letra.
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

function renderInline(text: string, keyPrefix: string): ReactNode[] {
    // Corta por **negrita**, conservando el resto como texto plano.
    const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
        }
        return <span key={`${keyPrefix}-${i}`}>{part}</span>
    })
}

export function renderMarkdownLite(text: string): ReactNode {
    const lines = text.split('\n')
    const blocks: ReactNode[] = []
    let listItems: string[] = []
    let listKey = 0

    const flushList = () => {
        if (listItems.length === 0) return
        blocks.push(
            <ul key={`ul-${listKey++}`} className="list-disc pl-5 space-y-0.5 my-1.5">
                {listItems.map((item, i) => (
                    <li key={i}>{renderInline(item, `li-${listKey}-${i}`)}</li>
                ))}
            </ul>
        )
        listItems = []
    }

    lines.forEach((rawLine, idx) => {
        const line = rawLine.trimEnd()
        const trimmed = line.trim()

        if (trimmed === '' || trimmed === '---') {
            flushList()
            if (trimmed === '---') {
                blocks.push(<hr key={`hr-${idx}`} className="my-2 border-border" />)
            }
            return
        }

        const headerMatch = trimmed.match(/^(#{1,4})\s+(.*)$/)
        if (headerMatch) {
            flushList()
            const level = headerMatch[1].length
            const content = collapseLetterSpacing(headerMatch[2])
            const sizeClass = level <= 2 ? 'text-base font-semibold' : 'text-sm font-semibold'
            blocks.push(
                <p key={`h-${idx}`} className={`${sizeClass} mt-2.5 mb-1`}>
                    {renderInline(content, `h-${idx}`)}
                </p>
            )
            return
        }

        const bulletMatch = trimmed.match(/^[-•]\s+(.*)$/)
        if (bulletMatch) {
            listItems.push(bulletMatch[1])
            return
        }

        const numberedMatch = trimmed.match(/^\d+[.)]\s+(.*)$/)
        if (numberedMatch) {
            listItems.push(numberedMatch[1])
            return
        }

        flushList()
        blocks.push(
            <p key={`p-${idx}`} className="my-0.5">
                {renderInline(trimmed, `p-${idx}`)}
            </p>
        )
    })

    flushList()
    return <div>{blocks}</div>
}
