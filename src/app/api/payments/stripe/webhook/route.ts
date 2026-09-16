import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { appendPaidRecord } from '@/lib/payments/sync'

/**
 * Webhook de Stripe. Reemplaza al de Systempay (nunca llegó a producción).
 *
 * Dos cosas no negociables acá:
 * 1. Verificar la firma con el body CRUDO (nunca parsear el JSON antes de
 *    verificar) — si no coincide, 400 y no se procesa nada.
 * 2. Usar la clave de servicio: Stripe llama a esto sin sesión de usuario.
 *
 * Idempotencia: appendPaidRecord no duplica si la referencia (session id)
 * ya está en el historial del pedido — ver el comentario en sync.ts sobre
 * por qué esto vive en el JSONB y no en una tabla con índice único todavía.
 */
export async function POST(request: Request) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!secretKey || secretKey.includes('pendiente') || !webhookSecret || webhookSecret.includes('pendiente')) {
        console.error('Webhook de Stripe llamado sin configurar STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET')
        return NextResponse.json({ error: 'Configuración de Stripe incompleta' }, { status: 500 })
    }
    if (!serviceRoleKey || serviceRoleKey.includes('pendiente')) {
        console.error('Webhook de Stripe: falta SUPABASE_SERVICE_ROLE_KEY')
        return NextResponse.json({ error: 'Configuración de servidor incompleta' }, { status: 500 })
    }

    const stripe = new Stripe(secretKey)
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'Falta la firma de Stripe' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err) {
        console.error('Firma de webhook de Stripe inválida:', err instanceof Error ? err.message : err)
        return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
    }

    // Solo nos importa cuando el checkout se completa y quedó pagado.
    if (event.type !== 'checkout.session.completed') {
        return NextResponse.json({ message: `Evento ignorado: ${event.type}` })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
        return NextResponse.json({ message: `Sesión sin pagar (${session.payment_status})` })
    }

    const orderId = session.metadata?.orderId
    const purpose = session.metadata?.purpose || 'custom'

    if (!orderId) {
        console.error('Webhook de Stripe: la sesión no tiene orderId en metadata', session.id)
        return NextResponse.json({ error: 'Falta orderId en metadata' }, { status: 400 })
    }

    const amountPaid = (session.amount_total ?? 0) / 100

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey
    )

    try {
        const { applied } = await appendPaidRecord(supabase, orderId, {
            amount: amountPaid,
            date: new Date().toISOString(),
            method: 'card',
            paymentType: 'blanco',
            reference: session.id,
            notes: `Stripe · ${purpose}`,
        })

        if (!applied) {
            // Stripe puede reintentar el mismo evento; esto es lo que evita duplicar el cobro.
            return NextResponse.json({ message: 'Ya procesado (idempotente)' })
        }

        return NextResponse.json({ message: 'OK' })
    } catch (error) {
        console.error('Error actualizando pago desde webhook de Stripe:', error)
        return NextResponse.json({ error: 'Error actualizando la base' }, { status: 500 })
    }
}
