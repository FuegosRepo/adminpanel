import React, { useState } from 'react'
import { BudgetData } from '../types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronRight, Car, Trash2 } from 'lucide-react'

interface DeplacementSectionProps {
    data: BudgetData['deplacement']
    onUpdate: (path: string, value: any) => void
    onDelete: () => void
}

export function DeplacementSection({ data, onUpdate, onDelete }: DeplacementSectionProps) {
    const [expanded, setExpanded] = useState(false)

    if (!data) return null

    return (
        <Card className="border-l-4 border-l-primary shadow-sm mt-6">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-semibold text-primary m-0">
                            Desplazamiento
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Distancia (km)</Label>
                            <Input
                                type="number"
                                value={data.distance}
                                onChange={(e) => onUpdate('deplacement.distance', parseFloat(e.target.value) || 0)}
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Precio por km (€)</Label>
                            <Input
                                type="number"
                                value={data.pricePerKm}
                                onChange={(e) => onUpdate('deplacement.pricePerKm', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>TVA (%)</Label>
                            <Input
                                type="number"
                                value={data.tvaPct}
                                onChange={(e) => onUpdate('deplacement.tvaPct', parseFloat(e.target.value) || 0)}
                                step="0.1"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg space-y-2 max-w-sm ml-auto mt-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Total HT:</span>
                            <strong className="text-foreground">{data.totalHT.toFixed(2)} €</strong>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">TVA ({data.tvaPct}%):</span>
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
