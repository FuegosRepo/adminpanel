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
function isApproved(status: string): boolean {
    return status === 'approved'
}

/**
 * Pastilla de estado con color + ícono — a propósito muy distinta entre
 * "Aprobado" (compromiso firme) y "Enviado" (puede no confirmarse), porque
 * es justo la distinción que el dueño necesita ver de un vistazo, sin leer
 * texto (pedido explícito, 2026-11-04).
 */
function StatusPill({ status }: { status: string }) {
    if (isApproved(status)) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-xs font-semibold px-2 py-0.5 shrink-0">
                ✅ Aprobado
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 text-amber-900 text-xs font-semibold px-2 py-0.5 shrink-0">
            📤 Enviado
        </span>
    )
}

/**
 * Aviso de capacidad del día: antes de mandar un presupuesto nuevo, mostrar
 * qué otros pedidos ya están confirmados/enviados para la misma fecha
 * (cliente, invitados, precio, y si cada uno es un compromiso firme o solo
 * una cotización mandada) — para decidir rápido si conviene aceptar uno
 * más. Solo lectura, pedido explícito del cliente (2026-11-04).
 */
export function SameDayOrdersAlert({ eventDate, excludeOrderId }: SameDayOrdersAlertProps) {
    const { orders, loading } = useSameDayOrders(eventDate, excludeOrderId)

    if (!eventDate) return null
    if (!loading && orders.length === 0) return null

    const totalGuests = orders.reduce((sum, o) => sum + o.guestCount, 0)
    const approved = orders.filter((o) => isApproved(o.status))
    const sent = orders.filter((o) => !isApproved(o.status))
    // Aprobados primero: son los que de verdad comprometen la fecha.
    const sortedOrders = [...approved, ...sent]

    return (
        <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm space-y-3">
            <div className="flex items-center gap-2 font-medium">
                <CalendarClock className="h-4 w-4 shrink-0" />
                {loading ? (
                    <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Revisando otros pedidos de esa fecha...
                    </span>
                ) : (
                    <span>Ya tenés {orders.length} pedido{orders.length !== 1 ? 's' : ''} más para esta fecha ({totalGuests} invitados en total)</span>
                )}
            </div>

            {!loading && orders.length > 0 && (
                <>
                    <div className="flex items-center gap-2 flex-wrap">
                        {approved.length > 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold px-2.5 py-1">
                                ✅ {approved.length} aprobado{approved.length !== 1 ? 's' : ''} (compromiso firme)
                            </span>
                        )}
                        {sent.length > 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1">
                                📤 {sent.length} enviado{sent.length !== 1 ? 's' : ''} (sin confirmar)
                            </span>
                        )}
                    </div>

                    <ul className="space-y-1.5">
                        {sortedOrders.map((o) => (
                            <li key={o.id} className="flex items-center gap-2 flex-wrap">
                                <StatusPill status={o.status} />
                                <span className="text-amber-900">
                                    {o.name} · {o.guestCount} invitados
                                    {o.estimatedPrice ? ` · ${formatEUR(o.estimatedPrice)}` : ''}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}
