'use client'

import { useState, useEffect, memo } from 'react'
import { CateringOrder, EmailTemplate } from '@/types'
import { format, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Mail, Eye, Edit, ChevronDown, ChevronUp, Clock, Trash2, FileText, StickyNote } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { emailTemplates } from '@/data/mockData'
import { formatLocalDate } from '@/utils/dateUtils'
import { ProductListResolver } from '@/components/admin/ProductListResolver'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import InternalNoteModal from '@/components/InternalNoteModal/InternalNoteModal'
import { toast } from 'sonner'
import styles from './OrderCard.module.css'

interface OrderCardProps {
  order: CateringOrder
  isSelected: boolean
  onStatusChange: (orderId: string, newStatus: CateringOrder['status']) => void
  onSendEmail: (order: CateringOrder, template?: EmailTemplate) => void
  onViewDetails: (order: CateringOrder) => void
  onSelectionChange: (orderId: string, isSelected: boolean) => void
  onUpdateOrder?: (orderId: string, updates: Partial<CateringOrder>) => void
  onDelete?: (orderId: string) => void
  onAddInternalNote?: (orderId: string, note: string) => Promise<void>
  onDeleteInternalNote?: (orderId: string, noteIndex: number) => Promise<void>
  isAddingNote?: boolean
  isDeletingNote?: boolean
}

const OrderCard = ({
  order,
  isSelected,
  onStatusChange,
  onSendEmail,
  onViewDetails,
  onSelectionChange,
  onUpdateOrder,
  onDelete,
  onAddInternalNote,
  onDeleteInternalNote,
  isAddingNote = false,
  isDeletingNote = false
}: OrderCardProps) => {
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [relanceModalOpen, setRelanceModalOpen] = useState(false)
  const [lastRelanceDate, setLastRelanceDate] = useState<string | null>(null)
  const [relanceCount, setRelanceCount] = useState(0)  // ✅ Contador de relances
  const [extrasView, setExtrasView] = useState<'compact' | 'detailed'>('compact')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [noteModalOpen, setNoteModalOpen] = useState(false)  // ✅ Internal note modal state

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // ✅ Fetch relance count and last date immediately (not just when expanded)
    const fetchRelanceData = async () => {
      const { data, count } = await supabase
        .from('email_logs')
        .select('sent_at', { count: 'exact' })
        .eq('order_id', order.id)
        .eq('subject', 'Relance - Votre devis Fuegos d\'Azur')
        .order('sent_at', { ascending: false })

      if (data && data.length > 0) {
        setLastRelanceDate(data[0].sent_at)
      }
      setRelanceCount(count || 0)
    }
    fetchRelanceData()
  }, [order.id])



  const handleRelanceClick = () => {
    setRelanceModalOpen(true)
  }

  const confirmRelance = async () => {
    try {
      const template = emailTemplates.find(t => t.id === '5') // Relance devis
      if (!template) return

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          customSubject: template.subject,
          customContent: template.content,
          type: template.type // Pass the template type
        })
      })

      if (response.ok) {
        setLastRelanceDate(new Date().toISOString())
        setRelanceCount(prev => prev + 1)  // ✅ Incrementar contador
        setRelanceModalOpen(false)
        toast.success('Email de relance enviado correctamente')
      } else {
        toast.error('Error al enviar el email')  // ✅ Toast instead of alert
      }
    } catch (e) {
      console.error(e)
      toast.error('Error al enviar el email')  // ✅ Toast instead of alert
    }
  }

  const getDaysSinceRelance = () => {
    if (!lastRelanceDate) return null
    return differenceInDays(new Date(), new Date(lastRelanceDate))
  }
  const formatDate = (dateString: string) => formatLocalDate(dateString)

  const getStatusText = (status: CateringOrder['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'sent': return 'Enviado'
      case 'ENVIADO': return 'Enviado'  // ✅ Added ENVIADO mapping
      case 'approved': return 'Aprobado'
      case 'rejected': return 'Rechazado'
      default: return status
    }
  }

  const getEventTypeText = (eventType: string) => {
    switch (eventType) {
      case 'mariage': return 'Boda'
      case 'anniversaire': return 'Cumpleaños'
      case 'bapteme': return 'Bautizo'
      case 'corporatif': return 'Corporativo'
      case 'autre': return 'Otro'
      default: return eventType
    }
  }

  // Estado para menú colapsable
  const [menuExpanded, setMenuExpanded] = useState(false)

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      {/* Vista compacta - siempre visible */}
      <div className={styles.compactView}>
        <div className={styles.compactHeader}>
          <div className={styles.clientInfo}>
            <h3>{order.contact.name}</h3>
            <p className={styles.email}>{order.contact.email}</p>
            <p className={styles.phone}>{order.contact.phone}</p>
          </div>
          <div className={styles.compactRight}>
            {/* Badge group - status + relance conectados */}
            <div className={styles.badgeGroup}>
              <span className={`${styles.statusBadge} ${styles[order.status === 'ENVIADO' ? 'sent' : order.status]} ${relanceCount > 0 ? styles.hasRelance : ''}`}>
                {getStatusText(order.status)}
              </span>
              {relanceCount > 0 && (
                <span className={styles.relanceBadge}>
                  {relanceCount}x
                </span>
              )}
            </div>
            {/* Expand button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={styles.expandButton}
              aria-label={isExpanded ? 'Contraer' : 'Expandir'}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Chips de info rápida */}
        <div className={styles.quickInfo}>
          <span className={styles.infoChip}>📅 {formatDate(order.contact.eventDate)}</span>
          <span className={styles.infoChip}>👥 {order.contact.guestCount} personas</span>
          {order.estimatedPrice && (
            <span className={`${styles.infoChip} ${styles.priceChip}`}>€{mounted ? order.estimatedPrice.toLocaleString() : order.estimatedPrice}</span>
          )}
          <span className={styles.infoChip}>{getEventTypeText(order.contact.eventType)}</span>
          <span className={styles.infoChip}>🍽️ {order.menu.type === 'dejeuner' ? 'Almuerzo' : order.menu.type === 'diner' ? 'Cena' : 'Menú'}</span>
        </div>
      </div>

      {/* Vista expandida */}
      {isExpanded && (
        <div className={styles.expandedContent}>
          {/* Menú colapsable */}
          <button
            className={styles.menuToggle}
            onClick={() => setMenuExpanded(!menuExpanded)}
          >
            {menuExpanded ? '▲' : '▼'} Ver menú completo
          </button>

          {menuExpanded && (
            <div className={styles.menuItems}>
              {order.entrees.length > 0 && (
                <div className={styles.menuSection}>
                  <h4>Entrées</h4>
                  <ProductListResolver ids={order.entrees} category="entrees" />
                </div>
              )}
              {order.viandes.length > 0 && (
                <div className={styles.menuSection}>
                  <h4>Viandes</h4>
                  <ProductListResolver ids={order.viandes} category="viandes" />
                </div>
              )}
              {order.dessert && (
                <div className={styles.menuSection}>
                  <h4>Dessert</h4>
                  <ProductListResolver ids={order.dessert} category="desserts" />
                </div>
              )}
              {/* Extras simplificados */}
              <div className={styles.extrasChips}>
                {order.extras.wines && <span className={`${styles.chip} ${styles.wines}`}>🍷 Vinos</span>}
                {order.extras.decoration && <span className={`${styles.chip} ${styles.decoration}`}>🎨 Decoración</span>}
                {order.extras.equipment.length > 0 && <span className={`${styles.chip} ${styles.equipment}`}>🔧 {order.extras.equipment.length} equipos</span>}
              </div>
            </div>
          )}

          {/* Client Special Request / Notes */}
          {order.extras?.specialRequest && (
            <div className={styles.notes} style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Notas del Cliente
              </h4>
              <p style={{
                borderLeft: '4px solid #f59e0b',
                paddingLeft: '0.75rem',
                fontStyle: 'italic',
                color: '#374151',
                background: '#fffbeb',
                padding: '0.5rem 0.75rem',
                borderRadius: '0 4px 4px 0',
                margin: 0
              }}>
                {order.extras.specialRequest}
              </p>
            </div>
          )}

          {order.notes && (
            <div className={styles.notes}>
              <p>{order.notes}</p>
            </div>
          )}

          {/* Selector de estado */}
          <div className={styles.statusSelector}>
            <span className={styles.statusLabel}>Estado:</span>
            <select
              className={styles.statusSelect}
              value={order.status === 'ENVIADO' ? 'sent' : order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as CateringOrder['status'])}
            >
              <option value="pending">Pendiente</option>
              <option value="sent">Enviado</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
            </select>
          </div>

          {/* Barra de acciones simplificada */}
          <div className={styles.actionBar}>
            <div className={styles.mainActions}>
              <button
                onClick={handleRelanceClick}
                className={`${styles.actionButton} ${styles.emailButton}`}
                title="Enviar email de relance"
              >
                <Mail size={16} />
                Relanzar
              </button>
              <button
                onClick={() => onViewDetails(order)}
                className={`${styles.actionButton} ${styles.viewButton}`}
                title="Ver detalles completos"
              >
                <Eye size={16} />
                Ver Detalles
              </button>
              {!order.hasBudget && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const confirmGen = confirm('¿Generar presupuesto automático?');
                    if (!confirmGen) return;
                    try {
                      const response = await fetch('/api/generate-budget-from-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id })
                      });
                      if (response.ok) {
                        toast.success('Presupuesto generado');
                        window.location.reload();
                      } else throw new Error('Error');
                    } catch { toast.error('No se pudo generar'); }
                  }}
                  className={`${styles.actionButton} ${styles.generateButton}`}
                >
                  <FileText size={16} />
                  Generar
                </button>
              )}
            </div>
            <div className={styles.iconActions}>
              <button
                onClick={(e) => { e.stopPropagation(); setNoteModalOpen(true) }}
                className={`${styles.iconButton} ${order.internalNotes?.length ? styles.hasNote : ''}`}
                title={order.internalNotes?.length ? `${order.internalNotes.length} nota(s)` : 'Notas'}
              >
                <StickyNote size={18} />
                {order.internalNotes?.length ? <span className={styles.noteBadge}>{order.internalNotes.length}</span> : null}
              </button>
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true) }}
                  className={`${styles.iconButton} ${styles.deleteIcon}`}
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Info de último relance */}
          {lastRelanceDate && (
            <div className={styles.relanceInfo}>
              <Clock size={12} />
              <span>Último envío: hace {getDaysSinceRelance()} días</span>
            </div>
          )}
        </div>
      )}
      {relanceModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirmar Relanzamiento</h3>
            <p>¿Estás de acuerdo en enviar el email de relance a:</p>
            <p><strong>{order.contact.name}</strong> ({order.contact.email})?</p>
            <div className={styles.modalButtons}>
              <button onClick={() => setRelanceModalOpen(false)} className={styles.cancelButton}>Cancelar</button>
              <button onClick={confirmRelance} className={styles.confirmButton}>Sí, enviar</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (onDelete) {
            onDelete(order.id)
          }
          setDeleteModalOpen(false)
        }}
        title="¿Eliminar pedido?"
        message="¿Estás seguro de que deseas eliminar este pedido?\n\nEsta acción es permanente y eliminará tanto el pedido como el presupuesto en ambas secciones para mantener la sincronización."
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* ✅ Internal Notes Thread Modal */}
      <InternalNoteModal
        isOpen={noteModalOpen}
        orderName={order.contact.name}
        notes={order.internalNotes || []}
        onClose={() => setNoteModalOpen(false)}
        onAddNote={async (note) => {
          if (onAddInternalNote) {
            await onAddInternalNote(order.id, note)
          }
        }}
        onDeleteNote={async (noteIndex) => {
          if (onDeleteInternalNote) {
            await onDeleteInternalNote(order.id, noteIndex)
          }
        }}
        isAdding={isAddingNote}
        isDeleting={isDeletingNote}
      />
    </div>
  )
}

export default memo(OrderCard)
