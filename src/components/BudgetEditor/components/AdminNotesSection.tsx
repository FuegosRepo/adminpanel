'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileEdit } from 'lucide-react'

interface AdminNotesSectionProps {
    adminNotes?: string
    onUpdate: (field: string, value: any) => void
}

export function AdminNotesSection({ adminNotes, onUpdate }: AdminNotesSectionProps) {
    return (
        <Card className="mt-8 shadow-sm">
            <CardHeader className="bg-muted/30 py-4 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                    <FileEdit className="h-5 w-5 text-primary" /> Notas del administrador
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div>
                        <Label className="text-base font-medium">
                            Notas personalizadas para el presupuesto
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                (Estas notas aparecerán en el PDF para el cliente)
                            </span>
                        </Label>
                        <Textarea
                            className="mt-2 min-h-[120px]"
                            value={adminNotes || ''}
                            onChange={(e) => onUpdate('adminNotes', e.target.value)}
                            placeholder="Ej: Ofrecemos un descuento especial del 10% si confirma antes del 31 de enero..."
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
