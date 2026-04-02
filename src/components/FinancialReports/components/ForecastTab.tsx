'use client'

import { useMemo } from 'react'
import { CateringOrder } from '@/types'
import { eachMonthOfInterval, startOfMonth, endOfMonth, format, parseISO, isFuture, isAfter } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts'
import { normalizeStatus, getOrderRevenue, formatCurrency } from '../utils/reportHelpers'
import styles from '../FinancialReports.module.css'

interface ForecastTabProps {
    orders: CateringOrder[]
    isMounted: boolean
}

export default function ForecastTab({ orders, isMounted }: ForecastTabProps) {
    const data = useMemo(() => {
        const now = new Date()

        // Approved orders with future event_date
        const futureApproved = orders.filter(o => {
            if (normalizeStatus(o.status) !== 'approved') return false
            if (!o.contact.eventDate) return false
            try {
                return isAfter(parseISO(o.contact.eventDate), now)
            } catch { return false }
        })

        if (futureApproved.length === 0) return null

        const confirmedRevenue = futureApproved.reduce((s, o) => s + getOrderRevenue(o), 0)
        const avgGuests = futureApproved.length > 0
            ? Math.round(futureApproved.reduce((s, o) => s + (o.contact.guestCount || 0), 0) / futureApproved.length)
            : 0

        // Group by month
        const eventDates = futureApproved.map(o => parseISO(o.contact.eventDate))
        const minDate = new Date(Math.min(...eventDates.map(d => d.getTime())))
        const maxDate = new Date(Math.max(...eventDates.map(d => d.getTime())))

        const months = eachMonthOfInterval({ start: startOfMonth(minDate), end: endOfMonth(maxDate) })
        let cumulative = 0
        const monthlyForecast = months.map(month => {
            const mStart = startOfMonth(month)
            const mEnd = endOfMonth(month)
            const monthOrders = futureApproved.filter(o => {
                const d = parseISO(o.contact.eventDate)
                return d >= mStart && d <= mEnd
            })
            const revenue = monthOrders.reduce((s, o) => s + getOrderRevenue(o), 0)
            cumulative += revenue
            return {
                month: format(month, 'MMM yy', { locale: es }),
                ingresos: revenue,
                pedidos: monthOrders.length,
                acumulado: cumulative,
            }
        })

        // Pending orders with future event_date (potential extra revenue)
        const futurePending = orders.filter(o => {
            const s = normalizeStatus(o.status)
            if (s !== 'pending' && s !== 'sent') return false
            if (!o.contact.eventDate) return false
            try { return isAfter(parseISO(o.contact.eventDate), now) } catch { return false }
        })
        const potentialRevenue = futurePending.reduce((s, o) => s + (o.estimatedPrice || 0), 0)

        // Next event
        const sortedByDate = [...futureApproved].sort((a, b) =>
            parseISO(a.contact.eventDate).getTime() - parseISO(b.contact.eventDate).getTime()
        )
        const nextEvent = sortedByDate[0]

        return {
            futureApproved,
            confirmedRevenue,
            avgGuests,
            monthlyForecast,
            potentialRevenue,
            futurePendingCount: futurePending.length,
            nextEvent,
        }
    }, [orders])

    if (!data || !isMounted) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔮</div>
                <div className={styles.emptyText}>No hay eventos futuros confirmados</div>
                <div className={styles.emptySubtext}>Los ingresos proyectados aparecerán cuando haya pedidos aprobados con fecha de evento futura</div>
            </div>
        )
    }

    return (
        <>
            <div className={styles.overview}>
                <div className={`${styles.overviewCard} ${styles.revenue}`}>
                    <div className={styles.overviewLabel}>Ingresos Confirmados</div>
                    <div className={styles.overviewValue}>{formatCurrency(data.confirmedRevenue, isMounted)}</div>
                    <div className={styles.overviewChange}>{data.futureApproved.length} eventos aprobados</div>
                </div>
                <div className={`${styles.overviewCard}`}
                    style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderColor: '#f59e0b' }}>
                    <div className={styles.overviewLabel}>Ingresos Potenciales</div>
                    <div className={styles.overviewValue}>{formatCurrency(data.potentialRevenue, isMounted)}</div>
                    <div className={styles.overviewChange}>{data.futurePendingCount} pedidos en proceso</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.orders}`}>
                    <div className={styles.overviewLabel}>Invitados Promedio</div>
                    <div className={styles.overviewValue}>{data.avgGuests}</div>
                    <div className={styles.overviewChange}>Por evento futuro</div>
                </div>
                {data.nextEvent && (
                    <div className={`${styles.overviewCard} ${styles.average}`}>
                        <div className={styles.overviewLabel}>Proximo Evento</div>
                        <div className={styles.overviewValue} style={{ fontSize: '1rem' }}>
                            {data.nextEvent.contact.name}
                        </div>
                        <div className={styles.overviewChange}>
                            {format(parseISO(data.nextEvent.contact.eventDate), 'dd MMM yyyy', { locale: es })}
                            {' — '}{data.nextEvent.contact.eventType || 'Evento'}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Ingresos Proyectados por Mes</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.monthlyForecast}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(v) => `€${v}`} />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            name === 'ingresos' ? formatCurrency(Number(value), isMounted) : value,
                                            name === 'ingresos' ? 'Ingresos' : 'Pedidos'
                                        ]}
                                    />
                                    <Bar dataKey="ingresos" fill="#d97706" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Ingresos Acumulados Proyectados</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.monthlyForecast}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(v) => `€${v}`} />
                                    <Tooltip formatter={(value) => [formatCurrency(Number(value), isMounted), 'Acumulado']} />
                                    <Area type="monotone" dataKey="acumulado" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming events table */}
            <div className={styles.monthlyTable}>
                <div className={styles.tableHeader}>
                    <h3 className={styles.tableTitle}>Proximos Eventos Confirmados</h3>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Fecha Evento</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Invitados</th>
                            <th>Ingreso</th>
                            <th>Estado Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.futureApproved
                            .sort((a, b) => parseISO(a.contact.eventDate).getTime() - parseISO(b.contact.eventDate).getTime())
                            .map((order) => (
                                <tr key={order.id}>
                                    <td>{format(parseISO(order.contact.eventDate), 'dd MMM yyyy', { locale: es })}</td>
                                    <td>{order.contact.name}</td>
                                    <td>{order.contact.eventType || '-'}</td>
                                    <td>{order.contact.guestCount || '-'}</td>
                                    <td>{formatCurrency(getOrderRevenue(order), isMounted)}</td>
                                    <td>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500,
                                            background: order.payment?.paymentStatus === 'completed' ? '#d1fae5'
                                                : order.payment?.paymentStatus === 'partial' ? '#fef3c7' : '#fef2f2',
                                            color: order.payment?.paymentStatus === 'completed' ? '#059669'
                                                : order.payment?.paymentStatus === 'partial' ? '#d97706' : '#dc2626',
                                        }}>
                                            {order.payment?.paymentStatus === 'completed' ? 'Pagado'
                                                : order.payment?.paymentStatus === 'partial' ? 'Parcial' : 'Pendiente'}
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
