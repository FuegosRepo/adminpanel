'use client'

import { useState } from 'react'
import { Sparkles, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContextChips, type ContextItem } from '@/components/AiChat/ContextChips'
import { ChatPanel } from '@/components/AiChat/ChatPanel'

const MOCK_EVENTS: ContextItem[] = [
    { id: 'ev1', icon: '🎉', label: 'Boda Dubois — 14 jun' },
    { id: 'ev2', icon: '🎂', label: 'Cumpleaños Martin — 13 sep' },
]

/**
 * Vista previa de diseño de la pestaña "Asistentes" (Fase 2 del plan,
 * bloqueada por créditos de OpenAI y decisiones de Gmail/Assistants).
 *
 * No está en el sidebar a propósito: es solo para revisar la interfaz,
 * no una funcionalidad activa. Nada acá llama a OpenAI ni gasta crédito.
 */
export default function AsistentesPreviewPage() {
    const [contextItems, setContextItems] = useState<ContextItem[]>(MOCK_EVENTS)

    const handleRemove = (id: string) => {
        setContextItems((prev) => prev.filter((item) => item.id !== id))
    }

    return (
        <div className="w-full max-w-[1000px] mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                    <p className="font-medium">Vista previa de diseño — sin IA conectada</p>
                    <p className="text-amber-800/90">
                        Esta pantalla no está en el menú y no llama a OpenAI. La conversación de
                        ejemplo es fija, para mostrar cómo va a verse el chat de Asistentes
                        cuando se resuelvan los créditos de OpenAI y las decisiones pendientes
                        (Gmail y los asistentes de ChatGPT del cliente).
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Asistentes
                    </CardTitle>
                    <ContextChips items={contextItems} onRemove={handleRemove} />
                </CardHeader>
                <CardContent>
                    <ChatPanel />
                </CardContent>
            </Card>
        </div>
    )
}
