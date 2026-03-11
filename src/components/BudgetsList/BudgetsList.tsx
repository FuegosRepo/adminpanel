import React, { useState } from 'react'
import { FileText } from 'lucide-react'
import { useBudgets } from '@/hooks/useBudgets'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import type { BudgetsFilters } from '@/services/budgetsService'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { useBudgetListActions } from './hooks/useBudgetListActions'
import BudgetsHeader from './components/BudgetsHeader'
import BudgetsFilterBar from './components/BudgetsFilterBar'
import BudgetTableRow from './components/BudgetTableRow'
import BudgetExpandedRow from './components/BudgetExpandedRow'

interface BudgetsListProps {
  onSelectBudget: (budgetId: string) => void
  page: number
  setPage: (page: number) => void
  filters: BudgetsFilters
  setFilters: (filters: BudgetsFilters) => void
}

export default function BudgetsList({ onSelectBudget, page, setPage, filters, setFilters }: BudgetsListProps) {
  const { budgets, totalCount, pageSize, loading, deleteBudget, createManualBudget } = useBudgets({ page, filters })
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const actions = useBudgetListActions({ deleteBudget, createManualBudget, onSelectBudget, budgets, filters })

  const toggleCard = (budgetId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(budgetId)) newSet.delete(budgetId)
      else newSet.add(budgetId)
      return newSet
    })
  }

  const totalPages = Math.ceil(totalCount / pageSize)
  const showCheckbox = !!(filters.status && (filters.status.startsWith('relance_') || filters.status === 'sent'))

  if (loading && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm">Cargando presupuestos...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BudgetsHeader
        totalCount={totalCount}
        filters={filters}
        selectedBudgets={actions.selectedBudgets}
        onBulkRelance={() => actions.setBulkRelanceModalOpen(true)}
        onCreateManual={actions.handleCreateManual}
      />

      <BudgetsFilterBar
        filters={filters}
        setFilters={setFilters}
        setPage={setPage}
        budgetsCount={budgets.length}
        selectedBudgets={actions.selectedBudgets}
        toggleSelectAll={actions.toggleSelectAll}
      />

      {budgets.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No hay presupuestos</h3>
          <p className="text-sm">Los presupuestos generados aparecerán aquí automáticamente</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12 pl-4"></TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-right">Total TTC</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right pr-4">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets?.map((budget: any) => {
                  const isExpanded = expandedCards.has(budget.id)

                  return (
                    <React.Fragment key={budget.id}>
                      <BudgetTableRow
                        budget={budget}
                        isExpanded={isExpanded}
                        isSelected={actions.selectedBudgets.has(budget.id)}
                        showCheckbox={showCheckbox}
                        onToggleExpand={() => toggleCard(budget.id)}
                        onToggleSelection={() => actions.toggleBudgetSelection(budget.id)}
                      />
                      {isExpanded && (
                        <BudgetExpandedRow
                          budget={budget}
                          onSelectBudget={onSelectBudget}
                          onMarkAsSentClick={actions.handleMarkAsSentClick}
                          onDeleteClick={actions.handleDeleteClick}
                        />
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {totalCount > pageSize && (
            <div className="flex justify-center items-center gap-4 mt-6 pb-4">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmationModal
        isOpen={actions.deleteModalOpen}
        onClose={() => { actions.setDeleteModalOpen(false); actions.setBudgetToDelete(null) }}
        onConfirm={actions.handleConfirmDelete}
        title="¿Eliminar presupuesto?"
        message="¿Estás seguro de que deseas eliminar este presupuesto y su pedido relacionado permanentemente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
      />
      <ConfirmationModal
        isOpen={actions.markAsSentModalOpen}
        onClose={() => { actions.setMarkAsSentModalOpen(false); actions.setBudgetToMarkAsSent(null) }}
        onConfirm={actions.handleConfirmMarkAsSent}
        title="Marcar como Enviado"
        message="¿Marcar este presupuesto como enviado? Esto actualizará el estado sin enviar email al cliente."
        confirmLabel="Marcar como Enviado"
        variant="info"
      />
      <ConfirmationModal
        isOpen={actions.bulkRelanceModalOpen}
        onClose={() => actions.setBulkRelanceModalOpen(false)}
        onConfirm={actions.handleConfirmBulkRelance}
        title={actions.selectedBudgets.size > 0 ? "Confirmar Relanzamiento Seleccionado" : "Confirmar Relanzamiento Masivo"}
        message={actions.selectedBudgets.size > 0
          ? `¿Estás seguro de que deseas enviar el email de relance a los ${actions.selectedBudgets.size} presupuestos SELECCIONADOS?`
          : `¿Estás seguro de que deseas enviar el email de relance a TODOS los presupuestos en la lista "${filters.status === 'sent' ? 'Enviados (1ra vez)' : filters.status === 'relance_3' ? 'Relanzado 3+ veces' : `Relanzado ${filters.status?.split('_')[1]} ve(ces)`}"?`
        }
        confirmLabel={actions.isBulkRelancing ? "Enviando..." : (actions.selectedBudgets.size > 0 ? "Sí, Relanzar Seleccionados" : "Sí, Relanzar a Todos")}
        variant="warning"
      />
    </div>
  )
}
