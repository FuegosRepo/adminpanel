import { simplifyString } from './stringUtils'

// Mapeo de nombres cortos (DB) a nombres completos (Display)
// Las claves deben estar "simplificadas" (sin acentos, minúsculas, solo a-z0-9)
export const DISPLAY_NAME_OVERRIDES: { [key: string]: string } = {
    // Entradas
    'brochettes': 'Brochettes de jambon ibérique',
    'burger': 'Miniburger maison au brasero',
    'burguer': 'Miniburger maison au brasero',
    'choripan': 'Choripan',
    'chori': 'Choripan',
    'chorizo': 'Choripan',
    'empanadas': 'Empanadas',
    'secreto': 'Secreto de porc Ibérique',
    'secretoiberico': 'Secreto de porc Ibérique',

    // Carnes
    'bifedechorizo': 'Faux filet / Bife de chorizo / Sirloin steak',
    'entrana': 'Entraña / Hampe / Skirt steak',
    'entrecotfr': 'Entrecôte / Ojo de bife / Ribeye (France)',
    'magretdecanard': 'Magret de Canard',
    'magret': 'Magret de Canard',
    'vacio': 'Vacio / Bavette d\'aloyau',
    'cotedeboeuf': 'Côte de bœuf / Tomahawk',
    'tomahawk': 'Côte de bœuf / Tomahawk',
    'entrecotarg': 'Entrecôte / Ojo de bife / Ribeye (Argentine)',
    'picanha': 'Picanha',
    'salmon': 'Saumon',
    'saumon': 'Saumon',

    // Postres
    'fruitsgrilles': 'Fruits grillés',
    'fruitsgrille': 'Fruits grillés',
    'fruit': 'Fruits grillés',
    'panqueques': 'Panqueques avec dulce de leche fondu au brasero',
    'panqueque': 'Panqueques avec dulce de leche fondu au brasero'
}

/**
 * Returns the "Fancy" display name for a given product name or ID.
 * Uses simplifyString to ensure fuzzy matching against the override list.
 */
export const getProductDisplayName = (originalName: string): string => {
    if (!originalName) return ''
    const simpleName = simplifyString(originalName)
    // Try exact match in overrides using simplified key
    if (DISPLAY_NAME_OVERRIDES[simpleName]) return DISPLAY_NAME_OVERRIDES[simpleName]

    // Fallback: return formatted original name if no override found
    return originalName
}
