import React from 'react'
import {
    Calculator, CheckSquare, Plus, RefreshCw, Download, Share2,
    List, BarChart3, TrendingUp, Search, X, CheckCircle2, AlertCircle
} from 'lucide-react'
import { ViewMode } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface EventCalculatorHeaderProps {
    eventsCount: number
    regeneratingCosts: boolean
    viewMode: ViewMode
    filters: {
        search: string
        dateFrom: string
        dateTo: string
    }
    successMessage: string | null
    error: string | null
    onSelectOrders: () => void
    onAddManualEvent: () => void
    onRegenerateCosts: () => void
    onGeneratePDF: () => void
    onSharePDF: () => void
    onViewModeChange: (mode: ViewMode) => void
    onFiltersChange: (filters: { search: string; dateFrom: string; dateTo: string }) => void
}

const viewModes: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
    { mode: 'list', icon: List, label: 'Vista Lista' },
    { mode: 'timeline', icon: BarChart3, label: 'Vista Timeline' },
    { mode: 'comparison', icon: TrendingUp, label: 'Vista Comparar' },
    { mode: 'stats', icon: Calculator, label: 'Vista Estadísticas' },
]

export function EventCalculatorHeader({
    eventsCount,
    regeneratingCosts,
    viewMode,
    filters,
    successMessage,
    error,
    onSelectOrders,
    onAddManualEvent,
    onRegenerateCosts,
    onGeneratePDF,
    onSharePDF,
    onViewModeChange,
    onFiltersChange
}: EventCalculatorHeaderProps) {
    return (
        <div className="space-y-4">
            {/* Header Row */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Title Section */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Calculator className="h-7 w-7 text-primary" />
                        Calculadora de Ingredientes
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Gestiona múltiples eventos y calcula las cantidades totales de ingredientes necesarios
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                    <TooltipProvider delayDuration={200}>
                        <div className="flex items-center gap-1.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={onSelectOrders} size="sm">
                                        <CheckSquare className="h-4 w-4" />
                                        <span className="hidden sm:inline">Seleccionar</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Seleccionar Pedidos Aprobados</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" onClick={onAddManualEvent} size="sm">
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:inline">Manual</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Crear Evento Manual</TooltipContent>
                            </Tooltip>
                        </div>

                        {eventsCount > 0 && (
                            <>
                                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={onRegenerateCosts}
                                            disabled={regeneratingCosts}
                                        >
                                            <RefreshCw className={cn("h-4 w-4", regeneratingCosts && "animate-spin")} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Regenerar costos desde productos actualizados</TooltipContent>
                                </Tooltip>

                                <div className="flex items-center gap-0.5">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={onGeneratePDF}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Descargar PDF</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={onSharePDF}>
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Compartir PDF</TooltipContent>
                                    </Tooltip>
                                </div>

                                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                                {/* View Mode Toggle */}
                                <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
                                    {viewModes.map(({ mode, icon: Icon, label }) => (
                                        <Tooltip key={mode}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant={viewMode === mode ? 'secondary' : 'ghost'}
                                                    size="icon"
                                                    className={cn(
                                                        "h-7 w-7",
                                                        viewMode === mode && "bg-background shadow-sm"
                                                    )}
                                                    onClick={() => onViewModeChange(mode)}
                                                >
                                                    <Icon className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{label}</TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </>
                        )}
                    </TooltipProvider>
                </div>
            </div>

            {/* Success / Error Messages */}
            {successMessage && (
                <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Filters Bar */}
            {eventsCount > 0 && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar eventos..."
                            value={filters.search}
                            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                            className="pl-9 h-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
                            className="h-9 w-auto"
                        />
                        <span className="text-muted-foreground text-xs">—</span>
                        <Input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
                            className="h-9 w-auto"
                        />
                        {(filters.search || filters.dateFrom || filters.dateTo) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onFiltersChange({ search: '', dateFrom: '', dateTo: '' })}
                                className="text-muted-foreground"
                            >
                                <X className="h-4 w-4" />
                                Limpiar
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
