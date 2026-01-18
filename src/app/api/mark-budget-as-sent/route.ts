import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
    try {
        // ✅ Use authenticated server client
        const supabase = createClient()

        // ✅ Verify user session
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado. Por favor inicie sesión.' },
                { status: 401 }
            )
        }

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

        // ✅ 3. Sync order status and estimated_price
        if (budget.order_id) {
            const budgetData = budget.budget_data as any
            const { error: orderUpdateError } = await supabase
                .from('catering_orders')
                .update({
                    status: 'sent',
                    estimated_price: budgetData?.totals?.totalTTC || 0,
                    updated_at: new Date().toISOString()
                })
                .eq('id', budget.order_id)

            if (orderUpdateError) {
                console.warn('⚠️ Failed to sync order status:', orderUpdateError)
            } else {
                console.log('✅ Order status synced to sent')
            }
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

