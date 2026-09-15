/**
 * Configuración de cobros. Decisión del cliente (2026-09-15): adelanto del
 * 30% por defecto, editable por pedido antes de enviar el link.
 */
export const DEPOSIT_PCT = 0.30

/** Los links de Stripe Checkout vencen a las 24 h (máximo que permite Stripe). */
export const STRIPE_LINK_EXPIRY_HOURS = 24
