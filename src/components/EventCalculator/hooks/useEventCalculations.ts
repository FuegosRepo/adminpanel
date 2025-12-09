import { useMemo } from 'react'
import { Product } from '@/types'
import { Event, IngredientTotal, GlobalStats } from '../types'
import { calculateEventCost } from '../utils/calculations'
import { parsePortionPerPerson } from '../utils/unitConversions'

export const useEventCalculations = (
    events: Event[],
    filteredEvents: Event[],
    products: Product[],
    comboIngredientsMap: { [key: string]: any[] }
) => {

    // Calcular totales por ingrediente sumando todos los eventos (agrupado por categoría)
    const grandTotals = useMemo(() => {
        // Estructura temporal para acumular totales y sub-items
        type TempTotal = {
            product: Product;
            total: number;
            subItemsMap?: { [key: string]: { product: Product; total: number } }
        }
        const totals: { [key: string]: TempTotal } = {}
        const defaultAccompaniments = products.filter(p => p.category === 'verduras')

        events.forEach(event => {
            const presentDefaultIds = new Set<string>()

            event.ingredients.forEach(ing => {
                // Marcar si este ingrediente es un acompañamiento default que ya está presente
                if (ing.product.category === 'verduras') {
                    presentDefaultIds.add(ing.product.id)
                }

                // Omitir materiales del cálculo
                if (ing.product.category === 'material') {
                    return
                }

                const totalForEvent = ing.isFixedQuantity
                    ? ing.quantityPerPerson
                    : ing.quantityPerPerson * event.guestCount

                // Si es combo, lo agregamos como item principal y sus ingredientes como sub-items
                if (ing.product.is_combo) {
                    if (!totals[ing.product.id]) {
                        totals[ing.product.id] = {
                            product: ing.product,
                            total: 0,
                            subItemsMap: {}
                        }
                    }
                    totals[ing.product.id].total += totalForEvent

                    const subIngs = comboIngredientsMap[ing.product.id]
                    if (subIngs && subIngs.length > 0) {
                        subIngs.forEach(sub => {
                            const subProduct = products.find(p => p.id === sub.ingredient_id)
                            if (subProduct) {
                                const subTotal = totalForEvent * sub.quantity
                                const parent = totals[ing.product.id]

                                if (!parent.subItemsMap) parent.subItemsMap = {}

                                if (!parent.subItemsMap[subProduct.id]) {
                                    parent.subItemsMap[subProduct.id] = {
                                        product: subProduct,
                                        total: 0
                                    }
                                }
                                parent.subItemsMap[subProduct.id].total += subTotal
                            }
                        })
                    }
                    return // No agregar ingredientes sueltos para evitar duplicados visuales fuera del grupo
                }

                if (totals[ing.product.id]) {
                    totals[ing.product.id].total += totalForEvent
                } else {
                    totals[ing.product.id] = {
                        product: ing.product,
                        total: totalForEvent
                    }
                }
            })

            // Agregar acompañamientos default que falten
            defaultAccompaniments.forEach(defProduct => {
                if (!presentDefaultIds.has(defProduct.id)) {
                    const quantityPerPerson = defProduct.portion_per_person
                        ? parsePortionPerPerson(defProduct.portion_per_person)
                        : 0

                    const totalForEvent = quantityPerPerson * event.guestCount

                    if (totals[defProduct.id]) {
                        totals[defProduct.id].total += totalForEvent
                    } else {
                        totals[defProduct.id] = {
                            product: defProduct,
                            total: totalForEvent
                        }
                    }
                }
            })
        })

        return Object.values(totals).map(t => ({
            product: t.product,
            total: t.total,
            subItems: t.subItemsMap ? Object.values(t.subItemsMap) : undefined
        }))
    }, [events, products, comboIngredientsMap])

    // Agrupar por categoría
    const totalsByCategory = useMemo(() => {
        const byCategory: { [key: string]: IngredientTotal[] } = {}

        grandTotals.forEach(item => {
            const category = item.product.category
            if (!byCategory[category]) {
                byCategory[category] = []
            }
            byCategory[category].push(item)
        })

        return byCategory
    }, [grandTotals])

    // Calcular estadísticas globales (basado en eventos filtrados)
    const globalStats = useMemo<GlobalStats>(() => {
        const totalEvents = filteredEvents.length
        const totalGuests = filteredEvents.reduce((sum, e) => sum + e.guestCount, 0)
        const totalCost = filteredEvents.reduce((sum, e) => {
            const costs = calculateEventCost(e)
            return sum + costs.totalCost
        }, 0)
        const avgCostPerGuest = totalGuests > 0 ? totalCost / totalGuests : 0
        const avgCostPerEvent = totalEvents > 0 ? totalCost / totalEvents : 0

        return {
            totalEvents,
            totalGuests,
            totalCost,
            avgCostPerGuest,
            avgCostPerEvent
        }
    }, [filteredEvents])

    return {
        grandTotals,
        totalsByCategory,
        globalStats
    }
}
