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
    const { products, loading } = useProducts()
    const [tempSelection, setTempSelection] = useState(selectedItems)

    useEffect(() => {
        if (isOpen) {
            // Helper to convert Name or ID to ID
            const toId = (item: string) => {
                // Try to find by ID first, then by Name
                const product = products.find(p => p.id === item || p.name === item)
                return product ? product.id : item
            }

            const normalizedSelection = {
                entrees: (selectedItems?.entrees || []).map(toId),
                viandes: (selectedItems?.viandes || []).map(toId),
                desserts: (selectedItems?.desserts || []).map(toId),
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
        return categoryList.some(item => {
            // Exact ID match
            if (item === product.id) return true
            // Exact Name match
            if (item === product.name) return true

            // Fuzzy Name match
            const itemSimple = simplifyString(item)
            const nameSimple = simplifyString(product.name)

            // Special case for 'Cote de boeuf' vs 'Tomahawk'
            if (itemSimple.includes('tomahawk') && nameSimple.includes('cote')) return true
            if (itemSimple.includes('cote') && nameSimple.includes('tomahawk')) return true

            // Special case for 'Burger' vs 'Burguer'
            // DB might have 'Burguer', ID is 'burger'
            if (itemSimple.includes('burger') && nameSimple.includes('burguer')) return true
            if (itemSimple.includes('burguer') && nameSimple.includes('burger')) return true

            return itemSimple.includes(nameSimple) || nameSimple.includes(itemSimple)
        })
    }

    // Palabras clave para EXCLUIR ingredientes o versiones desglosadas
    const EXCLUDED_KEYWORDS = [
        'pan ', 'queso ', 'base ', 'carne ', 'salsa ', 'focaccia', 'salade',
        'acompañamiento', 'ingrédient', 'supplément', 'flambes'
    ]

    // Palabras clave para INCLUIR (Platos principales)
    const MAIN_DISH_KEYWORDS = {
        entrees: ['brochet', 'burg', 'choripan', 'empanada', 'secreto'],
        desserts: ['fruit', 'panqueques']
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

    // Update filtering to ensure we capture the items even if names are short
    // Logic remains similar but we rely on the DB name for filtering
    const entreesList = products.filter(p =>
        p.category === 'entradas' && isMainDish(p, MAIN_DISH_KEYWORDS.entrees)
    )
    const viandesList = products.filter(p =>
        (p.category === 'carnes_clasicas' || p.category === 'carnes_premium') &&
        !EXCLUDED_KEYWORDS.some(k => p.name.toLowerCase().includes(k))
    )
    const dessertsList = products.filter(p =>
        p.category === 'postres' && isMainDish(p, MAIN_DISH_KEYWORDS.desserts)
    )

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
