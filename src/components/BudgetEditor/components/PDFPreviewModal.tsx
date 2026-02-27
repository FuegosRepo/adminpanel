'use client'

import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'

interface PDFPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    pdfBlobUrl: string | null
    filename: string
}

export function PDFPreviewModal({ isOpen, onClose, pdfBlobUrl, filename }: PDFPreviewModalProps) {
    if (!pdfBlobUrl) return null

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = pdfBlobUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-6xl w-[95vw] h-[95vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-muted/10 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="flex items-center gap-2 text-xl truncate pr-4">
                        <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="truncate" title={filename}>{filename}</span>
                    </DialogTitle>
                    <Button onClick={handleDownload} className="shrink-0">
                        <Download className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Descargar</span>
                    </Button>
                </DialogHeader>

                <div className="flex-1 w-full bg-black/5 p-4 sm:p-6 pb-6">
                    <iframe
                        src={pdfBlobUrl}
                        className="w-full h-full rounded-md shadow-md bg-white"
                        title="PDF Preview"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
