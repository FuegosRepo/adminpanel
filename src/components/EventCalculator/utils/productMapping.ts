import { Product } from '@/types'

// Mapeo completo de nombres del formulario a nombres en la BD
const NAME_MAPPING: { [key: string]: string[] } = {
    // New Unified IDs
    'empanadas': ['empanadas', 'empanada'],
    'choripan': ['choripan', 'chorizo', 'tapas chorizo', 'tapa chorizo'],
    'burger': ['burguer', 'burger', 'miniburger', 'mini burger', 'mini-burger'],
    'saumon': ['salmon', 'salmón', 'saumon'],
    'bife_chorizo': ['bife de chorizo', 'bife chorizo', 'bife'],
    'entrecote': ['entrecot fr', 'entrecote fr', 'entrecot france', 'entrecote france', 'entrecot'],
    'entrecote_arg': ['entrecot arg', 'entrecote arg', 'entrecot argentino', 'entrecote argentine', 'entrecote argentina'],
    'magret': ['magret de canard', 'magret', 'canard'],
    'vacio': ['vacio', 'vacío'],
    'costillar': ['costillar', 'costilla'],
    'tomahawk': ['cote de boeuf', 'cote boeuf', 'cote', 'tomahawk'],
    'picanha': ['picanha', 'picaña'],
    'fruits_grilles': ['fruits grille', 'fruits grillés', 'frutas grilladas', 'fruits flambes', 'fruits flambés'],
    'secreto': ['secreto', 'secreto de cerdos', 'secreto de porc', 'secreto iberico'],
    'brochettes': ['brochettes', 'brochette'],
    'entrana': ['entrana', 'entraña'],
    'panqueques': ['panqueques', 'panqueque', 'dulce de leche'],

    // Legacy Aliases (Backward Compatibility)
    'tapas-chorizo': ['choripan', 'chorizo', 'tapas chorizo'],
    'miniburger': ['burguer', 'burger', 'miniburger'],
    'bife-chorizo': ['bife de chorizo', 'bife chorizo'],
    'entrecote-france': ['entrecot fr', 'entrecote fr', 'entrecot france'],
    'entrecote-argentine': ['entrecot arg', 'entrecote arg', 'entrecot argentino'],
    'magret-canard': ['magret', 'canard'],
    'cote-boeuf': ['cote de boeuf', 'tomahawk'],
    'fruits-flambes': ['fruits flambes', 'fruits flambés'],
    'panqueques-dulce': ['panqueques', 'dulce de leche']
}

/**
 * Mapea nombre de producto del formulario a producto de la BD
 * Utiliza múltiples estrategias de búsqueda para encontrar coincidencias
 */
export function findProductByName(itemName: string, allProducts: Product[]): Product | undefined {
    if (!itemName) {
        console.warn('⚠️ findProductByName recibió un itemName vacío')
        return undefined
    }

    const normalizedInput = itemName.toLowerCase().trim()
    console.log(`🔎 Buscando producto: "${itemName}" (normalizado: "${normalizedInput}")`)

    // Estrategia 1: Buscar en el mapeo directo
    const mappedNames = NAME_MAPPING[normalizedInput] || [normalizedInput]

    // Estrategia 2: Buscar coincidencia exacta o parcial
    for (const mappedName of mappedNames) {
        const exactMatch = allProducts.find(p =>
            p.name.toLowerCase() === mappedName.toLowerCase()
        )
        if (exactMatch) {
            console.log(`✅ Encontrado exacto: "${itemName}" → "${exactMatch.name}" (activo: ${exactMatch.active})`)
            return exactMatch
        }
    }

    // Estrategia 3: Buscar por inclusión (más flexible)
    for (const mappedName of mappedNames) {
        const partialMatch = allProducts.find(p => {
            const productName = p.name.toLowerCase()
            return productName.includes(mappedName) || mappedName.includes(productName)
        })
        if (partialMatch) {
            console.log(`✅ Encontrado parcial: "${itemName}" → "${partialMatch.name}" (activo: ${partialMatch.active})`)
            return partialMatch
        }
    }

    // Estrategia 4: Buscar sin guiones ni espacios
    const cleanInput = normalizedInput.replace(/[-_]/g, ' ').replace(/\s+/g, ' ')
    const cleanMatch = allProducts.find(p => {
        const cleanProductName = p.name.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ')
        return cleanProductName.includes(cleanInput) || cleanInput.includes(cleanProductName)
    })
    if (cleanMatch) {
        console.log(`✅ Encontrado limpio: "${itemName}" → "${cleanMatch.name}" (activo: ${cleanMatch.active})`)
        return cleanMatch
    }

    // Estrategia 5: Búsqueda por palabras clave
    const keywords = cleanInput.split(/\s+/).filter(w => w.length > 2)
    if (keywords.length > 0) {
        const keywordMatch = allProducts.find(p => {
            const productName = p.name.toLowerCase()
            return keywords.some(keyword => productName.includes(keyword))
        })
        if (keywordMatch) {
            console.log(`✅ Encontrado por palabras clave: "${itemName}" → "${keywordMatch.name}" (activo: ${keywordMatch.active})`)
            return keywordMatch
        }
    }

    // Estrategia 6: Búsqueda por similitud
    const inputWords = normalizedInput.split(/[-_\s]+/).filter(w => w.length > 2)
    const similarityMatch = allProducts.find(p => {
        const productName = p.name.toLowerCase()
        const productWords = productName.split(/[-_\s]+/).filter(w => w.length > 2)

        const commonWords = inputWords.filter(iw =>
            productWords.some(pw => pw.includes(iw) || iw.includes(pw) || pw === iw)
        )

        return commonWords.length > 0
    })
    if (similarityMatch) {
        console.log(`✅ Encontrado por similitud: "${itemName}" → "${similarityMatch.name}" (activo: ${similarityMatch.active})`)
        return similarityMatch
    }

    // Estrategia 7: Búsqueda muy flexible - palabras clave principales
    if (normalizedInput.includes('burger') || normalizedInput.includes('miniburger')) {
        const burgerMatch = allProducts.find(p => {
            const productName = p.name.toLowerCase()
            return productName.includes('burger') || productName.includes('burguer')
        })
        if (burgerMatch) {
            console.log(`✅ Encontrado por búsqueda flexible (burger): "${itemName}" → "${burgerMatch.name}"`)
            return burgerMatch
        }
    }

    if (normalizedInput.includes('entrecot') || normalizedInput.includes('entrecote')) {
        const entrecotMatch = allProducts.find(p => {
            const productName = p.name.toLowerCase()
            if (productName.includes('entrecot')) {
                if (normalizedInput.includes('arg') || normalizedInput.includes('argentine') || normalizedInput.includes('argentina')) {
                    return productName.includes('arg')
                }
                return true
            }
            return false
        })
        if (entrecotMatch) {
            console.log(`✅ Encontrado por búsqueda flexible (entrecot): "${itemName}" → "${entrecotMatch.name}"`)
            return entrecotMatch
        }
    }

    // Si no se encuentra, loguear para debugging
    console.warn(`⚠️ Producto no encontrado: "${itemName}". Productos disponibles (activos):`,
        allProducts.map(p => `${p.name}${p.is_combo ? ' (combo)' : ''}`).join(', '))

    return undefined
}
