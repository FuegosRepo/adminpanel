import React from 'react'
import { CheckSquare, Square, Plus } from 'lucide-react'
import { CateringOrder } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface SelectOrderModalProps {
    isOpen: boolean
    onClose: () => void
    orders: CateringOrder[]
    selectedOrderIds: string[]
    onOrderToggle: (orderId: string) => void
    onSelectAll: (orderIds: string[]) => void
    onLoadOrders: () => void
}

export function SelectOrderModal({
    isOpen,
    onClose,
    orders,
    selectedOrderIds,
    onOrderToggle,
    onSelectAll,
    onLoadOrders
}: SelectOrderModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose()
                onSelectAll([])
            }
        }}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-primary" />
                        Seleccionar Pedidos Aprobados
                    </DialogTitle>
                    <DialogDescription>
                        Selecciona los pedidos que deseas cargar como eventos para calcular ingredientes.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 flex flex-col">
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-muted-foreground">No hay pedidos aprobados disponibles.</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Los pedidos deben estar en estado &quot;Aprobado&quot; y tener fecha de evento.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="flex items-center justify-between mb-3 shrink-0">
                                <span className="text-sm text-muted-foreground">
                                    {selectedOrderIds.length} de {orders.length} seleccionados
                                </span>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs"
                                    onClick={() =>
                                        selectedOrderIds.length < orders.length
                                            ? onSelectAll(orders.map(o => o.id))
                                            : onSelectAll([])
                                    }
                                >
                                    {selectedOrderIds.length < orders.length
                                        ? 'Seleccionar Todos'
                                        : 'Deseleccionar Todos'}
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                                <div className="space-y-2 pb-2">
                                    {orders.map(order => {
                                        const isSelected = selectedOrderIds.includes(order.id)
                                        return (
                                            <div
                                                key={order.id}
                                                onClick={() => onOrderToggle(order.id)}
                                                className={cn(
                                                    "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent/50",
                                                    isSelected && "border-primary bg-primary/5"
                                                )}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    className="mt-0.5"
                                                    onCheckedChange={() => onOrderToggle(order.id)}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm truncate">
                                                        {order.contact.eventType} - {order.contact.name}
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                                                        <span>📅 {new Date(order.contact.eventDate).toLocaleDateString()}</span>
                                                        <span>👥 {order.contact.guestCount} invitados</span>
                                                        <span>
                                                            🍽️ {order.entrees.length + order.viandes.length + (order.dessert ? 1 : 0)} productos
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onClose()
                            onSelectAll([])
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onLoadOrders}
                        disabled={selectedOrderIds.length === 0}
                    >
                        <Plus className="h-4 w-4" />
                        Cargar {selectedOrderIds.length} Evento(s)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
