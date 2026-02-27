import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FileText, Eye, Calendar, Users, ChevronDown, ChevronUp, MailCheck, Trash2, Plus, Rocket } from 'lucide-react'
import { useBudgets } from '@/hooks/useBudgets'
import { toast } from 'sonner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import type { BudgetsFilters } from '@/services/budgetsService'
import { formatLocalDate } from '@/utils/dateUtils'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface Budget {
  id: string
  order_id: string
  version: number
  status: 'draft' | 'pending_review' | 'approved' | 'APPROVED' | 'sent' | 'rejected' | 'ENVIADO'
  budget_data: any
  pdf_url?: string
  created_at: string
  updated_at: string
  relance_count?: number
}

interface BudgetsListProps {
  onSelectBudget: (budgetId: string) => void
  page: number
  setPage: (page: number) => void
  filters: BudgetsFilters
  setFilters: (filters: BudgetsFilters) => void
}

const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'pending_review', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'sent', label: 'Enviados' },
  { value: 'relance_1', label: 'Relanzado x1', isRelance: true },
  { value: 'relance_2', label: 'Relanzado x2', isRelance: true },
  { value: 'relance_3', label: 'Relanzado x3+', isRelance: true },
  { value: 'rejected', label: 'Rechazados' },
]

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "sent" => {
  switch (status) {
    case 'draft': return 'secondary'
    case 'pending_review': return 'warning'
    case 'approved':
    case 'APPROVED': return 'success'
    case 'sent':
    case 'ENVIADO': return 'sent'
    case 'rejected': return 'destructive'
    default: return 'secondary'
  }
}

export default function BudgetsList({ onSelectBudget, page, setPage, filters, setFilters }: BudgetsListProps) {
  const { budgets, totalCount, pageSize, loading, deleteBudget, createManualBudget } = useBudgets({ page, filters })
  const queryClient = useQueryClient()
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador'
      case 'pending_review': return 'Pendiente'
      case 'approved':
      case 'APPROVED': return 'Aprobado'
      case 'sent': return 'Enviado'
      case 'ENVIADO': return 'Enviado'
      case 'rejected': return 'Rechazado'
      default: return status
    }
  }

  const toggleCard = (budgetId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(budgetId)) newSet.delete(budgetId)
      else newSet.add(budgetId)
      return newSet
    })
  }

  const handleFilterChange = (newFilters: BudgetsFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)
  const [markAsSentModalOpen, setMarkAsSentModalOpen] = useState(false)
  const [budgetToMarkAsSent, setBudgetToMarkAsSent] = useState<string | null>(null)

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

  // Bulk Relance
  const [bulkRelanceModalOpen, setBulkRelanceModalOpen] = useState(false)
  const [isBulkRelancing, setIsBulkRelancing] = useState(false)
  const [selectedBudgets, setSelectedBudgets] = useState<Set<string>>(new Set())

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
      setSelectedBudgets(new Set(budgets.map(b => b.id)))
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

  const totalPages = Math.ceil(totalCount / pageSize)

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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          💰 Presupuestos Generados
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Total: {totalCount}</Badge>
          {filters.status && (filters.status.startsWith('relance_') || filters.status === 'sent') && (
            <Button
              size="sm"
              variant={selectedBudgets.size > 0 ? 'default' : 'outline'}
              onClick={() => setBulkRelanceModalOpen(true)}
              className="gap-1"
            >
              <Rocket className="h-4 w-4" />
              {selectedBudgets.size > 0
                ? `Relanzar seleccionados (${selectedBudgets.size})`
                : `Relanzar a todos (${filters.status === 'sent' ? '1ra vez' : filters.status === 'relance_3' ? '3+' : filters.status.split('_')[1]})`
              }
            </Button>
          )}
          <Button size="sm" onClick={handleCreateManual} className="gap-1">
            <Plus className="h-4 w-4" />
            Crear Presupuesto Manual
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {statusFilters.map(sf => (
          <Button
            key={sf.value}
            variant={(!filters.status || filters.status === 'all') && sf.value === 'all' ? 'default' : filters.status === sf.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange({ ...filters, status: sf.value })}
            className={cn(
              sf.isRelance && "border-indigo-200 text-indigo-700 hover:bg-indigo-50",
              (filters.status === sf.value) && sf.isRelance && "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600"
            )}
          >
            {sf.label}
          </Button>
        ))}

        <div className="ml-auto min-w-[200px]">
          <Input
            type="text"
            placeholder="Buscar por cliente..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          />
        </div>
      </div>

      {/* Select All for Relance */}
      {filters.status && (filters.status.startsWith('relance_') || filters.status === 'sent') && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <Checkbox
              checked={budgets.length > 0 && selectedBudgets.size === budgets.length}
              onCheckedChange={toggleSelectAll}
            />
            Seleccionar todos ({budgets.length})
          </label>
          {selectedBudgets.size > 0 && (
            <span className="text-sm font-semibold text-indigo-700">
              {selectedBudgets.size} seleccionados
            </span>
          )}
        </div>
      )}

      {/* Budgets Grid */}
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
                  <TableHead className="w-12 pl-4">
                    {/* Select All Checkbox rendered outside table usually, leaving space here but could move inside */}
                  </TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead className="text-right">Total TTC</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right pr-4">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets?.map((budget: any) => {
                  const clientInfo = budget.budget_data?.clientInfo || {}
                  const totals = budget.budget_data?.totals || {}
                  const isExpanded = expandedCards.has(budget.id)

                  return (
                    <React.Fragment key={budget.id}>
                      <TableRow
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-muted/50",
                          isExpanded && "bg-muted/20"
                        )}
                        onClick={() => toggleCard(budget.id)}
                        data-state={selectedBudgets.has(budget.id) ? "selected" : undefined}
                      >
                        {/* Checkbox */}
                        <TableCell className="w-12 pl-4" onClick={(e) => e.stopPropagation()}>
                          {filters.status && (filters.status.startsWith('relance_') || filters.status === 'sent') && (
                            <Checkbox
                              checked={selectedBudgets.has(budget.id)}
                              onCheckedChange={() => toggleBudgetSelection(budget.id)}
                              aria-label="Seleccionar presupuesto"
                            />
                          )}
                        </TableCell>

                        {/* Client Info */}
                        <TableCell>
                          <div className="font-medium text-base">{clientInfo.name || 'Cliente'}</div>
                          <div className="text-sm text-muted-foreground">{clientInfo.email}</div>
                          <div className="text-xs text-muted-foreground">{clientInfo.phone}</div>
                        </TableCell>

                        {/* Event Info */}
                        <TableCell>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
                              📅 {formatLocalDate(clientInfo.eventDate)}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
                              👥 {clientInfo.guestCount || 0} pax
                            </Badge>
                            <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
                              {clientInfo.eventType || '-'}
                            </Badge>
                          </div>
                        </TableCell>

                        {/* Amount */}
                        <TableCell className="text-right font-medium whitespace-nowrap">
                          {totals.totalTTC ? `${totals.totalTTC.toFixed(2)} €` : '-'}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Badge variant={getStatusVariant(budget.status)}>
                              {getStatusText(budget.status)}
                            </Badge>
                            {budget.relance_count != null && budget.relance_count > 0 && (
                              <Badge variant="info" className="text-[10px] px-1.5 py-0">
                                {budget.relance_count}x relance
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* Actions Toggle */}
                        <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => { e.stopPropagation(); toggleCard(budget.id); }}
                              aria-label={isExpanded ? 'Contraer' : 'Expandir'}
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={6} className="p-0 border-b">
                            <div className="p-4 sm:p-6 lg:pl-16 space-y-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                {/* Meta Data */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <span><strong className="font-medium">Versión:</strong> v{budget.version}</span>
                                  <span><strong className="font-medium">Creado:</strong> {new Date(budget.created_at).toLocaleDateString('fr-FR')}</span>
                                  {budget.updated_at && (
                                    <span><strong className="font-medium">Actualizado:</strong> {new Date(budget.updated_at).toLocaleDateString('fr-FR')}</span>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => onSelectBudget(budget.id)}>
                                    <Eye className="h-4 w-4 mr-1" /> Ver y Editar
                                  </Button>
                                  {budget.pdf_url && (
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={budget.pdf_url} target="_blank" rel="noopener noreferrer">
                                        <FileText className="h-4 w-4 mr-1" /> Ver PDF
                                      </a>
                                    </Button>
                                  )}
                                  {budget.pdf_url && budget.status !== 'approved' && budget.status !== 'sent' && budget.status !== 'ENVIADO' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => handleMarkAsSentClick(e, budget.id)}
                                      title="Marcar como enviado sin enviar email"
                                    >
                                      <MailCheck className="h-4 w-4 mr-1" /> Marcar Enviado
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground ml-auto md:ml-0"
                                    onClick={(e) => handleDeleteClick(e, budget.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                                  </Button>
                                </div>

                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="flex justify-center items-center gap-4 mt-6 pb-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setBudgetToDelete(null) }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar presupuesto?"
        message="¿Estás seguro de que deseas eliminar este presupuesto y su pedido relacionado permanentemente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
      />
      <ConfirmationModal
        isOpen={markAsSentModalOpen}
        onClose={() => { setMarkAsSentModalOpen(false); setBudgetToMarkAsSent(null) }}
        onConfirm={handleConfirmMarkAsSent}
        title="Marcar como Enviado"
        message="¿Marcar este presupuesto como enviado? Esto actualizará el estado sin enviar email al cliente."
        confirmLabel="Marcar como Enviado"
        variant="info"
      />
      <ConfirmationModal
        isOpen={bulkRelanceModalOpen}
        onClose={() => setBulkRelanceModalOpen(false)}
        onConfirm={handleConfirmBulkRelance}
        title={selectedBudgets.size > 0 ? "Confirmar Relanzamiento Seleccionado" : "Confirmar Relanzamiento Masivo"}
        message={selectedBudgets.size > 0
          ? `¿Estás seguro de que deseas enviar el email de relance a los ${selectedBudgets.size} presupuestos SELECCIONADOS?`
          : `¿Estás seguro de que deseas enviar el email de relance a TODOS los presupuestos en la lista "${filters.status === 'sent' ? 'Enviados (1ra vez)' : filters.status === 'relance_3' ? 'Relanzado 3+ veces' : `Relanzado ${filters.status?.split('_')[1]} ve(ces)`}"?`
        }
        confirmLabel={isBulkRelancing ? "Enviando..." : (selectedBudgets.size > 0 ? "Sí, Relanzar Seleccionados" : "Sí, Relanzar a Todos")}
        variant="warning"
      />
    </div>
  )
}
