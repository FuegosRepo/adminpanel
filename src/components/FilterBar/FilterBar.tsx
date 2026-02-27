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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as FilterOptions['status']
    onFiltersChange({ ...filters, status })
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
      searchTerm: ''
    })
  }

  return (
    <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
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

        {/* Status Select */}
        <select
          value={filters.status || 'all'}
          onChange={handleStatusChange}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="sent">Enviado</option>
          <option value="approved">Aprobado</option>
          <option value="rejected">Rechazado</option>
        </select>

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