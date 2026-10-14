'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, AlertTriangle, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContextChips, mockGmailThreadCount, type ContextItem } from '@/components/AiChat/ContextChips'
import { ChatPanel, type ChatPanelEvent } from '@/components/AiChat/ChatPanel'
import { EventSelector } from '@/components/AiChat/EventSelector'
import { PromptEditorDialog } from '@/components/AiChat/PromptEditorDialog'
import { UsageSummary } from '@/components/AiChat/UsageSummary'
import { fetchLatestBudgetMenus } from '@/services/budgetsService'
import type { BudgetMenuSection } from '@/lib/types/budget'
import type { CateringOrder } from '@/types'

function orderToContextItem(order: CateringOrder): ContextItem {
    return {
        id: order.id,
        icon: order.contact.eventType?.toLowerCase().includes('mariage') ? '🎉' : '🎂',
        label: order.contact.name || 'Sin nombre',
        sublabel: `${order.contact.eventDate || 'Sin fecha'} · ${order.contact.guestCount || 0} invitados`,
        gmailThreadCount: mockGmailThreadCount(order.id),
    }
}

/**
 * El menú real (lo que el admin terminó aprobando en el devis) vive en
 * budgets.budget_data.menu, no en catering_orders.entrees/viandes/dessert
 * — esos campos son lo que el cliente tildó en el formulario de la web y
 * suelen quedar vacíos o desactualizados. Si hay presupuesto, se usa ese;
 * si no, se cae a los campos del pedido como antes.
 */
function orderToChatPanelEvent(order: CateringOrder, menu: BudgetMenuSection | undefined): ChatPanelEvent {
    return {
        name: order.contact.name || 'Sin nombre',
        eventDate: order.contact.eventDate || '',
        eventType: order.contact.eventType || '',
        guestCount: order.contact.guestCount || 0,
        entrees: menu?.entrees?.map((i) => i.name) ?? order.entrees ?? [],
        viandes: menu?.viandes?.map((i) => i.name) ?? order.viandes ?? [],
        dessert: menu?.dessert?.name ?? order.dessert,
    }
}

/**
 * Vista previa de diseño de la pestaña "Asistentes" (Fase 2 del plan,
 * bloqueada por créditos de OpenAI y decisiones de Gmail/Assistants).
 *
 * No está en el sidebar a propósito: es solo para revisar la interfaz.
 * El selector de eventos lee pedidos aprobados reales (mismo hook que la
 * Calculadora, solo lectura). Los hilos de Gmail son un número simulado
 * por pedido — todavía no hay conexión real a Gmail.
 */
export default function AsistentesPreviewPage() {
    // Se guardan los pedidos completos (no solo el resumen para mostrar en
    // los chips) porque el chat necesita entrées/viandes/postre reales
    // para armar el devis que le manda a la IA.
    const [contextOrders, setContextOrders] = useState<CateringOrder[]>([])
    const [usageVersion, setUsageVersion] = useState(0)

    const contextOrderIds = contextOrders.map((o) => o.id)
    const { data: budgetMenus = {} } = useQuery({
        queryKey: ['budgetMenus', contextOrderIds],
        queryFn: () => fetchLatestBudgetMenus(contextOrderIds),
        enabled: contextOrderIds.length > 0,
    })

    const handleAddToContext = (orders: CateringOrder[]) => {
        setContextOrders((prev) => [...prev, ...orders])
    }

    const handleRemove = (id: string) => {
        setContextOrders((prev) => prev.filter((order) => order.id !== id))
    }

    const contextItems = contextOrders.map(orderToContextItem)

    return (
        <div className="w-full max-w-[1100px] mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                    <p className="font-medium">El chat ya llama a OpenAI de verdad — sin Gmail todavía</p>
                    <p className="text-amber-800/90">
                        La lista de eventos es real, y el chat manda el prompt, el manual de
                        cálculos y el devis del evento elegido a la API de OpenAI. Si la cuenta
                        no tiene crédito cargado, vas a ver el error real de OpenAI en el chat,
                        no un mensaje de vista previa. Los hilos de Gmail que se muestran por
                        pedido siguen siendo un número de ejemplo, esa parte no está conectada.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-[300px_1fr] gap-4 md:h-[640px]">
                <EventSelector
                    onAddToContext={handleAddToContext}
                    alreadyInContext={new Set(contextItems.map((i) => i.id))}
                />

                <Card className="flex flex-col md:h-full min-h-0">
                    <CardHeader className="pb-3 shrink-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Asistentes
                            </CardTitle>
                            <div className="flex items-center gap-1">
                                <UsageSummary refreshKey={usageVersion} />
                                <PromptEditorDialog />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            Contexto combinado: pedidos de la web + hilos de Gmail vinculados
                        </p>
                        <div className="max-h-32 overflow-y-auto">
                            <ContextChips items={contextItems} onRemove={handleRemove} />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <ChatPanel
                            events={contextOrders.map((o) => orderToChatPanelEvent(o, budgetMenus[o.id]))}
                            onUsageLogged={() => setUsageVersion((v) => v + 1)}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
