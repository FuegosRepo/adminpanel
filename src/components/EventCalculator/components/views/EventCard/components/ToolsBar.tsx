import { Calculator, StickyNote, FileText, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Event } from '../../../../types'

interface ToolsBarProps {
    event: Event
    isSaving: boolean
    onToggleCosts: () => void
    onToggleNotes: () => void
    onShowNotesModal: () => void
    onRepair: () => void
}

/**
 * Barra de herramientas con acciones rápidas para el evento.
 * Incluye botones para analizar costos, ver notas, editar notas y reparar.
 */
export const ToolsBar = ({
    event,
    isSaving,
    onToggleCosts,
    onToggleNotes,
    onShowNotesModal,
    onRepair
}: ToolsBarProps) => {
    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {/* Botón reparar (si tiene orderId y no tiene advertencia) */}
            {event.orderId && !event.notes?.includes('Items no encontrados') && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        onRepair()
                    }}
                    disabled={isSaving}
                    className="text-xs h-7"
                >
                    <Wrench className="h-3.5 w-3.5" />
                    {isSaving ? 'Reparando...' : 'Reparar Evento'}
                </Button>
            )}

            {/* Botón analizar costos */}
            {event.ingredients.length > 0 && (
                <Button
                    variant={event.showCosts ? "secondary" : "outline"}
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggleCosts()
                    }}
                    className="text-xs h-7"
                >
                    <Calculator className="h-3.5 w-3.5" />
                    {event.showCosts ? 'Ocultar' : 'Analizar'} Costos
                </Button>
            )}

            {/* Botón ver notas */}
            <Button
                variant={event.showNotes ? "secondary" : "outline"}
                size="sm"
                onClick={(e) => {
                    e.stopPropagation()
                    onToggleNotes()
                }}
                className="text-xs h-7"
            >
                <StickyNote className="h-3.5 w-3.5" />
                {event.showNotes ? 'Ocultar' : 'Ver'} Notas
            </Button>

            {/* Botón editar notas */}
            <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation()
                    onShowNotesModal()
                }}
                className="text-xs h-7"
            >
                <FileText className="h-3.5 w-3.5" />
                Editar Notas
            </Button>
        </div>
    )
}
