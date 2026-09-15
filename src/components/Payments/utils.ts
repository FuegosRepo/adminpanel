import type { CateringOrder, PaymentRecord } from '@/types'
import { DEPOSIT_PCT } from '@/config/payments'
import type { PaymentRowModel, PaymentState, StripeLink } from './types'

/**
 * Formato de euros hecho a mano (1.234,50 €) en vez de toLocaleString:
 * Intl puede diferir entre el servidor y el navegador y provocar un
 * mismatch de hidratación. PaymentTracker lo esquivaba con un flag
 * isMounted; esto es más simple y determinista.
 */
export function formatEUR(amount: number): string {
    const fixed = Math.abs(amount).toFixed(2)
    const [int, dec] = fixed.split('.')
    const withThousands = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `${amount < 0 ? '-' : ''}${withThousands},${dec} €`
}

export function roundMoney(n: number): number {
    return Math.round(n * 100) / 100
}

export function depositFor(total: number, pct: number = DEPOSIT_PCT): number {
    return roundMoney(total * pct)
}

/**
 * Hash chico y determinístico por id, para que los datos de ejemplo
 * (links de Stripe simulados) sean estables entre renders y entre
 * servidor/cliente. Mismo criterio que mockGmailThreadCount.
 */
function hashId(id: string): number {
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
    return hash
}

/**
 * Links de Stripe simulados. Vista previa: no hay Stripe conectado, así
 * que cada pedido recibe 0, 1 o 2 links de ejemplo según su id.
 */
export function mockStripeLinks(order: CateringOrder, total: number): StripeLink[] {
    const h = hashId(order.id)
    const variant = h % 4
    const base = order.createdAt || new Date().toISOString()
    if (variant === 0) return []
    if (variant === 1) {
        return [{ id: `${order.id}-dep`, purpose: 'deposit', amount: depositFor(total), status: 'pending', createdAt: base }]
    }
    if (variant === 2) {
        return [{ id: `${order.id}-dep`, purpose: 'deposit', amount: depositFor(total), status: 'paid', createdAt: base }]
    }
    return [
        { id: `${order.id}-dep`, purpose: 'deposit', amount: depositFor(total), status: 'paid', createdAt: base },
        { id: `${order.id}-bal`, purpose: 'balance', amount: roundMoney(total - depositFor(total)), status: 'expired', createdAt: base },
    ]
}

function stateFor(total: number, paid: number): PaymentState {
    if (total > 0 && paid >= total) return 'completed'
    if (paid > 0) return 'partial'
    return 'pending'
}

/**
 * Arma el modelo de una fila: lo que ya está en el JSONB `payment` del
 * pedido + los registros y links agregados en esta sesión (vista previa,
 * en memoria) + los links simulados.
 */
export function buildRowModel(
    order: CateringOrder,
    localRecords: PaymentRecord[] = [],
    localLinks: StripeLink[] = []
): PaymentRowModel {
    const total = order.payment?.totalAmount || order.estimatedPrice || 0
    const history = [...(order.payment?.paymentHistory || []), ...localRecords]

    const stripeLinks = [...mockStripeLinks(order, total), ...localLinks]
    // Un link pagado de Stripe cuenta como cobro aunque no esté todavía en el historial.
    const paidViaLinks = stripeLinks
        .filter((l) => l.status === 'paid')
        .reduce((sum, l) => sum + l.amount, 0)

    const paid = roundMoney(history.reduce((sum, r) => sum + r.amount, 0) + paidViaLinks)
    const pending = roundMoney(Math.max(0, total - paid))

    return {
        order,
        total,
        paid,
        pending,
        state: stateFor(total, paid),
        history,
        stripeLinks,
        hasDepositPaid: stripeLinks.some((l) => l.purpose === 'deposit' && l.status === 'paid') || paid > 0,
        hasPendingLink: stripeLinks.some((l) => l.status === 'pending'),
    }
}

export function parseEventDate(order: CateringOrder): Date | null {
    const raw = order.contact.eventDate
    if (!raw) return null
    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? null : d
}
