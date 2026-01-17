import React from 'react'
import { BudgetData } from '../types'
import styles from './TotalsSection.module.css'

interface TotalsSectionProps {
    data: BudgetData['totals']
    onUpdate: (path: string, value: any) => void
}

export function TotalsSection({ data, onUpdate }: TotalsSectionProps) {
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
                    <span>TOTAL A PAGAR (TTC):</span>
                    <span className={styles.finalAmount}>
                        {data.totalTTC.toFixed(2)} €
                    </span>
                </div>
            </div>
        </section>
    )
}
