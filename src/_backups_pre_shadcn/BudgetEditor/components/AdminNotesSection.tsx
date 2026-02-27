'use client'

import React from 'react'
import styles from '../BudgetEditor.module.css'

interface AdminNotesSectionProps {
    adminNotes?: string
    onUpdate: (field: string, value: any) => void
}

export function AdminNotesSection({ adminNotes, onUpdate }: AdminNotesSectionProps) {
    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📝 Notas del administrador (Aparecen en el PDF)</h3>
            <div className={styles.formGrid}>
                <div className={styles.fullWidth}>
                    <label className={styles.label}>
                        Notas personalizadas para el presupuesto
                        <span className={styles.labelHint}> (Estas notas aparecerán en el PDF para el cliente)</span>
                    </label>
                    <textarea
                        className={styles.textarea}
                        value={adminNotes || ''}
                        onChange={(e) => onUpdate('adminNotes', e.target.value)}
                        placeholder="Ej: Ofrecemos un descuento especial del 10% si confirma antes del 31 de enero..."
                        rows={4}
                    />
                </div>
            </div>
        </div>
    )
}
