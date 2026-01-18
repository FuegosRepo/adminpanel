import { useState } from 'react'

export type BudgetModalsState = {
    deleteBudget: boolean
    deleteSection: boolean
    confirmApprove: boolean
    confirmSent: boolean
    materialSelector: boolean
}

export function useBudgetModals() {
    const [modals, setModals] = useState<BudgetModalsState>({
        deleteBudget: false,
        deleteSection: false,
        confirmApprove: false,
        confirmSent: false,
        materialSelector: false
    })

    const [sectionToDelete, setSectionToDelete] = useState<string | null>(null)

    const openModal = (modal: keyof BudgetModalsState) => {
        setModals(prev => ({ ...prev, [modal]: true }))
    }

    const closeModal = (modal: keyof BudgetModalsState) => {
        setModals(prev => ({ ...prev, [modal]: false }))
    }

    const promptDeleteSection = (section: string) => {
        setSectionToDelete(section)
        openModal('deleteSection')
    }

    const closeDeleteSection = () => {
        setSectionToDelete(null)
        closeModal('deleteSection')
    }

    return {
        modals,
        sectionToDelete,
        openModal,
        closeModal,
        promptDeleteSection,
        closeDeleteSection
    }
}
