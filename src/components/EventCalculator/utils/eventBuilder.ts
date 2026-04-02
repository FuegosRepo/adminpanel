import { CateringOrder, Product } from '@/types'
import { Event, EventIngredient } from '../types'
import { parsePortionPerPerson } from './unitConversions'
import { findProductByName } from './productMapping'

/** Detect if a string is a UUID v4 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function isUUID(value: string): boolean {
    return UUID_REGEX.test(value)
}

/** Global counter to ensure unique IDs even within the same millisecond */
let idCounter = 0

export const createEventFromOrder = (order: CateringOrder, allProducts: Product[]): Event => {
    const ingredients: EventIngredient[] = []
    const notFoundItems: string[] = []

    console.log('🔍 Creando evento desde pedido:', {
        orderId: order.id,
        entrees: order.entrees,
        viandes: order.viandes,
        dessert: order.dessert
    })

    // Map ingredient type to product category for fallbacks
    const categoryMap: Record<string, Product['category']> = {
        'Entrante': 'entradas',
        'Carne': 'carnes_clasicas',
        'Postre': 'postres',
        'Extra': 'extras'
    }

    /** Find product by ID (UUID) or by name (slug/text) */
    const resolveProduct = (value: string): Product | undefined => {
        if (isUUID(value)) {
            return allProducts.find(p => p.id === value)
        }
        return findProductByName(value, allProducts)
    }

    // Helper to add ingredient
    const addIngredient = (value: string, type: string, index?: number) => {
        const product = resolveProduct(value)
        const idPrefix = index !== undefined ? `${type}-${index}` : type

        if (product) {
            const quantityPerPerson = product.portion_per_person
                ? parsePortionPerPerson(product.portion_per_person)
                : 1

            ingredients.push({
                id: `ing-${++idCounter}-${idPrefix}-${product.name.replace(/\s+/g, '-')}`,
                product,
                quantityPerPerson,
                notes: product.clarifications || undefined
            })
            console.log(`  ✅ ${type} agregado: ${value} → ${product.name}`)
        } else {
            // Create fallback product so the item still appears in calculations and PDF
            const fallbackProduct: Product = {
                id: `unmatched-${++idCounter}-${idPrefix}`,
                name: value,
                category: categoryMap[type] || 'extras',
                price_per_kg: null,
                price_per_portion: 0,
                unit_type: 'porcion',
                is_combo: false,
                notes: null,
                portion_per_person: '1',
                clarifications: `(No encontrado en catálogo de productos)`,
                active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            ingredients.push({
                id: `ing-${++idCounter}-${idPrefix}-${value.replace(/\s+/g, '-')}`,
                product: fallbackProduct,
                quantityPerPerson: 1,
                notes: `No encontrado en catálogo. Item original: "${value}"`
            })

            notFoundItems.push(`${type}: ${value}`)
            console.warn(`  ⚠️ ${type} no encontrado, fallback creado: ${value}`)
        }
    }

    // Procesar entrantes
    order.entrees.forEach((entree, index) => addIngredient(entree, 'Entrante', index))

    // Procesar carnes
    order.viandes.forEach((viande, index) => addIngredient(viande, 'Carne', index))

    // Procesar postre
    if (order.dessert) {
        addIngredient(order.dessert, 'Postre')
    }

    // Procesar equipamiento/materiales extra
    if (order.extras && order.extras.equipment && Array.isArray(order.extras.equipment)) {
        order.extras.equipment.forEach((item, index) => {
            const product = findProductByName(item, allProducts)
            if (product) {
                // Verificar si es material
                if (product.category === 'material') {
                    console.log(`  ℹ️ Material omitido del evento: ${item} → ${product.name}`)
                    return // SKIP adding material to ingredients
                }

                const quantityPerPerson = product.portion_per_person
                    ? parsePortionPerPerson(product.portion_per_person)
                    : 1

                ingredients.push({
                    id: `ing-${++idCounter}-extra-${index}-${item.replace(/\s+/g, '-')}`,
                    product,
                    quantityPerPerson,
                    notes: product.clarifications || undefined,
                    isFixedQuantity: false
                })
                console.log(`  ✅ Extra agregado: ${item} → ${product.name}`)
            } else {
                notFoundItems.push(`Extra: ${item}`)
                console.error(`  ❌ Extra no encontrado: ${item}`)
            }
        })
    }

    // Mostrar advertencia si hay items no encontrados
    if (notFoundItems.length > 0) {
        console.warn('⚠️ Items no encontrados en la base de datos:', notFoundItems)
        // We don't alert here to keep function pure-ish, the caller can handle alerts if needed via the returned note
    }

    const eventName = `${order.contact.eventType} - ${order.contact.name} (${new Date(order.contact.eventDate).toLocaleDateString()})`

    return {
        id: `temp-${++idCounter}-${order.id}`,
        name: eventName,
        eventDate: order.contact.eventDate,
        guestCount: order.contact.guestCount,
        orderId: order.id,
        ingredients,
        expanded: true,
        showCosts: false,
        showNotes: false,
        notes: notFoundItems.length > 0 ? `⚠️ Items no encontrados: ${notFoundItems.join(', ')}` : '',
        observations: '',
        versionNumber: 1,
        isSaved: false
    }
}
