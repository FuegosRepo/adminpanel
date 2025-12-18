import React from 'react'
import { Save, CheckCircle2, FileText } from 'lucide-react'
import styles from './BudgetActions.module.css'

interface BudgetActionsProps {
    onSave: () => void
    onApproveAndSend: () => void
    onGeneratePDF: () => void
    saving: boolean
    hasPdf: boolean
    hasUnsavedChanges: boolean
}

export function BudgetActions({ onSave, onApproveAndSend, onGeneratePDF, saving, hasPdf, hasUnsavedChanges }: BudgetActionsProps) {
    return (
        <div className={styles.budgetActions}>
            {hasUnsavedChanges ? (
                <button
                    onClick={onSave}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={saving}
                >
                    <Save size={18} />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            ) : (
                <>
                    <button
                        onClick={onSave}
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        disabled={true}
                    >
                        <Save size={18} />
                        Guardado
                    </button>

                    <button
                        onClick={onGeneratePDF}
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        disabled={saving}
                    >
                        <FileText size={18} />
                        {saving ? 'Generando PDF...' : 'Generar PDF'}
                    </button>
                </>
            )}

            <button
                onClick={onApproveAndSend}
                className={`${styles.btn} ${styles.btnSuccess}`}
                disabled={saving || hasUnsavedChanges || !hasPdf}
                title={hasUnsavedChanges ? 'Primero guarda los cambios' : (!hasPdf ? 'Primero debes generar el PDF' : '')}
            >
                <CheckCircle2 size={18} />
                Enviar Presupuesto
            </button>
        </div>
    )
}
