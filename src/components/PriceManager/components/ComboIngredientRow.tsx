import React, { useState, useEffect } from 'react'
import { ComboIngredient } from '@/types'
import { Trash2 } from 'lucide-react'
import styles from './ComboIngredientsModal.module.css'

interface ComboIngredientRowProps {
    item: ComboIngredient
    onUpdateQuantity: (relationId: string, quantity: number) => void
    onUpdatePrice?: (ingredientId: string, newPrice: number, field: 'price_per_kg' | 'price_per_portion') => void
    onUpdateUnit: (relationId: string, unit: 'kg' | 'gr' | 'u') => void
    onRemoveIngredient: (relationId: string) => Promise<boolean>
    loading: boolean
}

export const ComboIngredientRow: React.FC<ComboIngredientRowProps> = ({
    item,
    onUpdateQuantity,
    onUpdatePrice,
    onUpdateUnit,
    onRemoveIngredient,
    loading
}) => {
    // Determine default unit: Use persisted unit if valid, otherwise fallback to item Type logic
    const isKgItem = item.ingredient?.unit_type === 'kg'
    const storedUnit = item.display_unit as 'kg' | 'gr' | 'u' | undefined

    // Initial state logic:
    // If storedUnit exists, respect it.
    // Else default: Kg -> 'gr' (as per user pref), Others -> 'u'
    const getInitialUnit = (): 'kg' | 'gr' | 'u' => {
        if (storedUnit && ['kg', 'gr', 'u'].includes(storedUnit)) return storedUnit
        return isKgItem ? 'gr' : 'u'
    }

    const [unit, setUnit] = useState<'kg' | 'gr' | 'u'>(getInitialUnit)

    // Sync if db updates externally or correct on valid load
    useEffect(() => {
        if (storedUnit && storedUnit !== unit && ['kg', 'gr', 'u'].includes(storedUnit)) {
            setUnit(storedUnit)
        }
    }, [storedUnit])

    const handleQuantityChange = (val: string) => {
        let numVal = parseFloat(val)
        if (isNaN(numVal)) numVal = 0

        if (unit === 'gr') {
            onUpdateQuantity(item.id, numVal / 1000)
        } else {
            onUpdateQuantity(item.id, numVal)
        }
    }

    const handlePriceChange = (val: string) => {
        if (!onUpdatePrice || !item.ingredient?.id) return
        const numVal = parseFloat(val) || 0
        const field = isKgItem ? 'price_per_kg' : 'price_per_portion'
        onUpdatePrice(item.ingredient.id, numVal, field)
    }

    const displayQuantity = unit === 'gr'
        ? (item.quantity * 1000).toFixed(0)
        : item.quantity.toString()

    const toggleUnit = () => {
        // Cycle: kg -> gr -> u -> kg
        // Allow cycling even for non-kg if user really wants to use 'u' vs others? 
        // User asked for 'u' option.
        // Let's assume cycle is always valid if 'u' is desired feature. 
        // But converting 'u' <-> 'kg' implies 1:1.

        const nextUnit = unit === 'kg' ? 'gr' : (unit === 'gr' ? 'u' : 'kg')
        setUnit(nextUnit)
        onUpdateUnit(item.id, nextUnit)
    }

    // Allow toggle for all? Or restrict 'gr'/'kg' to Kg items?
    // If unit_type is portion/unit, 'gr' makes no sense.
    // So ONLY show toggle if isKgItem.
    // If not KgItem, unit is always 'u' (or 'storage').

    // Modification: User says "switch de kg o gr... ponerle una de u".
    // This implies only for items that HAVE a switch (i.e. KG items).
    // Non-kg items usually don't need a switch (always units).

    return (
        <div className={styles.ingredientRow}>
            <div className={styles.ingredientInfo}>
                <span className={styles.ingredientName}>{item.ingredient?.name}</span>

                <div className={styles.priceEditWrapper} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9em', color: '#666' }}>
                    <span>Costo base:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={isKgItem ? (item.ingredient?.price_per_kg || 0) : (item.ingredient?.price_per_portion || 0)}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            className={styles.quantityInput}
                            style={{ width: '70px', padding: '2px 5px', height: '24px' }}
                            disabled={loading}
                        />
                        <span>€ / {item.ingredient?.unit_type}</span>
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <div className={styles.quantityWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                            type="number"
                            min="0"
                            step={unit === 'gr' ? "1" : "0.001"}
                            value={displayQuantity}
                            onChange={e => handleQuantityChange(e.target.value)}
                            className={styles.quantityInput}
                            disabled={loading}
                        />

                        {isKgItem ? (
                            <button
                                className={styles.unitToggle}
                                onClick={toggleUnit}
                                style={{
                                    background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px',
                                    padding: '2px 6px', fontSize: '0.8em', cursor: 'pointer',
                                    minWidth: '35px'
                                }}
                                title="Cambiar unidad (Kg -> Gr -> U)"
                            >
                                {unit}
                            </button>
                        ) : (
                            <span className={styles.unitLabel} style={{ marginLeft: '5px' }}>{unit}</span>
                        )}
                    </div>
                    <span style={{ fontSize: '0.75em', color: '#888' }}>
                        {item.ingredient?.unit_type === 'porcion' ? 'por persona' : ''}
                    </span>
                </div>

                <button
                    onClick={() => onRemoveIngredient(item.id)}
                    className={styles.removeButton}
                    disabled={loading}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    )
}
