import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BudgetsFilters } from '@/services/budgetsService'

interface UseBudgetListActionsParams {
  deleteBudget: (id: string) => Promise<void>
  createManualBudget: (data: any) => Promise<any>
  onSelectBudget: (budgetId: string) => void
  budgets: any[]
  filters: BudgetsFilters
}

export function useBudgetListActions({ deleteBudget, createManualBudget, onSelectBudget, budgets, filters }: UseBudgetListActionsParams) {
  const queryClient = useQueryClient()

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)

  // Mark as sent modal
  const [markAsSentModalOpen, setMarkAsSentModalOpen] = useState(false)
  const [budgetToMarkAsSent, setBudgetToMarkAsSent] = useState<string | null>(null)

  // Bulk relance
  const [bulkRelanceModalOpen, setBulkRelanceModalOpen] = useState(false)
  const [isBulkRelancing, setIsBulkRelancing] = useState(false)
  const [selectedBudgets, setSelectedBudgets] = useState<Set<string>>(new Set())

  const handleDeleteClick = (e: React.MouseEvent, budgetId: string) => {
    e.stopPropagation()
    setBudgetToDelete(budgetId)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return
    try {
      await deleteBudget(budgetToDelete)
      toast.success('Presupuesto eliminado correctamente')
      setDeleteModalOpen(false)
      setBudgetToDelete(null)
    } catch (error) {
      console.error('Error eliminando:', error)
      toast.error('Error al eliminar el presupuesto')
    }
  }

  const handleMarkAsSentClick = (e: React.MouseEvent, budgetId: string) => {
    e.stopPropagation()
    setBudgetToMarkAsSent(budgetId)
    setMarkAsSentModalOpen(true)
  }

  const handleConfirmMarkAsSent = async () => {
    if (!budgetToMarkAsSent) return
    try {
      const response = await fetch('/api/mark-budget-as-sent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetId: budgetToMarkAsSent })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      toast.success('✅ Presupuesto marcado como enviado')
      setMarkAsSentModalOpen(false)
      setBudgetToMarkAsSent(null)
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    } catch (error: any) {
      console.error('Error marcando como enviado:', error)
      toast.error(error.message || 'Error al marcar como enviado')
    }
  }

  const toggleBudgetSelection = (id: string, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation()
    setSelectedBudgets(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedBudgets.size === budgets.length && budgets.length > 0) {
      setSelectedBudgets(new Set())
    } else {
      setSelectedBudgets(new Set(budgets.map((b: any) => b.id)))
    }
  }

  const handleConfirmBulkRelance = async () => {
    if (!filters.status || (!filters.status.startsWith('relance_') && filters.status !== 'sent')) return
    setIsBulkRelancing(true)
    try {
      const body: any = { filters }
      if (selectedBudgets.size > 0) body.budgetIds = Array.from(selectedBudgets)

      const response = await fetch('/api/bulk-relance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      toast.success(`✅ ${result.message}`)
      setBulkRelanceModalOpen(false)
      setSelectedBudgets(new Set())
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    } catch (error: any) {
      console.error('Error en relance masivo:', error)
      toast.error(error.message || 'Error al procesar el envío masivo')
    } finally {
      setIsBulkRelancing(false)
    }
  }

  const handleCreateManual = async () => {
    try {
      const newBudget = await createManualBudget({
        status: 'draft',
        budget_data: {
          clientInfo: {
            name: '', email: '', phone: '', eventType: '', eventDate: '', guestCount: 0, address: '', menuType: 'dejeuner'
          },
          menu: { pricePerPerson: 0, totalPersons: 0, totalHT: 0, tvaPct: 10, tva: 0, totalTTC: 0, selectedItems: { entrees: [], viandes: [], desserts: [] } },
          service: null,
          material: { items: [], insurancePct: 6, insuranceAmount: 0, tvaPct: 20, totalHT: 0, tva: 0, totalTTC: 0 },
          deliveryReprise: { deliveryCost: 0, pickupCost: 0, tvaPct: 20, totalHT: 0, tva: 0, totalTTC: 0 },
          boissonsSoft: { pricePerPerson: 0, totalPersons: 0, totalHT: 0, tva: 0, tvaPct: 20, totalTTC: 0 },
          deplacement: null,
          totals: { totalHT: 0, totalTVA: 0, totalTTC: 0, discount: { percentage: 0, amount: 0, reason: '' } },
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          generatedBy: 'manual'
        }
      })
      onSelectBudget(newBudget.id)
      toast.success('Presupuesto creado')
    } catch (err) {
      toast.error('Error creando presupuesto')
    }
  }

  return {
    // Delete
    deleteModalOpen, setDeleteModalOpen,
    budgetToDelete, setBudgetToDelete,
    handleDeleteClick, handleConfirmDelete,
    // Mark as sent
    markAsSentModalOpen, setMarkAsSentModalOpen,
    budgetToMarkAsSent, setBudgetToMarkAsSent,
    handleMarkAsSentClick, handleConfirmMarkAsSent,
    // Bulk relance
    bulkRelanceModalOpen, setBulkRelanceModalOpen,
    isBulkRelancing,
    selectedBudgets, toggleBudgetSelection, toggleSelectAll,
    handleConfirmBulkRelance,
    // Create manual
    handleCreateManual
  }
}
