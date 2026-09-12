import type { EmailTemplate } from '@/types'

/**
 * Extiende el tipo real con el campo que todavía no existe en la base
 * (`is_preset`, ver Fase 1.5 del plan). Solo para esta vista previa.
 */
export interface PreviewEmailTemplate extends EmailTemplate {
    isPreset: boolean
}

export const TEMPLATE_VARIABLES = [
    { key: 'name', label: 'Nombre del cliente' },
    { key: 'eventDate', label: 'Fecha del evento' },
    { key: 'guestCount', label: 'Cantidad de invitados' },
    { key: 'eventType', label: 'Tipo de evento' },
] as const

export const VARIABLE_SAMPLE_VALUES: Record<string, string> = {
    name: 'Marie Dubois',
    eventDate: '14 juin 2027',
    guestCount: '45',
    eventType: 'Mariage',
}
