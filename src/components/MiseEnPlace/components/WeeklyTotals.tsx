'use client'

import { useState } from 'react'
import { Sigma, Pencil, RotateCcw, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatQty } from '../utils'
import type { WeeklyTotal, MiseTask } from '../types'

interface WeeklyTotalsProps {
    totals: WeeklyTotal[]
    generalTasks: MiseTask[]
    notes: string
    /** Totales ajustados a mano (ej. redondear papas a 100 kg para comprar). key → valor */
    overrides: Record<string, number>
    onOverride: (key: string, value: number | null) => void
}

function TotalRow({ total, override, onOverride }: { total: WeeklyTotal; override?: number; onOverride: (v: number | null) => void }) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState('')

    const startEdit = () => {
        setDraft(String(override ?? total.total))
        setEditing(true)
    }
    const commit = () => {
        const v = Number(draft.replace(',', '.'))
        if (Number.isFinite(v) && v > 0 && Math.abs(v - total.total) > 0.0001) onOverride(v)
        else if (Number.isFinite(v) && Math.abs(v - total.total) <= 0.0001) onOverride(null)
        setEditing(false)
    }

    return (
        <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2 border-b last:border-b-0 items-center">
            <div className="min-w-0">
                <p className="text-sm">{total.label}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                    {total.breakdown.map((b) => `${b.client} ${formatQty(b.quantity, null)}`).join(' + ')}
                </p>
                {override !== undefined && (
                    <p className="text-[11px] text-amber-700">
                        Ajustado a mano · calculado: {formatQty(total.total, total.unit)}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
                {editing ? (
                    <>
                        <Input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') commit()
                                if (e.key === 'Escape') setEditing(false)
                            }}
                            autoFocus
                            className="h-7 w-20 text-right font-mono text-sm"
                        />
                        <span className="text-xs text-muted-foreground">{total.unit}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={commit} aria-label="Confirmar">
                            <Check className="h-3.5 w-3.5" />
                        </Button>
                    </>
                ) : (
                    <>
                        <span className={`text-sm font-mono tabular-nums font-medium ${override !== undefined ? 'text-amber-700' : ''}`}>
                            {formatQty(override ?? total.total, total.unit)}
                        </span>
                        {override !== undefined && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => onOverride(null)} title="Volver al calculado" aria-label="Volver al calculado">
                                <RotateCcw className="h-3 w-3" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={startEdit} title="Ajustar total a mano" aria-label="Ajustar total">
                            <Pencil className="h-3 w-3" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}

/** Resumen consolidado de la semana. Los totales los calcula el panel, no la IA; se pueden ajustar a mano. */
export function WeeklyTotals({ totals, generalTasks, notes, overrides, onOverride }: WeeklyTotalsProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <Sigma className="h-4 w-4 text-primary" />
                    Resumen de cantidades totales
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Suma de todos los eventos incluidos, calculada por el panel. Con el lápiz podés
                    ajustar un total a lo que vas a comprar (ej. redondear papas a 100 kg); queda
                    marcado y sale así en el PDF.
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
                            <TotalRow key={t.key} total={t} override={overrides[t.key]} onOverride={(v) => onOverride(t.key, v)} />
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
