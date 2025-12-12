import React from 'react'
import { AlertTriangle } from 'lucide-react'
import styles from './ConfirmationModal.module.css'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'danger'
}: ConfirmationModalProps) {
    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                </div>

                <p className={styles.message}>{message}</p>

                <div className={styles.footer}>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={onClose}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`${styles.button} ${styles.confirmButton}`}
                        onClick={() => {
                            onConfirm()
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
