'use client'

import { useState } from 'react'
import { CalendarPlus, Loader2, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApprovedOrders } from '@/hooks/useApprovedOrders'
import type { CateringOrder } from '@/types'

interface EventSelectorProps {
    onAddToContext: (orders: CateringOrder[]) => void
    alreadyInContext: Set<string>
}

/**
 * Lista de pedidos aprobados (dato real, mismo hook que usa la
 * Calculadora) para elegir cuáles le dan contexto al chat. Fase 2.1 del
 * plan: "Pestaña Asistentes: Eventos seleccionados + totales calculados".
 */
export function EventSelector({ onAddToContext, alreadyInContext }: EventSelectorProps) {
    const { orders, loading } = useApprovedOrders()
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [search, setSearch] = useState('')

    const toggle = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleAdd = () => {
        const toAdd = orders.filter((o) => selectedIds.has(o.id))
        onAddToContext(toAdd)
        setSelectedIds(new Set())
    }

    const normalizedSearch = search.trim().toLowerCase()
    const selectableOrders = orders
        .filter((o) => !alreadyInContext.has(o.id))
        .filter((o) => !normalizedSearch || (o.contact.name || '').toLowerCase().includes(normalizedSearch))

    return (
        <Card className="h-[400px] md:h-full flex flex-col min-h-0">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <CalendarPlus className="h-4 w-4 text-primary" />
                    Elegir eventos para el contexto
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Pedidos aprobados. Los que ya están en el contexto no se repiten en esta lista.
                </p>
                <div className="relative pt-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar cliente..."
                        className="h-8 pl-8 text-sm"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 space-y-3">
                {loading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando pedidos aprobados...
                    </div>
                ) : selectableOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                        {normalizedSearch
                            ? `Sin resultados para "${search}".`
                            : orders.length === 0
                                ? 'No hay pedidos aprobados todavía.'
                                : 'Ya agregaste todos los pedidos aprobados al contexto.'}
                    </p>
                ) : (
                    <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1">
                        {selectableOrders.map((order) => (
                            <label
                                key={order.id}
                                className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent cursor-pointer text-sm"
                            >
                                <Checkbox
                                    checked={selectedIds.has(order.id)}
                                    onCheckedChange={() => toggle(order.id)}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium truncate">{order.contact.name || 'Sin nombre'}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {order.contact.eventDate || 'Sin fecha'} · {order.contact.guestCount || 0} invitados
                                        {order.contact.eventType ? ` · ${order.contact.eventType}` : ''}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                )}

                <Button
                    size="sm"
                    className="w-full"
                    disabled={selectedIds.size === 0}
                    onClick={handleAdd}
                >
                    Agregar {selectedIds.size > 0 ? `(${selectedIds.size})` : ''} al contexto
                </Button>
            </CardContent>
        </Card>
    )
}
