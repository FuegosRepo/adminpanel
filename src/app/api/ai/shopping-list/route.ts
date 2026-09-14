import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { SHOPPING_LIST_PROMPT_SEED } from '@/components/AiChat/promptSeed'
import { CALCULATION_MANUAL_SEED } from '@/components/AiChat/calculationManualSeed'

// Misma clave que usa Fuegos para el generador de presupuestos (decisión:
// una sola clave de OpenAI para todo el proyecto, no una separada por app).
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

interface ChatMessageInput {
    role: 'user' | 'assistant'
    content: string
}

interface DevisEventInput {
    name: string
    eventDate: string
    eventType: string
    guestCount: number
    entrees: string[]
    viandes: string[]
    dessert: string | null
}

function buildDevisContext(events: DevisEventInput[]): string {
    if (events.length === 0) {
        return 'No hay eventos seleccionados todavía. Si el usuario pide un cálculo, pedile que elija uno o más pedidos de la lista antes de calcular.'
    }

    return events
        .map((e, i) => `
Evento ${i + 1}: ${e.name}
Fecha: ${e.eventDate || 'sin fecha'}
Tipo de evento: ${e.eventType || 'sin especificar'}
Invitados: ${e.guestCount}
Entrées seleccionadas: ${e.entrees.length > 0 ? e.entrees.join(', ') : 'ninguna'}
Viandes seleccionadas: ${e.viandes.length > 0 ? e.viandes.join(', ') : 'ninguna'}
Postre: ${e.dessert || 'sin especificar'}`)
        .join('\n---')
}

/**
 * Endpoint real para el chat de Asistentes (lista de compras). Usa como
 * prompt de sistema lo que mande el cliente en customPrompt/customManual
 * (lo que esté guardado en localStorage vía PromptEditorDialog), y si no
 * mandó nada cae en los seeds fijos (src/components/AiChat/promptSeed.ts
 * y calculationManualSeed.ts) — el mismo prompt + manual que el cliente
 * ya tiene en su GPT de ChatGPT.
 *
 * No genera PDF ni escribe nada en la base: devuelve texto, que el chat
 * muestra y desde donde se exporta a PDF del lado del cliente.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        if (!OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OPENAI_API_KEY no está configurada en el servidor' },
                { status: 500 }
            )
        }

        const body = await request.json()
        const messages: ChatMessageInput[] = Array.isArray(body?.messages) ? body.messages : []
        const events: DevisEventInput[] = Array.isArray(body?.events) ? body.events : []
        // El cliente manda lo que tenga guardado en localStorage (ver
        // PromptEditorDialog/promptStorage.ts). Si no manda nada o vino
        // vacío, se usan los seeds fijos como default.
        const customPrompt: string = typeof body?.customPrompt === 'string' ? body.customPrompt.trim() : ''
        const customManual: string = typeof body?.customManual === 'string' ? body.customManual.trim() : ''

        if (messages.length === 0 || !messages[messages.length - 1]?.content?.trim()) {
            return NextResponse.json({ error: 'Falta el mensaje del usuario' }, { status: 400 })
        }

        const systemPrompt = `${customPrompt || SHOPPING_LIST_PROMPT_SEED}

--- MANUAL DE CÁLCULOS (Knowledge) ---
${customManual || CALCULATION_MANUAL_SEED}`

        const openAiMessages = [
            { role: 'system', content: systemPrompt },
            { role: 'system', content: `DEVIS DE LOS EVENTOS SELECCIONADOS:\n${buildDevisContext(events)}` },
            ...messages,
        ]

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: openAiMessages,
                temperature: 0.2,
                max_tokens: 2000,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            return NextResponse.json(
                {
                    error: 'Error al llamar a OpenAI',
                    details: errorData?.error?.message || response.statusText,
                },
                { status: response.status === 429 ? 429 : 502 }
            )
        }

        const data = await response.json()
        const reply = data.choices?.[0]?.message?.content

        if (!reply) {
            return NextResponse.json({ error: 'OpenAI no devolvió contenido' }, { status: 502 })
        }

        return NextResponse.json({ reply })
    } catch (error) {
        console.error('Error en /api/ai/shopping-list:', error)
        return NextResponse.json(
            {
                error: 'Error inesperado',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
