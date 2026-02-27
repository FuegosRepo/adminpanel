import React from 'react'
import { Package, X, CheckSquare, Plus } from 'lucide-react'
import { Product } from '@/types'
import styles from './MaterialSelectorModal.module.css'
import { getFrenchNameFromSpanish } from '@/components/EventCalculator/utils/productMapping'
import { formatItemName } from '../utils/formatItemName'

interface MaterialSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    availableMaterials: Product[]
    selectedMaterialIds: string[]
    onToggleSelection: (id: string) => void
    onAddSelected: () => void
    existingItemNames: string[]
}

export function MaterialSelectorModal({
    isOpen,
    onClose,
    availableMaterials,
    selectedMaterialIds,
    onToggleSelection,
    onAddSelected,
    existingItemNames
}: MaterialSelectorModalProps) {
    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        <Package size={24} />
                        Agregar Materiales
                    </h3>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.body}>
                    <p className={styles.description}>
                        Selecciona los materiales que deseas agregar al presupuesto.
                    </p>

                    <div className={styles.grid}>
                        {availableMaterials.map(product => {
                            const isSelected = selectedMaterialIds.includes(product.id)
                            const alreadyInBudget = existingItemNames.includes(product.name)

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => onToggleSelection(product.id)}
                                    className={`
                    ${styles.card} 
                    ${isSelected ? styles.selected : ''} 
                    ${alreadyInBudget ? styles.alreadyInBudget : ''}
                  `}
                                >
                                    <div className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}>
                                        {isSelected && <CheckSquare size={14} color="white" />}
                                    </div>
                                    <div>
                                        <div className={styles.productName}>
                                            {formatItemName(getFrenchNameFromSpanish(product.name))}
                                        </div>
                                        {/* Show original name if different, for clarity */}
                                        {getFrenchNameFromSpanish(product.name) !== product.name && (
                                            <div className={styles.productInfo} style={{ fontStyle: 'italic', fontSize: '0.8em', color: '#666' }}>
                                                ({product.name})
                                            </div>
                                        )}
                                        {product.clarifications && (
                                            <div className={styles.productInfo}>{product.clarifications}</div>
                                        )}
                                        {alreadyInBudget && (
                                            <div className={styles.duplicateWarning}>
                                                Posible duplicado
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.btnSecondary}>
                        Cancelar
                    </button>
                    <button
                        onClick={onAddSelected}
                        className={styles.btnPrimary}
                        disabled={selectedMaterialIds.length === 0}
                    >
                        <Plus size={18} />
                        Agregar {selectedMaterialIds.length} Material(es)
                    </button>
                </div>
            </div>
        </div>
    )
}
