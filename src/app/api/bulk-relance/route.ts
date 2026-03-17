import { NextResponse } from 'next/server'
import { sendEmail, processEmailTemplate } from '@/lib/emails/service'
import { BaseLayout } from '@/lib/emails/templates/BaseLayout'
import { QuoteFollowUpTemplate } from '@/lib/emails/templates/QuoteFollowUp'
import { createClient } from '@/utils/supabase/server'
import { emailTemplates } from '@/data/mockData' // Fallback or source of templates

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'No autorizado. Por favor inicie sesión.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { filters, budgetIds } = body

        if (!filters || !filters.status || (!filters.status.startsWith('relance_') && filters.status !== 'sent')) {
            return NextResponse.json(
                { error: 'Filtro de relance no válido o no proporcionado.' },
                { status: 400 }
            )
        }

        // 1. Fetch budgets matching the filter OR specific IDs
        let query = supabase
            .from('budgets')
            .select('id, order_id, relance_count')

        // If specific IDs provided, prioritize them
        if (budgetIds && Array.isArray(budgetIds) && budgetIds.length > 0) {
            query = query.in('id', budgetIds)
        } else {
            // Fallback to filter logic
            if (filters.status === 'sent') {
                query = query.in('status', ['sent', 'ENVIADO']).or('relance_count.eq.0,relance_count.is.null')
                    .not('status', 'in', '(approved,APPROVED,rejected)')
            } else {
                const countStr = filters.status.split('_')[1];
                const count = parseInt(countStr);

                if (isNaN(count)) {
                    return NextResponse.json({ error: 'Formato de filtro inválido' }, { status: 400 })
                }

                query = query.not('status', 'in', '(approved,APPROVED,rejected)')
                if (count >= 3) {
                    query = query.gte('relance_count', 3);
                } else {
                    query = query.eq('relance_count', count);
                }
            }
        }

        const { data: budgets, error: budgetsError } = await query

        if (budgetsError) {
            return NextResponse.json({ error: 'Error al buscar presupuestos: ' + budgetsError.message }, { status: 500 })
        }

        if (!budgets || budgets.length === 0) {
            return NextResponse.json({ success: true, message: 'No se encontraron presupuestos para relanzar.', sentCount: 0 })
        }

        // 2. Prepare Template
        // Using ID '5' for "Relance devis" as per OrderCard.tsx
        // In a real app we might fetch this from DB, but OrderCard uses mockData '5'
        const templateId = '5'
        // We can fetch from DB if needed, or use hardcoded if that's how it is. 
        // routes.ts fetches from 'email_templates' table if templateId provided.

        let subject = 'Relance - Votre devis Fuegos d\'Azur' // Default fallbacks
        let content = 'Bonjour {{name}}, ...'

        const { data: templateData } = await supabase
            .from('email_templates')
            .select('*')
            .eq('id', templateId)
            .single()

        if (templateData) {
            subject = templateData.subject
            content = templateData.content
        } else {
            // Fallback to mock data if DB missing
            const mockTemplate = emailTemplates.find(t => t.id === '5')
            if (mockTemplate) {
                subject = mockTemplate.subject
                content = mockTemplate.content
            }
        }

        const headerUrl = process.env.EMAIL_HEADER_IMAGE_URL || 'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/headerblack.png'
        const logoUrl = process.env.EMAIL_LOGO_IMAGE_URL || 'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/minilogoblack.png'

        let successCount = 0
        let failureCount = 0

        // 3. Pre-fetch all orders in a single query (avoids N+1)
        const orderIds = [...new Set(budgets.map(b => b.order_id).filter(Boolean))]
        const { data: allOrders } = await supabase
            .from('catering_orders')
            .select('*')
            .in('id', orderIds)

        const ordersMap = new Map(
            (allOrders || []).map(order => [order.id, order])
        )

        // 4. Send in batches of 5 for better throughput
        const BATCH_SIZE = 5
        for (let i = 0; i < budgets.length; i += BATCH_SIZE) {
            const batch = budgets.slice(i, i + BATCH_SIZE)
            const results = await Promise.allSettled(batch.map(async (budget) => {
                const order = ordersMap.get(budget.order_id)

                if (!order || !order.email) {
                    return false
                }

                const variables = {
                    name: order.name || order.contact?.name || 'Client',
                    eventDate: order.event_date ? new Date(order.event_date).toLocaleDateString('fr-FR') : 'Date à définir',
                    guestCount: order.guest_count || 0,
                    eventType: order.event_type || 'Evento'
                }

                const processedSubject = processEmailTemplate(subject, variables)
                const processedContent = processEmailTemplate(content, variables)

                const htmlBody = QuoteFollowUpTemplate(processedContent, {
                    clientName: variables.name,
                    logoUrl
                })
                const finalHtml = BaseLayout(htmlBody, { headerUrl })

                const result = await sendEmail({
                    to: order.email,
                    subject: processedSubject,
                    html: finalHtml,
                    tags: [
                        { name: 'category', value: 'catering' },
                        { name: 'order_id', value: order.id },
                        { name: 'bulk_relance', value: 'true' }
                    ]
                })

                if (result.success) {
                    await supabase
                        .from('email_logs')
                        .insert([{
                            order_id: order.id,
                            template_id: templateId,
                            recipient_email: order.email,
                            recipient_name: variables.name,
                            subject: processedSubject,
                            content: processedContent,
                            status: 'sent'
                        }])

                    const { error: rpcError } = await supabase.rpc('increment_budget_relance', {
                        order_id_param: order.id
                    })
                    if (rpcError) {
                        await supabase
                            .from('budgets')
                            .update({ relance_count: (budget.relance_count || 0) + 1 })
                            .eq('id', budget.id)
                    }

                    return true
                } else {
                    console.error(`Failed to send bulk email to ${order.email}:`, result.error)
                    return false
                }
            }))

            results.forEach(r => {
                if (r.status === 'fulfilled' && r.value) successCount++
                else failureCount++
            })
        }

        return NextResponse.json({
            success: true,
            message: `Proceso completado. Enviados: ${successCount}, Fallidos: ${failureCount}`,
            sentCount: successCount,
            failCount: failureCount
        })

    } catch (error) {
        console.error('Error en API bulk-relance:', error)
        return NextResponse.json(
            {
                error: 'Error al procesar envío masivo',
                details: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
