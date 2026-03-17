import { Plus, Rocket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { BudgetsFilters } from '@/services/budgetsService'

interface BudgetsHeaderProps {
  totalCount: number
  filters: BudgetsFilters
  selectedBudgets: Set<string>
  onBulkRelance: () => void
  onCreateManual: () => void
}

export default function BudgetsHeader({ totalCount, filters, selectedBudgets, onBulkRelance, onCreateManual }: BudgetsHeaderProps) {
  const showRelance = filters.status && (filters.status.startsWith('relance_') || filters.status === 'sent')

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-bold flex items-center gap-2">
        💰 Presupuestos Generados
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Total: {totalCount}</Badge>
        {showRelance && (
          <Button
            size="sm"
            variant={selectedBudgets.size > 0 ? 'default' : 'outline'}
            onClick={onBulkRelance}
            className="gap-1"
          >
            <Rocket className="h-4 w-4" />
            {selectedBudgets.size > 0
              ? `Relanzar seleccionados (${selectedBudgets.size})`
              : `Relanzar a todos (${filters.status === 'sent' ? '1ra vez' : filters.status === 'relance_3' ? '3+' : filters.status!.split('_')[1]})`
            }
          </Button>
        )}
        <Button size="sm" onClick={onCreateManual} className="gap-1">
          <Plus className="h-4 w-4" />
          Crear Presupuesto Manual
        </Button>
      </div>
    </div>
  )
}
