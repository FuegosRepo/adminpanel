import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { OPS_PROMPT_SEED } from '@/components/MiseEnPlace/opsPromptSeed'
import type { MiseEventInput, MisePlan, MiseTask } from '@/components/MiseEnPlace/types'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

// Precio de gpt-4o-mini al momento de escribir esto (ver también shopping-list/route.ts).
const PRICE_PER_1M_INPUT_USD = 0.15
const PRICE_PER_1M_OUTPUT_USD = 0.60

/**
 * A diferencia del asistente de compras (texto libre), acá se le pide a
 * la IA un JSON con un esquema fijo: tareas con cantidad y unidad por
 * evento. El panel arma la checklist y calcula los totales semanales por
 * código, así la suma nunca depende de la aritmética del modelo (el PDF
 * de ejemplo del cliente tenía ese cuadro mal sumado).
 */
const OUTPUT_CONTRACT = `
FORMATO DE RESPUESTA (OBLIGATORIO):
Respondé ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después, con exactamente esta estructura:
{
  "events": [
    {
      "orderId": "<el orderId recibido, sin cambiar>",
      "tasks": [
        { "label": "Papas", "quantity": 15, "unit": "kg", "note": "", "toConfirm": false },
        { "label": "Descongelar cebollas", "quantity": 0.75, "unit": "kg", "note": "", "toConfirm": false },
        { "label": "Mezclar cebollas + pimientos", "quantity": null, "unit": null, "note": "", "toConfirm": false },
        { "label": "Frasco chimi", "quantity": 1, "unit": "un.", "note": "", "toConfirm": false }
      ],
      "standardMaterial": ["Caja negra", "Caja cubiertos", "Caja higiene"],
      "specificMaterial": [
        { "label": "Platos principales", "quantity": 20, "unit": "un.", "note": "", "toConfirm": false }
      ],
      "pendingQuestions": ["<pregunta concreta si falta un dato del devis, o lista vacía>"]
    }
  ],
  "generalTasks": [
    { "label": "Vinagreta (mostaza, 3/4 aceite, 1/4 aceto)", "quantity": null, "unit": null, "note": "", "toConfirm": false }
  ],
  "notes": "<observaciones generales de la semana, o cadena vacía>"
}
Reglas del JSON:
- "quantity" es un número (usar punto decimal) o null cuando la tarea no tiene cantidad. Nunca texto.
- "unit" es una de: "kg", "gr", "un.", "frasco", "pote", "porciones", "bolsas", o null.
- Si un dato falta en el devis y no podés calcular, poné "toConfirm": true, "quantity": null y agregá la pregunta en "pendingQuestions". NO inventes cantidades.
- Usá siempre los mismos nombres de tarea entre eventos (ej. siempre "Papas", siempre "Descongelar cebollas", siempre "Miniburger") para que los totales semanales se puedan sumar.
- NO incluyas totales semanales: los calcula el panel.
- Los nombres de tareas en español; los nombres de platos pueden quedar en francés.`

function isTask(t: unknown): t is MiseTask {
    if (!t || typeof t !== 'object') return false
    const o = t as Record<string, unknown>
    return typeof o.label === 'string'
}

function normalizeTasks(raw: unknown, prefix: string): MiseTask[] {
    if (!Array.isArray(raw)) return []
    return raw.filter(isTask).map((t, i) => {
        const o = t as unknown as Record<string, unknown>
        const q = typeof o.quantity === 'number' && Number.isFinite(o.quantity) ? o.quantity : null
        return {
            id: `${prefix}-${i}`,
            label: String(o.label).trim(),
            quantity: q,
            unit: typeof o.unit === 'string' && o.unit.trim() ? o.unit.trim() : null,
            note: typeof o.note === 'string' && o.note.trim() ? o.note.trim() : undefined,
            toConfirm: o.toConfirm === true || (q === null && typeof o.unit === 'string' && o.unit.trim() !== ''),
        }
    })
}

function normalizePlan(raw: unknown, inputs: MiseEventInput[]): MisePlan {
    const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
    const rawEvents = Array.isArray(o.events) ? o.events : []

    const events = inputs.map((input, idx) => {
        // Emparejar por orderId; si el modelo lo perdió, por posición.
        const found = (rawEvents.find((e) => e && typeof e === 'object' && (e as Record<string, unknown>).orderId === input.orderId)
            ?? rawEvents[idx]) as Record<string, unknown> | undefined
        return {
            orderId: input.orderId,
            tasks: normalizeTasks(found?.tasks, `${input.orderId}-t`),
            standardMaterial: Array.isArray(found?.standardMaterial)
                ? (found!.standardMaterial as unknown[]).filter((s): s is string => typeof s === 'string')
                : ['Caja negra', 'Caja cubiertos', 'Caja higiene'],
            specificMaterial: normalizeTasks(found?.specificMaterial, `${input.orderId}-m`),
            pendingQuestions: Array.isArray(found?.pendingQuestions)
                ? (found!.pendingQuestions as unknown[]).filter((s): s is string => typeof s === 'string' && s.trim() !== '')
                : [],
        }
    })

    return {
        events,
        generalTasks: normalizeTasks(o.generalTasks, 'general'),
        notes: typeof o.notes === 'string' ? o.notes.trim() : '',
    }
}

function describeEvent(e: MiseEventInput, i: number): string {
    return `
Evento ${i + 1} — orderId: ${e.orderId}
Cliente: ${e.client}
Fecha: ${e.date} (${e.dayLabel})
Momento: ${e.moment}${e.time ? ` (${e.time})` : ''}
Lugar: ${e.place || 'sin especificar'}
Personas: ${e.guests}
Tipo de evento: ${e.eventType || 'sin especificar'}
Entrées: ${e.entrees.length ? e.entrees.join(', ') : 'ninguna'}
Viandes: ${e.viandes.length ? e.viandes.join(', ') : 'ninguna'}
Postre: ${e.dessert || 'sin especificar'}
Material específico pedido en el devis: ${e.equipment.length ? e.equipment.join(', ') : 'ninguno'}
${e.specialRequest ? `Solicitud especial: ${e.specialRequest}` : ''}`.trim()
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }
        if (!OPENAI_API_KEY) {
            return NextResponse.json({ error: 'OPENAI_API_KEY no está configurada en el servidor' }, { status: 500 })
        }

        const body = await request.json()
        const events: MiseEventInput[] = Array.isArray(body?.events) ? body.events : []
        const weekLabel: string = typeof body?.weekLabel === 'string' ? body.weekLabel : ''
        const instructions: string = typeof body?.instructions === 'string' ? body.instructions.trim() : ''
        const customPrompt: string = typeof body?.customPrompt === 'string' ? body.customPrompt.trim() : ''

        if (events.length === 0) {
            return NextResponse.json({ error: 'No hay eventos para esta semana' }, { status: 400 })
        }

        const systemPrompt = `${customPrompt || OPS_PROMPT_SEED}\n\n${OUTPUT_CONTRACT}`
        const userContent = `${weekLabel ? `SEMANA: ${weekLabel}\n\n` : ''}EVENTOS DE LA SEMANA:\n\n${events.map(describeEvent).join('\n\n---\n\n')}${instructions ? `\n\nINSTRUCCIONES ESPECÍFICAS PARA ESTA SEMANA (prevalecen sobre el devis):\n${instructions}` : ''}\n\nGenerá la mise en place de cada evento en el formato JSON indicado.`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent },
                ],
                temperature: 0.1,
                max_tokens: 4000,
                response_format: { type: 'json_object' },
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            return NextResponse.json(
                { error: 'Error al llamar a OpenAI', details: errorData?.error?.message || response.statusText },
                { status: response.status === 429 ? 429 : 502 }
            )
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content
        if (!content) {
            return NextResponse.json({ error: 'OpenAI no devolvió contenido' }, { status: 502 })
        }

        let parsed: unknown
        try {
            parsed = JSON.parse(content)
        } catch {
            return NextResponse.json({ error: 'La IA no devolvió un JSON válido', details: String(content).slice(0, 300) }, { status: 502 })
        }

        const plan = normalizePlan(parsed, events)

        const usage = data.usage as { prompt_tokens?: number; completion_tokens?: number } | undefined
        const promptTokens = usage?.prompt_tokens ?? 0
        const completionTokens = usage?.completion_tokens ?? 0
        const estimatedCostUSD =
            (promptTokens / 1_000_000) * PRICE_PER_1M_INPUT_USD +
            (completionTokens / 1_000_000) * PRICE_PER_1M_OUTPUT_USD

        return NextResponse.json({ plan, usage: { promptTokens, completionTokens, estimatedCostUSD } })
    } catch (error) {
        console.error('Error en /api/ai/mise-en-place:', error)
        return NextResponse.json(
            { error: 'Error inesperado', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
