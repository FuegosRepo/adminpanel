'use client'

import { Lock, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TEMPLATE_VARIABLES, VARIABLE_SAMPLE_VALUES } from '../types'
import type { PreviewEmailTemplate } from '../types'

interface TemplateEditorProps {
    template: PreviewEmailTemplate
    onChange: (updates: Partial<PreviewEmailTemplate>) => void
    onSave: () => void
}

function renderPreview(text: string): string {
    let result = text
    Object.entries(VARIABLE_SAMPLE_VALUES).forEach(([key, value]) => {
        // split/join en vez de replaceAll: el target de tsconfig es es2020.
        result = result.split(`{${key}}`).join(value)
    })
    return result
}

export function TemplateEditor({ template, onChange, onSave }: TemplateEditorProps) {
    const readOnly = template.isPreset

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">Editar plantilla</CardTitle>
                        {readOnly && (
                            <Badge variant="secondary" className="gap-1 text-[10px]">
                                <Lock className="h-2.5 w-2.5" />
                                Predefinida, solo lectura
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Nombre interno</label>
                        <Input
                            value={template.name}
                            onChange={(e) => onChange({ name: e.target.value })}
                            disabled={readOnly}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Asunto</label>
                        <Input
                            value={template.subject}
                            onChange={(e) => onChange({ subject: e.target.value })}
                            disabled={readOnly}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Contenido</label>
                        <Textarea
                            value={template.content}
                            onChange={(e) => onChange({ content: e.target.value })}
                            disabled={readOnly}
                            className="min-h-[260px] font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">Variables disponibles</p>
                        <div className="flex flex-wrap gap-1.5">
                            {TEMPLATE_VARIABLES.map((v) => (
                                <Badge key={v.key} variant="outline" className="text-[11px] font-mono">
                                    {`{${v.key}}`}
                                    <span className="ml-1.5 font-sans text-muted-foreground">— {v.label}</span>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={onSave}
                        disabled={readOnly}
                        className="w-full gap-2"
                        title={readOnly ? 'Duplicá la plantilla para poder editarla' : undefined}
                    >
                        <Save className="h-4 w-4" />
                        Guardar cambios
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Vista previa</CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Con datos de ejemplo, tal como lo vería el cliente
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border bg-muted/40 p-4 space-y-3">
                        <div className="space-y-0.5 pb-2 border-b">
                            <p className="text-[11px] text-muted-foreground">Asunto</p>
                            <p className="text-sm font-medium">{renderPreview(template.subject)}</p>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {renderPreview(template.content)}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
