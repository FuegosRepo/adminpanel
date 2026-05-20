import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendEmail, processEmailTemplate } from '@/lib/emails/service'
import { BaseLayout } from '@/lib/emails/templates/BaseLayout'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { orderId, amount, customerEmail, customerName } = await request.json()

    if (!orderId || !amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios (orderId, amount, customerEmail)' },
        { status: 400 }
      )
    }

    // Preparar credenciales de Systempay
    const shopId = process.env.SYSTEMPAY_SHOP_ID
    const apiKey = process.env.SYSTEMPAY_TEST_KEY // O PROD_KEY según el entorno
    
    if (!shopId || !apiKey) {
      return NextResponse.json(
        { error: 'Credenciales de pago no configuradas en el servidor' },
        { status: 500 }
      )
    }

    const authString = Buffer.from(`${shopId}:${apiKey}`).toString('base64')

    // Systempay requiere el monto en céntimos
    const amountInCents = Math.round(amount * 100)

    // Crear la orden de pago en Systempay
    const systempayResponse = await fetch('https://api.systempay.fr/api-payment/V4/Charge/CreatePaymentOrder', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'EUR',
        orderId: orderId.toString().substring(0, 64), // Systempay max length es 64
        customer: {
          email: customerEmail,
          billingDetails: {
            firstName: customerName || 'Cliente'
          }
        }
      })
    })

    const systempayData = await systempayResponse.json()

    if (systempayData.status !== 'SUCCESS') {
      console.error('Error Systempay:', systempayData)
      return NextResponse.json(
        { error: 'Error al generar el link en Systempay', details: systempayData.answer?.errorMessage },
        { status: 400 }
      )
    }

    const paymentUrl = systempayData.answer.paymentURL

    // Enviar correo con el link
    const emailSubject = `Lien de paiement pour votre événement - Fuegos d'Azur`
    const emailContent = `
      <h2>Bonjour ${customerName},</h2>
      <p>Voici votre lien sécurisé pour procéder au paiement d'un montant de <strong>€${amount.toFixed(2)}</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${paymentUrl}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Payer maintenant
        </a>
      </div>
      <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : <br/> <a href="${paymentUrl}">${paymentUrl}</a></p>
      <p>Merci pour votre confiance !</p>
    `

    const headerUrl = process.env.EMAIL_HEADER_IMAGE_URL || 'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/headerblack.png'
    const finalHtml = BaseLayout(emailContent, { headerUrl })

    const emailResult = await sendEmail({
      to: customerEmail,
      subject: emailSubject,
      html: finalHtml,
      tags: [{ name: 'category', value: 'payment_link' }, { name: 'order_id', value: orderId }]
    })

    if (!emailResult.success) {
      console.error('Error enviando email:', emailResult.error)
      // No fallamos toda la petición si el email falla, igual devolvemos el link al admin
    }

    // Registrar en BD que el link fue enviado y está pendiente (opcional, si hay una tabla para esto)
    // Se asume que el webhook actualizará el pago principal.

    return NextResponse.json({
      success: true,
      paymentUrl,
      message: 'Link generado y enviado por correo correctamente'
    })

  } catch (error) {
    console.error('Error in create-link API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
