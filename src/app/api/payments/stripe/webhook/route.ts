import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { appendPaidRecord } from '@/lib/payments/sync'
import { sendEmail } from '@/lib/emails/service'
import { BaseLayout } from '@/lib/emails/templates/BaseLayout'

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
        const { applied, payment } = await appendPaidRecord(supabase, orderId, {
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

        await sendReceiptEmails({ orderId, amountPaid, purpose, session, supabase, pendingAfter: payment.pendingAmount })

        return NextResponse.json({ message: 'OK' })
    } catch (error) {
        console.error('Error actualizando pago desde webhook de Stripe:', error)
        return NextResponse.json({ error: 'Error actualizando la base' }, { status: 500 })
    }
}

/**
 * Recibo al cliente (francés, con la marca) + aviso interno al admin
 * (español). Nunca tira la petición si falla el envío: el cobro ya quedó
 * registrado en el pedido, que es lo que importa; el email es un plus.
 */
async function sendReceiptEmails(params: {
    orderId: string
    amountPaid: number
    purpose: string
    session: Stripe.Checkout.Session
    supabase: SupabaseClient
    pendingAfter: number
}) {
    const { orderId, amountPaid, purpose, session, supabase, pendingAfter } = params

    const { data: order } = await supabase
        .from('catering_orders')
        .select('name, email, event_date')
        .eq('id', orderId)
        .single()

    if (!order?.email) return

    const eventDateLabel = order.event_date
        ? new Date(order.event_date).toLocaleDateString('fr-FR')
        : 'date à confirmer'
    const purposeLabelFr = purpose === 'deposit' ? "de l'acompte" : purpose === 'balance' ? 'du solde' : 'du paiement'

    const clientHtml = BaseLayout(
        `
      <h2>Merci ${order.name || ''} !</h2>
      <p>Nous confirmons la bonne réception ${purposeLabelFr} pour votre événement du <strong>${eventDateLabel}</strong>.</p>
      <div class="highlight-box">
        <p class="highlight-title">Montant reçu : €${amountPaid.toFixed(2)}</p>
        <p style="margin:0;">Référence : ${session.id}</p>
        ${pendingAfter > 0 ? `<p style="margin:8px 0 0 0;">Solde restant : €${pendingAfter.toFixed(2)}</p>` : `<p style="margin:8px 0 0 0;">Votre événement est réglé intégralement.</p>`}
      </div>
      <p>Nous avons hâte de vous accueillir. Merci pour votre confiance !</p>
    `,
        process.env.EMAIL_HEADER_IMAGE_URL ? { headerUrl: process.env.EMAIL_HEADER_IMAGE_URL } : undefined
    )

    const clientResult = await sendEmail({
        to: order.email,
        subject: `Reçu de paiement — Fuegos d'Azur`,
        html: clientHtml,
        tags: [
            { name: 'category', value: 'payment_receipt' },
            { name: 'order_id', value: orderId },
        ],
    })
    if (!clientResult.success) {
        console.error('Error mandando el recibo al cliente:', clientResult.error)
    }

    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
        const adminHtml = BaseLayout(
            `
        <h2>Cobro recibido por Stripe</h2>
        <p><strong>${order.name || 'Cliente sin nombre'}</strong> (${order.email}) pagó <strong>€${amountPaid.toFixed(2)}</strong> (${purpose}).</p>
        <p>Evento: ${eventDateLabel}</p>
        <p>Pendiente después de este cobro: €${pendingAfter.toFixed(2)}</p>
        <p style="font-size:12px;color:#666;">Referencia Stripe: ${session.id}</p>
      `,
            process.env.EMAIL_HEADER_IMAGE_URL ? { headerUrl: process.env.EMAIL_HEADER_IMAGE_URL } : undefined
        )
        const adminResult = await sendEmail({
            to: adminEmail,
            subject: `Cobro Stripe recibido — €${amountPaid.toFixed(2)} — ${order.name || orderId}`,
            html: adminHtml,
            tags: [
                { name: 'category', value: 'payment_receipt_admin' },
                { name: 'order_id', value: orderId },
            ],
        })
        if (!adminResult.success) {
            console.error('Error mandando el aviso de cobro al admin:', adminResult.error)
        }
    }
}
