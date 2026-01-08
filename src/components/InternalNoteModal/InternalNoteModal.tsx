'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, StickyNote, Calendar, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import styles from './InternalNoteModal.module.css'

interface InternalNote {
    text: string
    createdAt: string
}

interface InternalNoteModalProps {
    isOpen: boolean
    orderName: string
    notes: InternalNote[]  // Array of notes
    onClose: () => void
    onAddNote: (note: string) => Promise<void>
    onDeleteNote: (index: number) => Promise<void>
    isAdding?: boolean
    isDeleting?: boolean
}

export default function InternalNoteModal({
    isOpen,
    orderName,
    notes = [],
    onClose,
    onAddNote,
    onDeleteNote,
    isAdding = false,
    isDeleting = false
}: InternalNoteModalProps) {
    const [newNote, setNewNote] = useState('')
    const [showInput, setShowInput] = useState(notes.length === 0)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setNewNote('')
            setShowInput(notes.length === 0)
        }
    }, [isOpen, notes.length])

    // Focus textarea when showing input
    useEffect(() => {
        if (showInput && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [showInput])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                if (showInput && notes.length > 0) {
                    setShowInput(false)
                    setNewNote('')
                } else {
                    onClose()
                }
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, showInput, notes.length, onClose])

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    const handleAddNote = async () => {
        if (!newNote.trim()) return
        await onAddNote(newNote.trim())
        setNewNote('')
        setShowInput(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault()
            handleAddNote()
        }
    }

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: es })
        } catch {
            return dateString
        }
    }

    if (!isOpen) return null

    const modalContent = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.titleRow}>
                        <StickyNote size={20} className={styles.icon} />
                        <h3>Notas Internas</h3>
                        <span className={styles.badge}>{notes.length}</span>
                    </div>
                    <button onClick={onClose} className={styles.closeButton} aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <p className={styles.subtitle}>
                    Historial de notas para <strong>{orderName}</strong>
                </p>

                <div className={styles.content}>
                    {/* Add new note section */}
                    {showInput ? (
                        <div className={styles.newNoteSection}>
                            <textarea
                                ref={textareaRef}
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe una nueva nota..."
                                className={styles.textarea}
                                rows={3}
                                maxLength={500}
                            />
                            <div className={styles.newNoteActions}>
                                <span className={styles.charCount}>{newNote.length}/500</span>
                                <div className={styles.buttonGroup}>
                                    {notes.length > 0 && (
                                        <button
                                            onClick={() => { setShowInput(false); setNewNote('') }}
                                            className={styles.cancelButton}
                                            disabled={isAdding}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button
                                        onClick={handleAddNote}
                                        className={styles.addButton}
                                        disabled={isAdding || !newNote.trim()}
                                    >
                                        {isAdding ? 'Guardando...' : 'Agregar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowInput(true)}
                            className={styles.addNoteButton}
                        >
                            <Plus size={16} />
                            Agregar nueva nota
                        </button>
                    )}

                    {/* Notes thread */}
                    <div className={styles.notesThread}>
                        {notes.map((note, index) => (
                            <div key={index} className={styles.noteItem}>
                                <div className={styles.noteHeader}>
                                    <div className={styles.noteDate}>
                                        <Calendar size={12} />
                                        <span>{formatDate(note.createdAt)}</span>
                                    </div>
                                    <button
                                        onClick={() => onDeleteNote(index)}
                                        className={styles.deleteNoteBtn}
                                        title="Eliminar nota"
                                        disabled={isDeleting}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <p className={styles.noteText}>{note.text}</p>
                            </div>
                        ))}

                        {notes.length === 0 && !showInput && (
                            <p className={styles.emptyState}>
                                No hay notas. Agrega la primera nota arriba.
                            </p>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.closeBtn}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}
