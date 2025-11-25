import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { BudgetData } from '@/lib/types/budget'

export async function POST(request: NextRequest) {
  try {
    const { budgetId, budgetData, editedBy, changesSummary } = await request.json()

    if (!budgetId || !budgetData) {
      return NextResponse.json(
        { error: 'budgetId y budgetData son requeridos' },
        { status: 400 }
      )
    }

    console.log(`✏️ Actualizando presupuesto ${budgetId}...`)

    // Obtener versión actual
    const { data: currentBudget, error: fetchError } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', budgetId)
      .single()

    if (fetchError || !currentBudget) {
      return NextResponse.json(
        { error: 'Presupuesto no encontrado' },
        { status: 404 }
      )
    }

    const newVersion = (currentBudget.version || 1) + 1
    const versionHistory = currentBudget.version_history || []

    // Calcular cambios
    const changes = calculateChanges(currentBudget.budget_data, budgetData)

    // Agregar al historial
    versionHistory.push({
      version: newVersion,
      changed_by: editedBy || 'admin',
      changed_at: new Date().toISOString(),
      changes,
      summary: changesSummary || 'Presupuesto editado manualmente'
    })

    // Actualizar
    const { data: updatedBudget, error: updateError } = await supabase
      .from('budgets')
      .update({
        budget_data: budgetData,
        version: newVersion,
        edited_by: editedBy || 'admin',
        edited_at: new Date().toISOString(),
        version_history: versionHistory,
        status: 'pending_review',
        pdf_url: null
      })
      .eq('id', budgetId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Error al actualizar', details: updateError.message },
        { status: 500 }
      )
    }

    console.log(`✅ Presupuesto actualizado a v${newVersion}`)

    return NextResponse.json({
      success: true,
      budget: updatedBudget
    })

  } catch (error) {
    console.error('❌ Error actualizando presupuesto:', error)
    return NextResponse.json(
      { error: 'Error inesperado', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

function calculateChanges(oldData: any, newData: any): Array<{ field: string, oldValue: any, newValue: any }> {
  const changes: Array<{ field: string, oldValue: any, newValue: any }> = []

  if (oldData?.totals?.totalTTC !== newData?.totals?.totalTTC) {
    changes.push({ field: 'Total TTC', oldValue: oldData?.totals?.totalTTC, newValue: newData?.totals?.totalTTC })
  }
  if (oldData?.menu?.pricePerPerson !== newData?.menu?.pricePerPerson) {
    changes.push({ field: 'Prix par personne', oldValue: oldData?.menu?.pricePerPerson, newValue: newData?.menu?.pricePerPerson })
  }

  return changes
}

