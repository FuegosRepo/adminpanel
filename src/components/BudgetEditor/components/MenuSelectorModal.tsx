import React, { useEffect, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { simplifyString } from '@/utils/stringUtils'
import { getProductDisplayName } from '@/utils/productDisplay'
import styles from './MenuSelectorModal.module.css'

interface MenuSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    selectedItems: {
        entrees: string[]
        viandes: string[]
        desserts: string[]
    }
    onSave: (selection: { entrees: string[], viandes: string[], desserts: string[] }) => void
}

export function MenuSelectorModal({ isOpen, onClose, selectedItems, onSave }: MenuSelectorModalProps) {
    // Use ONLY active products - filtering is done at database level
    const { products, loading } = useProducts(false)
    const [tempSelection, setTempSelection] = useState(selectedItems)

    useEffect(() => {
        if (isOpen) {
            // Helper to convert Name or ID to ID, with validation
            const toId = (item: string) => {
                // Only accept valid UUIDs, reject legacy text
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

                // If it's already a valid UUID, return it
                if (uuidRegex.test(item)) {
                    // Verify it exists in products
                    const exists = products.find(p => p.id === item)
                    return exists ? item : null
                }

                // Try to find by name
                const product = products.find(p => p.name === item || p.name.toLowerCase().trim() === item.toLowerCase().trim())
                return product ? product.id : null
            }

            // Clean and deduplicate selections
            const cleanAndDedupe = (items: string[]) => {
                const validIds = items.map(toId).filter((id): id is string => id !== null)
                return Array.from(new Set(validIds)) // Deduplicate
            }

            const normalizedSelection = {
                entrees: cleanAndDedupe(selectedItems?.entrees || []),
                viandes: cleanAndDedupe(selectedItems?.viandes || []),
                desserts: cleanAndDedupe(selectedItems?.desserts || []),
            }
            setTempSelection(normalizedSelection)
        }
    }, [isOpen, selectedItems, products])

    if (!isOpen) return null

    const handleToggle = (category: 'entrees' | 'viandes' | 'desserts', id: string) => {
        const currentList = tempSelection[category] || []
        const exists = currentList.includes(id)
        let newList

        if (category === 'desserts') {
            // Single selection for desserts
            // If clicking the already selected item, deselect it (empty list)
            // Otherwise, replace selection with new item
            newList = exists ? [] : [id]
        } else {
            // Multiple selection for entrees/viandes
            if (exists) {
                newList = currentList.filter(item => item !== id)
            } else {
                newList = [...currentList, id]
            }
        }

        setTempSelection({ ...tempSelection, [category]: newList })
    }

    // Helper to normalize strings for comparison is now imported

    const isSelected = (categoryList: string[] | undefined, product: any) => {
        if (!categoryList) return false

        // ULTRA STRICT: Only match by exact ID
        // No name matching at all to prevent any false positives
        return categoryList.includes(product.id)
    }

    // Palabras clave para EXCLUIR ingredientes o versiones desglosadas
    const EXCLUDED_KEYWORDS = [
        'pan ', 'queso ', 'base', 'carne ', 'salsa ', 'focaccia', 'salade',
        'acompañamiento', 'ingrédient', 'supplément', 'flambes',
        'tomate', 'jamon', 'mozza', 'tapas au chorizo', 'chorizo grillé',
        'entraña', 'hampe', 'skirt steak'
    ]

    // Palabras clave para INCLUIR (Platos principales)
    const MAIN_DISH_KEYWORDS = {
        entrees: ['brochet', 'burg', 'choripan', 'empanada', 'secreto'],
        desserts: ['panqueque', 'fruits grill'] // Solo estos 2
    }

    // Helper to get display name is now imported from @/utils/productDisplay

    // ... filtering code ...

    const isMainDish = (product: any, keywords: string[]) => {
        const name = product.name.toLowerCase()
        const exactName = name.trim()

        // 1. FILTRO DE EXCLUSIÓN ESPECÍFICO
        if (exactName === 'chori' || exactName === 'chorizo' || exactName === 'panqueque') return false

        // 2. FILTRO DE EXCLUSIÓN GENERAL
        if (EXCLUDED_KEYWORDS.some(k => name.includes(k))) return false

        // 3. FILTRO DE CATEGORÍA VIANDES (Carnes)
        if (product.category === 'carnes_clasicas' || product.category === 'carnes_premium') return true

        // 4. FILTRO DE INCLUSIÓN (Entradas y Postres)
        return keywords.some(k => name.includes(k))
    }

    // Helper to deduplicate products by name (keep first occurrence)
    const deduplicateByName = (products: any[]) => {
        const seen = new Set<string>()
        return products.filter(p => {
            const normalizedName = p.name.toLowerCase().trim()
            if (seen.has(normalizedName)) return false
            seen.add(normalizedName)
            return true
        })
    }

    // Update filtering - STRICT whitelist for desserts
    const entreesList = deduplicateByName(products.filter(p => {
        if (p.category !== 'entrees') return false
        const name = p.name.toLowerCase()
        return !EXCLUDED_KEYWORDS.some(k => name.includes(k))
    }))
    const viandesList = deduplicateByName(products.filter(p => {
        if (p.category !== 'viandes') return false
        const name = p.name.toLowerCase()
        return !EXCLUDED_KEYWORDS.some(k => name.includes(k))
    }))


    // DESSERTS: Mostrar TODOS los desserts activos (filtrado se hace en BD)
    const dessertsList = deduplicateByName(products.filter(p => {
        if (p.category !== 'desserts') return false
        // Ya no filtramos por keywords - confiamos en que solo los correctos están activos
        return true
    }))


    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Seleccionar Menú</h2>
                    <button className={styles.closeBtn} onClick={onClose} title="Cerrar">×</button>
                </div>
                {loading ? (
                    <p>Cargando productos...</p>
                ) : (
                    <div className={styles.grid}>
                        <div className={styles.column}>
                            <h3>Entradas</h3>
                            {entreesList.map(p => (
                                <div key={p.id} className={styles.item} onClick={() => handleToggle('entrees', p.id)}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected(tempSelection.entrees, p)}
                                        readOnly
                                    />
                                    <span>{getProductDisplayName(p.name)}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.column}>
                            <h3>Carnes</h3>
                            {viandesList.map(p => (
                                <div key={p.id} className={styles.item} onClick={() => handleToggle('viandes', p.id)}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected(tempSelection.viandes, p)}
                                        readOnly
                                    />
                                    <span>{getProductDisplayName(p.name)}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.column}>
                            <h3>Postres</h3>
                            {dessertsList.map(p => (
                                <div key={p.id} className={styles.item} onClick={() => handleToggle('desserts', p.id)}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected(tempSelection.desserts, p)}
                                        readOnly
                                    />
                                    <span>{getProductDisplayName(p.name)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className={styles.actions}>
                    <button className={`${styles.button} ${styles.cancelBtn}`} onClick={onClose}>Cancelar</button>
                    <button className={`${styles.button} ${styles.saveBtn}`} onClick={() => onSave(tempSelection)}>Guardar Selección</button>
                </div>
            </div>
        </div>
    )
}
