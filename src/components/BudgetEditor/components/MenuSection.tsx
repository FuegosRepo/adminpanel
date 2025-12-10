import React, { useState } from 'react'
import { BudgetData } from '../types'
import { useProducts } from '@/hooks/useProducts'
import { formatItemName } from '../utils/formatItemName'
import { MenuSelectorModal } from './MenuSelectorModal'
import styles from './MenuSection.module.css'

interface MenuSectionProps {
    data: BudgetData['menu']
    onUpdate: (path: string, value: any) => void
}

export function MenuSection({ data, onUpdate }: MenuSectionProps) {
    const [expanded, setExpanded] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const { products } = useProducts()

    const getProductNames = (ids: string[] | undefined) => {
        if (!ids || ids.length === 0) return []
        return ids.map(id => {
            const product = products.find(p => p.id === id)
            return product ? product.name : formatItemName(id)
        })
    }

    const selectedEntrees = getProductNames(data.selectedItems?.entrees)
    const selectedViandes = getProductNames(data.selectedItems?.viandes)
    const selectedDesserts = getProductNames(data.selectedItems?.desserts)

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
                                Modificar Menú
                            </button>
                        </div>

                        <div className={styles.selectionGrid}>
                            <div className={styles.selectionGroup}>
                                <h4>Entradas</h4>
                                {selectedEntrees.length > 0 ? (
                                    <ul className={styles.selectionList}>
                                        {selectedEntrees.map((name, i) => <li key={i}>{name}</li>)}
                                    </ul>
                                ) : <span className={styles.emptyMessage}>Sin selección</span>}
                            </div>
                            <div className={styles.selectionGroup}>
                                <h4>Carnes</h4>
                                {selectedViandes.length > 0 ? (
                                    <ul className={styles.selectionList}>
                                        {selectedViandes.map((name, i) => <li key={i}>{name}</li>)}
                                    </ul>
                                ) : <span className={styles.emptyMessage}>Sin selección</span>}
                            </div>
                            <div className={styles.selectionGroup}>
                                <h4>Postres</h4>
                                {selectedDesserts.length > 0 ? (
                                    <ul className={styles.selectionList}>
                                        {selectedDesserts.map((name, i) => <li key={i}>{name}</li>)}
                                    </ul>
                                ) : <span className={styles.emptyMessage}>Sin selección</span>}
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
                        selectedItems={{
                            entrees: data.selectedItems?.entrees || [],
                            viandes: data.selectedItems?.viandes || [],
                            desserts: data.selectedItems?.desserts || []
                        }}
                        onSave={(selection) => {
                            // Hidratar selección con nombres reales de productos
                            const hydrateItems = (ids: string[], category: string) => {
                                return ids.map(id => {
                                    const product = products.find(p => p.id === id)
                                    // Si no encuentra producto, usa el ID formateado
                                    return {
                                        name: product ? product.name : formatItemName(id),
                                        quantity: 0,
                                        pricePerUnit: 0,
                                        total: 0
                                    }
                                })
                            }

                            // Buscar el producto de postre si hay selección
                            let dessertItem = null
                            if (selection.desserts.length > 0) {
                                const dessertId = selection.desserts[0]
                                const product = products.find(p => p.id === dessertId)
                                dessertItem = {
                                    name: product ? product.name : formatItemName(dessertId),
                                    quantity: 0,
                                    pricePerUnit: 0,
                                    total: 0
                                }
                            }

                            // Actualizar IDs para la UI
                            onUpdate('menu.selectedItems', selection)

                            // Actualizar objetos completos para PDF
                            onUpdate('menu.entrees', hydrateItems(selection.entrees, 'entrees'))
                            onUpdate('menu.viandes', hydrateItems(selection.viandes, 'viandes'))
                            if (dessertItem) {
                                onUpdate('menu.dessert', dessertItem)
                            }

                            setShowModal(false)
                        }}
                    />
                </>
            )}
        </section>
    )
}
