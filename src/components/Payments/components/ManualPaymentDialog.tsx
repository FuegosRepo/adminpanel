'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Banknote, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { formatEUR, roundMoney } from '../utils'
import type { PaymentRowModel } from '../types'
import type { PaymentRecord } from '@/types'

interface ManualPaymentDialogProps {
    row: PaymentRowModel | null
    onClose: () => void
    onSave: (row: PaymentRowModel, record: PaymentRecord) => void
}

type ManualMethod = Exclude<PaymentRecord['method'], 'card'>

const METHOD_OPTIONS: { value: ManualMethod; label: string }[] = [
    { value: 'transfer', label: 'Transferencia' },
    { value: 'cash', label: 'Efectivo' },
    { value: 'check', label: 'Cheque' },
]

/**
 * Registro de un cobro que NO pasó por Stripe (transferencia, efectivo,
 * cheque). Decisión del cliente: conviven en el mismo historial que los
 * links de Stripe, y se conserva la distinción blanco/negro.
 */
export function ManualPaymentDialog({ row, onClose, onSave }: ManualPaymentDialogProps) {
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState('')
    const [method, setMethod] = useState<ManualMethod>('transfer')
    const [paymentType, setPaymentType] = useState<'blanco' | 'negro'>('blanco')
    const [reference, setReference] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (!row) return
        setAmount(row.pending)
        setDate(format(new Date(), 'yyyy-MM-dd'))
        setMethod('transfer')
        setPaymentType('blanco')
        setReference('')
        setNotes('')
    }, [row])

    if (!row) return null

    const invalid = amount <= 0

    const handleSave = () => {
        onSave(row, {
            id: `manual-${Date.now()}`,
            amount: roundMoney(amount),
            date: date ? new Date(`${date}T12:00:00`).toISOString() : new Date().toISOString(),
            method,
            paymentType,
            reference: reference.trim() || undefined,
            notes: notes.trim() || undefined,
        })
    }

    return (
        <Dialog open={!!row} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-primary" />
                        Registrar cobro manual
                    </DialogTitle>
                    <DialogDescription>
                        {row.order.contact.name} · pendiente {formatEUR(row.pending)}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="m-amount">Monto</Label>
                        <div className="relative">
                            <Input
                                id="m-amount"
                                type="number"
                                min={0}
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="pr-7"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="m-date">Fecha del cobro</Label>
                        <Input id="m-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Medio</Label>
                        <Select value={method} onValueChange={(v) => setMethod(v as ManualMethod)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {METHOD_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Tipo</Label>
                        <Select value={paymentType} onValueChange={(v) => setPaymentType(v as 'blanco' | 'negro')}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="blanco">Blanco</SelectItem>
                                <SelectItem value="negro">Negro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="m-ref">Referencia (opcional)</Label>
                        <Input
                            id="m-ref"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="N° de transferencia, cheque..."
                        />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="m-notes">Notas (opcional)</Label>
                        <Textarea
                            id="m-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="resize-none"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 text-amber-900 px-3 py-2 text-xs">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <p>
                        Vista previa de diseño: el cobro se suma al historial en esta pantalla, pero
                        no se guarda en la base de datos todavía.
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
                    <Button size="sm" disabled={invalid} onClick={handleSave}>Registrar cobro</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
