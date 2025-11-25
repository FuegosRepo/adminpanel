import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Nota: Este API necesita que configuremos Resend para enviar emails
// Por ahora, solo actualiza el estado en Supabase

export async function POST(request: NextRequest) {
  try {
    const { budgetId, clientEmail, clientName } = await request.json()

    if (!budgetId || !clientEmail) {
      return NextResponse.json(
        { error: 'Budget ID y email del cliente son requeridos' },
        { status: 400 }
      )
    }

    console.log(`📧 Aprobando y enviando presupuesto ${budgetId} a ${clientEmail}`)

    // 1. Obtener el presupuesto y su PDF
    const { data: budget, error: fetchError } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', budgetId)
      .single()

    if (fetchError || !budget) {
      console.error('Error obteniendo presupuesto:', fetchError)
      return NextResponse.json(
        { error: 'Presupuesto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que tenga PDF
    if (!budget.pdf_url) {
      return NextResponse.json(
        { error: 'El presupuesto no tiene PDF generado. Por favor, genere el PDF primero.' },
        { status: 400 }
      )
    }

    // 2. Actualizar estado a 'approved' y guardar timestamp
    const { error: updateError } = await supabase
      .from('budgets')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: 'admin',
        sent_at: new Date().toISOString()
      })
      .eq('id', budgetId)

    if (updateError) {
      console.error('Error actualizando presupuesto:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar estado del presupuesto' },
        { status: 500 }
      )
    }

    // 3. Enviar email al cliente con el PDF adjunto
    // IMPLEMENTACIÓN FUTURA: Integrar con Resend o servicio de email
    // Por ahora, el admin puede descargar el PDF y enviarlo manualmente
    
    console.log('✅ Presupuesto marcado como aprobado y enviado')
    console.log(`📎 PDF disponible en: ${budget.pdf_url}`)
    console.log(`📧 Cliente: ${clientEmail}`)

    return NextResponse.json({
      success: true,
      message: 'Presupuesto aprobado exitosamente',
      pdfUrl: budget.pdf_url,
      note: 'El email no se envió automáticamente. Descargue el PDF y envíelo manualmente al cliente.'
    })

  } catch (error) {
    console.error('Error en approve-and-send-budget:', error)
    return NextResponse.json(
      { error: 'Error inesperado al procesar la solicitud' },
      { status: 500 }
    )
  }
}

