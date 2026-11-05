/**
 * Precios de OpenAI por modelo (USD por 1M tokens, tier estándar). Se
 * fueron cambiando de modelo varias veces (gpt-4o-mini, gpt-6.1-sol...) y
 * cada vez había que acordarse de actualizar una constante hardcodeada en
 * cada ruta — esto lo centraliza. Si cambia OPENAI_MODEL, agregar la fila
 * acá en vez de tocar las rutas.
 */
const PRICING_PER_1M_USD: Record<string, { input: number; output: number }> = {
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-6-luna': { input: 0.10, output: 0.50 },
    'gpt-6.1-terra': { input: 1.00, output: 5.00 },
    'gpt-6.1-sol': { input: 2.00, output: 10.00 },
    'gpt-6-astra': { input: 10.00, output: 50.00 },
}

const FALLBACK_PRICING = PRICING_PER_1M_USD['gpt-4o-mini']

export function estimateCostUSD(model: string, promptTokens: number, completionTokens: number): number {
    const pricing = PRICING_PER_1M_USD[model] || FALLBACK_PRICING
    return (promptTokens / 1_000_000) * pricing.input + (completionTokens / 1_000_000) * pricing.output
}

/**
 * Los modelos de razonamiento más nuevos (ej. gpt-6.1-sol, gpt-6-astra)
 * rechazan la llamada si se manda `temperature` distinto del valor por
 * defecto (1) — error real: "Unsupported value: 'temperature' does not
 * support 0.2 with this model." Los modelos "clásicos" tipo gpt-4o-mini sí
 * lo soportan y lo necesitamos para respuestas consistentes.
 */
const REASONING_MODEL_PREFIXES = ['gpt-6', 'o1', 'o3', 'o4']

export function supportsCustomTemperature(model: string): boolean {
    return !REASONING_MODEL_PREFIXES.some((prefix) => model.startsWith(prefix))
}

/**
 * Con 1 solo evento, gpt-4o-mini (barato) resuelve bien. A partir de 2
 * eventos juntos (hay que sumar entre eventos, dividir carnes por evento,
 * etc.) gpt-4o-mini fallaba de forma consistente — ahí usamos el modelo
 * más caro pero confiable. Decisión del cliente, 2026-11-05.
 *
 * OPENAI_MODEL: modelo para 1 evento (default gpt-4o-mini).
 * OPENAI_MODEL_MULTI: modelo para 2+ eventos (default gpt-6.1-sol).
 */
export function pickModel(eventCount: number): string {
    const singleEventModel = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    const multiEventModel = process.env.OPENAI_MODEL_MULTI || 'gpt-6.1-sol'
    return eventCount >= 2 ? multiEventModel : singleEventModel
}

/** Etiqueta corta para mostrarle al admin qué modelo generó una respuesta. */
export function modelLabel(model?: string | null): string | null {
    if (!model) return null
    if (model.includes('mini')) return `⚡ ${model} (rápido)`
    return `🧠 ${model} (preciso)`
}
