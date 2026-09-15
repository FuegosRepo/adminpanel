import { OPS_PROMPT_SEED } from './opsPromptSeed'
import type { StaffMember } from './types'

/**
 * Persistencia en localStorage (mismo criterio que el asistente de compras:
 * por navegador, sin tocar la base). Lo único que a futuro debería ir a la
 * base es el equipo y sus asignaciones, porque lo comparten varias personas.
 */
const PROMPT_KEY = 'fuegos.mep.prompt.v1'
const STAFF_KEY = 'fuegos.mep.staff.v1'
const ASSIGNMENTS_KEY = 'fuegos.mep.assignments.v1'

function readJSON<T>(key: string, fallback: T): T {
    try {
        const raw = window.localStorage.getItem(key)
        return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
        return fallback
    }
}

function writeJSON(key: string, value: unknown): boolean {
    try {
        window.localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch {
        return false
    }
}

export function getOpsPrompt(): string {
    try {
        const stored = window.localStorage.getItem(PROMPT_KEY)
        return stored && stored.trim() ? stored : OPS_PROMPT_SEED
    } catch {
        return OPS_PROMPT_SEED
    }
}

export function saveOpsPrompt(prompt: string): boolean {
    try {
        window.localStorage.setItem(PROMPT_KEY, prompt)
        return true
    } catch {
        return false
    }
}

export function getStaff(): StaffMember[] {
    return readJSON<StaffMember[]>(STAFF_KEY, [])
}

export function saveStaff(staff: StaffMember[]): boolean {
    return writeJSON(STAFF_KEY, staff)
}

/** orderId → ids de colaboradores asignados. */
export function getAssignments(): Record<string, string[]> {
    return readJSON<Record<string, string[]>>(ASSIGNMENTS_KEY, {})
}

export function saveAssignments(assignments: Record<string, string[]>): boolean {
    return writeJSON(ASSIGNMENTS_KEY, assignments)
}
