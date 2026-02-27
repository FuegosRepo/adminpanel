import React from 'react'
import { BudgetData } from '../types'
import styles from './TotalsSection.module.css'

interface TotalsSectionProps {
    data: BudgetData['totals']
    menuDiscount?: { percentage: number; amount: number; reason: string }
    onUpdate: (path: string, value: any) => void
}

export function TotalsSection({ data, menuDiscount, onUpdate }: TotalsSectionProps) {
    // Con la nueva lógica, el totalHT ya incluye el descuento del menú (es totalHTApresRemise)
    // Por lo tanto, totalTTC = totalHT + totalTVA ya es el valor final correcto

    return (
        <section className={`${styles.section} ${styles.totalsFinal}`}>
            <h2 className={styles.title}>💰 Totales Finales</h2>
            <div className={styles.finalTotalsBox}>
                <div className={styles.totalRow}>
                    <span>Total HT Global:</span>
                    <strong>{data.totalHT.toFixed(2)} €</strong>
                </div>
                <div className={styles.totalRow}>
                    <span>Total TVA Global:</span>
                    <strong>{data.totalTVA.toFixed(2)} €</strong>
                </div>
                <div className={`${styles.totalRow} ${styles.highlightGreen}`}>
                    <span>TOTAL TTC:</span>
                    <span className={styles.finalAmount}>
                        {data.totalTTC.toFixed(2)} €
                    </span>
                </div>
            </div>
        </section>
    )
}
