'use client'

import { useState, useEffect, useRef } from 'react'
import { CateringOrder, PaymentMethod } from '@/types'
import { ReportBudget } from '@/services/budgetsService'
import { Download, ChevronDown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ReportDateRangePicker from './components/ReportDateRangePicker'
import OverviewTab from './components/OverviewTab'
import StatusFunnelTab from './components/StatusFunnelTab'
import IncomeAnalysisTab from './components/IncomeAnalysisTab'
import PaymentMethodTab from './components/PaymentMethodTab'
import EventTypeTab from './components/EventTypeTab'
import TrendsTab from './components/TrendsTab'
import ReceivablesTab from './components/ReceivablesTab'
import RelanceTab from './components/RelanceTab'
import ForecastTab from './components/ForecastTab'
import { exportReportCSV, exportReportPDF } from './utils/reportExport'
import styles from './FinancialReports.module.css'

interface FinancialReportsProps {
    orders: CateringOrder[]
    allOrdersUnfiltered: CateringOrder[]
    budgets: ReportBudget[]
    dateFrom: string
    dateTo: string
    onDateFromChange: (value: string) => void
    onDateToChange: (value: string) => void
    onUpdatePaymentMethod?: (orderId: string, method: PaymentMethod | null) => void
}

export default function FinancialReports({
    orders,
    allOrdersUnfiltered,
    budgets,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    onUpdatePaymentMethod,
}: FinancialReportsProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [exportOpen, setExportOpen] = useState(false)
    const exportRef = useRef<HTMLDivElement>(null)

    useEffect(() => { setIsMounted(true) }, [])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
                setExportOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!isMounted) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    Cargando reportes...
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Reportes Financieros</h2>
                <div className={styles.headerActions}>
                    <div className={styles.exportWrapper} ref={exportRef}>
                        <button className={styles.exportBtn} onClick={() => setExportOpen(!exportOpen)}>
                            <Download size={16} />
                            Exportar
                            <ChevronDown size={14} />
                        </button>
                        {exportOpen && (
                            <div className={styles.exportDropdown}>
                                <button onClick={() => { exportReportCSV(orders); setExportOpen(false) }}>
                                    Exportar CSV
                                </button>
                                <button onClick={() => { exportReportPDF(orders); setExportOpen(false) }}>
                                    Exportar PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ReportDateRangePicker
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={onDateFromChange}
                onDateToChange={onDateToChange}
            />

            <Tabs defaultValue="resumen" className={styles.tabs}>
                <TabsList className={styles.tabsList}>
                    <TabsTrigger value="resumen">Resumen</TabsTrigger>
                    <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                    <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
                    <TabsTrigger value="pagos">Medios de Pago</TabsTrigger>
                    <TabsTrigger value="eventos">Tipos de Evento</TabsTrigger>
                    <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
                    <TabsTrigger value="cobrar">Cuentas x Cobrar</TabsTrigger>
                    <TabsTrigger value="relances">Relances</TabsTrigger>
                    <TabsTrigger value="forecast">Forecast</TabsTrigger>
                </TabsList>

                <TabsContent value="resumen">
                    <OverviewTab orders={orders} allOrders={orders} isMounted={isMounted} />
                </TabsContent>
                <TabsContent value="pipeline">
                    <StatusFunnelTab orders={orders} isMounted={isMounted} />
                </TabsContent>
                <TabsContent value="ingresos">
                    <IncomeAnalysisTab orders={orders} allOrdersUnfiltered={allOrdersUnfiltered} isMounted={isMounted} />
                </TabsContent>
                <TabsContent value="pagos">
                    <PaymentMethodTab orders={orders} isMounted={isMounted} onUpdatePaymentMethod={onUpdatePaymentMethod} />
                </TabsContent>
                <TabsContent value="eventos">
                    <EventTypeTab orders={orders} isMounted={isMounted} />
                </TabsContent>
                <TabsContent value="tendencias">
                    <TrendsTab orders={orders} isMounted={isMounted} />
                </TabsContent>
                <TabsContent value="cobrar">
                    <ReceivablesTab orders={orders} isMounted={isMounted} />
                </TabsContent>
                <TabsContent value="relances">
                    <RelanceTab budgets={budgets} isMounted={isMounted} />
                </TabsContent>
                <TabsContent value="forecast">
                    <ForecastTab orders={orders} isMounted={isMounted} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
