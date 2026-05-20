import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { statusFilters } from '../utils'
import type { BudgetsFilters } from '@/services/budgetsService'

interface BudgetsFilterBarProps {
  filters: BudgetsFilters
  setFilters: (filters: BudgetsFilters) => void
  setPage: (page: number) => void
  budgetsCount: number
  selectedBudgets: Set<string>
  toggleSelectAll: () => void
}

export default function BudgetsFilterBar({ filters, setFilters, setPage, budgetsCount, selectedBudgets, toggleSelectAll }: BudgetsFilterBarProps) {
  const handleFilterChange = (newFilters: BudgetsFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const showSelectAll = filters.status && (filters.status.startsWith('relance_') || filters.status === 'sent')

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {statusFilters.map(sf => (
          <Button
            key={sf.value}
            variant={(!filters.status || filters.status === 'all') && sf.value === 'all' ? 'default' : filters.status === sf.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange({ ...filters, status: sf.value })}
            className={cn(
              sf.isRelance && "border-indigo-200 text-indigo-700 hover:bg-indigo-50",
              (filters.status === sf.value) && sf.isRelance && "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600"
            )}
          >
            {sf.label}
          </Button>
        ))}

        <div className="h-6 w-px bg-border mx-1"></div>

        <Button
          variant={filters.year === '2027' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange({ ...filters, year: filters.year === '2027' ? undefined : '2027' })}
        >
          2027
        </Button>

        <Button
          variant={filters.eventType === 'mariage' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange({ ...filters, eventType: filters.eventType === 'mariage' ? undefined : 'mariage' })}
        >
          Casamientos
        </Button>

        <div className="ml-auto min-w-[200px]">
          <Input
            type="text"
            placeholder="Buscar por cliente..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          />
        </div>
      </div>

      {showSelectAll && (
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <Checkbox
              checked={budgetsCount > 0 && selectedBudgets.size === budgetsCount}
              onCheckedChange={toggleSelectAll}
            />
            Seleccionar todos ({budgetsCount})
          </label>
          {selectedBudgets.size > 0 && (
            <span className="text-sm font-semibold text-indigo-700">
              {selectedBudgets.size} seleccionados
            </span>
          )}
        </div>
      )}
    </>
  )
}
