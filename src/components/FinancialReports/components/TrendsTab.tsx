'use client'

import { useMemo } from 'react'
import { CateringOrder } from '@/types'
import { eachMonthOfInterval, startOfMonth, endOfMonth, format, getDay, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts'
import styles from '../FinancialReports.module.css'

interface TrendsTabProps {
    orders: CateringOrder[]
    isMounted: boolean
}

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function TrendsTab({ orders, isMounted }: TrendsTabProps) {
    const data = useMemo(() => {
        if (orders.length === 0) return null

        // Day of week analysis (based on event_date)
        const dayOfWeekCounts = Array(7).fill(0)
        orders.forEach(order => {
            if (order.contact.eventDate) {
                try {
                    const date = parseISO(order.contact.eventDate)
                    dayOfWeekCounts[getDay(date)]++
                } catch { /* skip invalid dates */ }
            }
        })

        const dayOfWeekData = DAY_NAMES.map((name, i) => ({
            day: name,
            eventos: dayOfWeekCounts[i],
        }))

        // Monthly volume (all statuses, based on created_at)
        const dates = orders.map(o => new Date(o.createdAt))
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))

        const months = eachMonthOfInterval({ start: startOfMonth(minDate), end: endOfMonth(maxDate) })
        const monthlyVolume = months.map(month => {
            const mStart = startOfMonth(month)
            const mEnd = endOfMonth(month)
            const count = orders.filter(o => {
                const d = new Date(o.createdAt)
                return d >= mStart && d <= mEnd
            }).length
            return {
                month: format(month, 'MMM yy', { locale: es }),
                pedidos: count,
            }
        })

        // Seasonality: average per calendar month across all years
        const monthYearCounts: Record<number, number[]> = {}
        orders.forEach(o => {
            const d = new Date(o.createdAt)
            const m = d.getMonth()
            const y = d.getFullYear()
            const key = m
            if (!monthYearCounts[key]) monthYearCounts[key] = []
            // Track unique years
            if (!monthYearCounts[key].includes(y)) monthYearCounts[key].push(y)
        })

        const monthCounts: Record<number, number> = {}
        orders.forEach(o => {
            const m = new Date(o.createdAt).getMonth()
            monthCounts[m] = (monthCounts[m] || 0) + 1
        })

        const seasonalityData = MONTH_NAMES.map((name, i) => {
            const years = monthYearCounts[i]?.length || 1
            return {
                month: name.substring(0, 3),
                promedio: Math.round((monthCounts[i] || 0) / years * 10) / 10,
                total: monthCounts[i] || 0,
            }
        })

        // Busiest months
        const sortedMonths = [...seasonalityData].sort((a, b) => b.total - a.total)
        const busiestMonths = sortedMonths.slice(0, 3)

        // Busiest day
        const busiestDay = dayOfWeekData.reduce((max, d) => d.eventos > max.eventos ? d : max, dayOfWeekData[0])

        return { dayOfWeekData, monthlyVolume, seasonalityData, busiestMonths, busiestDay }
    }, [orders])

    if (!data || !isMounted) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📈</div>
                <div className={styles.emptyText}>No hay datos de tendencias en este rango</div>
            </div>
        )
    }

    return (
        <>
            {/* Highlights */}
            <div className={styles.overview}>
                <div className={`${styles.overviewCard} ${styles.revenue}`}>
                    <div className={styles.overviewLabel}>Dia Mas Activo</div>
                    <div className={styles.overviewValue} style={{ fontSize: '1.5rem' }}>{data.busiestDay.day}</div>
                    <div className={styles.overviewChange}>{data.busiestDay.eventos} eventos</div>
                </div>
                {data.busiestMonths.map((m, i) => (
                    <div key={i} className={`${styles.overviewCard} ${i === 0 ? styles.orders : ''}`}>
                        <div className={styles.overviewLabel}>#{i + 1} Mes Mas Activo</div>
                        <div className={styles.overviewValue} style={{ fontSize: '1.5rem' }}>{m.month}</div>
                        <div className={styles.overviewChange}>{m.total} pedidos totales</div>
                    </div>
                ))}
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Volumen Mensual de Pedidos</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.monthlyVolume}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="pedidos" stroke="#d97706" strokeWidth={2}
                                        dot={{ fill: '#d97706', r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Eventos por Dia de la Semana</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.dayOfWeekData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="eventos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seasonality */}
            <div className={styles.chartCard} style={{ marginTop: 24 }}>
                <h3 className={styles.chartTitle}>Estacionalidad: Promedio Mensual</h3>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.seasonalityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value, name) => [value, name === 'promedio' ? 'Promedio por ano' : 'Total']} />
                            <Bar dataKey="promedio" fill="#d97706" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}
