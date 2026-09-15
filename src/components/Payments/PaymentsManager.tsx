'use client'

import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useApprovedOrders } from '@/hooks/useApprovedOrders'
import type { PaymentRecord } from '@/types'
import { PaymentSummaryCards } from './components/PaymentSummaryCards'
import { PaymentFilterBar, type PaymentFilters } from './components/PaymentFilterBar'
import { PaymentsTable } from './components/PaymentsTable'
import { SendStripeLinkDialog } from './components/SendStripeLinkDialog'
import { ManualPaymentDialog } from './components/ManualPaymentDialog'
import { buildRowModel, parseEventDate, formatEUR } from './utils'
import type { PaymentRowModel, StripeLink, StripeLinkPurpose } from './types'

/**
 * Pantalla de cobros con Stripe. Reemplaza a PaymentTracker (CSS Modules,
 * alert(), registro manual que no persistía).
 *
 * Vista previa: los pedidos son reales (aprobados, solo lectura), pero los
 * links de Stripe son simulados y los cobros que se agregan acá viven en
 * memoria hasta que exista la tabla `payments` y las rutas de Stripe.
 */
export function PaymentsManager() {
    const { orders, loading } = useApprovedOrders()

    const [filters, setFilters] = useState<PaymentFilters>({ state: 'all', search: '', year: undefined })
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [localRecords, setLocalRecords] = useState<Record<string, PaymentRecord[]>>({})
    const [localLinks, setLocalLinks] = useState<Record<string, StripeLink[]>>({})
    const [linkDialog, setLinkDialog] = useState<{ row: PaymentRowModel; purpose: StripeLinkPurpose } | null>(null)
    const [manualDialogRow, setManualDialogRow] = useState<PaymentRowModel | null>(null)

    const allRows = useMemo(
        () => orders.map((order) => buildRowModel(order, localRecords[order.id], localLinks[order.id])),
        [orders, localRecords, localLinks]
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

    const handleSendLink = (row: PaymentRowModel, purpose: StripeLinkPurpose, amount: number) => {
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
        toast.success(`Link de ${purpose === 'deposit' ? 'adelanto' : 'saldo'} por ${formatEUR(amount)} agregado al historial (vista previa, no se envió nada).`)
    }

    const handleSaveManual = (row: PaymentRowModel, record: PaymentRecord) => {
        setLocalRecords((prev) => ({ ...prev, [row.order.id]: [...(prev[row.order.id] || []), record] }))
        setManualDialogRow(null)
        setExpandedId(row.order.id)
        toast.success(`Cobro de ${formatEUR(record.amount)} registrado (vista previa, no se guardó en la base).`)
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
                onClose={() => setLinkDialog(null)}
                onSend={handleSendLink}
            />
            <ManualPaymentDialog
                row={manualDialogRow}
                onClose={() => setManualDialogRow(null)}
                onSave={handleSaveManual}
            />
        </div>
    )
}
