import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
    // ✅ Track if component is mounted on client
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // ✅ Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // ✅ Don't render on server or when not open
    if (!mounted || !isOpen) return null

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
            case 'danger': return styles.iconContainer
            case 'warning': return `${styles.iconContainer} ${styles.headerWarning}`
            case 'success': return `${styles.iconContainer} ${styles.headerSuccess}`
            case 'info': return `${styles.iconContainer} ${styles.headerInfo}`
            default: return styles.iconContainer
        }
    }

    const getConfirmButtonStyle = () => {
        switch (variant) {
            case 'danger': return styles.confirmButton
            case 'warning': return `${styles.button} ${styles.buttonWarning}`
            case 'success': return `${styles.button} ${styles.buttonSuccess}`
            case 'info': return `${styles.button} ${styles.buttonInfo}`
            default: return styles.confirmButton
        }
    }

    // ✅ Render modal using React Portal at document.body level (client-side only)
    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={getIconContainerStyle()}>
                        {getIcon()}
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                </div>

                <p className={styles.message}>
                    {message.split('\\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            {i < message.split('\\n').length - 1 && <br />}
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
                        }}
                    >
                        {confirmLabel || (type === 'alert' ? 'Entendido' : 'Confirmar')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
