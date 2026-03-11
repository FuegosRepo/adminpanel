import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatEventTime = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return format(date, 'HH:mm', { locale: es })
  } catch {
    return '00:00'
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'scheduled'
    case 'Confirmed': return 'confirmed'
    case 'Completed': return 'completed'
    case 'Cancelled': return 'cancelled'
    default: return 'scheduled'
  }
}

export const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Casamiento': return 'casamiento'
    case 'Aniversario': return 'aniversario'
    case 'Bautismo': return 'bautismo'
    case 'Empresarial': return 'empresarial'
    case 'Otros': return 'otros'
    case 'Recordatorio': return 'reminder'
    case 'Pago Pendiente': return 'paymentDue'
    default: return 'otros'
  }
}

export const getEventIcon = (type: string) => {
  switch (type) {
    case 'Casamiento': return '💍'
    case 'Aniversario': return '🎂'
    case 'Bautismo': return '👼'
    case 'Empresarial': return '💼'
    case 'Otros': return '🎉'
    case 'Recordatorio': return '⏰'
    case 'Pago Pendiente': return '💰'
    default: return '📅'
  }
}

export const getUrgencyClass = (urgency: string) => {
  switch (urgency) {
    case 'urgent': return 'urgent'
    case 'soon': return 'soon'
    default: return ''
  }
}

export const getUrgencyText = (daysUntil: number) => {
  if (daysUntil === 0) return 'Hoy'
  if (daysUntil === 1) return 'Mañana'
  if (daysUntil <= 3) return `${daysUntil} días`
  return format(addDays(new Date(), daysUntil), 'dd/MM', { locale: es })
}

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Confirmed': return 'Confirmado'
    case 'Pending': return 'Pendiente'
    case 'Completed': return 'Completado'
    default: return 'Cancelado'
  }
}
