// Mapping for entree products to add descriptions in PDF
// Similar to meatMapping.ts but for entrees

export interface EntreeMapping {
    dbName: string
    displayName: string
}

export const ENTREE_MAPPINGS: EntreeMapping[] = [
    {
        dbName: 'Brochettes de jambon ibérique',
        displayName: 'Brochettes de jambon ibérique, tomates cerises, melon, mozzarella di bufala et basilic frais'
    },
    {
        dbName: 'Choripan',
        displayName: 'Choripan - Chorizo argentin grillé, chimichurri maison et pain artisanal [classique]'
    },
    {
        dbName: 'Empanadas',
        displayName: 'Empanadas maison (bœuf, poulet ou vegan)'
    },
    {
        dbName: 'Miniburger maison au brasero',
        displayName: 'Miniburger maison au brasero, viande premium, fromage et condiments artisanaux'
    },
    {
        dbName: 'Secreto de porc Ibérique',
        displayName: 'Secreto de porc Ibérique, pièce noble et fondante'
    }
]

/**
 * Get display name with description for PDF
 * @param dbName - The product name from database
 * @returns Display name with description, or original name if not found
 */
export function getEntreeDisplayName(dbName: string): string {
    // Normalize for matching (handle apostrophes, case, trim)
    const normalized = dbName.trim().toLowerCase().replace(/[\'\'`]/g, "'")

    const mapping = ENTREE_MAPPINGS.find(
        m => m.dbName.toLowerCase().replace(/[\'\'`]/g, "'") === normalized
    )

    return mapping ? mapping.displayName : dbName
}
