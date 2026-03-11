import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UseBudgetActionsParams {
  editedData: any
  setEditedData: (data: any) => void
  updateField: (field: string, value: any) => void
  hasUnsavedChanges: boolean
  budget: any
  saving: boolean
  saveBudget: (data: any) => Promise<any>
  deleteBudgetApi: () => Promise<{ success: boolean; error?: string }>
  approveAndSend: (email: string, name: string) => Promise<any>
  generatePDF: (data: any) => Promise<any>
  markAsSent: () => Promise<any>
  onBudgetDeleted?: () => void
  openModal: (name: string) => void
  closeModal: (name: string) => void
  promptDeleteSection: (section: string) => void
  closeDeleteSection: () => void
  sectionToDelete: string | null
}

export function useBudgetActions({
  editedData,
  setEditedData,
  updateField,
  hasUnsavedChanges,
  budget,
  saveBudget,
  deleteBudgetApi,
  approveAndSend,
  generatePDF,
  markAsSent,
  onBudgetDeleted,
  openModal,
  closeModal,
  promptDeleteSection,
  closeDeleteSection,
  sectionToDelete,
}: UseBudgetActionsParams) {
  const queryClient = useQueryClient()
  const [pdfPreview, setPdfPreview] = useState<{ blobUrl: string; filename: string } | null>(null)

  const handleSave = async () => {
    await saveBudget(editedData)
  }

  const handleApproveAndSend = async () => {
    if (hasUnsavedChanges) {
      toast.error('⚠️ Tienes cambios sin guardar. Por favor guarda el presupuesto antes de aprobar.')
      return
    }
    if (!budget?.pdf_url) {
      toast.error('⚠️ Por favor genera el PDF antes de aprobar y enviar')
      return
    }
    openModal('confirmApprove')
  }

  const confirmApproveAndSend = async () => {
    const result = await approveAndSend(editedData.clientInfo.email, editedData.clientInfo.name)
    if (result.success) {
      if (result.result.note) {
        const message = result.result.warning
          ? `⚠️ ${result.result.note}`
          : `⚠️ ${result.result.note}\n\nPDF: ${result.result.pdfUrl}`
        toast.success('Presupuesto aprobado exitosamente', { description: message })
      } else {
        toast.success('✅ Presupuesto aprobado y enviado al cliente por email')
      }
    } else {
      toast.error(`❌ Error al aprobar presupuesto: ${result.error}`)
    }
    closeModal('confirmApprove')
  }

  const handleDeleteBudget = async () => {
    openModal('deleteBudget')
  }

  const confirmDeleteBudget = async () => {
    const result = await deleteBudgetApi()
    if (result.success) {
      toast.success('✅ Presupuesto eliminado correctamente')
      if (onBudgetDeleted) {
        onBudgetDeleted()
      } else {
        queryClient.invalidateQueries({ queryKey: ['budgets'] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
      }
    } else {
      toast.error('❌ Error al eliminar el presupuesto')
    }
    closeModal('deleteBudget')
  }

  const handleGeneratePDF = async () => {
    if (hasUnsavedChanges) {
      toast.error('⚠️ Tienes cambios sin guardar. Por favor guarda antes de generar el PDF.')
      return
    }

    const loadingToast = toast.loading('Generando PDF... ⏳')
    const result = await generatePDF(editedData)
    toast.dismiss(loadingToast)

    if (result.success) {
      if (result.pdfBlob) {
        const blobUrl = URL.createObjectURL(result.pdfBlob)
        const filename = result.pdfFilename || `Devis_${editedData.clientInfo.name.replace(/\s+/g, '_')}.pdf`
        setPdfPreview({ blobUrl, filename })
      } else if ('pdfUrl' in result && result.pdfUrl) {
        window.open(result.pdfUrl as string, '_blank')
      }
      toast.success('PDF generado ✅')
    } else {
      toast.error(`Error al generar PDF: ${result.error}`)
    }
  }

  const closePdfPreview = () => {
    if (pdfPreview?.blobUrl) {
      URL.revokeObjectURL(pdfPreview.blobUrl)
    }
    setPdfPreview(null)
  }

  const handleMarkAsSent = async () => {
    if (hasUnsavedChanges) {
      toast.error('⚠️ Tienes cambios sin guardar. Por favor guarda el presupuesto antes de marcar como enviado.')
      return
    }
    if (!budget?.pdf_url) {
      toast.error('⚠️ Por favor genera el PDF antes de marcar como enviado')
      return
    }
    openModal('confirmSent')
  }

  const confirmMarkAsSent = async () => {
    const result = await markAsSent()
    if (result.success) {
      toast.success('✅ Presupuesto marcado como enviado correctamente')
    } else {
      toast.error(`❌ Error al marcar como enviado: ${result.error}`)
    }
    closeModal('confirmSent')
  }

  const addSection = (sectionName: string, initialData: any) => {
    updateField(sectionName, initialData)
  }

  const removeSection = (sectionName: string) => {
    promptDeleteSection(sectionName)
  }

  const confirmRemoveSection = () => {
    if (sectionToDelete) {
      const newData = { ...editedData }
      // @ts-expect-error: Dynamic key access on BudgetData
      delete newData[sectionToDelete]
      setEditedData(newData)
    }
    closeDeleteSection()
  }

  return {
    pdfPreview,
    handleSave,
    handleApproveAndSend,
    confirmApproveAndSend,
    handleDeleteBudget,
    confirmDeleteBudget,
    handleGeneratePDF,
    closePdfPreview,
    handleMarkAsSent,
    confirmMarkAsSent,
    addSection,
    removeSection,
    confirmRemoveSection,
  }
}
