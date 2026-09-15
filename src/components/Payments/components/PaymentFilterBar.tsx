'use client'

import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAvailableYears } from '@/hooks/useAvailableYears'
import type { PaymentStateFilter } from '../types'

export interface PaymentFilters {
    state: PaymentStateFilter
    search: string
    year?: string
}

interface PaymentFilterBarProps {
    filters: PaymentFilters
    onChange: (filters: PaymentFilters) => void
    resultsCount: number
}

const STATE_OPTIONS: { value: PaymentStateFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Sin cobrar' },
    { value: 'partial', label: 'Parciales' },
    { value: 'completed', label: 'Completos' },
]

export function PaymentFilterBar({ filters, onChange, resultsCount }: PaymentFilterBarProps) {
    const { years } = useAvailableYears()

    return (
        <div className="bg-card border rounded-lg p-3 flex flex-wrap items-center gap-2">
            {STATE_OPTIONS.map((opt) => (
                <Button
                    key={opt.value}
                    size="sm"
                    variant={filters.state === opt.value ? 'default' : 'outline'}
                    onClick={() => onChange({ ...filters, state: opt.value })}
                >
                    {opt.label}
                </Button>
            ))}

            <div className="h-6 w-px bg-border mx-1" />

            {years.map((y) => {
                const yearStr = String(y)
                return (
                    <Button
                        key={yearStr}
                        size="sm"
                        variant={filters.year === yearStr ? 'default' : 'outline'}
                        onClick={() => onChange({ ...filters, year: filters.year === yearStr ? undefined : yearStr })}
                    >
                        {yearStr}
                    </Button>
                )
            })}

            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={filters.search}
                    onChange={(e) => onChange({ ...filters, search: e.target.value })}
                    placeholder="Buscar por cliente..."
                    className="pl-9 h-9"
                />
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => onChange({ state: 'all', search: '', year: undefined })}
            >
                <X className="h-4 w-4 mr-1" />
                Limpiar
            </Button>

            <Badge variant="secondary" className="ml-auto">
                {resultsCount} pedido{resultsCount !== 1 ? 's' : ''}
            </Badge>
        </div>
    )
}
