/** Lo que se le manda a la IA por cada evento de la semana. */
export interface MiseEventInput {
    orderId: string
    client: string
    date: string        // ISO yyyy-mm-dd
    dayLabel: string    // "Miércoles 22"
    moment: string      // Almuerzo | Cena | Horario a definir
    time?: string
    place: string
    guests: number
    eventType: string
    entrees: string[]
    viandes: string[]
    dessert: string | null
    equipment: string[]         // material específico pedido en el devis
    specialRequest?: string
}

/** Una tarea de la checklist, tal como la devuelve la IA. */
export interface MiseTask {
    id: string
    label: string
    quantity: number | null
    unit: string | null
    note?: string
    toConfirm?: boolean
}

/** Ficha de un evento, ya generada. */
export interface MiseEventPlan {
    orderId: string
    tasks: MiseTask[]
    standardMaterial: string[]
    specificMaterial: MiseTask[]
    pendingQuestions: string[]
}

export interface MisePlan {
    events: MiseEventPlan[]
    generalTasks: MiseTask[]
    notes: string
}

export interface WeeklyTotal {
    /** label normalizado + unidad; identifica el total para ajustes manuales */
    key: string
    label: string
    unit: string
    total: number
    breakdown: { client: string; quantity: number }[]
}

export type StaffRole = 'cocina' | 'servicio' | 'logistica'

export interface StaffMember {
    id: string
    name: string
    role: StaffRole
}

export const STAFF_ROLE_LABEL: Record<StaffRole, string> = {
    cocina: 'Cocina',
    servicio: 'Servicio',
    logistica: 'Logística',
}
