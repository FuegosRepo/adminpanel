import type { CateringOrder, PaymentRecord } from '@/types'

export type PaymentState = 'pending' | 'partial' | 'completed'

export type StripeLinkPurpose = 'deposit' | 'balance' | 'custom'

export type StripeLinkStatus = 'pending' | 'paid' | 'expired'

/** Un link de Stripe Checkout enviado para un pedido. En la vista previa es dato simulado. */
export interface StripeLink {
    id: string
    purpose: StripeLinkPurpose
    amount: number
    status: StripeLinkStatus
    createdAt: string
}

/** Todo lo que la fila de la tabla necesita, ya calculado. */
export interface PaymentRowModel {
    order: CateringOrder
    total: number
    paid: number
    pending: number
    state: PaymentState
    history: PaymentRecord[]
    stripeLinks: StripeLink[]
    hasDepositPaid: boolean
    hasPendingLink: boolean
}

export type PaymentStateFilter = 'all' | PaymentState
