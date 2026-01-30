'use client'

import React, { useEffect } from 'react'
import styles from './PDFPreviewModal.module.css'

interface PDFPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    pdfBlobUrl: string | null
    filename: string
}

export function PDFPreviewModal({ isOpen, onClose, pdfBlobUrl, filename }: PDFPreviewModalProps) {
    // ✅ Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen || !pdfBlobUrl) return null

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = pdfBlobUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>📄 {filename}</h2>
                    <div className={styles.actions}>
                        <button onClick={handleDownload} className={styles.downloadBtn}>
                            ⬇️ Descargar
                        </button>
                        <button onClick={onClose} className={styles.closeBtn}>
                            ✕
                        </button>
                    </div>
                </div>
                <div className={styles.content}>
                    <iframe
                        src={pdfBlobUrl}
                        className={styles.pdfViewer}
                        title="PDF Preview"
                    />
                </div>
            </div>
        </div>
    )
}
