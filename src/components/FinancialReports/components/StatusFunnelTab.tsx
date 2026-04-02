'use client'

import { useMemo } from 'react'
import { CateringOrder } from '@/types'
import { eachMonthOfInterval, startOfMonth, endOfMonth, format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell
} from 'recharts'
import { normalizeStatus, formatPercentage, STATUS_COLORS, STATUS_LABELS } from '../utils/reportHelpers'
import styles from '../FinancialReports.module.css'

interface StatusFunnelTabProps {
    orders: CateringOrder[]
    isMounted: boolean
}

export default function StatusFunnelTab({ orders, isMounted }: StatusFunnelTabProps) {
    const data = useMemo(() => {
        if (orders.length === 0) return null

        const normalized = orders.map(o => ({ ...o, normalizedStatus: normalizeStatus(o.status) }))

        // Status distribution
        const statusCounts: Record<string, number> = { pending: 0, sent: 0, approved: 0, rejected: 0 }
        normalized.forEach(o => {
            if (statusCounts[o.normalizedStatus] !== undefined) {
                statusCounts[o.normalizedStatus]++
            }
        })

        const total = normalized.length
        const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
            name: STATUS_LABELS[status] || status,
            value: count,
            percentage: total > 0 ? (count / total) * 100 : 0,
            color: STATUS_COLORS[status] || '#9ca3af',
        }))

        // Conversion metrics
        const conversionRate = total > 0 ? (statusCounts.approved / total) * 100 : 0
        const rejectionRate = total > 0 ? (statusCounts.rejected / total) * 100 : 0

        // Monthly stacked data
        const dates = normalized.map(o => new Date(o.createdAt))
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))

        const months = eachMonthOfInterval({ start: startOfMonth(minDate), end: endOfMonth(maxDate) })
        const monthlyData = months.map(month => {
            const monthStart = startOfMonth(month)
            const monthEnd = endOfMonth(month)
            const monthOrders = normalized.filter(o => {
                const d = new Date(o.createdAt)
                return d >= monthStart && d <= monthEnd
            })
            return {
                month: format(month, 'MMM yy', { locale: es }),
                Pendiente: monthOrders.filter(o => o.normalizedStatus === 'pending').length,
                Enviado: monthOrders.filter(o => o.normalizedStatus === 'sent').length,
                Aprobado: monthOrders.filter(o => o.normalizedStatus === 'approved').length,
                Rechazado: monthOrders.filter(o => o.normalizedStatus === 'rejected').length,
                total: monthOrders.length,
            }
        })

        return { statusDistribution, conversionRate, rejectionRate, total, statusCounts, monthlyData }
    }, [orders])

    if (!data || !isMounted) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📋</div>
                <div className={styles.emptyText}>No hay datos de pedidos en este rango</div>
            </div>
        )
    }

    return (
        <>
            {/* Funnel metrics */}
            <div className={styles.overview}>
                <div className={`${styles.overviewCard} ${styles.orders}`}>
                    <div className={styles.overviewLabel}>Total Recibidos</div>
                    <div className={styles.overviewValue}>{data.total}</div>
                    <div className={styles.overviewChange}>Todos los pedidos</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.average}`}>
                    <div className={styles.overviewLabel}>Tasa de Conversion</div>
                    <div className={styles.overviewValue}>{formatPercentage(data.conversionRate)}</div>
                    <div className={styles.overviewChange}>{data.statusCounts.approved} aprobados</div>
                </div>
                <div className={`${styles.overviewCard}`} style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)', borderColor: '#ef4444' }}>
                    <div className={styles.overviewLabel}>Tasa de Rechazo</div>
                    <div className={styles.overviewValue}>{formatPercentage(data.rejectionRate)}</div>
                    <div className={styles.overviewChange}>{data.statusCounts.rejected} rechazados</div>
                </div>
                <div className={`${styles.overviewCard}`} style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)', borderColor: '#3b82f6' }}>
                    <div className={styles.overviewLabel}>En Proceso</div>
                    <div className={styles.overviewValue}>{data.statusCounts.pending + data.statusCounts.sent}</div>
                    <div className={styles.overviewChange}>{data.statusCounts.pending} pendientes + {data.statusCounts.sent} enviados</div>
                </div>
            </div>

            {/* Charts */}
            <div className={styles.chartsSection}>
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Pedidos por Mes y Estado</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Pendiente" stackId="a" fill={STATUS_COLORS.pending} />
                                    <Bar dataKey="Enviado" stackId="a" fill={STATUS_COLORS.sent} />
                                    <Bar dataKey="Aprobado" stackId="a" fill={STATUS_COLORS.approved} />
                                    <Bar dataKey="Rechazado" stackId="a" fill={STATUS_COLORS.rejected} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Distribucion de Estados</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.statusDistribution}
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={90}
                                        dataKey="value"
                                        label={({ name, percentage }) => `${name} ${formatPercentage(percentage)}`}
                                    >
                                        {data.statusDistribution.map((entry, index) => (
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

            {/* Monthly table */}
            <div className={styles.monthlyTable}>
                <div className={styles.tableHeader}>
                    <h3 className={styles.tableTitle}>Desglose Mensual por Estado</h3>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mes</th>
                            <th>Total</th>
                            <th>Pendientes</th>
                            <th>Enviados</th>
                            <th>Aprobados</th>
                            <th>Rechazados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.monthlyData.map((month, index) => (
                            <tr key={index}>
                                <td>{month.month}</td>
                                <td><strong>{month.total}</strong></td>
                                <td>{month.Pendiente}</td>
                                <td>{month.Enviado}</td>
                                <td>{month.Aprobado}</td>
                                <td>{month.Rechazado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
