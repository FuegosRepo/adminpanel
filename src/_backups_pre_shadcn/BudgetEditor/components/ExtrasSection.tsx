'use client'

import { BudgetExtrasSection } from '@/lib/types/budget'
import styles from '../BudgetEditor.module.css'

interface ExtrasSectionProps {
    extras?: BudgetExtrasSection
    onUpdate: (path: string, value: any) => void
}

export default function ExtrasSection({ extras, onUpdate }: ExtrasSectionProps) {
    const handleAddExtra = () => {
        const newExtras = extras ? { ...extras } : {
            items: [],
            totalHT: 0,
            totalTVA: 0,
            totalTTC: 0
        }

        newExtras.items.push({
            description: '',
            priceHT: 0,
            tvaPct: 20,
            tva: 0,
            priceTTC: 0
        })

        recalculateTotals(newExtras)
        onUpdate('extras', newExtras)
    }

    const handleRemoveExtra = (index: number) => {
        if (!extras) return

        const newExtras = { ...extras }
        newExtras.items = newExtras.items.filter((_, i) => i !== index)
        recalculateTotals(newExtras)
        onUpdate('extras', newExtras)
    }

    const handleUpdateExtra = (index: number, field: string, value: any) => {
        if (!extras) return

        const newExtras = { ...extras }
        const item = newExtras.items[index]

        if (field === 'description') {
            item.description = value
        } else if (field === 'priceHT') {
            item.priceHT = parseFloat(value) || 0
            item.tva = item.priceHT * (item.tvaPct / 100)
            item.priceTTC = item.priceHT + item.tva
        } else if (field === 'tvaPct') {
            item.tvaPct = parseFloat(value) || 0
            item.tva = item.priceHT * (item.tvaPct / 100)
            item.priceTTC = item.priceHT + item.tva
        }

        recalculateTotals(newExtras)
        onUpdate('extras', newExtras)
    }

    const recalculateTotals = (extrasSection: BudgetExtrasSection) => {
        extrasSection.totalHT = extrasSection.items.reduce((sum, item) => sum + item.priceHT, 0)
        extrasSection.totalTVA = extrasSection.items.reduce((sum, item) => sum + item.tva, 0)
        extrasSection.totalTTC = extrasSection.items.reduce((sum, item) => sum + item.priceTTC, 0)
    }

    const handleDeleteSection = () => {
        if (confirm('¿Estás seguro de eliminar toda la sección de Extras?')) {
            onUpdate('extras', undefined)
        }
    }

    if (!extras) {
        return (
            <div className={styles.section}>
                <div className={styles.emptySection}>
                    <p>No hay extras configurados</p>
                    <button onClick={handleAddExtra} className={styles.addButton}>
                        ➕ Agregar Extra
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.title}>➕ Extras</h2>
                <button onClick={handleDeleteSection} className={styles.deleteButton}>
                    🗑️ Eliminar Sección
                </button>
            </div>

            <div className={styles.sectionContent}>
                {extras.items.length > 0 ? (
                    extras.items.map((item, index) => (
                        <div key={index} className={styles.extraItem}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                    <label className={styles.label}>📝 Descripción</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        value={item.description}
                                        onChange={(e) => handleUpdateExtra(index, 'description', e.target.value)}
                                        placeholder="Ej: Decoración especial, servicio extra..."
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>💰 Precio HT (€)</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        value={item.priceHT}
                                        onChange={(e) => handleUpdateExtra(index, 'priceHT', e.target.value)}
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>📊 TVA</label>
                                    <select
                                        className={styles.select}
                                        value={item.tvaPct}
                                        onChange={(e) => handleUpdateExtra(index, 'tvaPct', e.target.value)}
                                    >
                                        <option value="10">10%</option>
                                        <option value="20">20%</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>💶 TVA Montant (€)</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        value={item.tva.toFixed(2)}
                                        disabled
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>💳 Prix TTC (€)</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        value={item.priceTTC.toFixed(2)}
                                        disabled
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => handleRemoveExtra(index)}
                                className={styles.removeItemButton}
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', background: '#f9fafb', borderRadius: '8px', marginBottom: '1rem' }}>
                        <p>No hay extras agregados. Click en "Agregar Extra" para comenzar.</p>
                    </div>
                )}

                <button onClick={handleAddExtra} className={styles.addButton}>
                    ➕ Agregar {extras.items.length > 0 ? 'Otro' : ''} Extra
                </button>

                {/* Totals - Only show if there are items */}
                {extras.items.length > 0 && (
                    <div className={styles.totalsBox}>
                        <div className={styles.totalRow}>
                            <span>Total HT:</span>
                            <span>{extras.totalHT.toFixed(2)} €</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Total TVA:</span>
                            <span>{extras.totalTVA.toFixed(2)} €</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Total TTC:</span>
                            <span>{extras.totalTTC.toFixed(2)} €</span>
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                    <label className={styles.label}>📝 Notes</label>
                    <textarea
                        className={styles.textarea}
                        value={extras.notes || ''}
                        onChange={(e) => {
                            const newExtras = { ...extras, notes: e.target.value }
                            onUpdate('extras', newExtras)
                        }}
                        placeholder="Notes additionnelles sur les extras..."
                        rows={3}
                    />
                </div>
            </div>
        </div>
    )
}
