'use client'

import { format } from 'date-fns'
import { CreditCard, Banknote, ArrowLeftRight, FileCheck, Link2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatEUR } from '../utils'
import type { PaymentRowModel, StripeLink } from '../types'
import type { PaymentRecord } from '@/types'

const METHOD_LABEL: Record<PaymentRecord['method'], { label: string; icon: typeof CreditCard }> = {
    card: { label: 'Tarjeta', icon: CreditCard },
    cash: { label: 'Efectivo', icon: Banknote },
    transfer: { label: 'Transferencia', icon: ArrowLeftRight },
    check: { label: 'Cheque', icon: FileCheck },
}

const PURPOSE_LABEL: Record<StripeLink['purpose'], string> = {
    deposit: 'Adelanto',
    balance: 'Saldo',
    custom: 'Cobro',
}

function StripeStatusBadge({ status }: { status: StripeLink['status'] }) {
    if (status === 'paid') return <Badge variant="success">Pagado</Badge>
    if (status === 'expired') return <Badge variant="outline" className="text-muted-foreground">Vencido</Badge>
    return <Badge variant="warning">Esperando pago</Badge>
}

type TimelineItem =
    | { kind: 'stripe'; date: string; link: StripeLink }
    | { kind: 'manual'; date: string; record: PaymentRecord }

function safeFormat(iso: string): string {
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? '—' : format(d, 'dd/MM/yyyy')
}

export function PaymentHistory({ row }: { row: PaymentRowModel }) {
    const items: TimelineItem[] = [
        ...row.stripeLinks.map((link) => ({ kind: 'stripe' as const, date: link.createdAt, link })),
        ...row.history.map((record) => ({ kind: 'manual' as const, date: record.date, record })),
    ].sort((a, b) => (a.date < b.date ? 1 : -1))

    if (items.length === 0) {
        return (
            <p className="text-sm text-muted-foreground py-3">
                Todavía no hay cobros ni links enviados para este pedido.
            </p>
        )
    }

    return (
        <div className="space-y-2 py-2">
            {items.map((item) => {
                if (item.kind === 'stripe') {
                    const { link } = item
                    return (
                        <div key={link.id} className="flex items-center justify-between gap-3 text-sm border rounded-md px-3 py-2 bg-background">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="rounded-md bg-violet-50 text-violet-600 p-1.5">
                                    <Link2 className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium">
                                        Link de Stripe · {PURPOSE_LABEL[link.purpose]}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Enviado el {safeFormat(link.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <StripeStatusBadge status={link.status} />
                                <span className="font-mono tabular-nums">{formatEUR(link.amount)}</span>
                            </div>
                        </div>
                    )
                }

                const { record } = item
                const method = METHOD_LABEL[record.method] ?? METHOD_LABEL.cash
                const Icon = method.icon
                return (
                    <div key={record.id} className="flex items-center justify-between gap-3 text-sm border rounded-md px-3 py-2 bg-background">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="rounded-md bg-emerald-50 text-emerald-600 p-1.5">
                                <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium">
                                    {method.label}
                                    {record.paymentType && (
                                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                                            ({record.paymentType})
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {safeFormat(record.date)}
                                    {record.reference ? ` · Ref. ${record.reference}` : ''}
                                    {record.notes ? ` · ${record.notes}` : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Badge variant="success">Cobrado</Badge>
                            <span className="font-mono tabular-nums">{formatEUR(record.amount)}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
