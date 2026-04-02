import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { CateringOrder } from '@/types'
import { normalizeStatus, getOrderRevenue, STATUS_LABELS, PAYMENT_METHOD_LABELS } from './reportHelpers'

// Extend jsPDF type for autoTable
interface jsPDFWithAutoTable extends jsPDF {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoTable: (options: any) => jsPDF
}

function formatDate(dateStr: string): string {
    try {
        return new Date(dateStr).toLocaleDateString('es-ES')
    } catch {
        return dateStr
    }
}

function formatEur(amount: number): string {
    return amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

function buildRows(orders: CateringOrder[]) {
    return orders.map(order => ({
        fecha: formatDate(order.createdAt),
        cliente: order.contact.name,
        email: order.contact.email,
        evento: order.contact.eventType || 'Sin especificar',
        fechaEvento: order.contact.eventDate ? formatDate(order.contact.eventDate) : '-',
        invitados: order.contact.guestCount || 0,
        estado: STATUS_LABELS[normalizeStatus(order.status)] || order.status,
        medioPago: order.paymentMethod ? (PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod) : '-',
        ingresos: getOrderRevenue(order),
    }))
}

export function exportReportCSV(orders: CateringOrder[]): void {
    const rows = buildRows(orders)
    const headers = ['Fecha', 'Cliente', 'Email', 'Evento', 'Fecha Evento', 'Invitados', 'Estado', 'Medio de Pago', 'Ingresos']

    const csvContent = [
        headers.join(','),
        ...rows.map(row => [
            row.fecha,
            `"${row.cliente.replace(/"/g, '""')}"`,
            row.email,
            `"${row.evento.replace(/"/g, '""')}"`,
            row.fechaEvento,
            row.invitados,
            row.estado,
            row.medioPago,
            row.ingresos.toFixed(2),
        ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `reporte-pedidos-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
}

export function exportReportPDF(orders: CateringOrder[]): void {
    const doc = new jsPDF({ orientation: 'landscape' }) as jsPDFWithAutoTable

    // Title
    doc.setFontSize(18)
    doc.setTextColor(217, 119, 6) // orange
    doc.text('Reporte de Pedidos - Fuegos d\'Azur', 14, 20)

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} — Total: ${orders.length} pedidos`, 14, 28)

    // Summary
    const approved = orders.filter(o => normalizeStatus(o.status) === 'approved')
    const totalRevenue = approved.reduce((s, o) => s + getOrderRevenue(o), 0)
    const avgValue = approved.length > 0 ? totalRevenue / approved.length : 0
    const conversionRate = orders.length > 0 ? ((approved.length / orders.length) * 100).toFixed(1) : '0'

    doc.setFontSize(11)
    doc.setTextColor(0)
    doc.text(`Ingresos: ${formatEur(totalRevenue)}  |  Aprobados: ${approved.length}  |  Valor Promedio: ${formatEur(avgValue)}  |  Conversion: ${conversionRate}%`, 14, 36)

    // Table
    const rows = buildRows(orders)
    doc.autoTable({
        startY: 42,
        head: [['Fecha', 'Cliente', 'Evento', 'Fecha Evento', 'Invitados', 'Estado', 'Medio Pago', 'Ingresos']],
        body: rows.map(r => [
            r.fecha, r.cliente, r.evento, r.fechaEvento,
            r.invitados, r.estado, r.medioPago, formatEur(r.ingresos)
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [217, 119, 6] },
        alternateRowStyles: { fillColor: [255, 249, 235] },
    })

    doc.save(`reporte-pedidos-${new Date().toISOString().slice(0, 10)}.pdf`)
}
