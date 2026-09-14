'use client'

import { X, Mail, Link2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface ContextItem {
    id: string
    icon?: string
    label: string
    sublabel?: string
    /** Cantidad de hilos de Gmail vinculados a este evento — dato de ejemplo, ver mockGmailThreadCount. */
    gmailThreadCount: number
}

interface ContextChipsProps {
    items: ContextItem[]
    onRemove: (id: string) => void
}

/**
 * Simula cuántos hilos de Gmail están vinculados a un pedido. Determinístico
 * por id (mismo pedido siempre muestra el mismo número), no aleatorio, para
 * no generar un mismatch de hidratación entre servidor y cliente.
 */
export function mockGmailThreadCount(id: string): number {
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
    return hash % 4 // 0 a 3
}

/**
 * Muestra qué pedidos está mirando el chat, incluyendo cuántos hilos de
 * Gmail tiene cada uno vinculados (Fase 2.3 del plan: el contexto combina
 * datos del pedido en la web con el correo del cliente). Todo simulado acá,
 * no hay conexión real a Gmail todavía.
 */
export function ContextChips({ items, onRemove }: ContextChipsProps) {
    if (items.length === 0) {
        return (
            <p className="text-sm text-muted-foreground italic">
                Sin eventos seleccionados. Elegí uno o más pedidos de la lista para empezar.
            </p>
        )
    }

    return (
        <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
                Contexto ({items.length}):
            </span>
            <div className="grid sm:grid-cols-2 gap-2">
                {items.map((item) => (
                    <Card key={item.id} className="p-2.5 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                {item.icon && <span className="mr-1">{item.icon}</span>}
                                {item.label}
                            </p>
                            {item.sublabel && (
                                <p className="text-xs text-muted-foreground truncate">{item.sublabel}</p>
                            )}
                            <div className="flex items-center gap-1.5 mt-1.5">
                                {item.gmailThreadCount > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                        <Mail className="h-3 w-3" />
                                        {item.gmailThreadCount} hilo{item.gmailThreadCount !== 1 ? 's' : ''} de Gmail (ejemplo)
                                    </span>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 px-1 text-[11px] text-muted-foreground"
                                        disabled
                                        title="Disponible cuando se conecte Gmail"
                                    >
                                        <Link2 className="h-3 w-3 mr-1" />
                                        Vincular hilo de Gmail
                                    </Button>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className="rounded-full hover:bg-muted-foreground/20 p-1 shrink-0"
                            aria-label={`Quitar ${item.label} del contexto`}
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    )
}
