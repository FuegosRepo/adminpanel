import React, { useState } from 'react'
import { BudgetData } from '../types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronRight, CupSoda, Trash2 } from 'lucide-react'

interface BoissonsSoftSectionProps {
    data: BudgetData['boissonsSoft']
    onUpdate: (path: string, value: any) => void
    onDelete: () => void
}

export function BoissonsSoftSection({ data, onUpdate, onDelete }: BoissonsSoftSectionProps) {
    const [expanded, setExpanded] = useState(false)

    if (!data) return null

    return (
        <Card className="border-l-4 border-l-primary shadow-sm mt-6">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CupSoda className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-semibold text-primary m-0">
                            Boissons Soft
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDelete}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            title="Eliminar sección"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpanded(!expanded)}
                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                        >
                            {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            {expanded && (
                <CardContent className="pt-0 pb-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Precio por Persona (€)</Label>
                            <Input
                                type="number"
                                value={data.pricePerPerson}
                                onChange={(e) => onUpdate('boissonsSoft.pricePerPerson', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Personas</Label>
                            <Input
                                type="number"
                                value={data.totalPersons}
                                onChange={(e) => onUpdate('boissonsSoft.totalPersons', parseInt(e.target.value) || 0)}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md border border-border">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-semibold">TVA:</span>
                            <strong className="text-primary text-base">20%</strong>
                        </div>
                        <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border border-border">
                            ⚙️ Valor fijo (no editable)
                        </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg space-y-2 max-w-sm ml-auto mt-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Total HT:</span>
                            <strong className="text-foreground">{data.totalHT.toFixed(2)} €</strong>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">TVA (20%):</span>
                            <strong className="text-foreground">{data.tva.toFixed(2)} €</strong>
                        </div>
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-border bg-amber-100 dark:bg-amber-900/30 p-2 rounded text-base">
                            <span className="font-semibold text-amber-900 dark:text-amber-400">Total TTC:</span>
                            <strong className="text-amber-900 dark:text-amber-400">{data.totalTTC.toFixed(2)} €</strong>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
