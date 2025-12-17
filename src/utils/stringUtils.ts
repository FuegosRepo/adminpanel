/**
 * Normalizes a string for robust comparison.
 * - Decomposes unicode characters (NFD) to separate accents.
 * - Removes diacritical marks (accents).
 * - Converts to lowercase.
 * - Removes non-alphanumeric characters.
 * 
 * Example: "Entraña" -> "entrana", "Côte de Bœuf" -> "cotedeboeuf"
 */
export const simplifyString = (s: string): string => {
    if (!s) return ''
    return s.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
}
