import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableRow, TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatLocalDate } from '@/utils/dateUtils'
import { getStatusVariant, getStatusText } from '../utils'

interface BudgetTableRowProps {
  budget: any
  isExpanded: boolean
  isSelected: boolean
  showCheckbox: boolean
  onToggleExpand: () => void
  onToggleSelection: () => void
}

export default function BudgetTableRow({ budget, isExpanded, isSelected, showCheckbox, onToggleExpand, onToggleSelection }: BudgetTableRowProps) {
  const clientInfo = budget.budget_data?.clientInfo || {}
  const totals = budget.budget_data?.totals || {}

  return (
    <TableRow
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50",
        isExpanded && "bg-muted/20"
      )}
      onClick={onToggleExpand}
      data-state={isSelected ? "selected" : undefined}
    >
      <TableCell className="w-12 pl-4" onClick={(e) => e.stopPropagation()}>
        {showCheckbox && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelection}
            aria-label="Seleccionar presupuesto"
          />
        )}
      </TableCell>

      <TableCell>
        <div className="font-medium text-base">{clientInfo.name || 'Cliente'}</div>
        <div className="text-sm text-muted-foreground">{clientInfo.email}</div>
        <div className="text-xs text-muted-foreground">{clientInfo.phone}</div>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
            📅 {formatLocalDate(clientInfo.eventDate)}
          </Badge>
          <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
            👥 {clientInfo.guestCount || 0} pax
          </Badge>
          <Badge variant="outline" className="text-xs font-normal whitespace-nowrap">
            {clientInfo.eventType || '-'}
          </Badge>
        </div>
      </TableCell>

      <TableCell className="text-right font-medium whitespace-nowrap">
        {totals.totalTTC ? `${totals.totalTTC.toFixed(2)} €` : '-'}
      </TableCell>

      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <Badge variant={getStatusVariant(budget.status)}>
            {getStatusText(budget.status)}
          </Badge>
          {budget.relance_count != null && budget.relance_count > 0 && (
            <Badge variant="info" className="text-[10px] px-1.5 py-0">
              {budget.relance_count}x relance
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
            aria-label={isExpanded ? 'Contraer' : 'Expandir'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
