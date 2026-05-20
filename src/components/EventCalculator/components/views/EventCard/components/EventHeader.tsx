import { ChevronDown, ChevronUp, History, Copy, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { CardHeader } from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Event } from '../../../../types'

interface EventHeaderProps {
    event: Event
    isSelected: boolean
    isSaving: boolean
    onSelect: (checked: boolean) => void
    onToggleExpand: () => void
    onUpdateGuests: (count: number) => void
    onDuplicate: () => void
    onShowHistory: () => void
    onRemove: () => void
}

/**
 * Header del evento con título, metadata y acciones.
 * Incluye checkbox, botón expandir/colapsar, título, badges,
 * input de invitados y botones de acción (duplicar, historial, eliminar).
 */
export const EventHeader = ({
    event,
    isSelected,
    isSaving,
    onSelect,
    onToggleExpand,
    onUpdateGuests,
    onDuplicate,
    onShowHistory,
    onRemove
}: EventHeaderProps) => {
    return (
        <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
                {/* Left: checkbox + expand + title */}
                <div className="flex items-start gap-2 min-w-0 flex-1">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelect(checked as boolean)}
                        className="mt-1"
                    />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={onToggleExpand}
                    >
                        {event.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3
                                className="font-semibold text-sm truncate cursor-pointer hover:text-primary transition-colors"
                                onClick={onToggleExpand}
                            >
                                {event.name}
                            </h3>
                            {event.isSaved === false && (
                                <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">
                                    Sin guardar
                                </Badge>
                            )}
                            {isSaving && (
                                <Badge variant="secondary" className="text-xs animate-pulse">
                                    Guardando...
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                            {event.eventDate && (
                                <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                            )}
                            <span>🍽️ {event.ingredients.length} ingredientes</span>
                            {event.dbId && (
                                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                                    v{event.versionNumber || 1}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: guests + actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Guest count input */}
                    <div className="flex items-center gap-1.5 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Input
                            type="number"
                            value={event.guestCount}
                            onChange={(e) => onUpdateGuests(parseInt(e.target.value) || 0)}
                            min={1}
                            className="w-16 h-7 text-xs text-center"
                        />
                    </div>

                    {/* Action buttons */}
                    <TooltipProvider delayDuration={200}>
                        <div className="flex items-center gap-0.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDuplicate}>
                                        <Copy className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Duplicar evento</TooltipContent>
                            </Tooltip>

                            {event.dbId && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onShowHistory}>
                                            <History className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ver historial de versiones</TooltipContent>
                                </Tooltip>
                            )}

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onRemove}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Eliminar evento</TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </div>
            </div>
        </CardHeader>
    )
}
