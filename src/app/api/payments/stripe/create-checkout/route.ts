import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'
import { sendEmail } from '@/lib/emails/service'
import { BaseLayout } from '@/lib/emails/templates/BaseLayout'
import { computePaymentState, resolveAmount, type StripePurpose } from '@/lib/payments/sync'
import { STRIPE_LINK_EXPIRY_HOURS } from '@/config/payments'

/**
 * Genera un link de Stripe Checkout y lo manda por email. Reemplaza a
 * /api/payments/create-link (Systempay), que nunca llegó a producción.
 *
 * El monto lo calcula y valida el servidor siempre (resolveAmount), nunca
 * se confía en lo que mande el cliente sin chequear contra el pendiente
 * real — era el hallazgo 4 del plan original sobre la ruta de Systempay.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const secretKey = process.env.STRIPE_SECRET_KEY
        if (!secretKey || secretKey.includes('pendiente')) {
            return NextResponse.json(
                { error: 'Stripe no está configurado todavía (falta STRIPE_SECRET_KEY real en el servidor)' },
                { status: 500 }
            )
        }

        const body = await request.json()
        const orderId: string | undefined = body?.orderId
        const purpose: StripePurpose | undefined = body?.purpose
        const customAmount: number | undefined = body?.amountEUR

        if (!orderId || !purpose || !['deposit', 'balance', 'custom'].includes(purpose)) {
            return NextResponse.json({ error: 'Faltan orderId o purpose válido (deposit | balance | custom)' }, { status: 400 })
        }

        const { data: order, error } = await supabase
            .from('catering_orders')
            .select('id, name, email, event_date, payment, estimated_price')
            .eq('id', orderId)
            .single()

        if (error || !order) {
            return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
        }
        if (!order.email) {
            return NextResponse.json({ error: 'El pedido no tiene email de contacto' }, { status: 400 })
        }

        const state = computePaymentState(order)
        const amount = resolveAmount(purpose, state, customAmount)

        if (amount === null) {
            return NextResponse.json(
                { error: `Monto inválido. Pendiente actual: €${state.pending.toFixed(2)}` },
                { status: 400 }
            )
        }

        const stripe = new Stripe(secretKey)
        const amountInCents = Math.round(amount * 100)
        const eventDateLabel = order.event_date
            ? new Date(order.event_date).toLocaleDateString('fr-FR')
            : 'date à confirmer'

        const purposeLabelEn = purpose === 'deposit' ? 'Acompte' : purpose === 'balance' ? 'Solde' : 'Paiement'
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            currency: 'eur',
            customer_email: order.email,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        unit_amount: amountInCents,
                        product_data: { name: `${purposeLabelEn} — événement du ${eventDateLabel} — Fuegos d'Azur` },
                    },
                    quantity: 1,
                },
            ],
            metadata: { orderId: order.id, purpose },
            success_url: `${appUrl}/payments/success?order=${order.id}`,
            cancel_url: `${appUrl}/payments/cancel?order=${order.id}`,
            // Stripe exige que expires_at sea MENOR a 24h desde la creación,
            // no igual — con exactamente 24h la API lo rechaza.
            expires_at: Math.floor(Date.now() / 1000) + STRIPE_LINK_EXPIRY_HOURS * 3600 - 60,
        })

        if (!session.url) {
            return NextResponse.json({ error: 'Stripe no devolvió una URL de pago' }, { status: 502 })
        }

        const purposeLabelFr = purpose === 'deposit' ? "l'acompte" : purpose === 'balance' ? 'le solde' : 'le paiement'
        const emailContent = `
      <h2>Bonjour ${order.name || ''},</h2>
      <p>Voici votre lien sécurisé pour régler ${purposeLabelFr} de votre événement, d'un montant de <strong>€${amount.toFixed(2)}</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${session.url}" style="background-color: #d97706; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Payer maintenant
        </a>
      </div>
      <p>Vous pouvez régler par carte, Apple Pay ou Google Pay. Ce lien expire dans ${STRIPE_LINK_EXPIRY_HOURS} h.</p>
      <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : <br/> <a href="${session.url}">${session.url}</a></p>
      <p>Merci pour votre confiance !</p>
    `
        const headerUrl = process.env.EMAIL_HEADER_IMAGE_URL
        const finalHtml = BaseLayout(emailContent, headerUrl ? { headerUrl } : undefined)

        const emailResult = await sendEmail({
            to: order.email,
            subject:
                purpose === 'deposit'
                    ? `Acompte pour votre événement du ${eventDateLabel} — Fuegos d'Azur`
                    : `Solde de votre événement du ${eventDateLabel} — Fuegos d'Azur`,
            html: finalHtml,
            tags: [
                { name: 'category', value: 'payment_link' },
                { name: 'order_id', value: order.id },
                { name: 'purpose', value: purpose },
            ],
        })

        if (!emailResult.success) {
            console.error('Error enviando email de cobro:', emailResult.error)
            // No fallamos toda la petición: el admin igual recibe el link para mandarlo a mano.
        }

        return NextResponse.json({
            success: true,
            checkoutUrl: session.url,
            amount,
            emailSent: emailResult.success,
        })
    } catch (error) {
        console.error('Error creando checkout de Stripe:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
