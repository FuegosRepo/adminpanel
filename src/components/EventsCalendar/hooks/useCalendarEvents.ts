import { useMemo } from 'react'
import { CateringOrder, CalendarEvent } from '@/types'
import { isSameDay, isAfter, isBefore, addDays, differenceInDays } from 'date-fns'

export interface UpcomingEvent extends CalendarEvent {
  daysUntil: number
  urgency: 'urgent' | 'soon' | 'normal'
}

export function useCalendarEvents(orders: CateringOrder[], manualEvents: CalendarEvent[], selectedDate: Date) {
  const orderEvents = useMemo((): CalendarEvent[] => {
    return orders
      .filter(order => order.contact.eventDate)
      .map(order => {
        let eventStatus: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' = 'Pending'
        if (order.status === 'approved') eventStatus = 'Confirmed'
        else if (order.status === 'rejected') eventStatus = 'Cancelled'
        else if (order.status === 'sent') eventStatus = 'Pending'

        let eventType: CalendarEvent['type'] = 'Otros'
        if (order.contact.eventType === 'mariage') eventType = 'Casamiento'
        else if (order.contact.eventType === 'anniversaire') eventType = 'Aniversario'
        else if (order.contact.eventType === 'bapteme') eventType = 'Bautismo'
        else if (order.contact.eventType === 'corporatif') eventType = 'Empresarial'
        else if (order.contact.eventType === 'autre') eventType = 'Otros'

        return {
          id: `event-${order.id}`,
          orderId: order.id,
          title: `${eventType} - ${order.contact.name}`,
          date: order.contact.eventDate,
          time: order.contact.eventTime || '12:00',
          type: eventType,
          status: eventStatus,
          clientName: order.contact.name,
          location: order.contact.address,
          notes: order.notes || ''
        }
      })
  }, [orders])

  const calendarEvents = useMemo(() => {
    return [...orderEvents, ...manualEvents]
  }, [orderEvents, manualEvents])

  const selectedDateEvents = calendarEvents.filter(event =>
    isSameDay(new Date(event.date), selectedDate)
  )

  const upcomingEvents = useMemo((): UpcomingEvent[] => {
    const now = new Date()
    const thirtyDaysFromNow = addDays(now, 30)

    return calendarEvents
      .filter(event => {
        const eventDate = new Date(event.date)
        return isAfter(eventDate, now) && isBefore(eventDate, thirtyDaysFromNow)
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(event => {
        const eventDate = new Date(event.date)
        const daysUntil = differenceInDays(eventDate, now)

        return {
          ...event,
          daysUntil,
          urgency: daysUntil <= 3 ? 'urgent' as const : daysUntil <= 7 ? 'soon' as const : 'normal' as const
        }
      })
  }, [calendarEvents])

  const hasEvents = (date: Date) => {
    return calendarEvents.some(event => isSameDay(new Date(event.date), date))
  }

  return { calendarEvents, selectedDateEvents, upcomingEvents, hasEvents }
}
