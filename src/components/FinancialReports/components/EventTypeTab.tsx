'use client'

import { useMemo } from 'react'
import { CateringOrder } from '@/types'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie
} from 'recharts'
import { normalizeStatus, getOrderRevenue, formatCurrency, formatPercentage } from '../utils/reportHelpers'
import styles from '../FinancialReports.module.css'

interface EventTypeTabProps {
    orders: CateringOrder[]
    isMounted: boolean
}

const EVENT_COLORS = ['#d97706', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#f59e0b', '#ec4899']

export default function EventTypeTab({ orders, isMounted }: EventTypeTabProps) {
    const data = useMemo(() => {
        const approved = orders.filter(o => normalizeStatus(o.status) === 'approved')
        if (approved.length === 0) return null

        // Event type stats
        const eventStats: Record<string, { count: number; revenue: number; totalGuests: number }> = {}
        approved.forEach(order => {
            const type = order.contact.eventType || 'Sin especificar'
            if (!eventStats[type]) eventStats[type] = { count: 0, revenue: 0, totalGuests: 0 }
            eventStats[type].count++
            eventStats[type].revenue += getOrderRevenue(order)
            eventStats[type].totalGuests += order.contact.guestCount || 0
        })

        const totalRevenue = approved.reduce((s, o) => s + getOrderRevenue(o), 0)
        const totalGuests = approved.reduce((s, o) => s + (o.contact.guestCount || 0), 0)

        const eventTypes = Object.entries(eventStats)
            .map(([type, stats], i) => ({
                type,
                count: stats.count,
                revenue: stats.revenue,
                avgRevenue: stats.count > 0 ? stats.revenue / stats.count : 0,
                avgGuests: stats.count > 0 ? Math.round(stats.totalGuests / stats.count) : 0,
                revenuePercentage: totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0,
                color: EVENT_COLORS[i % EVENT_COLORS.length],
            }))
            .sort((a, b) => b.revenue - a.revenue)

        // Menu type distribution
        const menuStats = { dejeuner: 0, diner: 0, sin_especificar: 0 }
        approved.forEach(order => {
            if (order.menu.type === 'dejeuner') menuStats.dejeuner++
            else if (order.menu.type === 'diner') menuStats.diner++
            else menuStats.sin_especificar++
        })

        const menuDistribution = [
            { name: 'Dejeuner (Almuerzo)', value: menuStats.dejeuner, color: '#f59e0b' },
            { name: 'Diner (Cena)', value: menuStats.diner, color: '#6366f1' },
            ...(menuStats.sin_especificar > 0 ? [{ name: 'Sin especificar', value: menuStats.sin_especificar, color: '#9ca3af' }] : []),
        ]

        const avgGuestsAll = approved.length > 0 ? Math.round(totalGuests / approved.length) : 0
        const revenuePerGuest = totalGuests > 0 ? totalRevenue / totalGuests : 0

        return { eventTypes, menuDistribution, avgGuestsAll, revenuePerGuest, totalRevenue }
    }, [orders])

    if (!data || !isMounted) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎉</div>
                <div className={styles.emptyText}>No hay datos de tipos de evento en este rango</div>
            </div>
        )
    }

    return (
        <>
            {/* Guest stats */}
            <div className={styles.overview}>
                <div className={`${styles.overviewCard} ${styles.orders}`}>
                    <div className={styles.overviewLabel}>Promedio de Invitados</div>
                    <div className={styles.overviewValue}>{data.avgGuestsAll}</div>
                    <div className={styles.overviewChange}>Por evento</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.average}`}>
                    <div className={styles.overviewLabel}>Ingreso por Invitado</div>
                    <div className={styles.overviewValue}>
                        {formatCurrency(data.revenuePerGuest, isMounted)}
                    </div>
                    <div className={styles.overviewChange}>Promedio general</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.revenue}`}>
                    <div className={styles.overviewLabel}>Tipos de Evento</div>
                    <div className={styles.overviewValue}>{data.eventTypes.length}</div>
                    <div className={styles.overviewChange}>Diferentes categorias</div>
                </div>
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Ingresos por Tipo de Evento</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.eventTypes} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tickFormatter={(v) => `€${v}`} />
                                    <YAxis type="category" dataKey="type" width={130} />
                                    <Tooltip formatter={(value) => [formatCurrency(Number(value), isMounted), 'Ingresos']} />
                                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                                        {data.eventTypes.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Tipo de Menu</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.menuDistribution}
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={90}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {data.menuDistribution.map((entry, index) => (
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

            {/* Event type table */}
            <div className={styles.monthlyTable}>
                <div className={styles.tableHeader}>
                    <h3 className={styles.tableTitle}>Detalle por Tipo de Evento</h3>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tipo de Evento</th>
                            <th>Pedidos</th>
                            <th>Ingresos</th>
                            <th>% Ingresos</th>
                            <th>Ingreso Prom.</th>
                            <th>Invitados Prom.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.eventTypes.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <span style={{
                                        display: 'inline-block', width: 10, height: 10,
                                        borderRadius: '50%', backgroundColor: item.color, marginRight: 8
                                    }}></span>
                                    {item.type}
                                </td>
                                <td>{item.count}</td>
                                <td>{formatCurrency(item.revenue, isMounted)}</td>
                                <td>{formatPercentage(item.revenuePercentage)}</td>
                                <td>{formatCurrency(item.avgRevenue, isMounted)}</td>
                                <td>{item.avgGuests}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
