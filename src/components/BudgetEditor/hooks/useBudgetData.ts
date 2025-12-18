import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Budget, BudgetData } from '../types'
import { formatItemName } from '../utils/formatItemName'
import { MATERIAL_MAPPINGS } from '@/components/EventCalculator/utils/productMapping'
import { normalizeFrontendIdsToProductNames } from '@/lib/productNormalization'

export function useBudgetData(budgetId: string) {
    const [budget, setBudget] = useState<Budget | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    const loadBudget = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error } = await supabase
                .from('budgets')
                .select('*')
                .eq('id', budgetId)
                .single()

            if (error) {
                throw error
            }

            if (data) {
                setBudget(data as any)

                // Procesamiento inicial de datos (similar al original)
                const budgetData = { ...data.budget_data } as BudgetData

                // Safe Client Info Backfill Strategy
                // - Only fills NULL/empty fields  
                // - Preserves manual edits
                // - Always fetch selectedItems from orders
                if (data.order_id) {
                    const { data: orderData, error: orderError } = await supabase
                        .from('catering_orders')
                        .select('entrees, viandes, dessert, event_date, name, email, phone, address, event_type, guest_count')
                        .eq('id', data.order_id)
                        .single()

                    if (orderError) {
                        console.error('❌ Error fetching order data:', orderError)
                    }

                    if (orderData) {
                        // PHASE 1: PRODUCT NORMALIZATION
                        // Convert frontend IDs (e.g., 'secreto', 'burger') to database product names
                        const normalizedEntrees = normalizeFrontendIdsToProductNames(orderData.entrees || [])
                        const normalizedViandes = normalizeFrontendIdsToProductNames(orderData.viandes || [])
                        const normalizedDessert = orderData.dessert
                            ? normalizeFrontendIdsToProductNames([orderData.dessert])[0]
                            : null

                        // Fetch full product objects from database
                        const allProductNames = [...normalizedEntrees, ...normalizedViandes]
                        if (normalizedDessert) allProductNames.push(normalizedDessert)

                        const { data: products, error: productsError } = await supabase
                            .from('products')
                            .select('id, name, price_per_portion, category, is_combo')
                            .in('name', allProductNames)

                        if (productsError) {
                            console.error('❌ Error fetching products:', productsError)
                        }

                        // Hydrate selectedItems with full product objects
                        if (products) {
                            const findProduct = (name: string) => products.find(p =>
                                p.name.toLowerCase() === name.toLowerCase()
                            )

                            budgetData.menu.selectedItems = {
                                entrees: normalizedEntrees.map(name => findProduct(name)?.name || name),
                                viandes: normalizedViandes.map(name => findProduct(name)?.name || name),
                                desserts: normalizedDessert ? [findProduct(normalizedDessert)?.name || normalizedDessert] : []
                            }

                            console.log('✅ Product normalization complete:', {
                                originalEntrees: orderData.entrees,
                                normalizedEntrees,
                                originalViandes: orderData.viandes,
                                normalizedViandes,
                                foundProducts: products.length
                            })
                        } else {
                            // Fallback: use normalized names even if no products found
                            budgetData.menu.selectedItems = {
                                entrees: normalizedEntrees,
                                viandes: normalizedViandes,
                                desserts: normalizedDessert ? [normalizedDessert] : []
                            }
                        }

                        // Safe fallback: Only fill empty fields, never overwrite
                        // This preserves manual edits while filling in missing data
                        if (!budgetData.clientInfo.name && orderData.name) {
                            budgetData.clientInfo.name = orderData.name
                        }
                        if (!budgetData.clientInfo.email && orderData.email) {
                            budgetData.clientInfo.email = orderData.email
                        }
                        if (!budgetData.clientInfo.phone && orderData.phone) {
                            budgetData.clientInfo.phone = orderData.phone
                        }
                        if (!budgetData.clientInfo.address && orderData.address) {
                            budgetData.clientInfo.address = orderData.address
                        }
                        if (!budgetData.clientInfo.eventType && orderData.event_type) {
                            budgetData.clientInfo.eventType = orderData.event_type
                        }
                        if (!budgetData.clientInfo.guestCount && orderData.guest_count) {
                            budgetData.clientInfo.guestCount = orderData.guest_count
                        }
                        // Event date: Fill if missing
                        if (!budgetData.clientInfo.eventDate && orderData.event_date) {
                            budgetData.clientInfo.eventDate = orderData.event_date
                        }
                    }
                } else {
                    // Budget has no order_id - standalone budget
                }

                // Asegurar valores fijos para servicio si existe
                if (budgetData.service) {
                    budgetData.service.pricePerHour = 40
                    budgetData.service.tvaPct = 20
                    const serviceHT = budgetData.service.mozos * budgetData.service.hours * 40
                    budgetData.service.totalHT = serviceHT
                    budgetData.service.tva = serviceHT * 0.20
                    budgetData.service.totalTTC = serviceHT + budgetData.service.tva
                }

                // Cargamos todos los productos de material para buscar precios correctos
                const { data: materialProducts } = await supabase
                    .from('products')
                    .select('name, price_per_portion')
                    .eq('category', 'material')

                // Formatear nombres y corregir precios de items de material
                if (budgetData.material && budgetData.material.items) {
                    budgetData.material.items = budgetData.material.items
                        .filter(item => {
                            const itemNameLower = item.name.toLowerCase()
                            return !itemNameLower.includes('serveur') &&
                                !itemNameLower.includes('servicio') &&
                                !itemNameLower.includes('mozos')
                        })
                        .map(item => {
                            // 1. Formatear nombre para francés (Visualización)
                            const formattedName = formatItemName(item.name)

                            // \u2705 PRESERVE MANUAL PRICES
                            // If item has isManualPrice flag, keep the existing price
                            if (item.isManualPrice) {
                                console.log(`\u2705 Preserving manual price for "${formattedName}": ${item.pricePerUnit}\u20ac`)
                                return {
                                    ...item,
                                    name: formattedName,
                                    // pricePerUnit unchanged
                                }
                            }

                            // 2. Buscar precio correcto en BD (Lógica)
                            let correctPrice = item.pricePerUnit

                            if (materialProducts) {
                                // Intentar mapear usando las claves conocidas
                                const dbMatches = Object.entries(MATERIAL_MAPPINGS).find(([key, _]) =>
                                    item.name.toLowerCase().includes(key) || formatItemName(item.name).toLowerCase().includes(key)
                                )

                                let foundProduct = null;

                                if (dbMatches) {
                                    // Buscar por nombre mapeado (Español)
                                    const possibleNames = dbMatches[1] as string[]
                                    foundProduct = materialProducts.find(p =>
                                        possibleNames.some((name: string) => p.name.toLowerCase().includes(name))
                                    )
                                }

                                // Si no se encuentra por mapeo, buscar directo (por si ya estaba en español o coincidencia exacta)
                                if (!foundProduct) {
                                    foundProduct = materialProducts.find(p =>
                                        p.name.toLowerCase() === item.name.toLowerCase() ||
                                        p.name.toLowerCase().includes(item.name.toLowerCase())
                                    )
                                }

                                if (foundProduct) {
                                    console.log(`\u2705 Precio corregido para "${item.name}": ${item.pricePerUnit} -> ${foundProduct.price_per_portion} `)
                                    correctPrice = foundProduct.price_per_portion || 0.50
                                }
                            }

                            // Si el precio sigue siendo sospechoso (entero 5, etc) y parece un plato/vaso, forzar 0.50
                            if (correctPrice >= 1.0 && (
                                formattedName.toLowerCase().includes('verre') ||
                                formattedName.toLowerCase().includes('assiette') ||
                                formattedName.toLowerCase().includes('couverts')
                            )) {
                                console.warn(`\u26a0\ufe0f Forzando precio 0.50 para "${formattedName}"(precio anterior: ${correctPrice})`)
                                correctPrice = 0.50
                            }

                            return {
                                ...item,
                                name: formattedName,
                                pricePerUnit: correctPrice
                            }
                        })

                    // Recálculo inicial de material
                    if (budgetData.material.items.length > 0) {
                        let materialHT = 0
                        budgetData.material.items.forEach(item => {
                            item.total = item.quantity * item.pricePerUnit
                            materialHT += item.total
                        })
                        const insPct = (budgetData.material.insurancePct ?? 6) / 100
                        const insurance = materialHT * insPct
                        budgetData.material.insurancePct = insPct * 100
                        budgetData.material.insuranceAmount = insurance
                        const materialHTWithInsurance = materialHT + insurance
                        budgetData.material.totalHT = materialHTWithInsurance
                        budgetData.material.tva = materialHTWithInsurance * (budgetData.material.tvaPct / 100)
                        budgetData.material.totalTTC = budgetData.material.totalHT + budgetData.material.tva
                    } else {
                        delete budgetData.material
                    }
                }

                // Updating the local budget object with enriched data
                const enrichedBudget = { ...data, budget_data: budgetData }
                setBudget(enrichedBudget as any)

                return budgetData
            }
            return null
        } catch (err) {
            setError('Error cargando presupuesto')
            console.error(err)
            return null
        } finally {
            setLoading(false)
        }
    }, [budgetId])

    useEffect(() => {
        if (budgetId) {
            loadBudget()
        }
    }, [budgetId, loadBudget])

    const saveBudget = async (editedData: BudgetData, summary: string = 'Edición manual') => {
        try {
            setSaving(true)

            const response = await fetch('/api/update-budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    budgetId,
                    budgetData: editedData,
                    editedBy: 'admin',
                    changesSummary: summary
                })
            })

            if (!response.ok) {
                throw new Error('Error al guardar')
            }

            const result = await response.json()
            console.log('✅ Cambios guardados:', result)

            // Recargar presupuesto para actualizar versión y estado
            const updatedData = await loadBudget()
            return { success: true, data: updatedData }
        } catch (err) {
            console.error('Error guardando:', err)
            return { success: false, error: err }
        } finally {
            setSaving(false)
        }
    }

    const deleteBudget = async () => {
        try {
            setSaving(true)

            // Get current budget to find order_id
            const currentBudget = budget

            // Delete budget first
            const { error: budgetError } = await supabase
                .from('budgets')
                .delete()
                .eq('id', budgetId)

            if (budgetError) throw budgetError

            // \u2705 Mirror delete: Also delete related order if exists
            if (currentBudget?.order_id) {
                console.log(`\ud83d\uddd1\ufe0f Mirror delete: Removing related order ${currentBudget.order_id}`)
                const { error: orderError } = await supabase
                    .from('catering_orders')
                    .delete()
                    .eq('id', currentBudget.order_id)

                if (orderError) {
                    console.warn('\u26a0\ufe0f Failed to delete related order:', orderError)
                    // Don't throw - budget already deleted
                } else {
                    console.log('\u2705 Related order deleted successfully')
                }
            }

            return { success: true }
        } catch (err) {
            console.error('Error eliminando:', err)
            return { success: false, error: err }
        } finally {
            setSaving(false)
        }
    }

    const approveAndSend = async (clientEmail: string, clientName: string) => {
        try {
            setSaving(true)
            const response = await fetch('/api/approve-and-send-budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    budgetId,
                    clientEmail,
                    clientName
                })
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Error al aprobar y enviar')

            await loadBudget()
            return { success: true, result }
        } catch (err) {
            console.error('Error aprobando:', err)
            return { success: false, error: err }
        } finally {
            setSaving(false)
        }
    }

    const generatePDF = async (currentData: BudgetData) => {
        try {
            setSaving(true)

            // \u2705 Verification logging for transport cost
            console.log('\ud83d\udd0d PDF Generation - Deplacement data:', currentData.deplacement)
            if (currentData.deplacement) {
                console.log('  Distance:', currentData.deplacement.distance, 'km')
                console.log('  Price per km:', currentData.deplacement.pricePerKm, '\u20ac')
                console.log('  Total HT:', currentData.deplacement.totalHT, '\u20ac')
            } else {
                console.log('  \u26a0\ufe0f No deplacement data present')
            }

            // Guardar primero
            await saveBudget(currentData, 'Guardado automático antes de PDF')

            const response = await fetch('/api/generate-budget-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    budgetId,
                    budgetData: currentData
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al generar PDF')
            }

            const result = await response.json()
            await loadBudget()
            return { success: true, pdfUrl: result.pdfUrl }
        } catch (err) {
            console.error('Error generando PDF:', err)
            return { success: false, error: err }
        } finally {
            setSaving(false)
        }
    }

    return {
        budget,
        loading,
        error,
        saving,
        loadBudget,
        saveBudget,
        deleteBudget,
        approveAndSend,
        generatePDF
    }
}
