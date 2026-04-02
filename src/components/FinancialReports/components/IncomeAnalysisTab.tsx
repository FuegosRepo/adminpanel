'use client'

import { useMemo } from 'react'
import { CateringOrder } from '@/types'
import { eachMonthOfInterval, startOfMonth, endOfMonth, subYears, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { TrendingUp, TrendingDown } from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    AreaChart, Area
} from 'recharts'
import { normalizeStatus, getOrderRevenue, formatCurrency, formatPercentage } from '../utils/reportHelpers'
import styles from '../FinancialReports.module.css'

interface IncomeAnalysisTabProps {
    orders: CateringOrder[]
    allOrdersUnfiltered: CateringOrder[]
    isMounted: boolean
}

export default function IncomeAnalysisTab({ orders, allOrdersUnfiltered, isMounted }: IncomeAnalysisTabProps) {
    const data = useMemo(() => {
        const approved = orders.filter(o => normalizeStatus(o.status) === 'approved')
        if (approved.length === 0) return null

        const currentRevenue = approved.reduce((s, o) => s + getOrderRevenue(o), 0)

        // Calculate date range for comparison
        const dates = approved.map(o => new Date(o.createdAt))
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
        const rangeDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)

        // Previous period: same duration before minDate
        const prevEnd = new Date(minDate.getTime() - 1)
        const prevStart = new Date(prevEnd.getTime() - rangeDays * 1000 * 60 * 60 * 24)

        const prevApproved = allOrdersUnfiltered.filter(o => {
            if (normalizeStatus(o.status) !== 'approved') return false
            const d = new Date(o.createdAt)
            return d >= prevStart && d <= prevEnd
        })
        const prevRevenue = prevApproved.reduce((s, o) => s + getOrderRevenue(o), 0)

        const growth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0

        // Monthly data for current period
        const months = eachMonthOfInterval({ start: startOfMonth(minDate), end: endOfMonth(maxDate) })

        // Previous period months for comparison
        const prevMonths = eachMonthOfInterval({
            start: startOfMonth(subYears(minDate, 1)),
            end: endOfMonth(subYears(maxDate, 1))
        })

        const getMonthRevenue = (sourceOrders: CateringOrder[], month: Date) => {
            const mStart = startOfMonth(month)
            const mEnd = endOfMonth(month)
            return sourceOrders
                .filter(o => {
                    const d = new Date(o.createdAt)
                    return d >= mStart && d <= mEnd && normalizeStatus(o.status) === 'approved'
                })
                .reduce((s, o) => s + getOrderRevenue(o), 0)
        }

        // Comparison chart data (current vs previous year, aligned by month)
        const comparisonData = months.map((month, i) => {
            const prevMonth = prevMonths[i]
            return {
                month: format(month, 'MMM', { locale: es }),
                actual: getMonthRevenue(orders, month),
                anterior: prevMonth ? getMonthRevenue(allOrdersUnfiltered, prevMonth) : 0,
            }
        })

        // Cumulative revenue
        let cumulative = 0
        const cumulativeData = months.map(month => {
            cumulative += getMonthRevenue(orders, month)
            return {
                month: format(month, 'MMM yy', { locale: es }),
                acumulado: cumulative,
            }
        })

        return {
            currentRevenue,
            prevRevenue,
            growth,
            currentOrders: approved.length,
            prevOrders: prevApproved.length,
            comparisonData,
            cumulativeData,
        }
    }, [orders, allOrdersUnfiltered])

    if (!data || !isMounted) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💰</div>
                <div className={styles.emptyText}>No hay ingresos en este rango</div>
            </div>
        )
    }

    const isPositive = data.growth >= 0

    return (
        <>
            <div className={styles.overview}>
                <div className={`${styles.overviewCard} ${styles.revenue}`}>
                    <div className={styles.overviewLabel}>Ingresos Periodo Actual</div>
                    <div className={styles.overviewValue}>
                        {formatCurrency(data.currentRevenue, isMounted)}
                    </div>
                    <div className={styles.overviewChange}>{data.currentOrders} pedidos aprobados</div>
                </div>
                <div className={`${styles.overviewCard}`} style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', borderColor: '#9ca3af' }}>
                    <div className={styles.overviewLabel}>Ingresos Periodo Anterior</div>
                    <div className={styles.overviewValue}>
                        {formatCurrency(data.prevRevenue, isMounted)}
                    </div>
                    <div className={styles.overviewChange}>{data.prevOrders} pedidos aprobados</div>
                </div>
                <div className={`${styles.overviewCard}`}
                    style={{
                        background: isPositive
                            ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                            : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                        borderColor: isPositive ? '#10b981' : '#ef4444'
                    }}>
                    <div className={styles.overviewLabel}>Crecimiento</div>
                    <div className={styles.overviewValue} style={{ color: isPositive ? '#059669' : '#dc2626' }}>
                        {isPositive ? '+' : ''}{formatPercentage(data.growth)}
                    </div>
                    <div className={styles.overviewChange}>
                        {isPositive
                            ? <TrendingUp size={14} style={{ display: 'inline', marginRight: 4 }} />
                            : <TrendingDown size={14} style={{ display: 'inline', marginRight: 4 }} />}
                        vs periodo anterior
                    </div>
                </div>
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Comparacion de Ingresos: Actual vs Anterior</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(v) => `€${v}`} />
                                    <Tooltip formatter={(value) => [formatCurrency(Number(value), isMounted)]} />
                                    <Legend />
                                    <Line type="monotone" dataKey="actual" name="Periodo Actual" stroke="#d97706" strokeWidth={3}
                                        dot={{ fill: '#d97706', r: 4 }} />
                                    <Line type="monotone" dataKey="anterior" name="Periodo Anterior" stroke="#9ca3af" strokeWidth={2}
                                        strokeDasharray="5 5" dot={{ fill: '#9ca3af', r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Ingresos Acumulados</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.cumulativeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(v) => `€${v}`} />
                                    <Tooltip formatter={(value) => [formatCurrency(Number(value), isMounted), 'Acumulado']} />
                                    <Area type="monotone" dataKey="acumulado" stroke="#d97706" fill="#fef3c7" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
