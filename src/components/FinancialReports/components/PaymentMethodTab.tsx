'use client'

import { useMemo, useState } from 'react'
import { CateringOrder, PaymentMethod } from '@/types'
import { ChevronDown, ChevronUp } from 'lucide-react'
import PaymentMethodSelector from '@/components/common/PaymentMethodSelector'
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import {
    normalizeStatus, getOrderRevenue, formatCurrency, formatPercentage,
    PAYMENT_METHOD_LABELS, PAYMENT_METHOD_COLORS
} from '../utils/reportHelpers'
import styles from '../FinancialReports.module.css'

interface PaymentMethodTabProps {
    orders: CateringOrder[]
    isMounted: boolean
    onUpdatePaymentMethod?: (orderId: string, method: PaymentMethod | null) => void
}

export default function PaymentMethodTab({ orders, isMounted, onUpdatePaymentMethod }: PaymentMethodTabProps) {
    const [showUnspecified, setShowUnspecified] = useState(false)
    const data = useMemo(() => {
        const approved = orders.filter(o => normalizeStatus(o.status) === 'approved')
        if (approved.length === 0) return null

        const methodStats: Record<string, { count: number; revenue: number }> = {}

        approved.forEach(order => {
            const method = order.paymentMethod || 'sin_especificar'
            if (!methodStats[method]) methodStats[method] = { count: 0, revenue: 0 }
            methodStats[method].count++
            methodStats[method].revenue += getOrderRevenue(order)
        })

        const total = approved.length
        const totalRevenue = approved.reduce((s, o) => s + getOrderRevenue(o), 0)

        const labels: Record<string, string> = {
            ...PAYMENT_METHOD_LABELS,
            sin_especificar: 'No especificado',
        }
        const colors: Record<string, string> = {
            ...PAYMENT_METHOD_COLORS,
            sin_especificar: '#9ca3af',
        }

        const distribution = Object.entries(methodStats)
            .map(([method, stats]) => ({
                method,
                name: labels[method] || method,
                count: stats.count,
                revenue: stats.revenue,
                percentage: total > 0 ? (stats.count / total) * 100 : 0,
                revenuePercentage: totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0,
                avgRevenue: stats.count > 0 ? stats.revenue / stats.count : 0,
                color: colors[method] || '#9ca3af',
            }))
            .sort((a, b) => b.revenue - a.revenue)

        // Blanco vs Negro analysis from payment history
        let blancoAmount = 0, negroAmount = 0, blancoCount = 0, negroCount = 0
        approved.forEach(order => {
            if (!order.payment?.paymentHistory) return
            order.payment.paymentHistory.forEach(record => {
                if (record.paymentType === 'blanco') {
                    blancoAmount += record.amount
                    blancoCount++
                } else if (record.paymentType === 'negro') {
                    negroAmount += record.amount
                    negroCount++
                }
            })
        })
        const blancoNegroTotal = blancoAmount + negroAmount
        const blancoNegro = (blancoCount > 0 || negroCount > 0) ? {
            blanco: { amount: blancoAmount, count: blancoCount, pct: blancoNegroTotal > 0 ? (blancoAmount / blancoNegroTotal) * 100 : 0 },
            negro: { amount: negroAmount, count: negroCount, pct: blancoNegroTotal > 0 ? (negroAmount / blancoNegroTotal) * 100 : 0 },
            total: blancoNegroTotal,
            pieData: [
                { name: 'Blanco', value: blancoAmount, color: '#10b981' },
                { name: 'Negro', value: negroAmount, color: '#374151' },
            ].filter(d => d.value > 0),
        } : null

        const unspecifiedOrders = approved.filter(o => !o.paymentMethod)

        return { distribution, total, totalRevenue, blancoNegro, unspecifiedOrders }
    }, [orders])

    if (!data || !isMounted) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💳</div>
                <div className={styles.emptyText}>No hay datos de medios de pago en este rango</div>
                <div className={styles.emptySubtext}>Solo se muestran pedidos aprobados con medio de pago registrado</div>
            </div>
        )
    }

    return (
        <>
            {/* Summary cards */}
            <div className={styles.overview}>
                {data.distribution.map((item) => {
                    const isUnspecified = item.method === 'sin_especificar' && data.unspecifiedOrders.length > 0
                    return (
                        <div key={item.method} className={styles.overviewCard}
                            onClick={isUnspecified ? () => setShowUnspecified(!showUnspecified) : undefined}
                            style={{
                                background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}25 100%)`,
                                borderColor: item.color,
                                cursor: isUnspecified ? 'pointer' : undefined,
                            }}>
                            <div className={styles.overviewLabel}>
                                {item.name}
                                {isUnspecified && (
                                    showUnspecified
                                        ? <ChevronUp size={14} style={{ display: 'inline', marginLeft: 4 }} />
                                        : <ChevronDown size={14} style={{ display: 'inline', marginLeft: 4 }} />
                                )}
                            </div>
                            <div className={styles.overviewValue}>{item.count}</div>
                            <div className={styles.overviewChange}>
                                {formatCurrency(item.revenue, isMounted)} — Prom: {formatCurrency(item.avgRevenue, isMounted)}
                                {isUnspecified && <span style={{ marginLeft: 8, fontSize: '0.7rem' }}>Click para ver</span>}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Unspecified orders expandable list */}
            {showUnspecified && data.unspecifiedOrders.length > 0 && (
                <div className={styles.monthlyTable} style={{ marginBottom: 24 }}>
                    <div className={styles.tableHeader}>
                        <h3 className={styles.tableTitle}>
                            Pedidos sin Medio de Pago ({data.unspecifiedOrders.length})
                        </h3>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Tipo Evento</th>
                                <th>Fecha Evento</th>
                                <th>Ingreso</th>
                                <th>Asignar Medio de Pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.unspecifiedOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.contact.name}</td>
                                    <td>{order.contact.eventType || '-'}</td>
                                    <td>{order.contact.eventDate || '-'}</td>
                                    <td>{formatCurrency(getOrderRevenue(order), isMounted)}</td>
                                    <td>
                                        {onUpdatePaymentMethod ? (
                                            <PaymentMethodSelector
                                                orderId={order.id}
                                                currentMethod={order.paymentMethod || null}
                                                onUpdate={onUpdatePaymentMethod}
                                            />
                                        ) : (
                                            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                                                Asignar desde /orders
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className={styles.chartsSection}>
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Ingresos por Medio de Pago</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.distribution} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={(v) => `€${v}`} />
                                    <YAxis type="category" dataKey="name" width={130} />
                                    <Tooltip formatter={(value) => [formatCurrency(Number(value), isMounted), 'Ingresos']} />
                                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                                        {data.distribution.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Distribucion por Cantidad</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.distribution}
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={90}
                                        dataKey="count"
                                        label={({ name, percentage }) => `${name} ${formatPercentage(percentage)}`}
                                    >
                                        {data.distribution.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Pedidos']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className={styles.monthlyTable}>
                <div className={styles.tableHeader}>
                    <h3 className={styles.tableTitle}>Detalle por Medio de Pago</h3>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Medio de Pago</th>
                            <th>Pedidos</th>
                            <th>Ingresos</th>
                            <th>% Ingresos</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.distribution.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <span style={{
                                        display: 'inline-block', width: 10, height: 10,
                                        borderRadius: '50%', backgroundColor: item.color, marginRight: 8
                                    }}></span>
                                    {item.name}
                                </td>
                                <td>{item.count}</td>
                                <td>{formatCurrency(item.revenue, isMounted)}</td>
                                <td>{formatPercentage(item.revenuePercentage)}</td>
                                <td>{formatCurrency(item.avgRevenue, isMounted)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Blanco vs Negro */}
            {data.blancoNegro && (
                <>
                    <div className={styles.chartCard} style={{ marginTop: 24 }}>
                        <h3 className={styles.chartTitle}>Blanco vs Negro</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16 }}>
                            <div>
                                <div className={styles.chartContainer} style={{ height: 250 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.blancoNegro.pieData}
                                                cx="50%" cy="50%"
                                                innerRadius={50} outerRadius={80}
                                                dataKey="value"
                                                label={({ name, value }) => `${name}: ${formatCurrency(value, isMounted)}`}
                                            >
                                                {data.blancoNegro.pieData.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [formatCurrency(Number(value), isMounted)]} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
                                <div className={styles.paymentItem}>
                                    <div className={styles.paymentLabel}>
                                        <div className={styles.paymentDot} style={{ backgroundColor: '#10b981' }}></div>
                                        Blanco ({data.blancoNegro.blanco.count} pagos)
                                    </div>
                                    <div>
                                        <div className={styles.paymentValue}>{formatCurrency(data.blancoNegro.blanco.amount, isMounted)}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{formatPercentage(data.blancoNegro.blanco.pct)}</div>
                                    </div>
                                </div>
                                <div className={styles.paymentItem}>
                                    <div className={styles.paymentLabel}>
                                        <div className={styles.paymentDot} style={{ backgroundColor: '#374151' }}></div>
                                        Negro ({data.blancoNegro.negro.count} pagos)
                                    </div>
                                    <div>
                                        <div className={styles.paymentValue}>{formatCurrency(data.blancoNegro.negro.amount, isMounted)}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{formatPercentage(data.blancoNegro.negro.pct)}</div>
                                    </div>
                                </div>
                                <div className={styles.paymentItem} style={{ borderColor: '#d97706' }}>
                                    <div className={styles.paymentLabel}>
                                        <strong>Total Registrado</strong>
                                    </div>
                                    <div className={styles.paymentValue}>{formatCurrency(data.blancoNegro.total, isMounted)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
