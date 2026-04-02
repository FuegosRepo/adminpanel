'use client'

import { useMemo } from 'react'
import { CateringOrder, FinancialReport, MonthlyFinancialData, ServiceRevenue } from '@/types'
import { eachMonthOfInterval, startOfMonth, endOfMonth, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { TrendingUp } from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { formatCurrency, formatPercentage, normalizeStatus, getOrderRevenue } from '../utils/reportHelpers'
import styles from '../FinancialReports.module.css'

interface OverviewTabProps {
    orders: CateringOrder[]
    allOrders: CateringOrder[]
    isMounted: boolean
}

const COLORS = {
    completed: '#10b981',
    partial: '#f59e0b',
    pending: '#ef4444'
}

export default function OverviewTab({ orders, allOrders, isMounted }: OverviewTabProps) {
    const approvedOrders = useMemo(() =>
        orders.filter(o => normalizeStatus(o.status) === 'approved'),
        [orders]
    )

    const financialReport = useMemo((): FinancialReport & { conversionRate: number } => {
        if (approvedOrders.length === 0) {
            return {
                period: '',
                totalRevenue: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                paymentBreakdown: { completed: 0, partial: 0, pending: 0 },
                monthlyData: [],
                topServices: [],
                conversionRate: 0,
            }
        }

        const totalRevenue = approvedOrders.reduce((sum, order) => sum + getOrderRevenue(order), 0)
        const totalOrders = approvedOrders.length
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        const conversionRate = allOrders.length > 0
            ? (approvedOrders.length / allOrders.length) * 100
            : 0

        const paymentBreakdown = approvedOrders.reduce((breakdown, order) => {
            if (!order.payment) return breakdown
            switch (order.payment.paymentStatus) {
                case 'completed':
                    breakdown.completed += order.payment.totalAmount
                    break
                case 'partial':
                    breakdown.partial += order.payment.paidAmount
                    breakdown.pending += order.payment.pendingAmount
                    break
                case 'pending':
                    breakdown.pending += order.payment.totalAmount
                    break
            }
            return breakdown
        }, { completed: 0, partial: 0, pending: 0 })

        const dates = approvedOrders.map(o => new Date(o.createdAt))
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))

        const months = eachMonthOfInterval({ start: startOfMonth(minDate), end: endOfMonth(maxDate) })
        const monthlyData: MonthlyFinancialData[] = months.map(month => {
            const monthStart = startOfMonth(month)
            const monthEnd = endOfMonth(month)
            const monthOrders = approvedOrders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate >= monthStart && orderDate <= monthEnd
            })
            const monthRevenue = monthOrders.reduce((sum, order) => sum + getOrderRevenue(order), 0)
            return {
                month: format(month, 'MMM yy', { locale: es }),
                revenue: monthRevenue,
                orders: monthOrders.length,
                averageValue: monthOrders.length > 0 ? monthRevenue / monthOrders.length : 0
            }
        })

        const serviceStats = approvedOrders.reduce((stats, order) => {
            const serviceType = order.contact.eventType || 'Sin especificar'
            if (!stats[serviceType]) stats[serviceType] = { revenue: 0, orders: 0 }
            stats[serviceType].revenue += getOrderRevenue(order)
            stats[serviceType].orders += 1
            return stats
        }, {} as Record<string, { revenue: number; orders: number }>)

        const topServices: ServiceRevenue[] = Object.entries(serviceStats)
            .map(([service, data]) => ({
                service,
                revenue: data.revenue,
                orders: data.orders,
                percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)

        return {
            period: '',
            totalRevenue,
            totalOrders,
            averageOrderValue,
            paymentBreakdown,
            monthlyData,
            topServices,
            conversionRate,
        }
    }, [approvedOrders, allOrders.length])

    const paymentChartData = [
        { name: 'Completados', value: financialReport.paymentBreakdown.completed, color: COLORS.completed },
        { name: 'Parciales', value: financialReport.paymentBreakdown.partial, color: COLORS.partial },
        { name: 'Pendientes', value: financialReport.paymentBreakdown.pending, color: COLORS.pending }
    ].filter(item => item.value > 0)

    if (approvedOrders.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📊</div>
                <div className={styles.emptyText}>No hay pedidos aprobados en este rango</div>
                <div className={styles.emptySubtext}>
                    Los reportes de resumen aparecerán cuando tengas pedidos aprobados
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={styles.overview}>
                <div className={`${styles.overviewCard} ${styles.revenue}`}>
                    <div className={styles.overviewLabel}>Ingresos Totales</div>
                    <div className={styles.overviewValue}>
                        {formatCurrency(financialReport.totalRevenue, isMounted)}
                    </div>
                    <div className={styles.overviewChange}>Pedidos aprobados</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.orders}`}>
                    <div className={styles.overviewLabel}>Total de Pedidos</div>
                    <div className={styles.overviewValue}>{financialReport.totalOrders}</div>
                    <div className={styles.overviewChange}>Pedidos aprobados</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.average}`}>
                    <div className={styles.overviewLabel}>Valor Promedio</div>
                    <div className={styles.overviewValue}>
                        {formatCurrency(financialReport.averageOrderValue, isMounted)}
                    </div>
                    <div className={styles.overviewChange}>Por pedido</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.conversion}`}>
                    <div className={styles.overviewLabel}>Tasa de Conversion</div>
                    <div className={styles.overviewValue}>
                        {formatPercentage(financialReport.conversionRate)}
                    </div>
                    <div className={styles.overviewChange}>
                        <TrendingUp size={12} style={{ marginRight: 4, display: 'inline' }} />
                        Aprobados / Total
                    </div>
                </div>
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Evolucion de Ingresos</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={financialReport.monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `€${value}`} />
                                    <Tooltip
                                        formatter={(value) => [formatCurrency(Number(value), isMounted), 'Ingresos']}
                                        labelFormatter={(label) => `Mes: ${label}`}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={3}
                                        dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Estado de Pagos</h3>
                        <div className={styles.paymentBreakdown}>
                            {paymentChartData.map((item, index) => (
                                <div key={index} className={styles.paymentItem}>
                                    <div className={styles.paymentLabel}>
                                        <div className={styles.paymentDot} style={{ backgroundColor: item.color }}></div>
                                        {item.name}
                                    </div>
                                    <div className={styles.paymentValue}>
                                        {formatCurrency(item.value, isMounted)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.topServices}>
                <h3 className={styles.chartTitle}>Servicios Mas Rentables</h3>
                <div className={styles.servicesGrid}>
                    {financialReport.topServices.map((service, index) => (
                        <div key={index} className={styles.serviceCard}>
                            <div className={styles.serviceName}>{service.service}</div>
                            <div className={styles.serviceRevenue}>
                                {formatCurrency(service.revenue, isMounted)}
                            </div>
                            <div className={styles.serviceOrders}>{service.orders} pedidos</div>
                            <div className={styles.servicePercentage}>
                                {formatPercentage(service.percentage)} del total
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.monthlyTable}>
                <div className={styles.tableHeader}>
                    <h3 className={styles.tableTitle}>Desglose Mensual</h3>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mes</th>
                            <th>Ingresos</th>
                            <th>Pedidos</th>
                            <th>Valor Promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financialReport.monthlyData.map((month, index) => (
                            <tr key={index}>
                                <td>{month.month}</td>
                                <td>{formatCurrency(month.revenue, isMounted)}</td>
                                <td>{month.orders}</td>
                                <td>{formatCurrency(month.averageValue, isMounted)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
