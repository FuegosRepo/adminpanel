import React, { useState } from 'react'
import { BudgetData } from '../types'
import { useProducts } from '@/hooks/useProducts'
import { formatItemName } from '../utils/formatItemName'
import { simplifyString } from '@/utils/stringUtils'
import { getProductDisplayName } from '@/utils/productDisplay'
import { MenuSelectorModal } from './MenuSelectorModal'
import styles from './MenuSection.module.css'

interface MenuSectionProps {
    data: BudgetData['menu']
    onUpdate: (path: string, value: any) => void
}

export function MenuSection({ data, onUpdate }: MenuSectionProps) {
    const [expanded, setExpanded] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const { products } = useProducts(true) // Include inactive products

    // Helper to resolve UUID or text to display name
    const resolveProductName = (nameOrId: string): string => {
        if (!nameOrId) return ''

        // Check if it's a UUID (with or without spaces/dashes)
        const cleanId = nameOrId.replace(/\s/g, '-').toLowerCase()
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

        if (uuidRegex.test(cleanId)) {
            // It's a UUID - try to find product
            const product = products.find(p => p.id.toLowerCase() === cleanId)
            return product ? product.name : '❓ Produit inconnu'
        }

        // Not a UUID - return formatted name
        return getProductDisplayName(nameOrId)
    }

    // Helper to add manual item
    const addManualItem = (category: string, name: string) => {
        if (!name.trim()) return
        const newItem = {
            name: name.trim(),
            quantity: 0,
            pricePerUnit: 0,
            total: 0
        }

        if (category === 'dessert') {
            onUpdate('menu.dessert', newItem)
        } else {
            // @ts-ignore
            const currentList = data[category] || []
            onUpdate(`menu.${category}`, [...currentList, newItem])
        }
    }

    const removeManualItem = (category: string, index: number) => {
        if (category === 'dessert') {
            onUpdate('menu.dessert', null)
            // Also clear from selectedItems
            onUpdate('menu.selectedItems.desserts', [])
        } else {
            // @ts-ignore
            const currentList = [...(data[category] || [])]
            const removedItem = currentList[index]
            currentList.splice(index, 1)
            onUpdate(`menu.${category}`, currentList)

            // Sync selectedItems - remove the deleted item
            const selectedKey = category // 'entrees' or 'viandes'
            // @ts-ignore
            const currentSelected = data.selectedItems?.[selectedKey] || []
            // Remove by both name and id to handle both cases
            const newSelected = currentSelected.filter((id: string) =>
                id !== removedItem.name && id !== removedItem.id
            )
            onUpdate(`menu.selectedItems.${selectedKey}`, newSelected)
        }
    }

    // Component for manual adder
    const ManualAdder = ({ category, placeholder }: { category: string, placeholder: string }) => {
        const [val, setVal] = useState('')
        return (
            <div className={styles.manualAdder}>
                <input
                    type="text"
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    placeholder={placeholder}
                    className={styles.manualInput}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            addManualItem(category, val)
                            setVal('')
                        }
                    }}
                />
                <button
                    onClick={() => {
                        addManualItem(category, val)
                        setVal('')
                    }}
                    className={styles.addBtn}
                >
                    +
                </button>
            </div>
        )
    }

    return (
        <section className={`${styles.section} ${styles.editable}`}>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={styles.toggleBtn}
                        title={expanded ? 'Colapsar' : 'Expandir'}
                    >
                        {expanded ? '▼' : '▶'}
                    </button>
                    <h2 className={styles.title}>🍽️ Menú</h2>
                </div>
            </div>
            {expanded && (
                <>
                    <div className={styles.editGrid}>
                        <div className={styles.editField}>
                            <label>Precio por Persona (€)</label>
                            <input
                                type="number"
                                value={data.pricePerPerson}
                                onChange={(e) => onUpdate('menu.pricePerPerson', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div className={styles.editField}>
                            <label>Total Personas</label>
                            <input
                                type="number"
                                value={data.totalPersons}
                                onChange={(e) => onUpdate('menu.totalPersons', parseInt(e.target.value) || 0)}
                                min="0"
                            />
                        </div>
                        <div className={styles.editField}>
                            <label>TVA (%)</label>
                            <input
                                type="number"
                                value={data.tvaPct}
                                onChange={(e) => onUpdate('menu.tvaPct', parseFloat(e.target.value) || 0)}
                                step="0.1"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className={styles.menuSelection}>
                        <div className={styles.menuSelectionHeader}>
                            <h3>Selección de Platos</h3>
                            <button
                                className={styles.modifyBtn}
                                onClick={() => setShowModal(true)}
                            >
                                Abrir Catálogo
                            </button>
                        </div>

                        <div className={styles.selectionGrid}>
                            {/* Entradas */}
                            <div className={styles.selectionGroup}>
                                <h4>Entradas</h4>
                                <ul className={styles.selectionList} style={{ listStyle: 'none', padding: 0 }}>
                                    {data.entrees?.map((item, i) => (
                                        <li key={i} className={styles.editableItem} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                            <span style={{ flex: 1 }}>• {resolveProductName(item.name)}</span>
                                            <button
                                                onClick={() => removeManualItem('entrees', i)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <ManualAdder category="entrees" placeholder="Agregar entrada manual..." />
                            </div>

                            {/* Carnes */}
                            <div className={styles.selectionGroup}>
                                <h4>Carnes</h4>
                                <ul className={styles.selectionList} style={{ listStyle: 'none', padding: 0 }}>
                                    {data.viandes?.map((item, i) => (
                                        <li key={i} className={styles.editableItem} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                            <span style={{ flex: 1 }}>• {resolveProductName(item.name)}</span>
                                            <button
                                                onClick={() => removeManualItem('viandes', i)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <ManualAdder category="viandes" placeholder="Agregar carne manual..." />
                            </div>

                            {/* Postres */}
                            <div className={styles.selectionGroup}>
                                <h4>Postres</h4>
                                <ul className={styles.selectionList} style={{ listStyle: 'none', padding: 0 }}>
                                    {data.dessert ? (
                                        <li className={styles.editableItem} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                            <span style={{ flex: 1 }}>• {resolveProductName(data.dessert.name)}</span>
                                            <button
                                                onClick={() => removeManualItem('dessert', 0)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </li>
                                    ) : null}
                                </ul>
                                {!data.dessert && (
                                    <ManualAdder category="dessert" placeholder="Agregar postre manual..." />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.totalsBox}>
                        <div className={styles.totalRow}>
                            <span>Total HT:</span>
                            <strong>{data.totalHT.toFixed(2)} €</strong>
                        </div>
                        <div className={styles.totalRow}>
                            <span>TVA ({data.tvaPct}%):</span>
                            <strong>{data.tva.toFixed(2)} €</strong>
                        </div>
                        <div className={`${styles.totalRow} ${styles.highlight}`}>
                            <span>Total TTC:</span>
                            <strong>{data.totalTTC.toFixed(2)} €</strong>
                        </div>
                    </div>

                    <MenuSelectorModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        // Legacy Fallback: If full objects are missing, try to use legacy selectedItems IDs
                        // This allows opening an old budget and having the modal pre-filled with the correct checks.
                        selectedItems={{
                            entrees: (data.entrees && data.entrees.length > 0)
                                ? data.entrees.map(e => e.name)
                                : (data.selectedItems?.entrees || []),
                            viandes: (data.viandes && data.viandes.length > 0)
                                ? data.viandes.map(v => v.name)
                                : (data.selectedItems?.viandes || []),
                            desserts: (data.dessert)
                                ? [data.dessert.name]
                                : (data.selectedItems?.desserts || [])
                        }}
                        onSave={(selection) => {
                            // Merge Strategy:
                            // The modal returns IDs. We convert them to full items.
                            // We REPLACE the current list with the new selection from the modal?
                            // NO, that destroys manual items.
                            // Better: The modal is an "Add to list" or "Sync list" tool.

                            // Let's adopt this strategy:
                            // The Modal returns the FULL desired set of "Catalog Items".
                            // Usage: If user uses modal, they are setting the "standard" items.
                            // Manual items might be lost if we are not careful.
                            // BUT, the user's main complaint was "I selected empanadas and can't remove them".
                            // This implies they want the Modal to be the Authority for Catalog items.

                            const hydrateItems = (ids: string[]) => {
                                // STEP 1: Deduplicate IDs first
                                const uniqueIds = Array.from(new Set(ids))

                                return uniqueIds.map(id => {
                                    // Try to find product by ID first, then by EXACT Name
                                    // Robust matching using simplifyString
                                    const idSimple = simplifyString(id)
                                    const product = products.find(p => {
                                        if (p.id === id || p.name === id) return true
                                        const pNameSimple = simplifyString(p.name)
                                        return pNameSimple === idSimple
                                    })

                                    // Always use the Product Name if found, otherwise fallback to the ID/Input
                                    const finalName = product ? product.name : formatItemName(id)

                                    return {
                                        name: finalName,
                                        quantity: 0,
                                        pricePerUnit: 0,
                                        total: 0
                                    }
                                })
                            }

                            // Update Entrees and Viandes
                            onUpdate('menu.entrees', hydrateItems(selection.entrees))
                            onUpdate('menu.viandes', hydrateItems(selection.viandes))

                            // Update Dessert
                            if (selection.desserts.length > 0) {
                                // Take the first selected dessert
                                const dId = selection.desserts[0]
                                const dIdSimple = simplifyString(dId)
                                const product = products.find(p => {
                                    if (p.id === dId || p.name === dId) return true
                                    return simplifyString(p.name) === dIdSimple
                                })
                                // Crucial: Use product.name if available to avoid "Dessert" or generic IDs
                                const finalName = product ? product.name : formatItemName(dId)

                                onUpdate('menu.dessert', {
                                    name: finalName,
                                    description: product?.description || undefined, // Pass description for special desserts
                                    quantity: 0,
                                    pricePerUnit: 0,
                                    total: 0
                                })
                            } else {
                                // Clear dessert if none selected
                                onUpdate('menu.dessert', null)
                            }

                            // Update the "selectedItems" IDs just in case legacy logic needs them, 
                            // though we are trying to move away from it.
                            onUpdate('menu.selectedItems', selection)

                            setShowModal(false)
                        }}
                    />
                </>
            )}
        </section>
    )
}
