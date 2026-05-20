import ConfirmationModal from "@/components/common/ConfirmationModal";
import { PDFPreviewModal } from "./PDFPreviewModal";
import { MaterialSelectorModal } from "./MaterialSelectorModal";
import type { BudgetModalsState } from "../hooks/useBudgetModals";

interface BudgetModalsProps {
	modals: {
		deleteBudget: boolean;
		deleteSection: boolean;
		confirmApprove: boolean;
		confirmSent: boolean;
	};
	closeModal: (name: keyof BudgetModalsState) => void;
	sectionToDelete: string | null;
	closeDeleteSection: () => void;
	editedData: any;
	// Confirm handlers
	confirmDeleteBudget: () => void;
	confirmRemoveSection: () => void;
	confirmApproveAndSend: () => void;
	confirmMarkAsSent: () => void;
	// PDF Preview
	pdfPreview: { blobUrl: string; filename: string } | null;
	closePdfPreview: () => void;
	// Material Selector
	showMaterialSelector: boolean;
	setShowMaterialSelector: (show: boolean) => void;
	availableMaterials: any[];
	selectedMaterialIds: string[];
	toggleMaterialSelection: (id: string) => void;
	addSelectedMaterials: () => void;
	existingItemNames: string[];
}

export function BudgetModals({
	modals,
	closeModal,
	sectionToDelete,
	closeDeleteSection,
	editedData,
	confirmDeleteBudget,
	confirmRemoveSection,
	confirmApproveAndSend,
	confirmMarkAsSent,
	pdfPreview,
	closePdfPreview,
	showMaterialSelector,
	setShowMaterialSelector,
	availableMaterials,
	selectedMaterialIds,
	toggleMaterialSelection,
	addSelectedMaterials,
	existingItemNames,
}: BudgetModalsProps) {
	return (
		<>
			<MaterialSelectorModal
				isOpen={showMaterialSelector}
				onClose={() => setShowMaterialSelector(false)}
				availableMaterials={availableMaterials}
				selectedMaterialIds={selectedMaterialIds}
				onToggleSelection={toggleMaterialSelection}
				onAddSelected={addSelectedMaterials}
				existingItemNames={existingItemNames}
			/>

			<PDFPreviewModal
				isOpen={pdfPreview !== null}
				onClose={closePdfPreview}
				pdfBlobUrl={pdfPreview?.blobUrl || null}
				filename={pdfPreview?.filename || "Devis.pdf"}
			/>

			<ConfirmationModal
				isOpen={modals.deleteBudget}
				onClose={() => closeModal("deleteBudget")}
				onConfirm={confirmDeleteBudget}
				title="¿Eliminar presupuesto?"
				message="¿Estás seguro de que deseas eliminar este presupuesto permanentemente?\n\nEsta acción es irreversible y eliminará tanto el presupuesto como el pedido relacionado en ambas secciones para mantener la sincronización."
				confirmLabel="Eliminar"
				variant="danger"
			/>

			<ConfirmationModal
				isOpen={modals.deleteSection}
				onClose={closeDeleteSection}
				onConfirm={confirmRemoveSection}
				title={`¿Eliminar sección ${sectionToDelete}?`}
				message={`¿Estás seguro de que deseas eliminar la sección de ${sectionToDelete}?`}
				confirmLabel="Eliminar"
				variant="warning"
			/>

			<ConfirmationModal
				isOpen={modals.confirmApprove}
				onClose={() => closeModal("confirmApprove")}
				onConfirm={confirmApproveAndSend}
				title="Enviar Presupuesto"
				message={`¿Estás seguro de enviar este presupuesto?\n\nCliente: ${editedData.clientInfo.name}\nEmail: ${editedData.clientInfo.email}\nTotal: ${editedData.totals.totalTTC.toFixed(2)}€\n\nSe enviará por email al cliente.`}
				confirmLabel="Enviar Presupuesto"
				variant="info"
			/>

			<ConfirmationModal
				isOpen={modals.confirmSent}
				onClose={() => closeModal("confirmSent")}
				onConfirm={confirmMarkAsSent}
				title="Marcar como Enviado"
				message={`¿Marcar este presupuesto como enviado?\n\nEsto actualizará el estado sin enviar email al cliente.\n\nCliente: ${editedData.clientInfo.name}\nEmail: ${editedData.clientInfo.email}\nTotal: ${editedData.totals.totalTTC.toFixed(2)}€`}
				confirmLabel="Marcar como Enviado"
				variant="info"
			/>
		</>
	);
}
