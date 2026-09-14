import { SHOPPING_LIST_PROMPT_SEED } from './promptSeed'
import { CALCULATION_MANUAL_SEED } from './calculationManualSeed'

/**
 * Persistencia del prompt/manual editables, en localStorage en vez de la
 * base de datos. Decisión deliberada: seguimos con la regla de no tocar
 * el esquema salvo que haga falta de verdad, y esto no lo requiere — es
 * un valor por admin/navegador, no algo que necesite compartirse entre
 * dispositivos todavía. Si más adelante hace falta que sea el mismo para
 * todos (varios admins editando), ahí sí conviene una tabla chica.
 */
const PROMPT_KEY = 'fuegos.asistentes.shoppingListPrompt.v1'
const MANUAL_KEY = 'fuegos.asistentes.calculationManual.v1'

function readKey(key: string, fallback: string): string {
    try {
        const stored = window.localStorage.getItem(key)
        return stored && stored.trim().length > 0 ? stored : fallback
    } catch {
        // localStorage puede fallar (modo privado, cuota, SSR) — usar el seed.
        return fallback
    }
}

function writeKey(key: string, value: string): boolean {
    try {
        window.localStorage.setItem(key, value)
        return true
    } catch {
        return false
    }
}

export function getStoredPrompt(): string {
    return readKey(PROMPT_KEY, SHOPPING_LIST_PROMPT_SEED)
}

export function getStoredManual(): string {
    return readKey(MANUAL_KEY, CALCULATION_MANUAL_SEED)
}

/** true si guardó de verdad; false si localStorage no está disponible. */
export function savePrompt(prompt: string, manual: string): boolean {
    const a = writeKey(PROMPT_KEY, prompt)
    const b = writeKey(MANUAL_KEY, manual)
    return a && b
}
