import React from 'react'
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'
import styles from './ConfirmationModal.module.css'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning' | 'info' | 'success'
    type?: 'confirm' | 'alert'
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'danger',
    type = 'confirm'
}: ConfirmationModalProps) {
    if (!isOpen) return null

    const getIcon = () => {
        switch (variant) {
            case 'danger': return <AlertTriangle size={24} />
            case 'warning': return <AlertTriangle size={24} />
            case 'success': return <CheckCircle size={24} />
            case 'info': return <Info size={24} />
            default: return <AlertTriangle size={24} />
        }
    }

    const getIconContainerStyle = () => {
        switch (variant) {
            case 'danger': return styles.iconContainer // default red
            case 'warning': return `${styles.iconContainer} ${styles.headerWarning}`
            case 'success': return `${styles.iconContainer} ${styles.headerSuccess}`
            case 'info': return `${styles.iconContainer} ${styles.headerInfo}`
            default: return styles.iconContainer
        }
    }

    const getConfirmButtonStyle = () => {
        switch (variant) {
            case 'danger': return styles.confirmButton // default red
            case 'warning': return `${styles.button} ${styles.buttonWarning}`
            case 'success': return `${styles.button} ${styles.buttonSuccess}`
            case 'info': return `${styles.button} ${styles.buttonInfo}`
            default: return styles.confirmButton
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={getIconContainerStyle()}>
                        {getIcon()}
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                </div>

                <p className={styles.message}>
                    {message.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            {i < message.split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>

                <div className={styles.footer}>
                    {type === 'confirm' && (
                        <button
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={onClose}
                        >
                            {cancelLabel}
                        </button>
                    )}
                    <button
                        className={getConfirmButtonStyle()}
                        onClick={() => {
                            onConfirm()
                            // If it's an alert, we might want to close it automatically on confirm here, 
                            // but usually the caller handles the logic. 
                            // However, strictly, onConfirm is just the callback.
                        }}
                    >
                        {confirmLabel || (type === 'alert' ? 'Entendido' : 'Confirmar')}
                    </button>
                </div>
            </div>
        </div>
    )
}
