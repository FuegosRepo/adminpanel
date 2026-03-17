export const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'pending_review', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobados' },
  { value: 'sent', label: 'Enviados' },
  { value: 'relance_1', label: 'Relanzado x1', isRelance: true },
  { value: 'relance_2', label: 'Relanzado x2', isRelance: true },
  { value: 'relance_3', label: 'Relanzado x3+', isRelance: true },
  { value: 'rejected', label: 'Rechazados' },
]

export const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "sent" => {
  switch (status) {
    case 'draft': return 'secondary'
    case 'pending_review': return 'warning'
    case 'approved':
    case 'APPROVED': return 'success'
    case 'sent':
    case 'ENVIADO': return 'sent'
    case 'rejected': return 'destructive'
    default: return 'secondary'
  }
}

export const getStatusText = (status: string) => {
  switch (status) {
    case 'draft': return 'Borrador'
    case 'pending_review': return 'Pendiente'
    case 'approved':
    case 'APPROVED': return 'Aprobado'
    case 'sent': return 'Enviado'
    case 'ENVIADO': return 'Enviado'
    case 'rejected': return 'Rechazado'
    default: return status
  }
}
