import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { generateBudgetPDF, getBudgetPDFFilename } from '@/lib/budgetPDFService'
import { BudgetData } from '@/lib/types/budget'

export async function POST(request: NextRequest) {
  try {
    // ✅ Use authenticated server client
    const supabase = await createClient()

    // ✅ Verify user session
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado. Por favor inicie sesión.' },
        { status: 401 }
      )
    }

    const { budgetId, budgetData: providedData } = await request.json()

    if (!budgetId) {
      return NextResponse.json(
        { error: 'budgetId es requerido' },
        { status: 400 }
      )
    }

    console.log(`📄 Generando PDF para presupuesto ${budgetId}...`)

    let budgetData: BudgetData

    if (providedData) {
      console.log('Using provided budget data directly')
      budgetData = providedData
    } else {
      // Fallback: Obtener datos del presupuesto de DB
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

      budgetData = budget.budget_data as BudgetData
    }

    // Generar PDF
    const pdfBlob = await generateBudgetPDF(budgetData)
    const filename = getBudgetPDFFilename(budgetData)

    // Subir a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('budgets')
      .upload(`${budgetId}/${filename}`, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('Error subiendo PDF:', uploadError)
      return NextResponse.json(
        { error: 'Error al guardar PDF', details: uploadError.message },
        { status: 500 }
      )
    }

    // Obtener URL pública con timestamp para evitar cache
    const { data: urlData } = supabase
      .storage
      .from('budgets')
      .getPublicUrl(uploadData.path)

    // Agregar timestamp para forzar regeneración y evitar cache del navegador
    const timestamp = Date.now()
    const pdfUrl = `${urlData.publicUrl}?t=${timestamp}`

    // Actualizar registro
    const { error: updateError } = await supabase
      .from('budgets')
      .update({ pdf_url: pdfUrl })
      .eq('id', budgetId)

    if (updateError) {
      console.error('Error actualizando URL:', updateError)
    }

    console.log(`✅ PDF generado: ${pdfUrl}`)

    // Return PDF binary directly with metadata in headers
    // This allows the frontend to display it immediately (Blob pattern)
    // while still receiving the persistent URL for state updates
    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'X-Pdf-Url': pdfUrl,
        'X-Pdf-Filename': filename
      }
    })

  } catch (error) {
    console.error('❌ Error generando PDF:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: errorMessage,
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack : undefined })
      },
      { status: 500 }
    )
  }
}

