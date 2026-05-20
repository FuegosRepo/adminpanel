import { useState, useEffect } from 'react'
import { FilterOptions } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'

interface FilterBarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  resultsCount: number
}

const SEARCH_DEBOUNCE_MS = 300

export default function FilterBar({ filters, onFiltersChange, resultsCount }: FilterBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm || '')

  useEffect(() => {
    setLocalSearchTerm(filters.searchTerm || '')
  }, [filters.searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== (filters.searchTerm || '')) {
        onFiltersChange({ ...filters, searchTerm: localSearchTerm })
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [localSearchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value)
  }

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, dateFrom: e.target.value })
  }

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, dateTo: e.target.value })
  }

  const clearFilters = () => {
    setLocalSearchTerm('')
    onFiltersChange({
      status: 'all',
      dateFrom: '',
      dateTo: '',
      searchTerm: '',
      year: undefined,
      eventType: undefined
    })
  }

  return (
    <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'pending', label: 'Pendientes' },
            { value: 'approved', label: 'Aprobados' },
            { value: 'sent', label: 'Enviados' },
            { value: 'rejected', label: 'Rechazados' },
          ].map(sf => (
            <Button
              key={sf.value}
              variant={(!filters.status || filters.status === 'all') && sf.value === 'all' ? 'default' : filters.status === sf.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, status: sf.value as FilterOptions['status'] })}
            >
              {sf.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre, email..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        {/* Date Range */}
        <Input
          type="date"
          value={filters.dateFrom || ''}
          onChange={handleDateFromChange}
          className="w-[160px]"
          placeholder="Fecha desde"
        />
        <Input
          type="date"
          value={filters.dateTo || ''}
          onChange={handleDateToChange}
          className="w-[160px]"
          placeholder="Fecha hasta"
        />

        <div className="h-6 w-px bg-border mx-1"></div>

        <Button
          variant={filters.year === '2027' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFiltersChange({ ...filters, year: filters.year === '2027' ? undefined : '2027' })}
        >
          2027
        </Button>

        <Button
          variant={filters.eventType === 'mariage' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFiltersChange({ ...filters, eventType: filters.eventType === 'mariage' ? undefined : 'mariage' })}
        >
          Casamientos
        </Button>

        {/* Clear */}
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>

        {/* Results Count */}
        <Badge variant="secondary" className="ml-auto">
          {resultsCount} resultado{resultsCount !== 1 ? 's' : ''}
        </Badge>
      </div>
    </div>
  )
}