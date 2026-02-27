import React from 'react'
import { BudgetData } from '../types'
import { Card, CardContent } from '@/components/ui/card'
import { Landmark } from 'lucide-react'

interface TotalsSectionProps {
    data: BudgetData['totals']
    menuDiscount?: { percentage: number; amount: number; reason: string }
    onUpdate: (path: string, value: any) => void
}

export function TotalsSection({ data, menuDiscount, onUpdate }: TotalsSectionProps) {
    // Con la nueva lógica, el totalHT ya incluye el descuento del menú (es totalHTApresRemise)
    // Por lo tanto, totalTTC = totalHT + totalTVA ya es el valor final correcto

    return (
        <Card className="mt-8 border-l-4 border-l-green-600 shadow-md overflow-hidden bg-green-50/30 dark:bg-green-950/20">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                    <div className="bg-green-600 text-white p-6 flex flex-col justify-center items-center md:w-1/3 rounded-tl-md rounded-tr-md md:rounded-tr-none md:rounded-bl-md">
                        <Landmark className="h-10 w-10 mb-2 opacity-80" />
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-center">
                            Totales Finales
                        </h2>
                    </div>

                    <div className="p-6 md:p-8 flex-1 space-y-4">
                        <div className="flex justify-between items-center text-lg border-b border-border/50 pb-3">
                            <span className="text-muted-foreground font-medium">Total HT Global:</span>
                            <strong className="text-foreground">{data.totalHT.toFixed(2)} €</strong>
                        </div>
                        <div className="flex justify-between items-center text-lg border-b border-border/50 pb-3">
                            <span className="text-muted-foreground font-medium">Total TVA Global:</span>
                            <strong className="text-foreground">{data.totalTVA.toFixed(2)} €</strong>
                        </div>

                        {menuDiscount && menuDiscount.amount > 0 && (
                            <div className="flex justify-between items-center text-sm text-amber-600 dark:text-amber-500 pb-2">
                                <span>Descuento Aplicado ({menuDiscount.percentage}%):</span>
                                <span>-{menuDiscount.amount.toFixed(2)} €</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-4">
                            <span className="text-xl md:text-2xl font-black text-green-700 dark:text-green-500 uppercase tracking-wider">
                                TOTAL TTC:
                            </span>
                            <span className="text-3xl md:text-4xl font-black text-green-700 dark:text-green-500 tabular-nums">
                                {data.totalTTC.toFixed(2)} €
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
