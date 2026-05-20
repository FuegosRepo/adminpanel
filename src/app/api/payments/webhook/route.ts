import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const bodyText = await request.text()
    // Systempay sends x-www-form-urlencoded typically for webhooks in V4, or JSON depending on config.
    // Let's handle both or assume standard JSON payload from form-data if parsed.
    
    // In Next.js App Router, we can parse it according to content-type
    const contentType = request.headers.get('content-type') || ''
    
    let rawAnswer = ''
    let krHash = ''
    let krHashAlgorithm = ''

    if (contentType.includes('application/json')) {
      const json = JSON.parse(bodyText)
      rawAnswer = JSON.stringify(json['kr-answer'])
      krHash = json['kr-hash']
      krHashAlgorithm = json['kr-hash-algorithm']
    } else {
      const urlParams = new URLSearchParams(bodyText)
      rawAnswer = urlParams.get('kr-answer') || ''
      krHash = urlParams.get('kr-hash') || ''
      krHashAlgorithm = urlParams.get('kr-hash-algorithm') || ''
    }

    if (!rawAnswer || !krHash) {
      return NextResponse.json({ error: 'Faltan parámetros de Systempay' }, { status: 400 })
    }

    // El webhook usa una clave específica o la misma de la API (depende de tu config).
    // Recomendado: SYSTEMPAY_TEST_KEY o una SYSTEMPAY_IPN_KEY
    const ipnKey = process.env.SYSTEMPAY_TEST_KEY // Asegúrate de usar la llave correcta en PROD

    if (!ipnKey) {
      console.error('Llave de Systempay no configurada')
      return NextResponse.json({ error: 'Configuración de servidor incompleta' }, { status: 500 })
    }

    // Verificar firma (HMAC-SHA256)
    const calculatedHash = crypto.createHmac('sha256', ipnKey)
                                 .update(rawAnswer)
                                 .digest('hex')

    if (calculatedHash !== krHash) {
      console.error('Firma de IPN inválida')
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const answer = JSON.parse(rawAnswer)
    
    // Validar el estado del pago
    if (answer.orderStatus !== 'PAID') {
      // Solo nos interesa cuando el pago se completa, o puedes manejar otros estados (CANCELLED, etc)
      return NextResponse.json({ message: 'Estado ignorado' })
    }

    const orderId = answer.orderDetails.orderId
    const amountPaid = answer.orderDetails.orderTotalAmount / 100 // Convertir de céntimos

    // Necesitamos usar service_role_key porque esto no viene de un usuario autenticado
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Obtener el pedido actual
    const { data: order, error: orderError } = await supabase
      .from('catering_orders')
      .select('payment')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Pedido no encontrado:', orderId)
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    // Actualizar JSON de payment
    let paymentData = order.payment || {
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      paymentStatus: 'pending',
      paymentHistory: []
    }

    // Añadir el nuevo pago al historial
    paymentData.paymentHistory.push({
      id: answer.transactions[0]?.transactionUuid || crypto.randomUUID(),
      amount: amountPaid,
      date: new Date().toISOString(),
      method: 'card',
      reference: 'Systempay Link',
      paymentType: 'blanco'
    })

    paymentData.paidAmount += amountPaid
    paymentData.pendingAmount = Math.max(0, paymentData.totalAmount - paymentData.paidAmount)

    if (paymentData.pendingAmount === 0) {
      paymentData.paymentStatus = 'completed'
    } else {
      paymentData.paymentStatus = 'partial'
    }

    // Guardar en BD
    const { error: updateError } = await supabase
      .from('catering_orders')
      .update({ payment: paymentData })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error actualizando pago en BD:', updateError)
      return NextResponse.json({ error: 'Error actualizando BD' }, { status: 500 })
    }

    return NextResponse.json({ message: 'OK' })

  } catch (error) {
    console.error('Error en webhook de Systempay:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
