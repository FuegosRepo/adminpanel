import { CalendarClock, Loader2 } from 'lucide-react'
import { useSameDayOrders } from '@/hooks/useSameDayOrders'

// Igual que Payments/utils.ts: sin Intl/toLocaleString para que el
// resultado sea idéntico en servidor y cliente (evita hydration mismatch).
function formatEUR(amount: number): string {
    const rounded = Math.round(amount * 100) / 100
    const [intPart, decPart = '00'] = rounded.toFixed(2).split('.')
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `${withThousands},${decPart} €`
}

interface SameDayOrdersAlertProps {
    eventDate: string | undefined
    excludeOrderId?: string
}

/** 'sent' y 'ENVIADO' son el mismo estado con distinta mayúscula en la base. */
function statusLabel(status: string): string {
    if (status === 'approved') return 'Aprobado'
    if (status === 'sent' || status === 'ENVIADO') return 'Enviado'
    return status
}

/**
 * Aviso de capacidad del día: antes de mandar un presupuesto nuevo, mostrar
 * qué otros pedidos ya están confirmados/enviados para la misma fecha
 * (cliente, invitados, precio) — para decidir rápido si conviene aceptar
 * uno más. Solo lectura, pedido explícito del cliente (2026-11-04).
 */
export function SameDayOrdersAlert({ eventDate, excludeOrderId }: SameDayOrdersAlertProps) {
    const { orders, loading } = useSameDayOrders(eventDate, excludeOrderId)

    if (!eventDate) return null
    if (!loading && orders.length === 0) return null

    const totalGuests = orders.reduce((sum, o) => sum + o.guestCount, 0)
    const approvedCount = orders.filter((o) => o.status === 'approved').length
    const sentCount = orders.length - approvedCount

    return (
        <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm space-y-2">
            <div className="flex items-center gap-2 font-medium">
                <CalendarClock className="h-4 w-4 shrink-0" />
                {loading ? (
                    <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Revisando otros pedidos de esa fecha...
                    </span>
                ) : (
                    <span>
                        Ya tenés {orders.length} pedido{orders.length !== 1 ? 's' : ''} más para esta fecha
                        {' '}({approvedCount} aprobado{approvedCount !== 1 ? 's' : ''}, {sentCount} enviado{sentCount !== 1 ? 's' : ''} sin confirmar · {totalGuests} invitados en total)
                    </span>
                )}
            </div>
            {!loading && orders.length > 0 && (
                <ul className="space-y-1 pl-6">
                    {orders.map((o) => (
                        <li key={o.id} className="text-amber-800/90">
                            {o.name} · {o.guestCount} invitados
                            {o.estimatedPrice ? ` · ${formatEUR(o.estimatedPrice)}` : ''}
                            {' · '}
                            <span className={o.status === 'approved' ? 'font-semibold' : 'italic'}>
                                {statusLabel(o.status)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
