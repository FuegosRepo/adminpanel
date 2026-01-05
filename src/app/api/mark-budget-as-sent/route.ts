import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
    try {
        const { budgetId } = await request.json()

        if (!budgetId) {
            return NextResponse.json(
                { error: 'Budget ID es requerido' },
                { status: 400 }
            )
        }

        console.log(`📋 Marcando presupuesto ${budgetId} como enviado (sin enviar email)`)

        // 1. Obtener el presupuesto
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

        // 2. Actualizar estado a 'sent' y guardar timestamp
        // NOTA: NO enviamos email al cliente - solo marcamos como enviado
        const { error: updateError } = await supabase
            .from('budgets')
            .update({
                status: 'sent',
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

        console.log('✅ Presupuesto marcado como enviado manualmente (sin envío de email)')

        return NextResponse.json({
            success: true,
            message: 'Presupuesto marcado como enviado exitosamente'
        })

    } catch (error) {
        console.error('Error en mark-budget-as-sent:', error)
        return NextResponse.json(
            { error: 'Error inesperado al procesar la solicitud' },
            { status: 500 }
        )
    }
}
