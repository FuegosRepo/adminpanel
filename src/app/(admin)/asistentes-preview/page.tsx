'use client'

import { useState } from 'react'
import { Sparkles, AlertTriangle, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContextChips, mockGmailThreadCount, type ContextItem } from '@/components/AiChat/ContextChips'
import { ChatPanel } from '@/components/AiChat/ChatPanel'
import { EventSelector } from '@/components/AiChat/EventSelector'
import { PromptEditorDialog } from '@/components/AiChat/PromptEditorDialog'
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
 * Vista previa de diseño de la pestaña "Asistentes" (Fase 2 del plan,
 * bloqueada por créditos de OpenAI y decisiones de Gmail/Assistants).
 *
 * No está en el sidebar a propósito: es solo para revisar la interfaz.
 * El selector de eventos lee pedidos aprobados reales (mismo hook que la
 * Calculadora, solo lectura). Los hilos de Gmail son un número simulado
 * por pedido — todavía no hay conexión real a Gmail.
 */
export default function AsistentesPreviewPage() {
    const [contextItems, setContextItems] = useState<ContextItem[]>([])

    const handleAddToContext = (orders: CateringOrder[]) => {
        setContextItems((prev) => [...prev, ...orders.map(orderToContextItem)])
    }

    const handleRemove = (id: string) => {
        setContextItems((prev) => prev.filter((item) => item.id !== id))
    }

    return (
        <div className="w-full max-w-[1100px] mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                    <p className="font-medium">Vista previa de diseño — sin IA ni Gmail conectados</p>
                    <p className="text-amber-800/90">
                        La lista de eventos de abajo es real (pedidos aprobados). Los hilos de
                        Gmail que se muestran por pedido son un número de ejemplo, no una
                        conexión real: la idea es que la IA pueda cruzar lo que dice el pedido
                        en la web con lo que el cliente escribió por mail, una vez que Gmail
                        esté conectado y se resuelvan los créditos de OpenAI.
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
                        <div className="flex items-center justify-between gap-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Asistentes
                            </CardTitle>
                            <PromptEditorDialog />
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
                        <ChatPanel />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
