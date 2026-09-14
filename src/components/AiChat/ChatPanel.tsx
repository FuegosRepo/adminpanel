'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Copy, RotateCcw, FileDown, Sparkles, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

type ChatRole = 'user' | 'assistant'

interface ChatMessage {
    id: string
    role: ChatRole
    text: string
    isError?: boolean
}

/** Lo mínimo del devis que necesita el prompt para calcular. */
export interface ChatPanelEvent {
    name: string
    eventDate: string
    eventType: string
    guestCount: number
    entrees: string[]
    viandes: string[]
    dessert: string | null
}

interface ChatPanelProps {
    events: ChatPanelEvent[]
}

const INTRO_MESSAGE: ChatMessage = {
    id: 'intro',
    role: 'assistant',
    text: 'Elegí uno o más eventos de la lista de la izquierda y pedime la lista de compras. Calculo con el prompt y el manual que ves en "Editar prompt del asistente".',
}

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
        navigator.clipboard.writeText(message.text)
        toast.success('Copiado')
    }

    return (
        <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div
                className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${isUser
                        ? 'bg-primary text-primary-foreground'
                        : message.isError
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                    }`}
            >
                {isUser ? (
                    <User className="h-3.5 w-3.5" />
                ) : message.isError ? (
                    <AlertCircle className="h-3.5 w-3.5" />
                ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                )}
            </div>
            <div className={`max-w-[80%] space-y-1 ${isUser ? 'items-end flex flex-col' : ''}`}>
                <div
                    className={`rounded-lg px-3.5 py-2.5 text-sm whitespace-pre-wrap ${isUser
                            ? 'bg-primary text-primary-foreground'
                            : message.isError
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-muted text-foreground'
                        }`}
                >
                    {message.text}
                </div>
                {!isUser && !message.isError && (
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
                            title="Reintentar: todavía no implementado"
                        >
                            <RotateCcw className="h-3 w-3 mr-1" /> Reintentar
                        </Button>
                        {isLast && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-muted-foreground"
                                disabled
                                title="Exportar a PDF: todavía no implementado"
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
 * Chat de Asistentes, conectado de verdad a /api/ai/shopping-list.
 *
 * Ya no es una conversación de ejemplo: cada mensaje llama a la API real
 * con el prompt + manual de cálculos (src/components/AiChat/promptSeed.ts
 * y calculationManualSeed.ts) y el devis de los eventos seleccionados.
 * Si la cuenta de OpenAI no tiene crédito, el error real de la API
 * aparece acá tal cual — es justamente lo que hay que ver para confirmar
 * que la conexión funciona, aunque la respuesta todavía no pueda
 * generarse por falta de crédito.
 */
export function ChatPanel({ events }: ChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSend = async () => {
        const text = input.trim()
        if (!text || isTyping) return

        const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text }
        const nextMessages = [...messages, userMessage]
        setMessages(nextMessages)
        setInput('')
        setIsTyping(true)

        try {
            const conversationHistory = nextMessages
                .filter((m) => m.id !== 'intro' && !m.isError)
                .map((m) => ({ role: m.role, content: m.text }))

            const response = await fetch('/api/ai/shopping-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory, events }),
            })

            const data = await response.json()

            if (!response.ok) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `err-${Date.now()}`,
                        role: 'assistant',
                        text: `${data.error || 'Error al conectar con la IA'}${data.details ? `\n\n${data.details}` : ''}`,
                        isError: true,
                    },
                ])
                return
            }

            setMessages((prev) => [
                ...prev,
                { id: `a-${Date.now()}`, role: 'assistant', text: data.reply as string },
            ])
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    role: 'assistant',
                    text: `No se pudo conectar con el servidor.\n\n${error instanceof Error ? error.message : ''}`,
                    isError: true,
                },
            ])
        } finally {
            setIsTyping(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant' && !m.isError)?.id

    return (
        <div className="flex flex-col h-full min-h-0 border rounded-lg bg-card">
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
                    disabled={isTyping}
                />
                <Button onClick={handleSend} disabled={!input.trim() || isTyping} size="icon" className="shrink-0">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
