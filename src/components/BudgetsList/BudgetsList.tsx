import React, { useState } from 'react'
import { FileText, Eye, Clock, CheckCircle, Send, XCircle, Trash2, Mail, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react'
import './BudgetsList.css'
import { useBudgets } from '@/hooks/useBudgets'
import { toast } from 'sonner'
import ConfirmationModal from '@/components/common/ConfirmationModal'

interface Budget {
  id: string
  order_id: string
  version: number
  status: 'draft' | 'pending_review' | 'approved' | 'sent' | 'rejected' | 'ENVIADO'
  budget_data: any
  pdf_url?: string
  created_at: string
  updated_at: string
}

interface BudgetsListProps {
  onSelectBudget: (budgetId: string) => void
}

export default function BudgetsList({ onSelectBudget }: BudgetsListProps) {
  const { budgets, loading, deleteBudget, createManualBudget } = useBudgets()
  const [filter, setFilter] = useState<'all' | 'pending_review' | 'approved' | 'sent' | 'ENVIADO'>('all')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Borrador'
      case 'pending_review':
        return 'Pendiente'
      case 'approved':
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

  const filteredBudgets = budgets.filter((budget: any) => {
    if (filter === 'all') return true
    if (filter === 'sent') {
      return budget.status === 'sent' || budget.status === 'ENVIADO'
    }
    return budget.status === filter
  })

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)

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

  if (loading) {
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
            Total: <strong>{budgets.length}</strong>
          </span>
          <span className="stat">
            Pendientes: <strong>{budgets.filter((b: any) => b.status === 'pending_review').length}</strong>
          </span>
          <span className="stat">
            Enviados: <strong>{budgets.filter((b: any) => b.status === 'sent' || b.status === 'ENVIADO').length}</strong>
          </span>
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
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({budgets.length})
        </button>
        <button
          className={`filter-btn ${filter === 'pending_review' ? 'active' : ''}`}
          onClick={() => setFilter('pending_review')}
        >
          Pendientes ({budgets.filter(b => b.status === 'pending_review').length})
        </button>
        <button
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Aprobados ({budgets.filter(b => b.status === 'approved').length})
        </button>
        <button
          className={`filter-btn ${filter === 'sent' ? 'active' : ''}`}
          onClick={() => setFilter('sent')}
        >
          Enviados ({budgets.filter(b => b.status === 'sent' || b.status === 'ENVIADO').length})
        </button>
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="budgets-list-empty">
          <FileText size={48} />
          <h3>No hay presupuestos</h3>
          <p>Los presupuestos generados aparecerán aquí automáticamente</p>
        </div>
      ) : (
        <div className="budgets-list-grid">
          {filteredBudgets.map((budget) => {
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
    </div>
  )
}
