'use client'

import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface ContextItem {
    id: string
    label: string
    icon?: string
}

interface ContextChipsProps {
    items: ContextItem[]
    onRemove: (id: string) => void
}

/**
 * Muestra qué eventos/hilos está mirando el chat en este momento, y permite
 * sacarlos de contexto. Diseño según Fase 2.1 del plan: "ContextChips.tsx
 * muestra qué está mirando y permite sacarlo".
 */
export function ContextChips({ items, onRemove }: ContextChipsProps) {
    if (items.length === 0) {
        return (
            <p className="text-sm text-muted-foreground italic">
                Sin eventos seleccionados. Elegí uno o más pedidos para empezar.
            </p>
        )
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground mr-1">
                Contexto:
            </span>
            {items.map((item) => (
                <Badge
                    key={item.id}
                    variant="secondary"
                    className="gap-1.5 pl-2.5 pr-1.5 py-1 text-sm font-normal"
                >
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="rounded-full hover:bg-muted-foreground/20 p-0.5 ml-0.5"
                        aria-label={`Quitar ${item.label} del contexto`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
        </div>
    )
}
