import React, { useEffect, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
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
        if (exists) {
            newList = currentList.filter(item => item !== id)
        } else {
            newList = [...currentList, id]
        }
        setTempSelection({ ...tempSelection, [category]: newList })
    }

    const isSelected = (categoryList: string[] | undefined, product: any) => {
        if (!categoryList) return false
        return categoryList.some(item => {
            // Exact ID match
            if (item === product.id) return true
            // Exact Name match
            if (item === product.name) return true
            // Fuzzy Name match (case insensitive, ignoring special chars)
            const simplify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
            const itemSimple = simplify(item)
            const nameSimple = simplify(product.name)
            return itemSimple.includes(nameSimple) || nameSimple.includes(itemSimple)
        })
    }

    // Listas de palabras clave para identificar platos principales (vs ingredientes)
    const MAIN_DISH_KEYWORDS = {
        entrees: ['brochet', 'burg', 'chori', 'empanada', 'secreto'],
        desserts: ['fruit', 'panqueque']
    }

    const isMainDish = (product: any, keywords: string[]) => {
        const name = product.name.toLowerCase()
        return keywords.some(k => name.includes(k))
    }

    const entreesList = products.filter(p =>
        p.category === 'entradas' && isMainDish(p, MAIN_DISH_KEYWORDS.entrees)
    )
    const viandesList = products.filter(p => p.category === 'carnes_clasicas' || p.category === 'carnes_premium')
    const dessertsList = products.filter(p =>
        p.category === 'postres' && isMainDish(p, MAIN_DISH_KEYWORDS.desserts)
    )

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Seleccionar Menú</h2>
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
                                    <span>{p.name}</span>
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
                                    <span>{p.name}</span>
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
                                    <span>{p.name}</span>
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
