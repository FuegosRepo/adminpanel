'use client'

import { ArrowLeftRight, Wallet, Loader2 } from 'lucide-react'
import { PaymentMethod } from '@/types'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface PaymentMethodSelectorProps {
  orderId: string
  currentMethod: PaymentMethod | null
  onUpdate: (orderId: string, method: PaymentMethod | null) => void
  isUpdating?: boolean
  compact?: boolean
}

const PAYMENT_CONFIG: Record<PaymentMethod, { label: string; icon: typeof ArrowLeftRight; badgeClass: string }> = {
  transferencia: {
    label: 'Transferencia',
    icon: ArrowLeftRight,
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  efectivo_blanco: {
    label: 'Efectivo (Blanco)',
    icon: Wallet,
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  efectivo_negro: {
    label: 'Efectivo (Negro)',
    icon: Wallet,
    badgeClass: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700',
  },
}

function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const config = PAYMENT_CONFIG[method]
  const Icon = config.icon
  return (
    <Badge variant="outline" className={cn('text-xs font-medium gap-1', config.badgeClass)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

export default function PaymentMethodSelector({
  orderId,
  currentMethod,
  onUpdate,
  isUpdating = false,
  compact = false,
}: PaymentMethodSelectorProps) {
  if (compact) {
    if (!currentMethod) {
      return (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-dashed text-muted-foreground">
          Sin medio de pago
        </Badge>
      )
    }
    return <PaymentMethodBadge method={currentMethod} />
  }

  if (isUpdating) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Actualizando...
      </div>
    )
  }

  return (
    <Select
      value={currentMethod || ''}
      onValueChange={(value) => onUpdate(orderId, (value || null) as PaymentMethod | null)}
    >
      <SelectTrigger className="w-[200px] h-9">
        <SelectValue placeholder="Seleccionar medio de pago">
          {currentMethod ? (
            <PaymentMethodBadge method={currentMethod} />
          ) : (
            <span className="text-muted-foreground">Sin definir</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="transferencia">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-blue-600" />
            Transferencia
          </div>
        </SelectItem>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel className="text-xs text-muted-foreground">Efectivo</SelectLabel>
          <SelectItem value="efectivo_blanco">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-emerald-600" />
              En Blanco
            </div>
          </SelectItem>
          <SelectItem value="efectivo_negro">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-gray-600" />
              En Negro
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { PaymentMethodBadge }
