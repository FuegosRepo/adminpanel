import React from 'react'
import { Save, CheckCircle2, FileText, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BudgetActionsProps {
    onSave: () => void
    onApproveAndSend: () => void
    onMarkAsSent: () => void
    onGeneratePDF: () => void
    saving: boolean
    hasPdf: boolean
    hasUnsavedChanges: boolean
}

export function BudgetActions({ onSave, onApproveAndSend, onMarkAsSent, onGeneratePDF, saving, hasPdf, hasUnsavedChanges }: BudgetActionsProps) {
    return (
        <div className="mt-8 flex flex-wrap justify-end gap-3 pb-12">
            {hasUnsavedChanges ? (
                <Button
                    onClick={onSave}
                    disabled={saving}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            ) : (
                <>
                    <Button
                        variant="secondary"
                        disabled={true}
                        className="bg-muted text-muted-foreground"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Guardado
                    </Button>

                    <Button
                        onClick={onGeneratePDF}
                        disabled={saving}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/10"
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        {saving ? 'Generando PDF...' : 'Generar PDF'}
                    </Button>

                    <Button
                        onClick={onMarkAsSent}
                        disabled={saving || hasUnsavedChanges || !hasPdf}
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-950/30"
                        title={hasUnsavedChanges ? 'Primero guarda los cambios' : (!hasPdf ? 'Primero debes generar el PDF' : 'Marcar como enviado sin enviar email')}
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        Marcar como Enviado
                    </Button>
                </>
            )}

            <Button
                onClick={onApproveAndSend}
                disabled={saving || hasUnsavedChanges || !hasPdf}
                className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                title={hasUnsavedChanges ? 'Primero guarda los cambios' : (!hasPdf ? 'Primero debes generar el PDF' : '')}
            >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Enviar Presupuesto
            </Button>
        </div>
    )
}
