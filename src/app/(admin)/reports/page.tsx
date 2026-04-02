'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useReportOrders } from '@/hooks/useReportOrders'
import { useReportBudgets } from '@/hooks/useReportBudgets'
import { fetchAllOrdersForReports } from '@/services/ordersService'
import { useQuery } from '@tanstack/react-query'

const FinancialReports = dynamic(
    () => import('@/components/FinancialReports/FinancialReports'),
    { loading: () => <div className="p-8 text-center text-muted-foreground">Cargando reportes...</div> }
)

export default function ReportsPage() {
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    const { orders } = useReportOrders(
        dateFrom || undefined,
        dateTo || undefined
    )

    // Unfiltered orders for period comparison in IncomeAnalysisTab
    const { data: allOrdersUnfiltered = [] } = useQuery({
        queryKey: ['reportOrdersAll'],
        queryFn: () => fetchAllOrdersForReports(),
        staleTime: 1000 * 60 * 10,
    })

    // Budgets for relance effectiveness analysis
    const { budgets } = useReportBudgets()

    return (
        <FinancialReports
            orders={orders}
            allOrdersUnfiltered={allOrdersUnfiltered}
            budgets={budgets}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
        />
    )
}
