import React from 'react'
import { FileText, Eye, MailCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableRow, TableCell } from '@/components/ui/table'
import PaymentMethodSelector from '@/components/common/PaymentMethodSelector'
import type { PaymentMethod } from '@/types'

interface BudgetExpandedRowProps {
  budget: any
  onSelectBudget: (id: string) => void
  onMarkAsSentClick: (e: React.MouseEvent, id: string) => void
  onDeleteClick: (e: React.MouseEvent, id: string) => void
  onUpdatePaymentMethod?: (orderId: string, method: PaymentMethod | null) => void
  isUpdatingPaymentMethod?: boolean
}

export default function BudgetExpandedRow({ budget, onSelectBudget, onMarkAsSentClick, onDeleteClick, onUpdatePaymentMethod, isUpdatingPaymentMethod }: BudgetExpandedRowProps) {
  const isApproved = budget.status === 'approved' || budget.status === 'APPROVED'

  return (
    <TableRow className="bg-muted/30 hover:bg-muted/30">
      <TableCell colSpan={6} className="p-0 border-b">
        <div className="p-4 sm:p-6 lg:pl-16 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span><strong className="font-medium">Versión:</strong> v{budget.version}</span>
              <span><strong className="font-medium">Creado:</strong> {new Date(budget.created_at).toLocaleDateString('fr-FR')}</span>
              {budget.updated_at && (
                <span><strong className="font-medium">Actualizado:</strong> {new Date(budget.updated_at).toLocaleDateString('fr-FR')}</span>
              )}
              {isApproved && budget.order_id && onUpdatePaymentMethod && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Medio de Pago:</span>
                  <PaymentMethodSelector
                    orderId={budget.order_id}
                    currentMethod={(budget.catering_orders?.payment_method as PaymentMethod) || null}
                    onUpdate={onUpdatePaymentMethod}
                    isUpdating={isUpdatingPaymentMethod}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => onSelectBudget(budget.id)}>
                <Eye className="h-4 w-4 mr-1" /> Ver y Editar
              </Button>
              {budget.pdf_url && (
                <Button size="sm" variant="outline" asChild>
                  <a href={budget.pdf_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-1" /> Ver PDF
                  </a>
                </Button>
              )}
              {budget.pdf_url && budget.status !== 'approved' && budget.status !== 'sent' && budget.status !== 'ENVIADO' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => onMarkAsSentClick(e, budget.id)}
                  title="Marcar como enviado sin enviar email"
                >
                  <MailCheck className="h-4 w-4 mr-1" /> Marcar Enviado
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground ml-auto md:ml-0"
                onClick={(e) => onDeleteClick(e, budget.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
              </Button>
            </div>

          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}
