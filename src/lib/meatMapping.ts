/**
 * Mapping constant for transforming database meat names to PDF display format
 * with origin prefix and trilingual names
 */

export interface MeatCategory {
  title: string
  items: MeatMapping[]
}

export interface MeatMapping {
  dbName: string // Name as stored in database
  displayName: string // Full display name with origin and trilingual format
  category: 'premium' | 'classique'
}

/**
 * Individual meat mappings
 * Maps database product names to their PDF display format: [Origin] Name1 / Name2 / Name3
 */
export const MEAT_MAPPINGS: MeatMapping[] = [
  // === PREMIUM CATEGORY ===
  {
    dbName: 'Entrecôte / Ojo de bife / Ribeye (ARG)',
    displayName: 'Entrecôte / Ojo de bife / Ribeye [Argentine]',
    category: 'premium'
  },
  {
    dbName: 'Picanha',
    displayName: 'Picanha [Argentine]',
    category: 'premium'
  },
  {
    dbName: 'Côte de bœuf ou Tomahawk',
    displayName: 'Côte de bœuf ou Tomahawk [France ou USA]',
    category: 'premium'
  },
  {
    dbName: 'Faux filet / Bife de chorizo',
    displayName: 'Faux filet / Bife de chorizo / Sirloin steak [Argentine]',
    category: 'premium'
  },
  {
    dbName: 'Saumon',
    displayName: 'Saumon [Norvège]',
    category: 'premium'
  },

  // === CLASSIQUE CATEGORY ===
  {
    dbName: 'Vacio / Bavette d\'aloyau',
    displayName: 'Vacio / Bavette d\'aloyau [Irlande]',
    category: 'classique'
  },
  {
    dbName: 'Entrecôte / Ojo de bife / Ribeye (FRA)',
    displayName: 'Entrecôte / Ojo de bife / Ribeye [France]',
    category: 'classique'
  },
  {
    dbName: 'Magret de Canard',
    displayName: 'Magret de Canard [France]',
    category: 'classique'
  },
  {
    dbName: 'Choripan',
    displayName: 'Choripan - Chorizo argentin grillé au brasero, accompagné de sauce criolla maison et pain artisanal',
    category: 'classique'
  }
]

/**
 * Categories for grouping meats in PDF
 */
export const MEAT_CATEGORIES: { [key: string]: string } = {
  premium: 'Morceaux Premium (Sélection d\'exception)',
  classique: 'Morceaux Classiques (Morceaux traditionnels)'
}

// Pre-built Map for O(1) lookups by normalized dbName
const MEAT_NAME_MAP = new Map(
  MEAT_MAPPINGS.map(m => [m.dbName.toLowerCase().replace(/[''`]/g, "'"), m])
)

/**
 * Get display name for a meat item from database name
 * @param dbName - Name as stored in database
 * @returns Formatted display name with origin, or original name if not found
 */
export function getMeatDisplayName(dbName: string): string {
  const normalized = dbName.trim().toLowerCase().replace(/[''`]/g, "'")
  const mapping = MEAT_NAME_MAP.get(normalized)
  return mapping ? mapping.displayName : dbName
}

/**
 * Group meat items by category for PDF display
 * @param meatItems - Array of meat items with names and optional subcategory
 * @returns Object with premium and classique arrays
 */
export function groupMeatsByCategory(meatItems: Array<{ name: string; subcategory?: string | null }>): {
  premium: Array<{ name: string; displayName: string }>
  classique: Array<{ name: string; displayName: string }>
} {
  const result = {
    premium: [] as Array<{ name: string; displayName: string }>,
    classique: [] as Array<{ name: string; displayName: string }>
  }

  meatItems.forEach(item => {
    // Normalize apostrophes for better matching
    const normalized = item.name.trim().toLowerCase().replace(/[''`]/g, "'")

    // Try exact match first via Map (O(1))
    let mapping = MEAT_NAME_MAP.get(normalized)

    // If subcategory specified and mapping doesn't match, search for correct one
    if (mapping && item.subcategory && mapping.category !== item.subcategory) {
      mapping = MEAT_MAPPINGS.find(
        m => m.dbName.toLowerCase().replace(/[''`]/g, "'") === normalized && m.category === item.subcategory
      )
    }

    // Fallback: partial match if no exact match found
    if (!mapping) {
      mapping = MEAT_MAPPINGS.find(
        m => m.displayName.toLowerCase().replace(/[''`]/g, "'").includes(normalized)
      )
    }

    if (mapping) {
      result[mapping.category].push({
        name: item.name,
        displayName: mapping.displayName
      })
    } else {
      // If not found in mapping, add to classique as fallback
      result.classique.push({
        name: item.name,
        displayName: item.name
      })
    }
  })

  return result
}
