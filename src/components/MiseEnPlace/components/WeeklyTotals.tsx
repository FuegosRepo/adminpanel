'use client'

import { Sigma } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatQty } from '../utils'
import type { WeeklyTotal, MiseTask } from '../types'

interface WeeklyTotalsProps {
    totals: WeeklyTotal[]
    generalTasks: MiseTask[]
    notes: string
}

/** Resumen consolidado de la semana. Los totales los calcula el panel, no la IA. */
export function WeeklyTotals({ totals, generalTasks, notes }: WeeklyTotalsProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <Sigma className="h-4 w-4 text-primary" />
                    Resumen de cantidades totales
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Suma de todos los eventos incluidos. Calculado por el panel a partir de las fichas, no por la IA.
                </p>
            </CardHeader>
            <CardContent className="space-y-3">
                {totals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin cantidades para sumar todavía.</p>
                ) : (
                    <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-1.5 bg-muted text-xs font-medium text-muted-foreground">
                            <span>Producto</span>
                            <span>Total</span>
                        </div>
                        {totals.map((t) => (
                            <div key={`${t.label}|${t.unit}`} className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2 border-b last:border-b-0 items-center">
                                <div className="min-w-0">
                                    <p className="text-sm">{t.label}</p>
                                    <p className="text-[11px] text-muted-foreground truncate">
                                        {t.breakdown.map((b) => `${b.client} ${formatQty(b.quantity, null)}`).join(' + ')}
                                    </p>
                                </div>
                                <span className="text-sm font-mono tabular-nums font-medium">{formatQty(t.total, t.unit)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {generalTasks.length > 0 && (
                    <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Tareas generales de la semana</p>
                        <ul className="text-sm space-y-0.5">
                            {generalTasks.map((t) => (
                                <li key={t.id} className="flex justify-between gap-3 border-b last:border-b-0 py-1">
                                    <span>{t.label}{t.note ? <span className="text-xs text-muted-foreground"> · {t.note}</span> : null}</span>
                                    <span className="font-mono tabular-nums text-muted-foreground">{formatQty(t.quantity, t.unit)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {notes && <p className="text-xs text-muted-foreground border-t pt-2">{notes}</p>}
            </CardContent>
        </Card>
    )
}
