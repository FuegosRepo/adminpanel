'use client'

import { useState } from 'react'
import { StickyNote, Plus, Trash2, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import styles from './InternalNoteSection.module.css'

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
            <div className={styles.container}>
                <div className={styles.header}>
                    <StickyNote size={18} className={styles.icon} />
                    <h3>Notas Internas</h3>
                </div>
                <p className={styles.noOrder}>
                    Sin pedido vinculado. Las notas solo están disponibles para presupuestos con pedido asociado.
                </p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <StickyNote size={18} className={styles.icon} />
                    <h3>Notas Internas</h3>
                    <span className={styles.badge}>{notes.length}</span>
                </div>
            </div>

            <p className={styles.description}>
                Historial de notas privadas. No aparece en el PDF.
            </p>

            <div className={styles.content}>
                {/* Add note input */}
                {showInput ? (
                    <div className={styles.newNoteSection}>
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Nueva nota..."
                            className={styles.textarea}
                            rows={2}
                            maxLength={500}
                            autoFocus
                        />
                        <div className={styles.inputActions}>
                            <span className={styles.charCount}>{newNote.length}/500</span>
                            <div className={styles.buttonGroup}>
                                <button
                                    onClick={() => { setShowInput(false); setNewNote('') }}
                                    className={styles.cancelBtn}
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className={styles.addBtn}
                                    disabled={saving || !newNote.trim()}
                                >
                                    {saving ? 'Guardando...' : 'Agregar'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowInput(true)}
                        className={styles.addNoteBtn}
                    >
                        <Plus size={14} />
                        Agregar nota
                    </button>
                )}

                {/* Notes list */}
                <div className={styles.notesThread}>
                    {notes.map((note, index) => (
                        <div key={index} className={styles.noteItem}>
                            <div className={styles.noteHeader}>
                                <div className={styles.noteDate}>
                                    <Calendar size={12} />
                                    <span>{formatDate(note.createdAt)}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className={styles.deleteBtn}
                                    title="Eliminar"
                                    disabled={saving}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <p className={styles.noteText}>{note.text}</p>
                        </div>
                    ))}

                    {notes.length === 0 && !showInput && (
                        <p className={styles.emptyState}>Sin notas aún</p>
                    )}
                </div>
            </div>
        </div>
    )
}
