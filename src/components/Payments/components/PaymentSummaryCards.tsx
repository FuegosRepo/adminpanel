'use client'

import { Clock, PieChart, CheckCircle2, Link2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatEUR } from '../utils'
import type { PaymentRowModel } from '../types'

interface PaymentSummaryCardsProps {
    rows: PaymentRowModel[]
}

export function PaymentSummaryCards({ rows }: PaymentSummaryCardsProps) {
    const pending = rows.filter((r) => r.state === 'pending')
    const partial = rows.filter((r) => r.state === 'partial')
    const completed = rows.filter((r) => r.state === 'completed')
    const pendingLinks = rows.reduce((n, r) => n + r.stripeLinks.filter((l) => l.status === 'pending').length, 0)

    const cards = [
        {
            label: 'Sin cobrar',
            value: formatEUR(pending.reduce((s, r) => s + r.pending, 0)),
            sub: `${pending.length} pedido${pending.length !== 1 ? 's' : ''}`,
            icon: Clock,
            accent: 'text-amber-600 bg-amber-50',
        },
        {
            label: 'Cobrado en parte',
            value: formatEUR(partial.reduce((s, r) => s + r.pending, 0)),
            sub: `${partial.length} pedido${partial.length !== 1 ? 's' : ''} · saldo pendiente`,
            icon: PieChart,
            accent: 'text-blue-600 bg-blue-50',
        },
        {
            label: 'Cobrado completo',
            value: formatEUR(completed.reduce((s, r) => s + r.total, 0)),
            sub: `${completed.length} pedido${completed.length !== 1 ? 's' : ''}`,
            icon: CheckCircle2,
            accent: 'text-emerald-600 bg-emerald-50',
        },
        {
            label: 'Links de Stripe abiertos',
            value: String(pendingLinks),
            sub: 'enviados, todavía sin pagar',
            icon: Link2,
            accent: 'text-violet-600 bg-violet-50',
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((c) => (
                <Card key={c.label}>
                    <CardContent className="p-4 flex items-start gap-3">
                        <div className={`rounded-md p-2 ${c.accent}`}>
                            <c.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">{c.label}</p>
                            <p className="text-lg font-semibold tabular-nums truncate">{c.value}</p>
                            <p className="text-xs text-muted-foreground">{c.sub}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
