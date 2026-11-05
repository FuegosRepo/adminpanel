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
