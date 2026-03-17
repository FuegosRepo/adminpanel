'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useOrders } from '@/hooks/useOrders'
import { CalendarEvent } from '@/types'

const EventsCalendar = dynamic(
  () => import('@/components/EventsCalendar/EventsCalendar'),
  { loading: () => <div className="p-8 text-center text-muted-foreground">Cargando calendario...</div> }
)

export default function CalendarPage() {
    const { orders, handleStatusChange } = useOrders()
    const [manualEvents, setManualEvents] = useState<CalendarEvent[]>([])

    // Manejar adición de eventos manuales
    const handleAddEvent = (event: CalendarEvent) => {
        setManualEvents(prevEvents => [...prevEvents, event])
    }

    // Eliminar evento del calendario
    const handleDeleteEvent = async (eventId: string) => {
        if (eventId.startsWith('manual-')) {
            setManualEvents(prev => prev.filter(e => e.id !== eventId))
        } else if (eventId.startsWith('event-')) {
            const orderId = eventId.replace('event-', '')
            if (confirm('Este evento está vinculado a un pedido. ¿Deseas cancelar el pedido?')) {
                await handleStatusChange(orderId, 'rejected')
            }
        }
    }

    return (
        <EventsCalendar
            orders={orders}
            manualEvents={manualEvents}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
        />
    )
}
