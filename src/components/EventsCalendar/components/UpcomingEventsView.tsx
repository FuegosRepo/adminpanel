import { MapPin, User, Eye } from 'lucide-react'
import { CalendarEvent } from '@/types'
import { UpcomingEvent } from '../hooks/useCalendarEvents'
import { getStatusColor, getEventTypeColor, getEventIcon, getUrgencyClass, getUrgencyText, getStatusLabel } from '../utils'
import styles from '../EventsCalendar.module.css'

interface UpcomingEventsViewProps {
  upcomingEvents: UpcomingEvent[]
  setSelectedEvent: (event: CalendarEvent) => void
  onViewDetails: (event: CalendarEvent) => void
}

export default function UpcomingEventsView({ upcomingEvents, setSelectedEvent, onViewDetails }: UpcomingEventsViewProps) {
  return (
    <div className={styles.upcomingEvents}>
      <h3 className={styles.panelTitle}>Eventos Próximos (30 días)</h3>

      {upcomingEvents.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🗓️</div>
          <div className={styles.emptyText}>No hay eventos próximos</div>
          <div className={styles.emptySubtext}>
            No hay eventos programados en los próximos 30 días
          </div>
        </div>
      ) : (
        <div className={styles.upcomingList}>
          {upcomingEvents.map(event => (
            <div
              key={event.id}
              className={`${styles.upcomingItem} ${styles[getUrgencyClass(event.urgency)]} ${styles[getEventTypeColor(event.type)]}`}
            >
              {(event.urgency === 'urgent' || event.urgency === 'soon') && (
                <div className={`${styles.urgencyBadge} ${styles[event.urgency]}`}>
                  {event.urgency === 'urgent' ? 'Urgente' : 'Pronto'}
                </div>
              )}

              <div
                className={styles.upcomingHeader}
                onClick={() => setSelectedEvent(event)}
              >
                <div className={styles.upcomingTitle}>
                  <span className={styles.eventIcon}>{getEventIcon(event.type)}</span>
                  {event.title}
                </div>
                <div className={styles.upcomingDate}>
                  {getUrgencyText(event.daysUntil)}
                </div>
              </div>

              <div className={styles.upcomingClient}>
                <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {event.clientName}
              </div>

              {event.location && (
                <div className={styles.upcomingLocation}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {event.location}
                </div>
              )}

              <div className={styles.eventActions}>
                <button className={styles.actionBtn} onClick={() => onViewDetails(event)}>
                  <Eye size={12} />
                  Ver Detalles
                </button>
                <div className={`${styles.status} ${styles[getStatusColor(event.status)]}`}>
                  {getStatusLabel(event.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
