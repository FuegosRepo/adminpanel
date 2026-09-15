'use client'

import { Fragment } from 'react'
import { format } from 'date-fns'
import { ChevronDown, ChevronRight, Link2, Banknote, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatEUR, parseEventDate } from '../utils'
import { PaymentHistory } from './PaymentHistory'
import type { PaymentRowModel, PaymentState } from '../types'

interface PaymentsTableProps {
    rows: PaymentRowModel[]
    expandedId: string | null
    onToggle: (orderId: string) => void
    onSendDeposit: (row: PaymentRowModel) => void
    onSendBalance: (row: PaymentRowModel) => void
    onManualPayment: (row: PaymentRowModel) => void
}

function StateBadge({ state }: { state: PaymentState }) {
    if (state === 'completed') return <Badge variant="success">Completo</Badge>
    if (state === 'partial') return <Badge variant="info">Parcial</Badge>
    return <Badge variant="warning">Sin cobrar</Badge>
}

function ProgressBar({ paid, total }: { paid: number; total: number }) {
    const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0
    return (
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
                className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    )
}

export function PaymentsTable({
    rows,
    expandedId,
    onToggle,
    onSendDeposit,
    onSendBalance,
    onManualPayment,
}: PaymentsTableProps) {
    if (rows.length === 0) {
        return (
            <div className="border rounded-lg p-10 text-center text-sm text-muted-foreground">
                No hay pedidos aprobados que coincidan con el filtro.
            </div>
        )
    }

    return (
        <div className="border rounded-lg overflow-x-auto bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-8" />
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[200px]">Cobrado</TableHead>
                        <TableHead className="text-right">Pendiente</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => {
                        const { order } = row
                        const expanded = expandedId === order.id
                        const eventDate = parseEventDate(order)
                        const canSendDeposit = !row.hasDepositPaid && row.pending > 0
                        const canSendBalance = row.pending > 0 && row.hasDepositPaid
                        const canRecord = row.pending > 0

                        return (
                            <Fragment key={order.id}>
                                <TableRow
                                    className="cursor-pointer"
                                    onClick={() => onToggle(order.id)}
                                >
                                    <TableCell className="pr-0 text-muted-foreground">
                                        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium">{order.contact.name || 'Sin nombre'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {eventDate ? format(eventDate, 'dd/MM/yyyy') : 'Sin fecha'}
                                            {order.contact.eventType ? ` · ${order.contact.eventType}` : ''}
                                            {order.contact.guestCount ? ` · ${order.contact.guestCount} inv.` : ''}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right font-mono tabular-nums">{formatEUR(row.total)}</TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-mono tabular-nums">{formatEUR(row.paid)}</span>
                                                <span className="text-muted-foreground">
                                                    {row.total > 0 ? Math.round((row.paid / row.total) * 100) : 0}%
                                                </span>
                                            </div>
                                            <ProgressBar paid={row.paid} total={row.total} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono tabular-nums font-medium">
                                        {formatEUR(row.pending)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-start gap-1">
                                            <StateBadge state={row.state} />
                                            {row.hasPendingLink && (
                                                <span className="text-[11px] text-violet-700 flex items-center gap-1">
                                                    <Link2 className="h-3 w-3" /> link enviado, sin pagar
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 gap-1.5"
                                                disabled={!canSendDeposit}
                                                title={canSendDeposit ? 'Enviar link de adelanto por Stripe' : 'Ya hay un adelanto cobrado'}
                                                onClick={() => onSendDeposit(row)}
                                            >
                                                <Link2 className="h-3.5 w-3.5" />
                                                Adelanto
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 gap-1.5"
                                                disabled={!canSendBalance}
                                                title={canSendBalance ? 'Enviar link del saldo por Stripe' : 'Primero el adelanto, o no queda saldo'}
                                                onClick={() => onSendBalance(row)}
                                            >
                                                <Wallet className="h-3.5 w-3.5" />
                                                Saldo
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 gap-1.5 text-muted-foreground"
                                                disabled={!canRecord}
                                                title="Registrar transferencia, efectivo o cheque"
                                                onClick={() => onManualPayment(row)}
                                            >
                                                <Banknote className="h-3.5 w-3.5" />
                                                Manual
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expanded && (
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableCell />
                                        <TableCell colSpan={6}>
                                            <p className="text-xs font-medium text-muted-foreground mt-1">Historial de cobros</p>
                                            <PaymentHistory row={row} />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
