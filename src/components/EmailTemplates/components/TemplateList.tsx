'use client'

import { FileText, Lock, Copy, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PreviewEmailTemplate } from '../types'

interface TemplateListProps {
    templates: PreviewEmailTemplate[]
    selectedId: string | null
    onSelect: (id: string) => void
    onDuplicate: (id: string) => void
    onNew: () => void
}

export function TemplateList({ templates, selectedId, onSelect, onDuplicate, onNew }: TemplateListProps) {
    return (
        <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={onNew}>
                <Plus className="h-4 w-4" />
                Nueva plantilla
            </Button>

            <div className="space-y-1.5 pt-1">
                {templates.map((template) => (
                    <Card
                        key={template.id}
                        onClick={() => onSelect(template.id)}
                        className={`p-3 cursor-pointer transition-colors hover:bg-accent ${selectedId === template.id ? 'border-primary bg-accent' : ''
                            }`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                                <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{template.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{template.subject}</p>
                                </div>
                            </div>
                            {template.isPreset ? (
                                <Badge variant="secondary" className="shrink-0 gap-1 text-[10px]">
                                    <Lock className="h-2.5 w-2.5" />
                                    Predefinida
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="shrink-0 text-[10px]">
                                    Personalizada
                                </Badge>
                            )}
                        </div>

                        {template.isPreset && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 mt-2 text-muted-foreground"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDuplicate(template.id)
                                }}
                            >
                                <Copy className="h-3 w-3 mr-1" />
                                Duplicar para editar
                            </Button>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
