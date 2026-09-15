'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Link2, Mail, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { DEPOSIT_PCT, STRIPE_LINK_EXPIRY_HOURS } from '@/config/payments'
import { formatEUR, roundMoney, depositFor, parseEventDate } from '../utils'
import type { PaymentRowModel, StripeLinkPurpose } from '../types'

interface SendStripeLinkDialogProps {
    row: PaymentRowModel | null
    purpose: StripeLinkPurpose
    onClose: () => void
    onSend: (row: PaymentRowModel, purpose: StripeLinkPurpose, amount: number) => void
}

/**
 * Diálogo para generar y enviar un link de Stripe Checkout (adelanto o
 * saldo). Decisión del cliente: adelanto 30% por defecto, editable por
 * pedido. El porcentaje y el monto están enlazados: cambiar uno recalcula
 * el otro.
 */
export function SendStripeLinkDialog({ row, purpose, onClose, onSend }: SendStripeLinkDialogProps) {
    const isDeposit = purpose === 'deposit'
    const [pct, setPct] = useState(Math.round(DEPOSIT_PCT * 100))
    const [amount, setAmount] = useState(0)

    useEffect(() => {
        if (!row) return
        if (isDeposit) {
            setPct(Math.round(DEPOSIT_PCT * 100))
            setAmount(depositFor(row.total))
        } else {
            setAmount(row.pending)
        }
    }, [row, isDeposit])

    if (!row) return null

    const { order } = row
    const eventDate = parseEventDate(order)
    const eventDateLabel = eventDate ? format(eventDate, 'dd/MM/yyyy') : 'date à confirmer'
    const maxAmount = row.pending
    const invalid = amount <= 0 || amount > maxAmount + 0.001

    const handlePctChange = (value: number) => {
        const safe = Math.min(100, Math.max(0, value))
        setPct(safe)
        setAmount(roundMoney(row.total * (safe / 100)))
    }

    const handleAmountChange = (value: number) => {
        setAmount(roundMoney(value))
        if (isDeposit && row.total > 0) setPct(Math.round((value / row.total) * 100))
    }

    const subject = isDeposit
        ? `Acompte pour votre événement du ${eventDateLabel} — Fuegos d'Azur`
        : `Solde de votre événement du ${eventDateLabel} — Fuegos d'Azur`

    return (
        <Dialog open={!!row} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-primary" />
                        {isDeposit ? 'Enviar link de adelanto' : 'Enviar link de saldo'}
                    </DialogTitle>
                    <DialogDescription>
                        Se genera un link de pago de Stripe y se manda por email a{' '}
                        <span className="font-medium text-foreground">{order.contact.email}</span>. El link vence a las{' '}
                        {STRIPE_LINK_EXPIRY_HOURS} h.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-3 text-sm rounded-md bg-muted/50 p-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Total del pedido</p>
                        <p className="font-semibold tabular-nums">{formatEUR(row.total)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Ya cobrado</p>
                        <p className="font-semibold tabular-nums">{formatEUR(row.paid)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Pendiente</p>
                        <p className="font-semibold tabular-nums">{formatEUR(row.pending)}</p>
                    </div>
                </div>

                <div className={`grid gap-3 ${isDeposit ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {isDeposit && (
                        <div className="space-y-1.5">
                            <Label htmlFor="pct">Porcentaje</Label>
                            <div className="relative">
                                <Input
                                    id="pct"
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={pct}
                                    onChange={(e) => handlePctChange(Number(e.target.value))}
                                    className="pr-7"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                            </div>
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label htmlFor="amount">Monto a cobrar</Label>
                        <div className="relative">
                            <Input
                                id="amount"
                                type="number"
                                min={0}
                                step="0.01"
                                value={amount}
                                onChange={(e) => handleAmountChange(Number(e.target.value))}
                                className="pr-7"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                        </div>
                        {invalid && (
                            <p className="text-xs text-destructive">
                                El monto tiene que ser mayor a 0 y no superar el pendiente ({formatEUR(maxAmount)}).
                            </p>
                        )}
                    </div>
                </div>

                <div className="rounded-md border p-3 space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        Vista previa del email (en francés, como lo recibe el cliente)
                    </p>
                    <p className="text-sm font-medium">{subject}</p>
                    <p className="text-sm text-muted-foreground">
                        Bonjour {order.contact.name || 'Madame, Monsieur'}, voici votre lien sécurisé pour régler{' '}
                        {isDeposit ? `l'acompte de ${pct} %` : 'le solde'} de votre événement par carte, Apple Pay ou Google Pay, d&apos;un montant de{' '}
                        <span className="font-medium text-foreground">{formatEUR(amount)}</span>. Le devis est joint en PDF.
                    </p>
                </div>

                <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 text-amber-900 px-3 py-2 text-xs">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <p>
                        Vista previa de diseño: Stripe todavía no está conectado. Al confirmar, el link
                        aparece en el historial de este pedido como &quot;esperando pago&quot;, pero no se
                        genera ningún link real ni se manda ningún email.
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
                    <Button size="sm" className="gap-1.5" disabled={invalid} onClick={() => onSend(row, purpose, amount)}>
                        <Link2 className="h-3.5 w-3.5" />
                        Generar link y enviar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
