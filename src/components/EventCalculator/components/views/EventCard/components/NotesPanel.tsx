import { Badge } from '@/components/ui/badge'
import type { Event } from '../../../../types'
import type { EventCalculationNote } from '@/types'

interface NotesPanelProps {
    event: Event
    eventNotes?: EventCalculationNote[]
}

/**
 * Panel que muestra las notas y observaciones del evento.
 * Incluye notas del evento, observaciones y notas adicionales de la BD.
 */
export const NotesPanel = ({ event, eventNotes }: NotesPanelProps) => {
    return (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
            {/* Notas del evento */}
            {event.notes && (
                <div className="rounded-md bg-background border p-3">
                    <h5 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Notas</h5>
                    <p className="text-sm">{event.notes}</p>
                </div>
            )}

            {/* Observaciones */}
            {event.observations && (
                <div className="rounded-md bg-background border p-3">
                    <h5 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Observaciones</h5>
                    <p className="text-sm">{event.observations}</p>
                </div>
            )}

            {/* Notas adicionales de la BD */}
            {eventNotes && eventNotes.length > 0 && (
                <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notas Adicionales</h5>
                    {eventNotes.map(note => (
                        <div key={note.id} className="rounded-md bg-background border p-3 space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{note.note_type}</Badge>
                                {note.priority !== 'normal' && (
                                    <Badge
                                        variant={note.priority === 'high' ? 'destructive' : 'secondary'}
                                        className="text-xs"
                                    >
                                        {note.priority}
                                    </Badge>
                                )}
                            </div>
                            {note.title && <strong className="text-sm block">{note.title}</strong>}
                            <p className="text-sm text-muted-foreground">{note.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
