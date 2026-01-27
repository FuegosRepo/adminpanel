'use client'

import { useState, useEffect, memo } from 'react'
import { CateringOrder, EmailTemplate } from '@/types'
import { format, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Mail, Eye, Edit, ChevronDown, ChevronUp, Clock, Trash2, FileText, StickyNote } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { emailTemplates } from '@/data/mockData'
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
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es })
    } catch {
      return dateString
    }
  }

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

  return (
    <div className={`${styles.card} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      {/* Vista compacta - siempre visible */}
      <div className={styles.compactView}>
        <div className={styles.compactHeader}>
          <div className={styles.clientInfo}>
            <h3>{order.contact.name}</h3>
            <p className={styles.email}>{order.contact.email}</p>
            <p className={styles.phone}>{order.contact.phone}</p>
            <p className={styles.eventDate}>📅 {formatDate(order.contact.eventDate)}</p>
          </div>
          <div className={styles.compactRight}>
            <span className={`${styles.status} ${styles[order.status === 'ENVIADO' ? 'sent' : order.status]}`}>
              {getStatusText(order.status)}
            </span>
            {/* ✅ Badge de relance */}
            {relanceCount > 0 && (
              <span className={`${styles.status} ${styles.relanced}`} title={`Relanzado ${relanceCount} ${relanceCount === 1 ? 'vez' : 'veces'}`}>
                🔄 Relanzado {relanceCount}x
              </span>
            )}
            {/* ✅ Internal notes indicator */}
            {order.internalNotes && order.internalNotes.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setNoteModalOpen(true)
                }}
                className={styles.noteIndicator}
                title={`${order.internalNotes.length} nota(s)`}
              >
                <StickyNote size={16} />
                <span className={styles.noteCount}>{order.internalNotes.length}</span>
              </button>
            )}
            {/* Delete button in compact view */}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteModalOpen(true)
                }}
                className={styles.compactDeleteButton}
                title="Eliminar pedido"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={styles.expandButton}
              aria-label={isExpanded ? 'Contraer tarjeta' : 'Expandir tarjeta'}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Vista expandida - solo visible cuando isExpanded es true */}
      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Fecha del evento:</span>
              <span className={styles.detailValue}>{formatDate(order.contact.eventDate)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Tipo de evento:</span>
              <span className={styles.detailValue}>{getEventTypeText(order.contact.eventType)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Invitados:</span>
              <span className={styles.detailValue}>{order.contact.guestCount}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Tipo de menú:</span>
              <span className={styles.detailValue}>
                {order.menu.type === 'dejeuner' ? 'Almuerzo' : order.menu.type === 'diner' ? 'Cena' : 'No especificado'}
              </span>
            </div>
            {order.estimatedPrice && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Precio estimado:</span>
                <span className={`${styles.detailValue} ${styles.price}`}>
                  €{mounted ? order.estimatedPrice.toLocaleString() : order.estimatedPrice}
                </span>
              </div>
            )}
          </div>

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

            {/* Extras */}
            <div className={styles.menuSection}>
              <h4>Extras</h4>
              <select
                className={styles.extrasSelect}
                value={extrasView}
                onChange={(e) => setExtrasView(e.target.value as 'compact' | 'detailed')}
              >
                <option value="compact">Vista compacta</option>
                <option value="detailed">Vista detallada</option>
              </select>

              {extrasView === 'detailed' ? (
                <div className={styles.extrasChips}>
                  {order.extras.wines && (
                    <span className={`${styles.chip} ${styles.wines}`}>🍷 Vinos incluidos</span>
                  )}
                  {order.extras.decoration && (
                    <span className={`${styles.chip} ${styles.decoration}`}>🎨 Decoración incluida</span>
                  )}
                  {order.extras.equipment.length > 0 && order.extras.equipment.map((equip, index) => (
                    <span key={index} className={`${styles.chip} ${styles.equipment}`}>🔧 {equip}</span>
                  ))}
                  {order.extras.specialRequest && (
                    <span className={`${styles.chip} ${styles.request}`}>📝 {order.extras.specialRequest}</span>
                  )}
                </div>
              ) : (
                <div className={styles.extrasChips}>
                  {order.extras.wines && (
                    <span className={`${styles.chip} ${styles.wines}`}>🍷 Vinos</span>
                  )}
                  {order.extras.decoration && (
                    <span className={`${styles.chip} ${styles.decoration}`}>🎨 Decoración</span>
                  )}
                  {order.extras.equipment.length > 0 && (
                    <span className={`${styles.chip} ${styles.equipment}`}>
                      🔧 <span className={styles.chipCount}>{order.extras.equipment.length}</span> ítems
                    </span>
                  )}
                  {order.extras.specialRequest && (
                    <span className={`${styles.chip} ${styles.request}`}>📝 {order.extras.specialRequest}</span>
                  )}
                  {!(order.extras.wines || order.extras.decoration || order.extras.equipment.length > 0 || order.extras.specialRequest) && (
                    <span className={styles.chip}>Sin extras</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {order.notes && (
            <div className={styles.notes}>
              <p>{order.notes}</p>
            </div>
          )}

          <div className={styles.actions}>
            {/* Sección de Estado - Botones en lugar de dropdown */}
            <div className={styles.statusSection}>
              <label className={styles.statusLabel}>Estado:</label>
              <div className={styles.statusButtons}>
                <button
                  onClick={() => onStatusChange(order.id, 'pending')}
                  className={`${styles.statusBtn} ${order.status === 'pending' ? `${styles.statusBtnActive} ${styles.pending}` : ''}`}
                  title="Marcar como Pendiente"
                >
                  Pendiente
                </button>
                <button
                  onClick={() => onStatusChange(order.id, 'sent')}
                  className={`${styles.statusBtn} ${(order.status === 'sent' || order.status === 'ENVIADO') ? `${styles.statusBtnActive} ${styles.sent}` : ''}`}
                  title="Marcar como Enviado"
                >
                  Enviado
                </button>
                <button
                  onClick={() => onStatusChange(order.id, 'approved')}
                  className={`${styles.statusBtn} ${order.status === 'approved' ? `${styles.statusBtnActive} ${styles.approved}` : ''}`}
                  title="Marcar como Aprobado"
                >
                  Aprobado
                </button>
                <button
                  onClick={() => onStatusChange(order.id, 'rejected')}
                  className={`${styles.statusBtn} ${order.status === 'rejected' ? `${styles.statusBtnActive} ${styles.rejected}` : ''}`}
                  title="Marcar como Rechazado"
                >
                  Rechazado
                </button>
              </div>
            </div>

            {/* Sección de Acciones */}
            <div className={styles.actionButtons}>
              <button
                onClick={handleRelanceClick}
                className={`${styles.actionButton} ${styles.emailButton}`}
                title="Enviar email de relance"
              >
                <Mail size={16} />
                Relanzar Devis
              </button>

              {lastRelanceDate && (
                <div className={styles.relanceInfo}>
                  <Clock size={14} />
                  <span>Último envío: hace {getDaysSinceRelance()} días</span>
                </div>
              )}

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
                    const confirmGen = confirm('¿Generar presupuesto automático para este pedido?');
                    if (!confirmGen) return;

                    try {
                      // Llamamos a la lógica de generación
                      // Por ahora, usamos el endpoint de Fuegos si está disponible o implementamos uno aquí
                      // Para mayor robustez, intentaremos llamar al API de generación.
                      const response = await fetch('/api/generate-budget-from-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id })
                      });

                      if (response.ok) {
                        toast.success('Presupuesto generado correctamente');
                        window.location.reload(); // Recargar para ver cambios
                      } else {
                        throw new Error('Error en el servidor');
                      }
                    } catch (err) {
                      toast.error('No se pudo generar el presupuesto');
                    }
                  }}
                  className={`${styles.actionButton} ${styles.generateButton}`}
                  title="Generar presupuesto ahora"
                >
                  <FileText size={16} />
                  Generar Presupuesto
                </button>
              )}

              {/* ✅ Internal Notes Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setNoteModalOpen(true)
                }}
                className={`${styles.actionButton} ${styles.noteButton} ${order.internalNotes?.length ? styles.hasNote : ''}`}
                title={order.internalNotes?.length ? `${order.internalNotes.length} nota(s)` : 'Agregar nota'}
              >
                <StickyNote size={16} />
                {order.internalNotes?.length ? `Notas (${order.internalNotes.length})` : 'Notas'}
              </button>

              {/* Delete Button */}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteModalOpen(true)
                  }}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  title="Eliminar pedido"
                >
                  🗑️ Eliminar
                </button>
              )}
            </div>
          </div>
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
