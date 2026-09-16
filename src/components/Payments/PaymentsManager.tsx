'use client'

import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useApprovedOrders } from '@/hooks/useApprovedOrders'
import { PaymentSummaryCards } from './components/PaymentSummaryCards'
import { PaymentFilterBar, type PaymentFilters } from './components/PaymentFilterBar'
import { PaymentsTable } from './components/PaymentsTable'
import { SendStripeLinkDialog } from './components/SendStripeLinkDialog'
import { ManualPaymentDialog } from './components/ManualPaymentDialog'
import { buildRowModel, parseEventDate, formatEUR } from './utils'
import type { PaymentRowModel, StripeLink, StripeLinkPurpose } from './types'
import type { PaymentRecord } from '@/types'

/**
 * Pantalla de cobros con Stripe. Reemplaza a PaymentTracker (CSS Modules,
 * alert(), registro manual que no persistía).
 *
 * Ya conectada a las rutas reales (/api/payments/stripe/create-checkout y
 * /api/payments/record). Lo único que sigue siendo aproximado: los links
 * de Stripe "esperando pago" son un indicador local, porque la v1 no
 * persiste sesiones pendientes (ver lib/payments/sync.ts) — cuando el
 * cliente paga de verdad, el webhook escribe el cobro real y ESE sí sale
 * de la base, no de acá.
 */
export function PaymentsManager() {
    const { orders, loading } = useApprovedOrders()
    const queryClient = useQueryClient()

    const [filters, setFilters] = useState<PaymentFilters>({ state: 'all', search: '', year: undefined })
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [localLinks, setLocalLinks] = useState<Record<string, StripeLink[]>>({})
    const [linkDialog, setLinkDialog] = useState<{ row: PaymentRowModel; purpose: StripeLinkPurpose } | null>(null)
    const [manualDialogRow, setManualDialogRow] = useState<PaymentRowModel | null>(null)
    const [sendingLink, setSendingLink] = useState(false)
    const [savingManual, setSavingManual] = useState(false)

    const allRows = useMemo(
        () => orders.map((order) => buildRowModel(order, undefined, localLinks[order.id])),
        [orders, localLinks]
    )

    const rows = useMemo(() => {
        const search = filters.search.trim().toLowerCase()
        return allRows
            .filter((r) => filters.state === 'all' || r.state === filters.state)
            .filter((r) => !search || (r.order.contact.name || '').toLowerCase().includes(search))
            .filter((r) => {
                if (!filters.year) return true
                const d = parseEventDate(r.order)
                return d ? String(d.getFullYear()) === filters.year : false
            })
            .sort((a, b) => {
                const da = parseEventDate(a.order)?.getTime() ?? Number.MAX_SAFE_INTEGER
                const db = parseEventDate(b.order)?.getTime() ?? Number.MAX_SAFE_INTEGER
                return da - db
            })
    }, [allRows, filters])

    const handleSendLink = async (row: PaymentRowModel, purpose: StripeLinkPurpose, amount: number) => {
        setSendingLink(true)
        try {
            const response = await fetch('/api/payments/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: row.order.id, purpose, amountEUR: amount }),
            })
            const data = await response.json()

            if (!response.ok) {
                toast.error(`${data.error || 'Error al generar el link'}${data.details ? `: ${data.details}` : ''}`)
                return
            }

            // El link en sí es real (Stripe lo creó). No hay una fila "pendiente"
            // en la base todavía (ver el comentario arriba del componente), así
            // que esto es solo para que la pantalla muestre algo mientras tanto.
            const link: StripeLink = {
                id: `local-${row.order.id}-${Date.now()}`,
                purpose,
                amount,
                status: 'pending',
                createdAt: new Date().toISOString(),
            }
            setLocalLinks((prev) => ({ ...prev, [row.order.id]: [...(prev[row.order.id] || []), link] }))
            setLinkDialog(null)
            setExpandedId(row.order.id)

            if (data.emailSent) {
                toast.success(`Link de ${purpose === 'deposit' ? 'adelanto' : 'saldo'} por ${formatEUR(amount)} generado y enviado por email.`)
            } else {
                toast.warning(`Link generado, pero el email no se pudo enviar. Copiá el link a mano: ${data.checkoutUrl}`)
            }
        } catch (e) {
            toast.error(`No se pudo conectar con el servidor. ${e instanceof Error ? e.message : ''}`)
        } finally {
            setSendingLink(false)
        }
    }

    const handleSaveManual = async (row: PaymentRowModel, record: PaymentRecord) => {
        setSavingManual(true)
        try {
            const response = await fetch('/api/payments/record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: row.order.id,
                    amount: record.amount,
                    method: record.method,
                    paymentType: record.paymentType,
                    reference: record.reference,
                    notes: record.notes,
                    date: record.date,
                }),
            })
            const data = await response.json()

            if (!response.ok) {
                toast.error(`${data.error || 'Error al registrar el cobro'}${data.details ? `: ${data.details}` : ''}`)
                return
            }

            // Esto sí quedó guardado en la base: se refresca la lista de pedidos
            // en vez de simularlo en memoria.
            await queryClient.invalidateQueries({ queryKey: ['approvedOrders'] })
            setManualDialogRow(null)
            setExpandedId(row.order.id)
            toast.success(`Cobro de ${formatEUR(record.amount)} registrado y guardado.`)
        } catch (e) {
            toast.error(`No se pudo conectar con el servidor. ${e instanceof Error ? e.message : ''}`)
        } finally {
            setSavingManual(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-10 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando pedidos aprobados...
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <PaymentSummaryCards rows={allRows} />
            <PaymentFilterBar filters={filters} onChange={setFilters} resultsCount={rows.length} />
            <PaymentsTable
                rows={rows}
                expandedId={expandedId}
                onToggle={(id) => setExpandedId((prev) => (prev === id ? null : id))}
                onSendDeposit={(row) => setLinkDialog({ row, purpose: 'deposit' })}
                onSendBalance={(row) => setLinkDialog({ row, purpose: 'balance' })}
                onManualPayment={(row) => setManualDialogRow(row)}
            />

            <SendStripeLinkDialog
                row={linkDialog?.row ?? null}
                purpose={linkDialog?.purpose ?? 'deposit'}
                sending={sendingLink}
                onClose={() => setLinkDialog(null)}
                onSend={handleSendLink}
            />
            <ManualPaymentDialog
                row={manualDialogRow}
                saving={savingManual}
                onClose={() => setManualDialogRow(null)}
                onSave={handleSaveManual}
            />
        </div>
    )
}
