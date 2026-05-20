import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface AddEventModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: () => void
    eventName: string
    eventDate: string
    guestCount: number
    onNameChange: (name: string) => void
    onDateChange: (date: string) => void
    onGuestCountChange: (count: number) => void
}

export function AddEventModal({
    isOpen,
    onClose,
    onSubmit,
    eventName,
    eventDate,
    guestCount,
    onNameChange,
    onDateChange,
    onGuestCountChange
}: AddEventModalProps) {
    const isValid = eventName.trim() && guestCount > 0

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary" />
                        Agregar Evento Manual
                    </DialogTitle>
                    <DialogDescription>
                        Crea un nuevo evento y define sus parámetros básicos.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="event-name">Nombre del Evento *</Label>
                        <Input
                            id="event-name"
                            value={eventName}
                            onChange={(e) => onNameChange(e.target.value)}
                            placeholder="Ej: Evento Viernes, Boda Juan y María..."
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="event-date">Fecha del Evento</Label>
                        <Input
                            id="event-date"
                            type="date"
                            value={eventDate}
                            onChange={(e) => onDateChange(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="guest-count">Número de Invitados *</Label>
                        <Input
                            id="guest-count"
                            type="number"
                            min="1"
                            value={guestCount || ''}
                            onChange={(e) => onGuestCountChange(parseInt(e.target.value) || 0)}
                            placeholder="Ej: 50"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={onSubmit} disabled={!isValid}>
                        <Plus className="h-4 w-4" />
                        Crear Evento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
