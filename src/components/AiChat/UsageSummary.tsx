'use client'

import { useEffect, useState } from 'react'
import { DollarSign, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUsageLog, clearUsageLog, type UsageEntry } from './usageStorage'

interface UsageSummaryProps {
    /** Cambiarlo fuerza a releer localStorage (después de cada consulta nueva). */
    refreshKey: number
}

function isSameMonth(iso: string, ref: Date): boolean {
    const d = new Date(iso)
    return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}

/**
 * Botón + diálogo con el gasto estimado de IA, por consulta. Guardado en
 * localStorage (ver usageStorage.ts), no en la cuenta real de OpenAI —
 * el número exacto y definitivo siempre está en platform.openai.com/usage.
 */
export function UsageSummary({ refreshKey }: UsageSummaryProps) {
    const [open, setOpen] = useState(false)
    const [log, setLog] = useState<UsageEntry[]>([])

    useEffect(() => {
        setLog(getUsageLog())
    }, [refreshKey, open])

    const now = new Date()
    const monthEntries = log.filter((e) => isSameMonth(e.timestamp, now))
    const monthCost = monthEntries.reduce((sum, e) => sum + (e.estimatedCostUSD || 0), 0)

    const handleClear = () => {
        clearUsageLog()
        setLog([])
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground font-mono"
                onClick={() => setOpen(true)}
            >
                <DollarSign className="h-3.5 w-3.5" />
                ${monthCost.toFixed(3)} este mes ({monthEntries.length})
            </Button>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        Uso y costo estimado de IA
                    </DialogTitle>
                    <DialogDescription>
                        Estimado con el precio de gpt-4o-mini ($0.15 cada 1M de tokens de
                        entrada, $0.60 cada 1M de salida). Guardado en este navegador, no en tu
                        cuenta de OpenAI — el gasto real y exacto siempre está en{' '}
                        platform.openai.com/usage.
                    </DialogDescription>
                </DialogHeader>

                {log.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                        Todavía no hay consultas registradas.
                    </p>
                ) : (
                    <ScrollArea className="max-h-[320px]">
                        <div className="space-y-1.5 pr-3">
                            {log.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between gap-2 text-xs border-b pb-1.5"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {entry.question || '(sin texto)'}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {new Date(entry.timestamp).toLocaleString('es-AR')} ·{' '}
                                            {entry.promptTokens + entry.completionTokens} tokens
                                        </p>
                                    </div>
                                    <span className="shrink-0 font-mono">
                                        ${entry.estimatedCostUSD.toFixed(4)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}

                {log.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground self-start"
                        onClick={handleClear}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Vaciar historial
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    )
}
