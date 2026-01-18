/**
 * Constantes de negocio para presupuestos de catering
 * Centraliza todos los valores fijos para fácil mantenimiento
 */

// ============ PRECIOS BASE ============

/** Precio base por persona para menú Déjeuner (€) */
export const DEJEUNER_PRICE_PER_PERSON = 35

/** Precio base por persona para menú Dîner (€) */
export const DINER_PRICE_PER_PERSON = 42

/** Precio por hora de servicio de camareros (€ HT) */
export const SERVICE_PRICE_PER_HOUR = 40

/** Precio por kilometro de desplazamiento (€ HT) */
export const DEFAULT_PRICE_PER_KM = 0.50

// ============ TASAS TVA ============

/** TVA para menú (%) */
export const TVA_MENU = 10

/** TVA para servicio (%) */
export const TVA_SERVICE = 20

/** TVA para material (%) */
export const TVA_MATERIAL = 20

/** TVA para entrega/recogida (%) */
export const TVA_DELIVERY = 20

/** TVA para desplazamiento (%) */
export const TVA_DEPLACEMENT = 20

/** TVA para bebidas soft (%) */
export const TVA_BOISSONS = 20

// ============ DESCUENTOS ============

/** Descuento para menú Déjeuner (%) */
export const DEJEUNER_DISCOUNT_PERCENTAGE = 10

/** Razón del descuento Déjeuner */
export const DEJEUNER_DISCOUNT_REASON = 'Événement à midi - 10%'

// ============ SEGUROS ============

/** Porcentaje de seguro por pérdida/rotura de material (%) */
export const MATERIAL_INSURANCE_PERCENTAGE = 6

// ============ VALIDEZ ============

/** Días de validez del presupuesto */
export const BUDGET_VALIDITY_DAYS = 30

// ============ TIPOS HELPER ============

export type MenuType = 'dejeuner' | 'diner'

export function getBasePriceByMenuType(menuType: MenuType): number {
    return menuType === 'dejeuner' ? DEJEUNER_PRICE_PER_PERSON : DINER_PRICE_PER_PERSON
}
