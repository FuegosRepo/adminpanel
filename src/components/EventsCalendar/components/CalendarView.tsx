import Calendar from 'react-calendar'
import { format, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { MapPin, User, Eye } from 'lucide-react'
import { CalendarEvent } from '@/types'
import { formatEventTime, getStatusColor, getEventTypeColor, getEventIcon, getStatusLabel } from '../utils'
import styles from '../EventsCalendar.module.css'

interface CalendarViewProps {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  selectedDateEvents: CalendarEvent[]
  selectedEvent: CalendarEvent | null
  setSelectedEvent: (event: CalendarEvent | null) => void
  onViewDetails: (event: CalendarEvent) => void
  hasEvents: (date: Date) => boolean
}

export default function CalendarView({
  selectedDate,
  setSelectedDate,
  selectedDateEvents,
  selectedEvent,
  setSelectedEvent,
  onViewDetails,
  hasEvents
}: CalendarViewProps) {
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasEvents(date)) {
      return `react-calendar__tile--hasEvent ${styles.hasEvent}`
    }
    return null
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasEvents(date)) {
      return <div className={styles.eventIndicator}></div>
    }
    return null
  }

  return (
    <div className={styles.calendarSection}>
      <div className={styles.calendarContainer}>
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          locale="es-ES"
          tileClassName={tileClassName}
          tileContent={tileContent}
          className={styles.calendar}
          prev2Label={null}
          next2Label={null}
          formatShortWeekday={(locale, date) =>
            format(date, 'EEE', { locale: es }).toUpperCase()
          }
        />
      </div>

      <div className={styles.eventsPanel}>
        <h3 className={styles.panelTitle}>Eventos del Día</h3>
        <div className={styles.selectedDate}>
          {format(selectedDate, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es })}
        </div>

        <div className={styles.eventsList}>
          {selectedDateEvents.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📅</div>
              <div className={styles.emptyText}>No hay eventos</div>
              <div className={styles.emptySubtext}>
                No hay eventos programados para este día
              </div>
            </div>
          ) : (
            selectedDateEvents.map(event => (
              <div
                key={event.id}
                className={`${styles.eventItem} ${styles[getStatusColor(event.status)]} ${styles[getEventTypeColor(event.type)]} ${selectedEvent?.id === event.id ? styles.selectedEvent : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className={styles.eventHeader}>
                  <div className={styles.eventTitle}>
                    <span className={styles.eventIcon}>{getEventIcon(event.type)}</span>
                    {event.title}
                  </div>
                  <div className={styles.eventTime}>
                    {event.time || formatEventTime(event.date)}
                  </div>
                </div>

                <div className={styles.eventDetails}>
                  <div className={styles.eventClient}>
                    <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {event.clientName}
                  </div>
                  {event.location && (
                    <div className={styles.eventLocation}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {event.location}
                    </div>
                  )}
                </div>

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
            ))
          )}
        </div>
      </div>
    </div>
  )
}
