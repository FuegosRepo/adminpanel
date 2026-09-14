'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Copy, RotateCcw, FileDown, Sparkles, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

type ChatRole = 'user' | 'assistant'

interface ChatMessage {
    id: string
    role: ChatRole
    content: React.ReactNode
    plainText: string
}

// Conversación de ejemplo, tal cual el flujo descrito en el plan (2.1/2.2):
// el admin pide una lista de compras, y va ajustándola en el mismo hilo.
// Esto es contenido fijo para mostrar el diseño — no hay ningún modelo de
// IA respondiendo acá.
const SCRIPTED_MESSAGES: ChatMessage[] = [
    {
        id: 'm1',
        role: 'user',
        plainText: 'Necesito la lista de compras para la boda de Dubois y el cumpleaños de Martin de este sábado.',
        content: 'Necesito la lista de compras para la boda de Dubois y el cumpleaños de Martin de este sábado.',
    },
    {
        id: 'm2',
        role: 'assistant',
        plainText: 'Lista de compras para 2 eventos (65 personas en total).',
        content: (
            <div className="space-y-2">
                <p>Junté los dos eventos del sábado. Las cantidades salen del motor de productos, no las calculo yo:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Carnes</strong> — 19.5 kg (Entrecôte, Picanha) — proveedor habitual</li>
                    <li><strong>Entrantes</strong> — Tapas de chorizo x65, Empanadas x130</li>
                    <li><strong>Vinos</strong> — 12 botellas tinto, 8 botellas blanco</li>
                    <li><strong>Postre</strong> — Panqueques (ingredientes para 65)</li>
                </ul>
                <p className="text-muted-foreground text-sm">¿Agrupo por proveedor o preferís por evento?</p>
            </div>
        ),
    },
    {
        id: 'm3',
        role: 'user',
        plainText: 'Sacá los vinos, los pone el cliente en los dos eventos.',
        content: 'Sacá los vinos, los pone el cliente en los dos eventos.',
    },
    {
        id: 'm4',
        role: 'assistant',
        plainText: 'Listo, saqué los vinos de ambos eventos.',
        content: (
            <div className="space-y-2">
                <p>Listo, saqué los vinos de los dos eventos:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Carnes</strong> — 19.5 kg (Entrecôte, Picanha)</li>
                    <li><strong>Entrantes</strong> — Tapas de chorizo x65, Empanadas x130</li>
                    <li><strong>Postre</strong> — Panqueques (ingredientes para 65)</li>
                </ul>
            </div>
        ),
    },
    {
        id: 'm5',
        role: 'user',
        plainText: 'Agregá 10% de margen en las carnes.',
        content: 'Agregá 10% de margen en las carnes.',
    },
    {
        id: 'm6',
        role: 'assistant',
        plainText: 'Carnes recalculadas con 10% de margen: 21.45 kg.',
        content: (
            <p>
                Hecho. <strong>Carnes</strong>: 19.5 kg → <strong>21.45 kg</strong> con el 10% de margen aplicado.
                El resto de la lista no cambia.
            </p>
        ),
    },
    {
        id: 'm7',
        role: 'user',
        plainText: 'Ponelo en tabla.',
        content: 'Ponelo en tabla.',
    },
    {
        id: 'm8',
        role: 'assistant',
        plainText: 'Tabla final de la lista de compras.',
        content: (
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b text-left text-muted-foreground">
                            <th className="py-1.5 pr-3 font-medium">Ítem</th>
                            <th className="py-1.5 pr-3 font-medium">Cantidad</th>
                            <th className="py-1.5 font-medium">Nota</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-1.5 pr-3">Entrecôte / Picanha</td>
                            <td className="py-1.5 pr-3">21.45 kg</td>
                            <td className="py-1.5 text-muted-foreground">con 10% de margen</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-1.5 pr-3">Tapas de chorizo</td>
                            <td className="py-1.5 pr-3">65 u.</td>
                            <td className="py-1.5 text-muted-foreground">—</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-1.5 pr-3">Empanadas</td>
                            <td className="py-1.5 pr-3">130 u.</td>
                            <td className="py-1.5 text-muted-foreground">—</td>
                        </tr>
                        <tr>
                            <td className="py-1.5 pr-3">Panqueques (ingredientes)</td>
                            <td className="py-1.5 pr-3">65 pers.</td>
                            <td className="py-1.5 text-muted-foreground">dulce de leche aparte</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ),
    },
    {
        id: 'm9',
        role: 'user',
        plainText: '¿Hay algo pendiente con la boda de Dubois?',
        content: '¿Hay algo pendiente con la boda de Dubois?',
    },
    {
        id: 'm10',
        role: 'assistant',
        plainText: 'Encontré una diferencia entre el pedido y un mail del cliente.',
        content: (
            <div className="space-y-2">
                <p>
                    Sí, encontré una diferencia entre lo que dice el pedido y un mail de Gmail
                    vinculado a este evento:
                </p>
                <div className="rounded-md border-l-2 border-amber-400 bg-amber-50 px-3 py-2 text-sm">
                    <p className="text-amber-900">
                        El 12/08, la clienta escribió (cita textual del mail, en francés):
                    </p>
                    <p className="italic text-amber-900 mt-1">
                        « Finalement on serait 55, pas 45 »
                    </p>
                    <p className="text-amber-800/90 mt-1">
                        El pedido en la web todavía dice <strong>45 invitados</strong>.
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Esto es solo lectura: yo no cambio el pedido. Si confirmás el dato,
                    lo actualizás vos con un clic desde la fila del pedido.
                </p>
            </div>
        ),
    },
]

const PREVIEW_REPLY =
    'Vista previa de diseño: en la versión conectada, acá te respondería usando los datos reales de tus eventos y productos. Por ahora esta pantalla solo muestra cómo va a verse.'

function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-1 py-2">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: `${i * 120}ms` }}
                />
            ))}
        </div>
    )
}

function MessageBubble({ message, isLast }: { message: ChatMessage; isLast: boolean }) {
    const isUser = message.role === 'user'

    const handleCopy = () => {
        navigator.clipboard.writeText(message.plainText)
        toast.success('Copiado')
    }

    return (
        <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div
                className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
            >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            </div>
            <div className={`max-w-[80%] space-y-1 ${isUser ? 'items-end flex flex-col' : ''}`}>
                <div
                    className={`rounded-lg px-3.5 py-2.5 text-sm ${isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                >
                    {message.content}
                </div>
                {!isUser && (
                    <div className="flex items-center gap-1 pl-0.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-muted-foreground"
                            onClick={handleCopy}
                        >
                            <Copy className="h-3 w-3 mr-1" /> Copiar
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-muted-foreground"
                            disabled
                            title="Disponible cuando el chat esté conectado a IA real"
                        >
                            <RotateCcw className="h-3 w-3 mr-1" /> Reintentar
                        </Button>
                        {isLast && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-muted-foreground"
                                disabled
                                title="Disponible cuando el chat esté conectado a IA real"
                            >
                                <FileDown className="h-3 w-3 mr-1" /> Exportar a PDF
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * Chat de Asistentes — vista previa de diseño (Fase 2.1/2.2 del plan).
 * No conecta a ningún modelo de IA: la conversación de ejemplo es fija y
 * cualquier mensaje nuevo recibe una respuesta de aviso, no una respuesta
 * real. Sirve para validar la interfaz antes de resolver créditos de
 * OpenAI y las decisiones de Gmail/Assistants.
 */
export function ChatPanel() {
    const [messages, setMessages] = useState<ChatMessage[]>(SCRIPTED_MESSAGES)
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSend = () => {
        const text = input.trim()
        if (!text) return

        const userMessage: ChatMessage = {
            id: `u-${Date.now()}`,
            role: 'user',
            plainText: text,
            content: text,
        }
        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        // Simulación de "está escribiendo" — no hay ninguna llamada real acá.
        setTimeout(() => {
            const assistantMessage: ChatMessage = {
                id: `a-${Date.now()}`,
                role: 'assistant',
                plainText: PREVIEW_REPLY,
                content: PREVIEW_REPLY,
            }
            setMessages((prev) => [...prev, assistantMessage])
            setIsTyping(false)
        }, 900)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id

    return (
        <div className="flex flex-col h-[560px] border rounded-lg bg-card">
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-5">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isLast={message.id === lastAssistantId}
                        />
                    ))}
                    {isTyping && (
                        <div className="flex gap-2.5">
                            <div className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                                <Sparkles className="h-3.5 w-3.5" />
                            </div>
                            <div className="rounded-lg bg-muted px-3.5">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="border-t p-3 flex items-end gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pedí una lista de compras, un ajuste, o preguntá algo sobre estos eventos..."
                    className="min-h-[44px] max-h-32 resize-none"
                    rows={1}
                />
                <Button onClick={handleSend} disabled={!input.trim()} size="icon" className="shrink-0">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
