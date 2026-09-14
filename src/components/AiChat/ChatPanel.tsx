'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Copy, RotateCcw, FileDown, Sparkles, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { getStoredPrompt, getStoredManual } from './promptStorage'
import { logUsage } from './usageStorage'

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
    /** Se llama después de registrar el uso de una consulta exitosa, para que el contador de gasto se actualice. */
    onUsageLogged?: () => void
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

interface MessageBubbleProps {
    message: ChatMessage
    isLast: boolean
    canRetry: boolean
    isBusy: boolean
    onRetry: () => void
    onExport: () => void
}

function MessageBubble({ message, isLast, canRetry, isBusy, onRetry, onExport }: MessageBubbleProps) {
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
                {!isUser && (
                    <div className="flex items-center gap-1 pl-0.5">
                        {!message.isError && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-muted-foreground"
                                onClick={handleCopy}
                            >
                                <Copy className="h-3 w-3 mr-1" /> Copiar
                            </Button>
                        )}
                        {canRetry && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-muted-foreground"
                                disabled={isBusy}
                                onClick={onRetry}
                            >
                                <RotateCcw className="h-3 w-3 mr-1" /> Reintentar
                            </Button>
                        )}
                        {isLast && !message.isError && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-muted-foreground"
                                onClick={onExport}
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
 * Manda a la API el prompt/manual editados en PromptEditorDialog (si hay
 * algo guardado en localStorage de este navegador) o, si no, los seeds
 * fijos. Reintentar vuelve a mandar el último mensaje del usuario sin
 * repetirlo a mano. Exportar a PDF genera el PDF del lado del cliente,
 * con jsPDF cargado recién al usarlo (no infla el bundle inicial).
 */
export function ChatPanel({ events, onUsageLogged }: ChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    /** Llama a la API con el historial dado y agrega la respuesta (o el error). */
    const callApi = async (historyForApi: ChatMessage[]) => {
        setIsTyping(true)
        try {
            const conversationHistory = historyForApi
                .filter((m) => m.id !== 'intro' && !m.isError)
                .map((m) => ({ role: m.role, content: m.text }))

            const response = await fetch('/api/ai/shopping-list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: conversationHistory,
                    events,
                    customPrompt: getStoredPrompt(),
                    customManual: getStoredManual(),
                }),
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

            if (data.usage) {
                const lastUserMessage = [...historyForApi].reverse().find((m) => m.role === 'user')
                logUsage({
                    question: (lastUserMessage?.text || '').slice(0, 80),
                    promptTokens: data.usage.promptTokens ?? 0,
                    completionTokens: data.usage.completionTokens ?? 0,
                    estimatedCostUSD: data.usage.estimatedCostUSD ?? 0,
                })
                onUsageLogged?.()
            }
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

    const handleSend = () => {
        const text = input.trim()
        if (!text || isTyping) return

        const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text }
        const nextMessages = [...messages, userMessage]
        setMessages(nextMessages)
        setInput('')
        callApi(nextMessages)
    }

    /** Saca este mensaje de asistente (y el error, si lo hubo) y vuelve a pedirle a la IA lo mismo. */
    const handleRetry = (assistantMessageId: string) => {
        if (isTyping) return
        const index = messages.findIndex((m) => m.id === assistantMessageId)
        if (index <= 0) return
        const historyUpToUser = messages.slice(0, index) // corta antes de la respuesta a reintentar
        setMessages(historyUpToUser)
        callApi(historyUpToUser)
    }

    const handleExport = async (text: string) => {
        try {
            const { default: jsPDF } = await import('jspdf')
            const doc = new jsPDF()
            doc.setFontSize(16)
            doc.text("Lista de Compras — Fuegos d'Azur", 14, 18)
            doc.setFontSize(9)
            doc.setTextColor(120)
            doc.text(new Date().toLocaleDateString('es-AR'), 14, 24)
            doc.setFontSize(11)
            doc.setTextColor(20)
            const lines = doc.splitTextToSize(text, 180)
            doc.text(lines, 14, 34)
            doc.save(`lista-compras-${new Date().toISOString().split('T')[0]}.pdf`)
        } catch {
            toast.error('No se pudo generar el PDF.')
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
                            canRetry={message.role === 'assistant' && message.id !== 'intro'}
                            isBusy={isTyping}
                            onRetry={() => handleRetry(message.id)}
                            onExport={() => handleExport(message.text)}
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
