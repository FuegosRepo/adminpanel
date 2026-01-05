'use client'

import React, { useState, useEffect } from 'react' // ✅ Added useState, useEffect
import { useRouter } from 'next/navigation' // ✅ Added useRouter
import { BudgetEditorProps } from './types'
import { useBudgetData } from './hooks/useBudgetData'
import { useBudgetCalculations } from './hooks/useBudgetCalculations'
import { useMaterialSelector } from './hooks/useMaterialSelector'
import { ClientInfoSection } from './components/ClientInfoSection'
import { MenuSection } from './components/MenuSection'
import { ServiceSection } from './components/ServiceSection'
import { MaterialSection } from './components/MaterialSection'
import { DeliveryRepriseSection } from './components/DeliveryRepriseSection'
import { BoissonsSoftSection } from './components/BoissonsSoftSection'
import { DeplacementSection } from './components/DeplacementSection'
import ExtrasSection from './components/ExtrasSection'
import { TotalsSection } from './components/TotalsSection'
import { BudgetActions } from './components/BudgetActions'
import { MaterialSelectorModal } from './components/MaterialSelectorModal'
import { AdminNotesSection } from './components/AdminNotesSection'
import ConfirmationModal from '@/components/common/ConfirmationModal' // ✅ Added
import { toast } from 'sonner' // ✅ Added
import { isEqual } from 'lodash'
import styles from './BudgetEditor.module.css'

export function BudgetEditor({ budgetId, onBudgetDeleted }: BudgetEditorProps) {
    // ✅ Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteSectionModalOpen, setDeleteSectionModalOpen] = useState(false)
    const [sectionToDelete, setSectionToDelete] = useState<string | null>(null)
    const [confirmBeforeApproveModalOpen, setConfirmBeforeApproveModalOpen] = useState(false)
    const [confirmMarkAsSentModalOpen, setConfirmMarkAsSentModalOpen] = useState(false)

    const {
        budget,
        loading,
        error,
        saving,
        saveBudget,
        deleteBudget: deleteBudgetApi,
        approveAndSend,
        generatePDF,
        markAsSent
    } = useBudgetData(budgetId)

    const {
        editedData,
        updateField,
        setEditedData
    } = useBudgetCalculations(budget?.budget_data || null)

    // Detectar cambios no guardados
    const hasUnsavedChanges = React.useMemo(() => {
        if (!budget?.budget_data || !editedData) return false
        return !isEqual(budget.budget_data, editedData)
    }, [budget?.budget_data, editedData])

    // Sincronizar datos cuando se carga el presupuesto
    React.useEffect(() => {
        if (budget?.budget_data) {
            setEditedData(budget.budget_data)
        }
    }, [budget, setEditedData])

    const {
        availableMaterials,
        showMaterialSelector,
        setShowMaterialSelector,
        selectedMaterialIds,
        toggleMaterialSelection,
        addSelectedMaterials
    } = useMaterialSelector()

    if (loading) {
        return <div className={styles.loading}>Cargando presupuesto...</div>
    }

    if (error) {
        return <div className={styles.error}>{error}</div>
    }

    if (!editedData) {
        return <div className={styles.error}>No se pudo cargar el presupuesto</div>
    }

    const handleSave = async () => {
        await saveBudget(editedData)
    }

    const handleApproveAndSend = async () => {
        if (hasUnsavedChanges) {
            toast.error('⚠️ Tienes cambios sin guardar. Por favor guarda el presupuesto antes de aprobar.')  // ✅ Toast
            return
        }

        if (!budget?.pdf_url) {
            toast.error('⚠️ Por favor genera el PDF antes de aprobar y enviar')  // ✅ Toast
            return
        }

        // ✅ Open confirmation modal instead of window.confirm
        setConfirmBeforeApproveModalOpen(true)
    }

    const confirmApproveAndSend = async () => {
        const result = await approveAndSend(editedData.clientInfo.email, editedData.clientInfo.name)
        if (result.success) {
            if (result.result.note) {
                const message = result.result.warning
                    ? `⚠️ ${result.result.note}`
                    : `⚠️ ${result.result.note}\n\nPDF: ${result.result.pdfUrl}`
                toast.success('Presupuesto aprobado exitosamente', { description: message })  // ✅ Toast with description
            } else {
                toast.success('✅ Presupuesto aprobado y enviado al cliente por email')  // ✅ Toast
            }
        } else {
            toast.error(`❌ Error al aprobar presupuesto: ${result.error}`)  // ✅ Toast
        }
        setConfirmBeforeApproveModalOpen(false)
    }

    const handleDeleteBudget = async () => {
        // ✅ Open modal instead of window.confirm
        setDeleteModalOpen(true)
    }

    const confirmDeleteBudget = async () => {
        const result = await deleteBudgetApi()
        if (result.success) {
            toast.success('✅ Presupuesto eliminado correctamente')  // ✅ Toast
            if (onBudgetDeleted) {
                onBudgetDeleted()
            } else {
                window.location.reload()
            }
        } else {
            toast.error('❌ Error al eliminar el presupuesto')  // ✅ Toast
        }
        setDeleteModalOpen(false)
    }

    const handleGeneratePDF = async () => {
        if (hasUnsavedChanges) {
            toast.error('⚠️ Tienes cambios sin guardar. Por favor guarda antes de generar el PDF.')  // ✅ Toast
            return
        }

        const result = await generatePDF(editedData)
        if (result.success && result.pdfUrl) {
            console.log('✅ PDF generado:', result.pdfUrl)
            const pdfUrlWithCache = `${result.pdfUrl}${result.pdfUrl.includes('?') ? '&' : '?'}_=${Date.now()}`

            // Usar un enlace temporal para evitar bloqueadores de popups
            const link = document.createElement('a')
            link.href = pdfUrlWithCache
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else {
            toast.error(`Error al generar PDF: ${result.error}`)  // ✅ Toast
        }
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

        setConfirmMarkAsSentModalOpen(true)
    }

    const confirmMarkAsSent = async () => {
        const result = await markAsSent()
        if (result.success) {
            toast.success('✅ Presupuesto marcado como enviado correctamente')
        } else {
            toast.error(`❌ Error al marcar como enviado: ${result.error}`)
        }
        setConfirmMarkAsSentModalOpen(false)
    }

    // Handlers para agregar/eliminar secciones
    const addSection = (sectionName: string, initialData: any) => {
        updateField(sectionName, initialData)
    }

    const removeSection = (sectionName: string) => {
        // ✅ Open modal instead of window.confirm
        setSectionToDelete(sectionName)
        setDeleteSectionModalOpen(true)
    }

    const confirmRemoveSection = () => {
        if (sectionToDelete) {
            const newData = { ...editedData }
            // @ts-expect-error: Dynamic key access on BudgetData
            delete newData[sectionToDelete]
            setEditedData(newData) // Esto recalculará totales en el hook
        }
        setDeleteSectionModalOpen(false)
        setSectionToDelete(null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Editor de Presupuesto</h1>
                <div className={styles.statusContainer}>
                    <span className={`${styles.statusBadge} ${styles[`status${(budget?.status || 'draft').charAt(0).toUpperCase() + (budget?.status || 'draft').slice(1)}`]}`}>
                        {budget?.status || 'Borrador'}
                    </span>
                    <span className={styles.versionBadge}>v{budget?.version}</span>
                    <button
                        onClick={handleDeleteBudget}
                        className={styles.deleteBudgetBtn}
                        title="Eliminar presupuesto"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <MaterialSelectorModal
                isOpen={showMaterialSelector}
                onClose={() => setShowMaterialSelector(false)}
                availableMaterials={availableMaterials}
                selectedMaterialIds={selectedMaterialIds}
                onToggleSelection={toggleMaterialSelection}
                onAddSelected={() => addSelectedMaterials(editedData, setEditedData)}  // ✅ Fixed: onAddSelected + setEditedData
                existingItemNames={editedData.material?.items.map(i => i.name) || []}  // ✅ Added missing prop
            />

            {/* ✅ Delete Budget Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteBudget}
                title="¿Eliminar presupuesto?"
                message="¿Estás seguro de que deseas eliminar este presupuesto permanentemente?\n\nEsta acción es irreversible y eliminará tanto el presupuesto como el pedido relacionado en ambas secciones para mantener la sincronización."
                confirmLabel="Eliminar"
                variant="danger"
            />

            {/* ✅ Delete Section Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteSectionModalOpen}
                onClose={() => {
                    setDeleteSectionModalOpen(false)
                    setSectionToDelete(null)
                }}
                onConfirm={confirmRemoveSection}
                title={`¿Eliminar sección ${sectionToDelete}?`}
                message={`¿Estás seguro de que deseas eliminar la sección de ${sectionToDelete}?`}
                confirmLabel="Eliminar"
                variant="warning"
            />

            {/* ✅ Approve and Send Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmBeforeApproveModalOpen}
                onClose={() => setConfirmBeforeApproveModalOpen(false)}
                onConfirm={confirmApproveAndSend}
                title="Enviar Presupuesto"
                message={`¿Estás seguro de enviar este presupuesto?\n\nCliente: ${editedData.clientInfo.name}\nEmail: ${editedData.clientInfo.email}\nTotal: ${editedData.totals.totalTTC.toFixed(2)}€\n\nSe enviará por email al cliente.`}
                confirmLabel="Enviar Presupuesto"
                variant="info"
            />

            {/* ✅ Mark as Sent Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmMarkAsSentModalOpen}
                onClose={() => setConfirmMarkAsSentModalOpen(false)}
                onConfirm={confirmMarkAsSent}
                title="Marcar como Enviado"
                message={`¿Marcar este presupuesto como enviado?\n\nEsto actualizará el estado sin enviar email al cliente.\n\nCliente: ${editedData.clientInfo.name}\nEmail: ${editedData.clientInfo.email}\nTotal: ${editedData.totals.totalTTC.toFixed(2)}€`}
                confirmLabel="Marcar como Enviado"
                variant="info"
            />

            <ClientInfoSection
                data={editedData.clientInfo}
                onUpdate={updateField}
            />

            <MenuSection
                data={editedData.menu}
                onUpdate={updateField}
            />

            {editedData.service ? (
                <ServiceSection
                    data={editedData.service}
                    onUpdate={updateField}
                    onDelete={() => removeSection('service')}
                />
            ) : (
                <div className={`${styles.section} ${styles.addSectionContainer}`}>
                    <p>No hay servicio configurado</p>
                    <button
                        className={styles.addSectionBtn}
                        onClick={() => addSection('service', {
                            mozos: 1,
                            hours: 1,
                            pricePerHour: 40,
                            totalHT: 40,
                            tva: 8,
                            tvaPct: 20,
                            totalTTC: 48
                        })}
                    >
                        ➕ Agregar Servicio
                    </button>
                </div>
            )}

            {editedData.material ? (
                <MaterialSection
                    data={editedData.material}
                    deliveryReprise={editedData.deliveryReprise}
                    onUpdate={updateField}
                    onDelete={() => removeSection('material')}
                    onOpenSelector={() => setShowMaterialSelector(true)}
                />
            ) : (
                <div className={`${styles.section} ${styles.addSectionContainer}`}>
                    <p>No hay materiales configurados</p>
                    <button
                        className={styles.addSectionBtn}
                        onClick={() => addSection('material', {
                            items: [], tvaPct: 20, totalHT: 0, tva: 0, totalTTC: 0, insurancePct: 6, insuranceAmount: 0
                        })}
                    >
                        ➕ Agregar Material
                    </button>
                </div>
            )}

            {/* {editedData.deliveryReprise ? (
                <DeliveryRepriseSection
                    data={editedData.deliveryReprise}
                    onUpdate={updateField}
                    onDelete={() => removeSection('deliveryReprise')}
                />
            ) : (
                <div className={`${styles.section} ${styles.addSectionContainer}`}>
                    <p>No hay entrega/recogida configurada</p>
                    <button
                        className={styles.addSectionBtn}
                        onClick={() => addSection('deliveryReprise', {
                            deliveryCost: 0, pickupCost: 0, totalHT: 0, tva: 0, tvaPct: 20, totalTTC: 0
                        })}
                    >
                        ➕ Agregar Entrega/Recogida
                    </button>
                </div>
            )} */}

            {editedData.boissonsSoft ? (
                <BoissonsSoftSection
                    data={editedData.boissonsSoft}
                    onUpdate={updateField}
                    onDelete={() => removeSection('boissonsSoft')}
                />
            ) : (
                <div className={`${styles.section} ${styles.addSectionContainer}`}>
                    <p>No hay bebidas soft configuradas</p>
                    <button
                        className={styles.addSectionBtn}
                        onClick={() => addSection('boissonsSoft', {
                            pricePerPerson: 0, totalPersons: 0, totalHT: 0, tva: 0, tvaPct: 20, totalTTC: 0
                        })}
                    >
                        ➕ Agregar Boissons Soft
                    </button>
                </div>
            )}

            {editedData.deplacement ? (
                <DeplacementSection
                    data={editedData.deplacement}
                    onUpdate={updateField}
                    onDelete={() => removeSection('deplacement')}
                />
            ) : (
                <div className={`${styles.section} ${styles.addSectionContainer}`}>
                    <p>No hay desplazamiento configurado</p>
                    <button
                        className={styles.addSectionBtn}
                        onClick={() => addSection('deplacement', {
                            distance: 0, pricePerKm: 0, totalHT: 0, tva: 0, tvaPct: 20, totalTTC: 0
                        })}
                    >
                        ➕ Agregar Desplazamiento
                    </button>
                </div>
            )}

            {/* Extras Section */}
            {editedData.extras ? (
                <ExtrasSection
                    extras={editedData.extras}
                    onUpdate={updateField}
                />
            ) : (
                <div className={`${styles.section} ${styles.addSectionContainer}`}>
                    <p>No hay extras configurados</p>
                    <button
                        className={styles.addSectionBtn}
                        onClick={() => addSection('extras', {
                            items: [],
                            totalHT: 0,
                            totalTVA: 0,
                            totalTTC: 0
                        })}
                    >
                        ➕ Agregar Extra
                    </button>
                </div>
            )}

            <TotalsSection
                data={editedData.totals}
                onUpdate={updateField}
            />

            <AdminNotesSection
                adminNotes={editedData.adminNotes}
                onUpdate={updateField}
            />

            <BudgetActions
                onSave={handleSave}
                onApproveAndSend={handleApproveAndSend}
                onMarkAsSent={handleMarkAsSent}
                onGeneratePDF={handleGeneratePDF}
                saving={saving}
                hasPdf={!!budget?.pdf_url}
                hasUnsavedChanges={hasUnsavedChanges}
            />
        </div>
    )
}
