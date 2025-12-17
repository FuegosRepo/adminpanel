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
    dbName: 'Entrecôte / Ojo de bife / Ribeye',
    displayName: 'Entrecôte / Ojo de bife / Ribeye [Argentine]',
    category: 'premium'
  },
  {
    dbName: 'Picanha',
    displayName: 'Picanha [Argentine]',
    category: 'premium'
  },
  {
    dbName: 'Côte de bœuf / Tomahawk',
    displayName: 'Côte de bœuf / Tomahawk [France ou USA]',
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
    dbName: 'Entrecôte / Ojo de bife / Ribeye',
    displayName: 'Entrecôte / Ojo de bife / Ribeye [France]',
    category: 'classique'
  },
  {
    dbName: 'Magret de Canard',
    displayName: 'Magret de Canard [France]',
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

/**
 * Get display name for a meat item from database name
 * @param dbName - Name as stored in database
 * @returns Formatted display name with origin, or original name if not found
 */
export function getMeatDisplayName(dbName: string): string {
  const normalized = dbName.trim().toLowerCase()
  const mapping = MEAT_MAPPINGS.find(
    m => m.dbName.toLowerCase() === normalized
  )
  return mapping ? mapping.displayName : dbName
}

/**
 * Group meat items by category for PDF display
 * @param meatItems - Array of meat items with names
 * @returns Object with premium and classique arrays
 */
export function groupMeatsByCategory(meatItems: Array<{ name: string }>): {
  premium: Array<{ name: string; displayName: string }>
  classique: Array<{ name: string; displayName: string }>
} {
  const result = {
    premium: [] as Array<{ name: string; displayName: string }>,
    classique: [] as Array<{ name: string; displayName: string }>
  }

  meatItems.forEach(item => {
    const normalized = item.name.trim().toLowerCase()
    const mapping = MEAT_MAPPINGS.find(
      m => m.dbName.toLowerCase() === normalized ||
        m.displayName.toLowerCase().includes(normalized)
    )

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
