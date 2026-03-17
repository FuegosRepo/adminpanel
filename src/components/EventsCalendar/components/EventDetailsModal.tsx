import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarEvent } from '@/types'
import { getStatusColor, getEventIcon, getStatusLabel } from '../utils'
import styles from '../EventsCalendar.module.css'

interface EventDetailsModalProps {
  event: CalendarEvent
  onClose: () => void
  onDeleteEvent?: (eventId: string) => void
}

export default function EventDetailsModal({ event, onClose, onDeleteEvent }: EventDetailsModalProps) {
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            <span className={styles.eventIcon}>{getEventIcon(event.type)}</span>
            Detalles del Evento
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.detailsContent}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Título:</span>
            <span className={styles.detailValue}>{event.title}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Fecha:</span>
            <span className={styles.detailValue}>
              {format(new Date(event.date), 'dd/MM/yyyy', { locale: es })}
            </span>
          </div>

          {event.time && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Hora:</span>
              <span className={styles.detailValue}>{event.time}</span>
            </div>
          )}

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Tipo:</span>
            <span className={styles.detailValue}>{event.type}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Estado:</span>
            <span className={`${styles.statusBadge} ${styles[getStatusColor(event.status)]}`}>
              {getStatusLabel(event.status)}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Cliente:</span>
            <span className={styles.detailValue}>{event.clientName}</span>
          </div>

          {event.location && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ubicación:</span>
              <span className={styles.detailValue}>{event.location}</span>
            </div>
          )}

          {event.notes && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Notas:</span>
              <span className={styles.detailValue}>{event.notes}</span>
            </div>
          )}

          {event.orderId && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>ID de Pedido:</span>
              <span className={styles.detailValue}>{event.orderId}</span>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          {onDeleteEvent && (
            <button
              className={`${styles.closeButton} ${styles.deleteButton}`}
              style={{ backgroundColor: '#fee2e2', color: '#991b1b', marginRight: 'auto' }}
              onClick={() => {
                if (confirm('¿Estás seguro de eliminar este evento?')) {
                  onDeleteEvent(event.id)
                  onClose()
                }
              }}
            >
              Eliminar
            </button>
          )}
          <button className={styles.closeButton} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
