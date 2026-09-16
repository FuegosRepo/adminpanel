import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { appendPaidRecord } from '@/lib/payments/sync'
import type { PaymentRecord } from '@/types'

const VALID_METHODS: PaymentRecord['method'][] = ['cash', 'transfer', 'check', 'card']

/**
 * Registro de un cobro que no pasó por Stripe (transferencia, efectivo,
 * cheque). Reemplaza el no-op de `handleUpdatePayment` en useOrders.ts,
 * que solo invalidaba la query sin escribir nada — el hallazgo 3 del
 * plan original.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { orderId, amount, method, paymentType, reference, notes, date } = body

        if (!orderId || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Faltan orderId o amount válido' }, { status: 400 })
        }
        if (!VALID_METHODS.includes(method)) {
            return NextResponse.json({ error: `method inválido, debe ser uno de: ${VALID_METHODS.join(', ')}` }, { status: 400 })
        }

        const { applied, payment } = await appendPaidRecord(supabase, orderId, {
            amount: Number(amount),
            date: date || new Date().toISOString(),
            method,
            paymentType: paymentType === 'negro' ? 'negro' : 'blanco',
            reference: reference || undefined,
            notes: notes || undefined,
        })

        return NextResponse.json({ success: true, applied, payment })
    } catch (error) {
        console.error('Error registrando pago manual:', error)
        return NextResponse.json(
            { error: 'Error interno', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
