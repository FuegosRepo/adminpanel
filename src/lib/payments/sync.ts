import type { SupabaseClient } from '@supabase/supabase-js'
import type { PaymentInfo, PaymentRecord } from '@/types'
import { DEPOSIT_PCT } from '@/config/payments'

/**
 * Capa de pagos v1: sigue usando el JSONB `catering_orders.payment` que ya
 * existe (el mismo que usaba el webhook de Systempay), en vez de la tabla
 * `payments` completa del plan original. Decisión deliberada: evita la
 * migración (nuevas columnas, tabla stripe_events) mientras no haya
 * credenciales de Stripe probadas. La idempotencia se resuelve buscando
 * la referencia (session id / payment intent) en el historial existente,
 * en vez de un índice único — más débil, pero cero cambios de esquema.
 *
 * Cuando el volumen lo justifique, migrar a la tabla real (ver el plan,
 * sección "FASE PAGOS — Stripe") sin cambiar la forma de esta función.
 */

interface OrderPaymentRow {
    id: string
    payment: PaymentInfo | null
    estimated_price: number | null
}

export interface PaymentState {
    total: number
    paid: number
    pending: number
}

export function computePaymentState(order: OrderPaymentRow): PaymentState {
    const total = order.payment?.totalAmount || order.estimated_price || 0
    const paid = order.payment?.paidAmount || 0
    return { total, paid, pending: Math.max(0, total - paid) }
}

export type StripePurpose = 'deposit' | 'balance' | 'custom'

/**
 * Calcula el monto a cobrar según el motivo, validado contra el
 * pendiente real. Nunca confía en un monto que venga del cliente sin
 * este chequeo (hallazgo 4 del plan original, sobre Systempay).
 */
export function resolveAmount(purpose: StripePurpose, state: PaymentState, customAmount?: number): number | null {
    let amount: number
    if (purpose === 'deposit') {
        amount = Math.round(state.total * DEPOSIT_PCT * 100) / 100
    } else if (purpose === 'balance') {
        amount = state.pending
    } else {
        amount = Number(customAmount)
    }
    if (!Number.isFinite(amount) || amount <= 0 || amount > state.pending + 0.01) return null
    return amount
}

/**
 * Agrega un cobro ya confirmado (Stripe pagado, o manual) al historial del
 * pedido y recalcula los totales. Si `reference` ya existe en el
 * historial, no duplica (esto es lo que hace idempotente al webhook).
 */
export async function appendPaidRecord(
    supabase: SupabaseClient,
    orderId: string,
    record: Omit<PaymentRecord, 'id'> & { id?: string }
): Promise<{ applied: boolean; payment: PaymentInfo }> {
    const { data: order, error } = await supabase
        .from('catering_orders')
        .select('payment, estimated_price')
        .eq('id', orderId)
        .single()

    if (error || !order) {
        throw new Error(`Pedido ${orderId} no encontrado`)
    }

    const existing: PaymentInfo = order.payment || {
        totalAmount: order.estimated_price || 0,
        paidAmount: 0,
        pendingAmount: order.estimated_price || 0,
        paymentStatus: 'pending',
        paymentHistory: [],
    }

    if (record.reference && existing.paymentHistory.some((r) => r.reference === record.reference)) {
        return { applied: false, payment: existing }
    }

    const fullRecord: PaymentRecord = { id: record.id || crypto.randomUUID(), ...record }
    const paidAmount = Math.round((existing.paidAmount + fullRecord.amount) * 100) / 100
    const pendingAmount = Math.max(0, Math.round((existing.totalAmount - paidAmount) * 100) / 100)

    const updated: PaymentInfo = {
        ...existing,
        paidAmount,
        pendingAmount,
        paymentStatus: pendingAmount <= 0 ? 'completed' : 'partial',
        paymentHistory: [...existing.paymentHistory, fullRecord],
    }

    const { error: updateError } = await supabase
        .from('catering_orders')
        .update({ payment: updated })
        .eq('id', orderId)

    if (updateError) throw updateError

    return { applied: true, payment: updated }
}
