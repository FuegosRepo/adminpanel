/**
 * PRODUCT NORMALIZATION LAYER
 * Phase 1: Legacy Data Handler
 * 
 * This module provides a robust mapping from Fuegos frontend hardcoded IDs
 * to actual database product names/IDs. It acts as the "Rosetta Stone" between
 * the two systems until full UUID migration (Phase 2) is complete.
 * 
 * SOURCE: Based on Gap Analysis of Fuegos/step-entrees.tsx and step-viandes.tsx
 */

export interface ProductNormalizationMap {
    /** Hardcoded ID from Fuegos frontend */
    frontendId: string
    /** Product name in database (for string matching) */
    dbProductName: string
    /** Product category */
    category: 'entrees' | 'viandes' | 'desserts' | 'material'
    /** Alternative names/aliases for fuzzy matching */
    aliases?: string[]
}

/**
 * MASTER PRODUCT MAPPING DICTIONARY
 * 
 * Maps every hardcoded ID found in Fuegos frontend to its database equivalent.
 * This is the single source of truth for legacy data normalization.
 */
export const PRODUCT_ID_NORMALIZATION: ProductNormalizationMap[] = [
    // ========================================
    // ENTRÉES (from step-entrees.tsx)
    // ========================================
    {
        frontendId: 'empanadas',
        dbProductName: 'Empanadas',
        category: 'entrees',
        aliases: ['empanada', 'Empanada']
    },
    {
        frontendId: 'choripan',
        dbProductName: 'Choripan',
        category: 'entrees',
        aliases: ['chorizo', 'tapas au chorizo', 'tapas chorizo', 'Tapas au Chorizo grillé']
    },
    {
        frontendId: 'secreto',
        dbProductName: 'Secreto de porc Ibérique',
        category: 'entrees',
        aliases: ['secreto', 'secreto de porc', 'secreto iberico', 'secreto de cerdos']
    },
    {
        frontendId: 'burger',
        dbProductName: 'Miniburger maison au brasero',
        category: 'entrees',
        aliases: ['miniburger', 'mini burger', 'burguer', 'burger']
    },
    {
        frontendId: 'brochettes',
        dbProductName: 'Brochettes de jambon ibérique',
        category: 'entrees',
        aliases: ['brochette', 'brochettes', 'brochettes jambon']
    },

    // ========================================
    // VIANDES CLASSIQUES (from step-viandes.tsx)
    // ========================================
    {
        frontendId: 'vacio',
        dbProductName: 'Vacio / Bavette d\'aloyau',
        category: 'viandes',
        aliases: ['vacio', 'vacío', 'bavette', 'bavette d\'aloyau']
    },
    {
        frontendId: 'entrecote',
        dbProductName: 'Entrecôte / Ojo de bife / Ribeye',
        category: 'viandes',
        aliases: ['entrecôte', 'entrecote fr', 'entrecot france', 'ribeye', 'ojo de bife']
    },
    {
        frontendId: 'entrana',
        dbProductName: 'Entraña / Hampe / Skirt steak',
        category: 'viandes',
        aliases: ['entrana', 'entraña', 'hampe', 'skirt steak']
    },
    {
        frontendId: 'magret',
        dbProductName: 'Magret de Canard',
        category: 'viandes',
        aliases: ['magret', 'canard', 'duck']
    },

    // ========================================
    // VIANDES PREMIUM (from step-viandes.tsx)
    // ========================================
    {
        frontendId: 'entrecote_arg',
        dbProductName: 'Entrecôte / Ojo de bife / Ribeye',
        category: 'viandes',
        aliases: ['entrecôte argentine', 'entrecot arg', 'entrecot argentino', 'ribeye argentine']
    },
    {
        frontendId: 'picanha',
        dbProductName: 'Picanha',
        category: 'viandes',
        aliases: ['picaña']
    },
    {
        frontendId: 'tomahawk',
        dbProductName: 'Côte de bœuf / Tomahawk',
        category: 'viandes',
        aliases: ['côte de boeuf', 'cote de boeuf', 'cote boeuf', 'tomahawk']
    },
    {
        frontendId: 'bife_chorizo',
        dbProductName: 'Faux filet / Bife de chorizo',
        category: 'viandes',
        aliases: ['faux filet', 'bife de chorizo', 'bife chorizo', 'sirloin']
    },
    {
        frontendId: 'saumon',
        dbProductName: 'Saumon',
        category: 'viandes',
        aliases: ['salmon', 'salmón']
    },

    // ========================================
    // DESSERTS (from step-review.tsx)
    // ========================================
    {
        frontendId: 'fruits_grilles',
        dbProductName: 'Fruits grillés',
        category: 'desserts',
        aliases: ['fruits grille', 'frutas grilladas', 'fruits flambés', 'fruits flambes']
    },
    {
        frontendId: 'panqueques',
        dbProductName: 'Panqueques avec dulce de leche fondu au brasero',
        category: 'desserts',
        aliases: ['panqueques', 'panqueque', 'dulce de leche', 'Panqueques con dulce de leche']
    }
]

/**
 * Normalize a frontend ID to its database product name
 * 
 * @param frontendId - The hardcoded ID from Fuegos (e.g., 'secreto', 'burger')
 * @returns Database product name or null if not found
 */
export function normalizeFrontendIdToProductName(frontendId: string): string | null {
    const normalized = frontendId.toLowerCase().trim()

    const mapping = PRODUCT_ID_NORMALIZATION.find(
        m => m.frontendId.toLowerCase() === normalized
    )

    return mapping ? mapping.dbProductName : null
}

/**
 * Normalize a frontend ID to product name with fallback to fuzzy name matching
 * 
 * This function tries exact ID match first, then falls back to checking
 * if the input matches any known aliases.
 * 
 * @param input - Frontend ID or product name
 * @returns Database product name or the original input if no match
 */
export function smartNormalizeProductName(input: string): string {
    if (!input) return input

    const normalized = input.toLowerCase().trim()

    // Try exact ID match first
    const idMatch = PRODUCT_ID_NORMALIZATION.find(
        m => m.frontendId.toLowerCase() === normalized
    )
    if (idMatch) return idMatch.dbProductName

    // Try alias matching
    const aliasMatch = PRODUCT_ID_NORMALIZATION.find(m =>
        m.aliases?.some(alias => normalized.includes(alias.toLowerCase()) || alias.toLowerCase().includes(normalized))
    )
    if (aliasMatch) return aliasMatch.dbProductName

    // Try partial match on db name
    const dbMatch = PRODUCT_ID_NORMALIZATION.find(m =>
        normalized.includes(m.dbProductName.toLowerCase()) || m.dbProductName.toLowerCase().includes(normalized)
    )
    if (dbMatch) return dbMatch.dbProductName

    // Return original if no match
    return input
}

/**
 * Normalize an array of frontend IDs to database product names
 * 
 * @param frontendIds - Array of hardcoded IDs from Fuegos
 * @returns Array of database product names
 */
export function normalizeFrontendIdsToProductNames(frontendIds: string[]): string[] {
    return frontendIds.map(id => smartNormalizeProductName(id))
}

/**
 * Get category for a frontend ID
 */
export function getCategoryForFrontendId(frontendId: string): string | null {
    const normalized = frontendId.toLowerCase().trim()
    const mapping = PRODUCT_ID_NORMALIZATION.find(
        m => m.frontendId.toLowerCase() === normalized
    )
    return mapping ? mapping.category : null
}

/**
 * Validate if a frontend ID exists in our mapping
 */
export function isKnownFrontendId(frontendId: string): boolean {
    const normalized = frontendId.toLowerCase().trim()
    return PRODUCT_ID_NORMALIZATION.some(
        m => m.frontendId.toLowerCase() === normalized
    )
}

/**
 * Get all known frontend IDs for a category
 */
export function getFrontendIdsByCategory(category: 'entrees' | 'viandes' | 'desserts'): string[] {
    return PRODUCT_ID_NORMALIZATION
        .filter(m => m.category === category)
        .map(m => m.frontendId)
}

/**
 * Debug utility: List all mappings
 */
export function debugListAllMappings(): void {
    console.log('📚 Product Normalization Mappings:')
    const byCategory = {
        entrees: PRODUCT_ID_NORMALIZATION.filter(m => m.category === 'entrees'),
        viandes: PRODUCT_ID_NORMALIZATION.filter(m => m.category === 'viandes'),
        desserts: PRODUCT_ID_NORMALIZATION.filter(m => m.category === 'desserts')
    }

    Object.entries(byCategory).forEach(([cat, items]) => {
        console.log(`\n${cat.toUpperCase()}:`)
        items.forEach(item => {
            console.log(`  ${item.frontendId} → ${item.dbProductName}`)
        })
    })
}
