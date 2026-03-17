'use client'

import dynamic from 'next/dynamic'
import { useOrders } from '@/hooks/useOrders'

const FinancialReports = dynamic(
  () => import('@/components/FinancialReports/FinancialReports'),
  { loading: () => <div className="p-8 text-center text-muted-foreground">Cargando reportes...</div> }
)

export default function ReportsPage() {
    const { orders } = useOrders()

    return (
        <FinancialReports orders={orders} />
    )
}
