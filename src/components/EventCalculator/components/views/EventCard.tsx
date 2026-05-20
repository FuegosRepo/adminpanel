import { useMemo } from 'react'
import { useEventCalculator } from '../../context/EventCalculatorContext'
import { useEventCosts, useEventCardActions } from './EventCard/hooks'
import {
    EventHeader,
    WarningBox,
    ToolsBar,
    CostsPanel,
    NotesPanel,
    IngredientsTable
} from './EventCard/components'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { Event } from '../../types'

interface EventCardProps {
    event: Event
}

/**
 * Componente principal de tarjeta de evento.
 * Actúa como compositor que orquesta todos los sub-componentes.
 * 
 * Refactorizado para eliminar IIFEs, reducir complejidad y mejorar testeabilidad.
 */
export const EventCard = ({ event }: EventCardProps) => {
    const { saving, eventNotes, selectedEventIds } = useEventCalculator()

    // Hooks personalizados
    const costs = useEventCosts(event)
    const actions = useEventCardActions(event.id)

    // Estados derivados
    const isSelected = selectedEventIds.includes(event.id)
    const isSaving = saving === event.id

    return (
        <Card className={cn(
            "transition-all duration-200",
            event.expanded && "ring-1 ring-primary/20 shadow-md",
            event.isSaved === false && "border-amber-300 bg-amber-50/30"
        )}>
            {/* Header con título, metadata y acciones principales */}
            <EventHeader
                event={event}
                isSelected={isSelected}
                isSaving={isSaving}
                onSelect={actions.onSelect}
                onToggleExpand={actions.onToggleExpand}
                onUpdateGuests={actions.onUpdateGuests}
                onDuplicate={actions.onDuplicate}
                onShowHistory={actions.onShowHistory}
                onRemove={actions.onRemove}
            />

            {/* Contenido expandible */}
            {event.expanded && (
                <CardContent className="pt-0 space-y-4">
                    {/* Advertencia de items no encontrados */}
                    {event.notes?.includes('Items no encontrados') && (
                        <WarningBox
                            message={event.notes}
                            onRepair={actions.onRepair}
                            isSaving={isSaving}
                        />
                    )}

                    {/* Barra de herramientas */}
                    <ToolsBar
                        event={event}
                        isSaving={isSaving}
                        onToggleCosts={actions.onToggleCosts}
                        onToggleNotes={actions.onToggleNotes}
                        onShowNotesModal={actions.onShowNotes}
                        onRepair={actions.onRepair}
                    />

                    {/* Panel de análisis de costos */}
                    {event.showCosts && (
                        <CostsPanel costs={costs} />
                    )}

                    {/* Panel de notas y observaciones */}
                    {event.showNotes && (
                        <NotesPanel
                            event={event}
                            eventNotes={eventNotes[event.id]}
                        />
                    )}

                    {/* Tabla de ingredientes */}
                    <IngredientsTable
                        event={event}
                        onOpenMaterialSelector={actions.onOpenMaterialSelector}
                    />
                </CardContent>
            )}
        </Card>
    )
}
