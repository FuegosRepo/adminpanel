'use client'

import { useState } from 'react'
import { CateringOrder, CalendarEvent } from '@/types'
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react'
import AddEventModal from '../AddEventModal'
import { useCalendarEvents } from './hooks/useCalendarEvents'
import CalendarView from './components/CalendarView'
import UpcomingEventsView from './components/UpcomingEventsView'
import EventDetailsModal from './components/EventDetailsModal'
import 'react-calendar/dist/Calendar.css'
import styles from './EventsCalendar.module.css'

interface EventsCalendarProps {
  orders: CateringOrder[]
  manualEvents?: CalendarEvent[]
  onAddEvent?: (event: CalendarEvent) => void
  onDeleteEvent?: (eventId: string) => void
}

type ViewMode = 'calendar' | 'upcoming'

export default function EventsCalendar({ orders, manualEvents = [], onAddEvent, onDeleteEvent }: EventsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [addEventModal, setAddEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const { selectedDateEvents, upcomingEvents, hasEvents } = useCalendarEvents(orders, manualEvents, selectedDate)

  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `manual-${Date.now()}`
    }

    if (onAddEvent) {
      onAddEvent(newEvent)
    }

    setAddEventModal(false)
  }

  const handleViewDetails = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowDetailsModal(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Calendario de Eventos</h2>
        <div className={styles.headerActions}>
          {onDeleteEvent && selectedEvent && (
            <button
              className={styles.deleteEventBtn}
              onClick={() => {
                if (confirm('¿Eliminar el evento seleccionado?')) {
                  onDeleteEvent(selectedEvent.id)
                  setSelectedEvent(null)
                }
              }}
            >
              Eliminar Evento Seleccionado
            </button>
          )}
          <button
            className={styles.addEventBtn}
            onClick={() => setAddEventModal(true)}
          >
            <Plus size={16} />
            Agregar Evento
          </button>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'calendar' ? styles.active : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon size={16} />
              Calendario
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'upcoming' ? styles.active : ''}`}
              onClick={() => setViewMode('upcoming')}
            >
              <Clock size={16} />
              Próximos
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <CalendarView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedDateEvents={selectedDateEvents}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          onViewDetails={handleViewDetails}
          hasEvents={hasEvents}
        />
      ) : (
        <UpcomingEventsView
          upcomingEvents={upcomingEvents}
          setSelectedEvent={setSelectedEvent}
          onViewDetails={handleViewDetails}
        />
      )}

      {addEventModal && (
        <AddEventModal
          isOpen={addEventModal}
          onClose={() => setAddEventModal(false)}
          onSave={handleAddEvent}
          selectedDate={selectedDate}
        />
      )}

      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowDetailsModal(false)}
          onDeleteEvent={onDeleteEvent}
        />
      )}
    </div>
  )
}
