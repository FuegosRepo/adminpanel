import React from 'react'
import { StickyNote, Save } from 'lucide-react'
import { Event } from '../../types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface NotesModalProps {
    isOpen: boolean
    onClose: () => void
    event: Event | undefined
    onNotesChange: (notes: string) => void
    onObservationsChange: (observations: string) => void
    onSave: () => void
}

export function NotesModal({
    isOpen,
    onClose,
    event,
    onNotesChange,
    onObservationsChange,
    onSave
}: NotesModalProps) {
    if (!event) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <StickyNote className="h-5 w-5 text-primary" />
                        Notas y Observaciones
                    </DialogTitle>
                    <DialogDescription>
                        Edita las notas y observaciones del evento &quot;{event.name}&quot;.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notas Generales</Label>
                        <Textarea
                            id="notes"
                            value={event.notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder="Notas generales sobre el evento..."
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observations">Observaciones</Label>
                        <Textarea
                            id="observations"
                            value={event.observations}
                            onChange={(e) => onObservationsChange(e.target.value)}
                            placeholder="Observaciones importantes..."
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={onSave}>
                        <Save className="h-4 w-4" />
                        Guardar Notas
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
