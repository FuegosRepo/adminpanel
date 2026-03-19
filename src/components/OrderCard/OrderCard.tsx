'use client'

import { useState, useEffect, memo, Fragment } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CateringOrder, EmailTemplate, PaymentMethod } from '@/types'
import { differenceInDays } from 'date-fns'
import { Mail, Eye, ChevronDown, ChevronUp, Clock, Trash2, FileText, StickyNote } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { emailTemplates } from '@/data/mockData'
import { formatLocalDate } from '@/utils/dateUtils'
import { ProductListResolver } from '@/components/admin/ProductListResolver'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import PaymentMethodSelector from '@/components/common/PaymentMethodSelector'
import InternalNoteModal from '@/components/InternalNoteModal/InternalNoteModal'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableRow, TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface OrderCardProps {
  order: CateringOrder
  isSelected: boolean
  onStatusChange: (orderId: string, newStatus: CateringOrder['status']) => void
  onSendEmail: (order: CateringOrder, template?: EmailTemplate) => void
  onViewDetails: (order: CateringOrder) => void
  onSelectionChange: (orderId: string, isSelected: boolean) => void
  onUpdateOrder?: (orderId: string, updates: Partial<CateringOrder>) => void
  onDelete?: (orderId: string) => void
  onUpdatePaymentMethod?: (orderId: string, method: PaymentMethod | null) => void
  isUpdatingPaymentMethod?: boolean
  onAddInternalNote?: (orderId: string, note: string) => Promise<void>
  onDeleteInternalNote?: (orderId: string, noteIndex: number) => Promise<void>
  isAddingNote?: boolean
  isDeletingNote?: boolean
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "sent" => {
  switch (status) {
    case 'pending': return 'warning'
    case 'sent':
    case 'ENVIADO': return 'sent'
    case 'approved': return 'success'
    case 'rejected': return 'destructive'
    default: return 'secondary'
  }
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
  onUpdatePaymentMethod,
  isUpdatingPaymentMethod = false,
  onAddInternalNote,
  onDeleteInternalNote,
  isAddingNote = false,
  isDeletingNote = false
}: OrderCardProps) => {
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [relanceModalOpen, setRelanceModalOpen] = useState(false)
  const [lastRelanceDate, setLastRelanceDate] = useState<string | null>(null)
  const [relanceCount, setRelanceCount] = useState(0)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [noteModalOpen, setNoteModalOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    let cancelled = false
    const fetchRelanceData = async () => {
      const { data, count } = await supabase
        .from('email_logs')
        .select('sent_at', { count: 'exact' })
        .eq('order_id', order.id)
        .eq('subject', 'Relance - Votre devis Fuegos d\'Azur')
        .order('sent_at', { ascending: false })
      if (cancelled) return
      if (data && data.length > 0) setLastRelanceDate(data[0].sent_at)
      setRelanceCount(count || 0)
    }
    fetchRelanceData()
    return () => { cancelled = true }
  }, [order.id])

  const handleRelanceClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRelanceModalOpen(true)
  }

  const confirmRelance = async () => {
    try {
      const template = emailTemplates.find(t => t.id === '5')
      if (!template) return
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          customSubject: template.subject,
          customContent: template.content,
          type: template.type
        })
      })
      if (response.ok) {
        setLastRelanceDate(new Date().toISOString())
        setRelanceCount(prev => prev + 1)
        setRelanceModalOpen(false)
        toast.success('Email de relance enviado correctamente')
      } else {
        toast.error('Error al enviar el email')
      }
    } catch (e) {
      console.error(e)
      toast.error('Error al enviar el email')
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
      case 'ENVIADO': return 'Enviado'
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
    <Fragment>
      <TableRow
        className={cn("cursor-pointer transition-colors hover:bg-muted/50", isExpanded && "bg-muted/20")}
        onClick={() => setIsExpanded(!isExpanded)}
      >

        {/* Client Info */}
        <TableCell>
          <div className="font-medium">{order.contact.name}</div>
          <div className="text-sm text-muted-foreground">{order.contact.email}</div>
          <div className="text-xs text-muted-foreground">{order.contact.phone}</div>
        </TableCell>

        {/* Event / Summary */}
        <TableCell>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
              📅 {formatDate(order.contact.eventDate)}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
              👥 {order.contact.guestCount} pax
            </Badge>
            <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
              {getEventTypeText(order.contact.eventType)}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
              🍽️ {order.menu.type === 'dejeuner' ? 'Almuerzo' : order.menu.type === 'diner' ? 'Cena' : 'Menú'}
            </Badge>
          </div>
        </TableCell>

        {/* Price */}
        <TableCell className="text-right whitespace-nowrap">
          {order.estimatedPrice && (
            <div className="font-semibold">
              €{mounted ? order.estimatedPrice.toLocaleString() : order.estimatedPrice}
            </div>
          )}
        </TableCell>

        {/* Status */}
        <TableCell className="text-center">
          <div className="flex flex-col items-center gap-1">
            <Badge variant={getStatusVariant(order.status)}>
              {getStatusText(order.status)}
            </Badge>
            {relanceCount > 0 && (
              <Badge variant="info" className="text-[10px] px-1.5 py-0 whitespace-nowrap">
                {relanceCount}x relance
              </Badge>
            )}
            {order.status === 'approved' && (
              <PaymentMethodSelector
                orderId={order.id}
                currentMethod={order.paymentMethod ?? null}
                onUpdate={onUpdatePaymentMethod || (() => {})}
                compact
              />
            )}
          </div>
        </TableCell>

        {/* Actions */}
        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 relative", order.internalNotes?.length && "text-amber-600")}
              onClick={(e) => { e.stopPropagation(); setNoteModalOpen(true) }}
              title={order.internalNotes?.length ? `${order.internalNotes.length} nota(s)` : 'Notas'}
            >
              <StickyNote className="h-4 w-4" />
              {order.internalNotes?.length ? (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {order.internalNotes.length}
                </span>
              ) : null}
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true) }}
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
              aria-label={isExpanded ? 'Contraer' : 'Expandir'}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded Content */}
      {isExpanded && (
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell colSpan={6} className="p-0 border-b">
            <div className="p-4 sm:p-6 lg:pl-16 space-y-6">

              {/* Menu Details & Action Bar side-by-side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Menu Info */}
                <div>
                  <h4 className="font-semibold mb-3">Detalles del Menú</h4>
                  <div className="space-y-3">
                    {order.entrees.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold text-muted-foreground mb-1">Entrées</h5>
                        <ProductListResolver ids={order.entrees} category="entrees" />
                      </div>
                    )}
                    {order.viandes.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold text-muted-foreground mb-1">Viandes</h5>
                        <ProductListResolver ids={order.viandes} category="viandes" />
                      </div>
                    )}
                    {order.dessert && (
                      <div>
                        <h5 className="text-sm font-semibold text-muted-foreground mb-1">Dessert</h5>
                        <ProductListResolver ids={order.dessert} category="desserts" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {order.extras.wines && <Badge variant="secondary">🍷 Vinos</Badge>}
                      {order.extras.decoration && <Badge variant="secondary">🎨 Decoración</Badge>}
                      {order.extras.equipment.length > 0 && <Badge variant="secondary">🔧 {order.extras.equipment.length} equipos</Badge>}
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="space-y-4">
                  {/* Status Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Cambiar Estado:</span>
                    <select
                      className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={order.status === 'ENVIADO' ? 'sent' : order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as CateringOrder['status'])}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="sent">Enviado</option>
                      <option value="approved">Aprobado</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                  </div>

                  {/* Payment Method - Only for approved orders */}
                  {order.status === 'approved' && onUpdatePaymentMethod && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">Medio de Pago:</span>
                      <PaymentMethodSelector
                        orderId={order.id}
                        currentMethod={order.paymentMethod ?? null}
                        onUpdate={onUpdatePaymentMethod}
                        isUpdating={isUpdatingPaymentMethod}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold mt-2">Acciones</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={handleRelanceClick}>
                        <Mail className="h-4 w-4 mr-1" />
                        Relanzar
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onViewDetails(order); }}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                      {!order.hasBudget && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={async (e) => {
                            e.stopPropagation()
                            const confirmGen = confirm('¿Generar presupuesto automático?')
                            if (!confirmGen) return
                            try {
                              const response = await fetch('/api/generate-budget-from-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ orderId: order.id })
                              })
                              if (response.ok) {
                                toast.success('Presupuesto generado')
                                queryClient.invalidateQueries({ queryKey: ['orders'] })
                                queryClient.invalidateQueries({ queryKey: ['budgets'] })
                              } else throw new Error('Error')
                            } catch { toast.error('No se pudo generar') }
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Generar Presupuesto
                        </Button>
                      )}
                    </div>
                    {/* Last relance info */}
                    {lastRelanceDate && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Último envío: hace {getDaysSinceRelance()} días</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Client Notes / Internal Notes underneath */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t pt-4 border-black/5 dark:border-white/10">
                {order.extras?.specialRequest ? (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Petición Especial del Cliente
                    </h4>
                    <div className="text-sm border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 rounded-r-md italic">
                      {order.extras.specialRequest}
                    </div>
                  </div>
                ) : <div />}

                {order.notes && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Notas del Pedido
                    </h4>
                    <div className="text-sm text-muted-foreground bg-muted/50 px-4 py-3 rounded-md">
                      {order.notes}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Relance Confirmation Modal */}
      {relanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setRelanceModalOpen(false)}>
          <div className="bg-background rounded-lg p-6 shadow-lg max-w-md w-full mx-4 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Confirmar Relanzamiento</h3>
            <p className="text-sm text-muted-foreground">¿Estás de acuerdo en enviar el email de relance a:</p>
            <p className="text-sm"><strong>{order.contact.name}</strong> ({order.contact.email})?</p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setRelanceModalOpen(false)}>Cancelar</Button>
              <Button onClick={(e) => { e.stopPropagation(); confirmRelance(); }}>Sí, enviar</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (onDelete) onDelete(order.id)
          setDeleteModalOpen(false)
        }}
        title="¿Eliminar pedido?"
        message="¿Estás seguro de que deseas eliminar este pedido?\n\nEsta acción es permanente y eliminará tanto el pedido como el presupuesto en ambas secciones para mantener la sincronización."
        confirmLabel="Eliminar"
        variant="danger"
      />

      <InternalNoteModal
        isOpen={noteModalOpen}
        orderName={order.contact.name}
        notes={order.internalNotes || []}
        onClose={() => setNoteModalOpen(false)}
        onAddNote={async (note) => {
          if (onAddInternalNote) await onAddInternalNote(order.id, note)
        }}
        onDeleteNote={async (noteIndex) => {
          if (onDeleteInternalNote) await onDeleteInternalNote(order.id, noteIndex)
        }}
        isAdding={isAddingNote}
        isDeleting={isDeletingNote}
      />
    </Fragment>
  )
}

export default memo(OrderCard)
