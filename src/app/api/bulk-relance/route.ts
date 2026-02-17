import { NextResponse } from 'next/server'
import { sendEmail, processEmailTemplate } from '@/lib/emails/service'
import { BaseLayout } from '@/lib/emails/templates/BaseLayout'
import { QuoteFollowUpTemplate } from '@/lib/emails/templates/QuoteFollowUp'
import { createClient } from '@/utils/supabase/server'
import { emailTemplates } from '@/data/mockData' // Fallback or source of templates

export async function POST(request: Request) {
    try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado. Por favor inicie sesión.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { filters, budgetIds } = body

        if (!filters || !filters.status || !filters.status.startsWith('relance_')) {
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
            const countStr = filters.status.split('_')[1];
            const count = parseInt(countStr);

            if (isNaN(count)) {
                return NextResponse.json({ error: 'Formato de filtro inválido' }, { status: 400 })
            }

            if (count >= 3) {
                query = query.gte('relance_count', 3);
            } else {
                query = query.eq('relance_count', count);
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

        const headerUrl = 'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/headerblack.png'
        const logoUrl = 'https://fygptwzqzjgomumixuqc.supabase.co/storage/v1/object/public/budgets/imgemail/minilogoblack.png'

        let successCount = 0
        let failureCount = 0

        // 3. Loop and Send
        for (const budget of budgets) {
            // Get order details for email
            const { data: order } = await supabase
                .from('catering_orders')
                .select('*')
                .eq('id', budget.order_id)
                .single()

            if (!order || !order.email) {
                failureCount++
                continue
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
                successCount++
                // Log it
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

                // Increment Count
                // Try RPC first
                const { error: rpcError } = await supabase.rpc('increment_budget_relance', {
                    order_id_param: order.id
                })
                if (rpcError) {
                    // Fallback manual update
                    await supabase
                        .from('budgets')
                        .update({ relance_count: (budget.relance_count || 0) + 1 })
                        .eq('id', budget.id)
                }

            } else {
                console.error(`Failed to send bulk email to ${order.email}:`, result.error)
                failureCount++
            }
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
