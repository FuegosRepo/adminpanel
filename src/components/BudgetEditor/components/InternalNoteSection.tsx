'use client'

import { useState } from 'react'
import { StickyNote, Plus, Trash2, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

interface InternalNote {
    text: string
    createdAt: string
}

interface InternalNoteSectionProps {
    notes: InternalNote[]
    orderId: string | null
    onAdd: (note: string) => Promise<{ success: boolean; error?: any }>
    onDelete: (noteIndex: number) => Promise<{ success: boolean; error?: any }>
    saving?: boolean
}

export function InternalNoteSection({
    notes = [],
    orderId,
    onAdd,
    onDelete,
    saving = false
}: InternalNoteSectionProps) {
    const [newNote, setNewNote] = useState('')
    const [showInput, setShowInput] = useState(false)

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: es })
        } catch {
            return dateString
        }
    }

    const handleAdd = async () => {
        if (!newNote.trim()) return
        const result = await onAdd(newNote.trim())
        if (result.success) {
            toast.success('Nota agregada')
            setNewNote('')
            setShowInput(false)
        } else {
            toast.error('Error al agregar nota')
        }
    }

    const handleDelete = async (index: number) => {
        const result = await onDelete(index)
        if (result.success) {
            toast.success('Nota eliminada')
        } else {
            toast.error('Error al eliminar nota')
        }
    }

    // If no order linked
    if (!orderId) {
        return (
            <Card className="mt-8 shadow-sm border-blue-200">
                <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20 py-4 border-b border-blue-100">
                    <CardTitle className="text-xl flex items-center gap-2 text-blue-800 dark:text-blue-500">
                        <StickyNote className="h-5 w-5" /> Notas Internas
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-muted-foreground text-center">
                    <p>Sin pedido vinculado. Las notas solo están disponibles para presupuestos con pedido asociado.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mt-8 shadow-sm border-blue-200 overflow-hidden">
            <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20 py-4 border-b border-blue-100">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2 text-blue-800 dark:text-blue-500">
                        <StickyNote className="h-5 w-5" />
                        Notas Internas
                        {notes.length > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">{notes.length}</Badge>
                        )}
                    </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                    Historial de notas privadas. No aparece en el PDF.
                </p>
            </CardHeader>

            <CardContent className="p-0">
                {/* Notes list */}
                <div className="flex flex-col">
                    {notes.map((note, index) => (
                        <div key={index} className="flex flex-col p-4 border-b border-border hover:bg-muted/30 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{formatDate(note.createdAt)}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(index)}
                                    disabled={saving}
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.text}</p>
                        </div>
                    ))}

                    {notes.length === 0 && !showInput && (
                        <div className="p-8 text-center text-muted-foreground italic">
                            Sin notas aún
                        </div>
                    )}
                </div>

                {/* Add note input area */}
                <div className="p-4 bg-muted/10 border-t border-border focus-within:bg-muted/30 transition-colors">
                    {showInput ? (
                        <div className="space-y-3">
                            <Textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Escribe una nueva nota..."
                                rows={3}
                                maxLength={500}
                                autoFocus
                                className="resize-none border-blue-200 focus-visible:ring-blue-500"
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    {newNote.length}/500
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => { setShowInput(false); setNewNote('') }}
                                        disabled={saving}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleAdd}
                                        disabled={saving || !newNote.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {saving ? 'Guardando...' : 'Agregar Nota'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setShowInput(true)}
                            className="w-full border-dashed border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Agregar Nueva Nota
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
