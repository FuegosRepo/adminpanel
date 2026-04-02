'use client'

import { useMemo } from 'react'
import { CateringOrder } from '@/types'
import { differenceInDays } from 'date-fns'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { normalizeStatus, formatCurrency } from '../utils/reportHelpers'
import styles from '../FinancialReports.module.css'

interface ReceivablesTabProps {
    orders: CateringOrder[]
    isMounted: boolean
}

interface ReceivableOrder {
    order: CateringOrder
    pendingAmount: number
    ageDays: number
    bucket: string
}

const BUCKETS = [
    { label: '0-30 dias', min: 0, max: 30, color: '#10b981' },
    { label: '30-60 dias', min: 30, max: 60, color: '#f59e0b' },
    { label: '60-90 dias', min: 60, max: 90, color: '#f97316' },
    { label: '90+ dias', min: 90, max: Infinity, color: '#ef4444' },
]

function getBucket(days: number): string {
    for (const b of BUCKETS) {
        if (days >= b.min && days < b.max) return b.label
    }
    return '90+ dias'
}

export default function ReceivablesTab({ orders, isMounted }: ReceivablesTabProps) {
    const data = useMemo(() => {
        const now = new Date()
        const approved = orders.filter(o => normalizeStatus(o.status) === 'approved')

        const receivables: ReceivableOrder[] = approved
            .filter(o => o.payment && o.payment.paymentStatus !== 'completed' && o.payment.pendingAmount > 0)
            .map(o => {
                const referenceDate = o.payment?.dueDate
                    ? new Date(o.payment.dueDate)
                    : new Date(o.createdAt)
                const ageDays = Math.max(0, differenceInDays(now, referenceDate))
                return {
                    order: o,
                    pendingAmount: o.payment!.pendingAmount,
                    ageDays,
                    bucket: getBucket(ageDays),
                }
            })
            .sort((a, b) => b.ageDays - a.ageDays)

        if (receivables.length === 0) return null

        const totalPending = receivables.reduce((s, r) => s + r.pendingAmount, 0)
        const avgAge = receivables.length > 0
            ? Math.round(receivables.reduce((s, r) => s + r.ageDays, 0) / receivables.length)
            : 0

        // Bucket aggregation
        const bucketData = BUCKETS.map(b => {
            const items = receivables.filter(r => r.bucket === b.label)
            return {
                name: b.label,
                monto: items.reduce((s, r) => s + r.pendingAmount, 0),
                cantidad: items.length,
                color: b.color,
            }
        }).filter(b => b.cantidad > 0)

        // Overdue (past due date)
        const overdue = receivables.filter(r => {
            if (!r.order.payment?.dueDate) return false
            return new Date(r.order.payment.dueDate) < now
        })
        const overdueAmount = overdue.reduce((s, r) => s + r.pendingAmount, 0)

        return { receivables, totalPending, avgAge, bucketData, overdueAmount, overdueCount: overdue.length }
    }, [orders])

    if (!data || !isMounted) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>✅</div>
                <div className={styles.emptyText}>No hay cuentas por cobrar pendientes</div>
                <div className={styles.emptySubtext}>Todos los pedidos aprobados estan pagos</div>
            </div>
        )
    }

    return (
        <>
            <div className={styles.overview}>
                <div className={`${styles.overviewCard}`}
                    style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)', borderColor: '#ef4444' }}>
                    <div className={styles.overviewLabel}>Total Pendiente</div>
                    <div className={styles.overviewValue}>{formatCurrency(data.totalPending, isMounted)}</div>
                    <div className={styles.overviewChange}>{data.receivables.length} pedidos</div>
                </div>
                <div className={`${styles.overviewCard}`}
                    style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)', borderColor: '#f97316' }}>
                    <div className={styles.overviewLabel}>Vencidos</div>
                    <div className={styles.overviewValue}>{formatCurrency(data.overdueAmount, isMounted)}</div>
                    <div className={styles.overviewChange}>{data.overdueCount} pedidos con fecha vencida</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.orders}`}>
                    <div className={styles.overviewLabel}>Antiguedad Promedio</div>
                    <div className={styles.overviewValue}>{data.avgAge} dias</div>
                    <div className={styles.overviewChange}>Desde fecha de vencimiento o creacion</div>
                </div>
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Montos Pendientes por Antiguedad</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.bucketData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(v) => `€${v}`} />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === 'monto' ? formatCurrency(Number(value), isMounted) : value,
                                        name === 'monto' ? 'Monto' : 'Pedidos'
                                    ]}
                                />
                                <Bar dataKey="monto" radius={[4, 4, 0, 0]}>
                                    {data.bucketData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed table */}
            <div className={styles.monthlyTable}>
                <div className={styles.tableHeader}>
                    <h3 className={styles.tableTitle}>Detalle de Cuentas por Cobrar</h3>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Evento</th>
                            <th>Total</th>
                            <th>Pagado</th>
                            <th>Pendiente</th>
                            <th>Antiguedad</th>
                            <th>Estado Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.receivables.map((r) => (
                            <tr key={r.order.id}>
                                <td>{r.order.contact.name}</td>
                                <td>{r.order.contact.eventType || '-'}</td>
                                <td>{formatCurrency(r.order.payment?.totalAmount || 0, isMounted)}</td>
                                <td>{formatCurrency(r.order.payment?.paidAmount || 0, isMounted)}</td>
                                <td style={{ color: '#ef4444', fontWeight: 600 }}>
                                    {formatCurrency(r.pendingAmount, isMounted)}
                                </td>
                                <td>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500,
                                        background: r.ageDays >= 90 ? '#fef2f2' : r.ageDays >= 60 ? '#fff7ed' : r.ageDays >= 30 ? '#fffbeb' : '#f0fdf4',
                                        color: r.ageDays >= 90 ? '#dc2626' : r.ageDays >= 60 ? '#ea580c' : r.ageDays >= 30 ? '#d97706' : '#16a34a',
                                    }}>
                                        {r.ageDays} dias
                                    </span>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500,
                                        background: r.order.payment?.paymentStatus === 'partial' ? '#fffbeb' : '#fef2f2',
                                        color: r.order.payment?.paymentStatus === 'partial' ? '#d97706' : '#dc2626',
                                    }}>
                                        {r.order.payment?.paymentStatus === 'partial' ? 'Parcial' : 'Pendiente'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
