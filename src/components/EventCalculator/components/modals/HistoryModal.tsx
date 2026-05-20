import React from 'react'
import { History, Clock } from 'lucide-react'
import { Event, EventCalculationVersion } from '@/components/EventCalculator/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface HistoryModalProps {
    isOpen: boolean
    onClose: () => void
    eventId: string | null
    events: Event[]
    eventVersions: { [key: string]: EventCalculationVersion[] }
    onRestoreVersion: (eventId: string, version: EventCalculationVersion) => void
}

export function HistoryModal({
    isOpen,
    onClose,
    eventId,
    events,
    eventVersions,
    onRestoreVersion
}: HistoryModalProps) {
    if (!eventId) return null

    const versions = eventVersions[eventId] || []

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Historial de Versiones
                    </DialogTitle>
                    <DialogDescription>
                        Visualiza y restaura versiones anteriores de este evento.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0">
                    {versions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                            <History className="h-12 w-12 text-muted-foreground/40" />
                            <p className="text-muted-foreground">No hay historial de versiones para este evento.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-2 min-h-0 max-h-[55vh]">
                            <div className="space-y-3">
                                {versions.map(version => (
                                    <div
                                        key={version.id}
                                        className="rounded-lg border p-4 space-y-2 transition-colors hover:bg-accent/30"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm">
                                                    Versión {version.version_number}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(version.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onRestoreVersion(eventId, version)}
                                            >
                                                <Clock className="h-3.5 w-3.5" />
                                                Restaurar
                                            </Button>
                                        </div>
                                        <div className="text-sm text-muted-foreground space-y-0.5">
                                            <p>
                                                <span className="font-medium text-foreground">Tipo:</span>{' '}
                                                <Badge variant="secondary" className="text-xs font-normal">
                                                    {version.change_type}
                                                </Badge>
                                            </p>
                                            {version.change_description && (
                                                <p>
                                                    <span className="font-medium text-foreground">Descripción:</span>{' '}
                                                    {version.change_description}
                                                </p>
                                            )}
                                            {version.version_data && (
                                                <details className="mt-2">
                                                    <summary className="text-xs cursor-pointer hover:text-foreground transition-colors">
                                                        Ver datos de la versión
                                                    </summary>
                                                    <pre className="mt-2 text-xs bg-muted rounded-md p-3 overflow-x-auto max-h-48">
                                                        {JSON.stringify(version.version_data, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
