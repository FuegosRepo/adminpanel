'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { emailTemplates } from '@/data/mockData'
import { TemplateList } from './components/TemplateList'
import { TemplateEditor } from './components/TemplateEditor'
import type { PreviewEmailTemplate } from './types'

// Semilla: las mismas 5 plantillas francesas que hoy están hardcodeadas en
// EmailModal/mockData.ts, marcadas como predefinidas. Es la migración de
// datos que describe la Fase 1.5 del plan, sin tocar la base todavía.
const SEED_TEMPLATES: PreviewEmailTemplate[] = emailTemplates.map((t) => ({
    ...t,
    isPreset: true,
}))

let duplicateCounter = 0

export function EmailTemplatesPreview() {
    const [templates, setTemplates] = useState<PreviewEmailTemplate[]>(SEED_TEMPLATES)
    const [selectedId, setSelectedId] = useState<string | null>(SEED_TEMPLATES[0]?.id ?? null)

    const selected = templates.find((t) => t.id === selectedId) ?? null

    const handleChange = (updates: Partial<PreviewEmailTemplate>) => {
        if (!selectedId) return
        setTemplates((prev) =>
            prev.map((t) => (t.id === selectedId ? { ...t, ...updates } : t))
        )
    }

    const handleSave = () => {
        toast.info('Vista previa de diseño: en la versión conectada esto se guardaría en la base.')
    }

    const handleDuplicate = (id: string) => {
        const original = templates.find((t) => t.id === id)
        if (!original) return
        duplicateCounter += 1
        const copy: PreviewEmailTemplate = {
            ...original,
            id: `copy-${duplicateCounter}-${Date.now()}`,
            name: `${original.name} (copia)`,
            isPreset: false,
        }
        setTemplates((prev) => [...prev, copy])
        setSelectedId(copy.id)
        toast.success('Duplicada. Ahora es una plantilla personalizada y se puede editar.')
    }

    const handleNew = () => {
        duplicateCounter += 1
        const blank: PreviewEmailTemplate = {
            id: `new-${duplicateCounter}-${Date.now()}`,
            name: 'Nueva plantilla',
            subject: 'Asunto del email',
            content: 'Bonjour {name},\n\n[Escribí el contenido acá]\n\nCordialement,\nL\'équipe Fuegos d\'Azur',
            type: 'custom',
            isPreset: false,
        }
        setTemplates((prev) => [...prev, blank])
        setSelectedId(blank.id)
    }

    return (
        <div className="grid md:grid-cols-[280px_1fr] gap-4 items-start">
            <TemplateList
                templates={templates}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDuplicate={handleDuplicate}
                onNew={handleNew}
            />
            {selected ? (
                <TemplateEditor template={selected} onChange={handleChange} onSave={handleSave} />
            ) : (
                <p className="text-sm text-muted-foreground p-6 text-center">
                    Elegí una plantilla de la lista.
                </p>
            )}
        </div>
    )
}
