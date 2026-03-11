'use client'

import React from 'react'
import { BudgetEditorProps } from './types'
import { useBudgetData } from './hooks/useBudgetData'
import { useBudgetCalculations } from './hooks/useBudgetCalculations'
import { useMaterialSelector } from './hooks/useMaterialSelector'
import { useBudgetModals } from './hooks/useBudgetModals'
import { useBudgetActions } from './hooks/useBudgetActions'
import { ClientInfoSection } from './components/ClientInfoSection'
import { MenuSection } from './components/MenuSection'
import { ServiceSection } from './components/ServiceSection'
import { MaterialSection } from './components/MaterialSection'
import { BoissonsSoftSection } from './components/BoissonsSoftSection'
import { DeplacementSection } from './components/DeplacementSection'
import ExtrasSection from './components/ExtrasSection'
import { TotalsSection } from './components/TotalsSection'
import { BudgetActions } from './components/BudgetActions'
import { AdminNotesSection } from './components/AdminNotesSection'
import { InternalNoteSection } from './components/InternalNoteSection'
import { AddSectionPlaceholder } from './components/AddSectionPlaceholder'
import { BudgetModals } from './components/BudgetModals'
import { MigrationBanner } from './components/MigrationBanner'
import { isEqual } from 'lodash'
import { recalculateTotals } from './utils/budgetCalculations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function BudgetEditor({ budgetId, onBudgetDeleted }: BudgetEditorProps) {
    const {
        modals,
        sectionToDelete,
        openModal,
        closeModal,
        promptDeleteSection,
        closeDeleteSection
    } = useBudgetModals()

    const {
        budget,
        loading,
        error,
        saving,
        internalNotes,
        orderId,
        saveBudget,
        deleteBudget: deleteBudgetApi,
        approveAndSend,
        generatePDF,
        markAsSent,
        addInternalNote,
        deleteInternalNote,
        createLinkedOrder
    } = useBudgetData(budgetId)

    const {
        editedData,
        updateField,
        setEditedData
    } = useBudgetCalculations(budget?.budget_data || null)

    const hasUnsavedChanges = React.useMemo(() => {
        if (!budget?.budget_data || !editedData) return false
        return !isEqual(budget.budget_data, editedData)
    }, [budget?.budget_data, editedData])

    React.useEffect(() => {
        if (budget?.budget_data) {
            const correctedData = recalculateTotals(budget.budget_data)
            setEditedData(correctedData)
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

    const actions = useBudgetActions({
        editedData,
        setEditedData,
        updateField,
        hasUnsavedChanges,
        budget,
        saving,
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
    })

    if (loading) {
        return <div className="text-center p-10 text-lg text-muted-foreground">Cargando presupuesto...</div>
    }

    if (error) {
        return <div className="text-center p-10 text-lg text-destructive">{error}</div>
    }

    if (!editedData) {
        return <div className="text-center p-10 text-lg text-destructive">No se pudo cargar el presupuesto</div>
    }

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'aprobado': return 'success';
            case 'enviado': return 'default';
            case 'rechazado': return 'destructive';
            case 'pendiente_revision': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b-2 border-primary gap-4">
                <h1 className="text-2xl font-semibold text-foreground m-0">Editor de Presupuesto</h1>
                <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(budget?.status || 'draft')} className="uppercase">
                        {budget?.status || 'Borrador'}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground bg-muted">
                        v{budget?.version}
                    </Badge>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={actions.handleDeleteBudget}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title="Eliminar presupuesto"
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <BudgetModals
                modals={modals}
                closeModal={closeModal}
                sectionToDelete={sectionToDelete}
                closeDeleteSection={closeDeleteSection}
                editedData={editedData}
                confirmDeleteBudget={actions.confirmDeleteBudget}
                confirmRemoveSection={actions.confirmRemoveSection}
                confirmApproveAndSend={actions.confirmApproveAndSend}
                confirmMarkAsSent={actions.confirmMarkAsSent}
                pdfPreview={actions.pdfPreview}
                closePdfPreview={actions.closePdfPreview}
                showMaterialSelector={showMaterialSelector}
                setShowMaterialSelector={setShowMaterialSelector}
                availableMaterials={availableMaterials}
                selectedMaterialIds={selectedMaterialIds}
                toggleMaterialSelection={toggleMaterialSelection}
                addSelectedMaterials={() => addSelectedMaterials(editedData, setEditedData)}
                existingItemNames={editedData.material?.items.map((i: any) => i.name) || []}
            />

            <ClientInfoSection data={editedData.clientInfo} onUpdate={updateField} />
            <MenuSection data={editedData.menu} onUpdate={updateField} />

            {editedData.service ? (
                <ServiceSection data={editedData.service} onUpdate={updateField} onDelete={() => actions.removeSection('service')} />
            ) : (
                <AddSectionPlaceholder label="servicio" buttonText="+ Agregar Servicio" onAdd={() => actions.addSection('service', {
                    mozos: 1, hours: 1, pricePerHour: 40, totalHT: 40, tva: 8, tvaPct: 20, totalTTC: 48
                })} />
            )}

            {editedData.material ? (
                <MaterialSection
                    data={editedData.material}
                    deliveryReprise={editedData.deliveryReprise}
                    onUpdate={updateField}
                    onDelete={() => actions.removeSection('material')}
                    onOpenSelector={() => setShowMaterialSelector(true)}
                />
            ) : (
                <AddSectionPlaceholder label="materiales configurados" buttonText="+ Agregar Material" onAdd={() => actions.addSection('material', {
                    items: [], tvaPct: 20, totalHT: 0, tva: 0, totalTTC: 0, insurancePct: 6, insuranceAmount: 0
                })} />
            )}

            {editedData.boissonsSoft ? (
                <BoissonsSoftSection data={editedData.boissonsSoft} onUpdate={updateField} onDelete={() => actions.removeSection('boissonsSoft')} />
            ) : (
                <AddSectionPlaceholder label="bebidas soft configuradas" buttonText="+ Agregar Boissons Soft" onAdd={() => actions.addSection('boissonsSoft', {
                    pricePerPerson: 0, totalPersons: 0, totalHT: 0, tva: 0, tvaPct: 20, totalTTC: 0
                })} />
            )}

            {editedData.deplacement ? (
                <DeplacementSection data={editedData.deplacement} onUpdate={updateField} onDelete={() => actions.removeSection('deplacement')} />
            ) : (
                <AddSectionPlaceholder label="desplazamiento configurado" buttonText="+ Agregar Desplazamiento" onAdd={() => actions.addSection('deplacement', {
                    distance: 0, pricePerKm: 0, totalHT: 0, tva: 0, tvaPct: 20, totalTTC: 0
                })} />
            )}

            {editedData.extras ? (
                <ExtrasSection extras={editedData.extras} onUpdate={updateField} />
            ) : (
                <AddSectionPlaceholder label="extras configurados" buttonText="+ Agregar Extra" onAdd={() => actions.addSection('extras', {
                    items: [], totalHT: 0, totalTVA: 0, totalTTC: 0
                })} />
            )}

            <TotalsSection data={editedData.totals} menuDiscount={editedData.menu.discount} onUpdate={updateField} />

            {!orderId && !loading && (
                <MigrationBanner saving={saving} createLinkedOrder={createLinkedOrder} editedData={editedData} />
            )}

            <InternalNoteSection
                notes={internalNotes}
                orderId={orderId}
                onAdd={addInternalNote}
                onDelete={deleteInternalNote}
                saving={saving}
            />

            <AdminNotesSection adminNotes={editedData.adminNotes} onUpdate={updateField} />

            <BudgetActions
                onSave={actions.handleSave}
                onApproveAndSend={actions.handleApproveAndSend}
                onMarkAsSent={actions.handleMarkAsSent}
                onGeneratePDF={actions.handleGeneratePDF}
                saving={saving}
                hasPdf={!!budget?.pdf_url}
                hasUnsavedChanges={hasUnsavedChanges}
            />
        </div>
    )
}
