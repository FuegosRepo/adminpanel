/**
 * Registro de uso/costo estimado de IA por consulta. Igual que el prompt
 * (ver promptStorage.ts), se guarda en localStorage y no en la base de
 * datos: es información de este navegador, no compartida entre
 * dispositivos. Si más adelante hace falta verlo centralizado (por
 * ejemplo, que el cliente vea el gasto total sin importar quién lo usó),
 * ahí sí conviene una tabla.
 *
 * El costo es una ESTIMACIÓN nuestra a partir de los tokens que devuelve
 * la API y el precio de gpt-4o-mini vigente al momento de escribir esto.
 * El gasto real y definitivo siempre está en platform.openai.com/usage.
 */
export interface UsageEntry {
    id: string
    timestamp: string // ISO
    question: string
    promptTokens: number
    completionTokens: number
    estimatedCostUSD: number
}

const USAGE_KEY = 'fuegos.asistentes.usageLog.v1'
const MAX_ENTRIES = 200

export function getUsageLog(): UsageEntry[] {
    try {
        const raw = window.localStorage.getItem(USAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function logUsage(entry: Omit<UsageEntry, 'id' | 'timestamp'>): void {
    try {
        const log = getUsageLog()
        const newEntry: UsageEntry = {
            ...entry,
            id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            timestamp: new Date().toISOString(),
        }
        const updated = [newEntry, ...log].slice(0, MAX_ENTRIES)
        window.localStorage.setItem(USAGE_KEY, JSON.stringify(updated))
    } catch {
        // localStorage no disponible: se pierde el registro de esta
        // consulta puntual, pero no rompe el chat.
    }
}

export function clearUsageLog(): void {
    try {
        window.localStorage.removeItem(USAGE_KEY)
    } catch {
        // no-op
    }
}
