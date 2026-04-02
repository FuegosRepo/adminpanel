'use client'

import { useMemo } from 'react'
import { ReportBudget } from '@/services/budgetsService'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell
} from 'recharts'
import { formatPercentage } from '../utils/reportHelpers'
import styles from '../FinancialReports.module.css'

interface RelanceTabProps {
    budgets: ReportBudget[]
    isMounted: boolean
}

function normalizeBudgetStatus(status: string): string {
    if (status === 'ENVIADO') return 'sent'
    if (status === 'APPROVED') return 'approved'
    return status
}

const RELANCE_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280']

export default function RelanceTab({ budgets, isMounted }: RelanceTabProps) {
    const data = useMemo(() => {
        if (budgets.length === 0) return null

        // Group by relance count
        const maxRelance = Math.min(Math.max(...budgets.map(b => b.relance_count)), 5)
        const groups: { relances: string; total: number; approved: number; rejected: number; pending: number; rate: number }[] = []

        for (let i = 0; i <= maxRelance; i++) {
            const label = i >= 3 ? '3+' : `${i}`
            const existing = groups.find(g => g.relances === label)
            if (existing) continue

            const groupBudgets = i >= 3
                ? budgets.filter(b => b.relance_count >= 3)
                : budgets.filter(b => b.relance_count === i)

            const approved = groupBudgets.filter(b => {
                const s = normalizeBudgetStatus(b.status)
                return s === 'approved'
            }).length
            const rejected = groupBudgets.filter(b => normalizeBudgetStatus(b.status) === 'rejected').length
            const pending = groupBudgets.length - approved - rejected

            groups.push({
                relances: label,
                total: groupBudgets.length,
                approved,
                rejected,
                pending,
                rate: groupBudgets.length > 0 ? (approved / groupBudgets.length) * 100 : 0,
            })
        }

        // Overall stats
        const totalBudgets = budgets.length
        const totalApproved = budgets.filter(b => {
            const s = normalizeBudgetStatus(b.status)
            return s === 'approved'
        }).length
        const totalWithRelance = budgets.filter(b => b.relance_count > 0).length
        const avgRelances = totalBudgets > 0
            ? Math.round((budgets.reduce((s, b) => s + b.relance_count, 0) / totalBudgets) * 10) / 10
            : 0

        // Approval rate for those with relances vs without
        const withoutRelance = budgets.filter(b => b.relance_count === 0)
        const withRelance = budgets.filter(b => b.relance_count > 0)
        const rateWithout = withoutRelance.length > 0
            ? (withoutRelance.filter(b => normalizeBudgetStatus(b.status) === 'approved').length / withoutRelance.length) * 100
            : 0
        const rateWith = withRelance.length > 0
            ? (withRelance.filter(b => normalizeBudgetStatus(b.status) === 'approved').length / withRelance.length) * 100
            : 0

        // Chart data for stacked bar
        const chartData = groups.map(g => ({
            relances: g.relances === '0' ? 'Sin relance' : `${g.relances} relance${g.relances !== '1' ? 's' : ''}`,
            Aprobados: g.approved,
            Rechazados: g.rejected,
            'En proceso': g.pending,
        }))

        // Pie data: with vs without relance
        const comparisonPie = [
            { name: 'Sin relance', value: withoutRelance.length, color: '#3b82f6' },
            { name: 'Con relance(s)', value: withRelance.length, color: '#f59e0b' },
        ]

        return {
            groups, chartData, comparisonPie,
            totalBudgets, totalApproved, totalWithRelance, avgRelances,
            rateWithout, rateWith,
        }
    }, [budgets])

    if (!data || !isMounted) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📨</div>
                <div className={styles.emptyText}>No hay datos de presupuestos para analizar</div>
            </div>
        )
    }

    return (
        <>
            <div className={styles.overview}>
                <div className={`${styles.overviewCard} ${styles.orders}`}>
                    <div className={styles.overviewLabel}>Total Presupuestos</div>
                    <div className={styles.overviewValue}>{data.totalBudgets}</div>
                    <div className={styles.overviewChange}>{data.totalApproved} aprobados</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.revenue}`}>
                    <div className={styles.overviewLabel}>Con Relance</div>
                    <div className={styles.overviewValue}>{data.totalWithRelance}</div>
                    <div className={styles.overviewChange}>
                        {formatPercentage(data.totalBudgets > 0 ? (data.totalWithRelance / data.totalBudgets) * 100 : 0)} del total
                    </div>
                </div>
                <div className={`${styles.overviewCard} ${styles.average}`}>
                    <div className={styles.overviewLabel}>Promedio Relances</div>
                    <div className={styles.overviewValue}>{data.avgRelances}</div>
                    <div className={styles.overviewChange}>Por presupuesto</div>
                </div>
                <div className={`${styles.overviewCard} ${styles.conversion}`}>
                    <div className={styles.overviewLabel}>Aprobacion con Relance</div>
                    <div className={styles.overviewValue}>{formatPercentage(data.rateWith)}</div>
                    <div className={styles.overviewChange}>vs {formatPercentage(data.rateWithout)} sin relance</div>
                </div>
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Resultado por Cantidad de Relances</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="relances" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Aprobados" stackId="a" fill="#10b981" />
                                    <Bar dataKey="Rechazados" stackId="a" fill="#ef4444" />
                                    <Bar dataKey="En proceso" stackId="a" fill="#9ca3af" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3 className={styles.chartTitle}>Con Relance vs Sin Relance</h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.comparisonPie}
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={90}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {data.comparisonPie.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Presupuestos']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed table */}
            <div className={styles.monthlyTable}>
                <div className={styles.tableHeader}>
                    <h3 className={styles.tableTitle}>Efectividad por Numero de Relances</h3>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Relances</th>
                            <th>Total</th>
                            <th>Aprobados</th>
                            <th>Rechazados</th>
                            <th>En Proceso</th>
                            <th>Tasa Aprobacion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.groups.map((g, index) => (
                            <tr key={index}>
                                <td>
                                    <span style={{
                                        display: 'inline-block', width: 10, height: 10,
                                        borderRadius: '50%', backgroundColor: RELANCE_COLORS[index % RELANCE_COLORS.length], marginRight: 8
                                    }}></span>
                                    {g.relances === '0' ? 'Sin relance' : `${g.relances} relance${g.relances !== '1' ? 's' : ''}`}
                                </td>
                                <td>{g.total}</td>
                                <td style={{ color: '#10b981', fontWeight: 500 }}>{g.approved}</td>
                                <td style={{ color: '#ef4444', fontWeight: 500 }}>{g.rejected}</td>
                                <td>{g.pending}</td>
                                <td>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
                                        background: g.rate >= 50 ? '#d1fae5' : g.rate >= 25 ? '#fef3c7' : '#fef2f2',
                                        color: g.rate >= 50 ? '#059669' : g.rate >= 25 ? '#d97706' : '#dc2626',
                                    }}>
                                        {formatPercentage(g.rate)}
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
