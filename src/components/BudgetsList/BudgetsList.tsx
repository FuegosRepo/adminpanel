import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'  // ✅ Add for cache invalidation
import { FileText, Eye, Clock, CheckCircle, Send, XCircle, Trash2, Mail, Calendar, Users, ChevronDown, ChevronUp, MailCheck } from 'lucide-react'
import './BudgetsList.css'
import { useBudgets } from '@/hooks/useBudgets'
import { toast } from 'sonner'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import type { BudgetsFilters } from '@/services/budgetsService'

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
  // ✅ Props para persistir paginación desde el padre
  page: number
  setPage: (page: number) => void
  filters: BudgetsFilters
  setFilters: (filters: BudgetsFilters) => void
}

export default function BudgetsList({ onSelectBudget, page, setPage, filters, setFilters }: BudgetsListProps) {
  const { budgets, totalCount, pageSize, loading, deleteBudget, createManualBudget } = useBudgets({ page, filters })
  const queryClient = useQueryClient()  // ✅ For cache invalidation
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Borrador'
      case 'pending_review':
        return 'Pendiente'
      case 'approved':
      case 'APPROVED':  // ✅ Handle uppercase
        return 'Aprobado'
      case 'sent':
        return 'Enviado'
      case 'ENVIADO':
        return 'Enviado'
      case 'rejected':
        return 'Rechazado'
      default:
        return status
    }
  }

  const toggleCard = (budgetId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(budgetId)) {
        newSet.delete(budgetId)
      } else {
        newSet.add(budgetId)
      }
      return newSet
    })
  }

  // ✅ Función para cambiar filtros y resetear página - solo se ejecuta con acción del usuario
  const handleFilterChange = (newFilters: BudgetsFilters) => {
    setFilters(newFilters)
    setPage(1)  // Reset a página 1 solo cuando el usuario cambia un filtro
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
      // ✅ Invalidate cache instead of full page reload
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    } catch (error: any) {
      console.error('Error marcando como enviado:', error)
      toast.error(error.message || 'Error al marcar como enviado')
    }
  }

  // ✅ Bulk Relance State & Handler
  const [bulkRelanceModalOpen, setBulkRelanceModalOpen] = useState(false)
  const [isBulkRelancing, setIsBulkRelancing] = useState(false)

  const handleConfirmBulkRelance = async () => {
    if (!filters.status || !filters.status.startsWith('relance_')) return

    setIsBulkRelancing(true)
    try {
      const response = await fetch('/api/bulk-relance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      toast.success(`✅ ${result.message}`)
      setBulkRelanceModalOpen(false)
      // Invalidate queries to refresh list and move items to next status level
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

  if (loading && page === 1) {
    return (
      <div className="budgets-list-loading">
        <div className="spinner"></div>
        <p>Cargando presupuestos...</p>
      </div>
    )
  }

  return (
    <div className="budgets-list-container">
      <div className="budgets-list-header">
        <h2>💰 Presupuestos Generados</h2>
        <div className="budgets-list-stats">
          <span className="stat">
            Total: <strong>{totalCount}</strong>
          </span>
          {filters.status && filters.status.startsWith('relance_') && (
            <button
              className="create-manual-btn"
              style={{ backgroundColor: '#4338ca', marginLeft: '10px' }}
              onClick={() => setBulkRelanceModalOpen(true)}
            >
              🚀 Relanzar a todos ({filters.status === 'relance_3' ? '3+' : filters.status.split('_')[1]})
            </button>
          )}
          <button
            className="create-manual-btn"
            onClick={handleCreateManual}
          >
            ➕ Crear Presupuesto Manual
          </button>
        </div>
      </div>

      <div className="budgets-list-filters">
        <button
          className={`filter-btn ${!filters.status || filters.status === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange({ ...filters, status: 'all' })}
        >
          Todos
        </button>
        <button
          className={`filter-btn ${filters.status === 'pending_review' ? 'active' : ''}`}
          onClick={() => handleFilterChange({ ...filters, status: 'pending_review' })}
        >
          Pendientes
        </button>
        <button
          className={`filter-btn ${filters.status === 'approved' ? 'active' : ''}`}
          onClick={() => handleFilterChange({ ...filters, status: 'approved' })}
        >
          Aprobados
        </button>
        <button
          className={`filter-btn ${filters.status === 'sent' ? 'active' : ''}`}
          onClick={() => handleFilterChange({ ...filters, status: 'sent' })}
        >
          Enviados
        </button>
        <button
          className={`filter-btn relance-btn ${filters.status === 'relance_1' ? 'active' : ''}`}
          onClick={() => handleFilterChange({ ...filters, status: 'relance_1' })}
        >
          Relanzado x1
        </button>
        <button
          className={`filter-btn relance-btn ${filters.status === 'relance_2' ? 'active' : ''}`}
          onClick={() => handleFilterChange({ ...filters, status: 'relance_2' })}
        >
          Relanzado x2
        </button>
        <button
          className={`filter-btn relance-btn ${filters.status === 'relance_3' ? 'active' : ''}`}
          onClick={() => handleFilterChange({ ...filters, status: 'relance_3' })}
        >
          Relanzado x3+
        </button>
        <button
          className={`filter-btn ${filters.status === 'rejected' ? 'active' : ''}`}
          onClick={() => handleFilterChange({ ...filters, status: 'rejected' })}
        >
          Rechazados
        </button>

        <div className="budget-search">
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="search-input"
          />
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="budgets-list-empty">
          <FileText size={48} />
          <h3>No hay presupuestos</h3>
          <p>Los presupuestos generados aparecerán aquí automáticamente</p>
        </div>
      ) : (
        <>
          <div className="budgets-list-grid">
            {budgets.map((budget: any) => {
              const clientInfo = budget.budget_data?.clientInfo || {}
              const totals = budget.budget_data?.totals || {}
              const isExpanded = expandedCards.has(budget.id)

              return (
                <div key={budget.id} className={`budget-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  {/* Compact Header - Always Visible */}
                  <div className="budget-compact-view">
                    <div className="budget-compact-header">
                      <div className="budget-client-info">
                        <h3>{clientInfo.name || 'Cliente'}</h3>
                        <p className="budget-email">{clientInfo.email}</p>
                        <p className="budget-phone">{clientInfo.phone}</p>
                        <p className="budget-event-date">
                          📅 {clientInfo.eventDate ? new Date(clientInfo.eventDate).toLocaleDateString('fr-FR') : '-'}
                        </p>
                      </div>
                      <div className="budget-compact-right">
                        <span className={`budget-status status-${budget.status === 'ENVIADO' ? 'sent' : budget.status}`}>
                          {getStatusText(budget.status)}
                        </span>
                        {budget.relance_count && budget.relance_count > 0 && (
                          <span className="budget-status status-pending" style={{ marginLeft: '8px', background: '#e0e7ff', color: '#4338ca' }}>
                            {budget.relance_count}x Relance
                          </span>
                        )}
                        <button
                          onClick={() => toggleCard(budget.id)}
                          className="budget-expand-button"
                          aria-label={isExpanded ? 'Contraer tarjeta' : 'Expandir tarjeta'}
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content - Only When Expanded */}
                  {isExpanded && (
                    <div className="budget-expanded-content">
                      <div className="budget-details">
                        <div className="budget-detail-row">
                          <span className="budget-detail-label">
                            <Users size={14} /> Invitados:
                          </span>
                          <span className="budget-detail-value">{clientInfo.guestCount || 0}</span>
                        </div>
                        <div className="budget-detail-row">
                          <span className="budget-detail-label">
                            <Calendar size={14} /> Tipo de evento:
                          </span>
                          <span className="budget-detail-value">{clientInfo.eventType || '-'}</span>
                        </div>
                        <div className="budget-detail-row">
                          <span className="budget-detail-label">
                            💰 Total TTC:
                          </span>
                          <span className="budget-detail-value budget-price">
                            {totals.totalTTC ? `${totals.totalTTC.toFixed(2)} €` : '-'}
                          </span>
                        </div>
                      </div>

                      <div className="budget-actions">
                        <div className="budget-action-buttons">
                          <button
                            className="budget-action-button budget-view-button"
                            onClick={() => onSelectBudget(budget.id)}
                          >
                            <Eye size={16} />
                            Ver y Editar
                          </button>
                          {budget.pdf_url && (
                            <a
                              href={budget.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="budget-action-button budget-pdf-button"
                            >
                              <FileText size={16} />
                              Ver PDF
                            </a>
                          )}
                          {budget.pdf_url && budget.status !== 'approved' && budget.status !== 'sent' && budget.status !== 'ENVIADO' && (
                            <button
                              className="budget-action-button budget-mark-sent-button"
                              onClick={(e) => handleMarkAsSentClick(e, budget.id)}
                              title="Marcar como enviado sin enviar email"
                            >
                              <MailCheck size={16} />
                              Marcar como Enviado
                            </button>
                          )}
                          <button
                            className="budget-action-button budget-delete-button"
                            onClick={(e) => handleDeleteClick(e, budget.id)}
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                        <div className="budget-meta">
                          <span>Versión: v{budget.version}</span>
                          <span>Creado: {new Date(budget.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination Controls */}
          {totalCount > pageSize && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="page-button"
              >
                Anterior
              </button>
              <span className="page-info">
                Página {page} de {Math.ceil(totalCount / pageSize)}
              </span>
              <button
                disabled={page >= Math.ceil(totalCount / pageSize)}
                onClick={() => setPage(page + 1)}
                className="page-button"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setBudgetToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar presupuesto?"
        message="¿Estás seguro de que deseas eliminar este presupuesto y su pedido relacionado permanentemente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
      />
      <ConfirmationModal
        isOpen={markAsSentModalOpen}
        onClose={() => {
          setMarkAsSentModalOpen(false)
          setBudgetToMarkAsSent(null)
        }}
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
        title=" Confirmar Relanzamiento Masivo"
        message={`¿Estás seguro de que deseas enviar el email de relance a TODOS los presupuestos en la lista "${filters.status === 'relance_3' ? 'Relanzado 3+ veces' : `Relanzado ${filters.status?.split('_')[1]} ve(ces)`}"? 
        
Esta acción enviará correos reales a los clientes filtrados.`}
        confirmLabel={isBulkRelancing ? "Enviando..." : "Sí, Relanzar a Todos"}
        variant="warning"
      />
    </div>
  )
}
