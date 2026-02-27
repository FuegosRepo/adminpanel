import React, { useState } from 'react'
import { BudgetData } from '../types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Trash2, Truck } from 'lucide-react'

interface DeliveryRepriseSectionProps {
    data: BudgetData['deliveryReprise']
    onUpdate: (path: string, value: any) => void
    onDelete: () => void
}

export function DeliveryRepriseSection({ data, onUpdate, onDelete }: DeliveryRepriseSectionProps) {
    const [expanded, setExpanded] = useState(false)

    if (!data) return null

    return (
        <Card className="mt-6 border-amber-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-amber-50/50 dark:bg-amber-950/20 py-3 flex flex-row items-center justify-between space-y-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100">
                        {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </Button>
                    <CardTitle className="text-xl flex items-center gap-2 text-amber-800 dark:text-amber-500">
                        <Truck className="h-5 w-5" /> Livraison et Reprise
                    </CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    title="Eliminar sección"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            {expanded && (
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Costo Entrega (€)</Label>
                            <Input
                                type="number"
                                value={data.deliveryCost}
                                onChange={(e) => onUpdate('deliveryReprise.deliveryCost', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                                className="border-amber-200 focus-visible:ring-amber-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Costo Recogida (€)</Label>
                            <Input
                                type="number"
                                value={data.pickupCost}
                                onChange={(e) => onUpdate('deliveryReprise.pickupCost', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                                className="border-amber-200 focus-visible:ring-amber-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>TVA (%)</Label>
                            <Input
                                type="number"
                                value={data.tvaPct}
                                onChange={(e) => onUpdate('deliveryReprise.tvaPct', parseFloat(e.target.value) || 0)}
                                step="0.1"
                                min="0"
                                max="100"
                                className="border-amber-200 focus-visible:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg space-y-2 max-w-sm ml-auto mt-6">
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
