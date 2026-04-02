import { CateringOrder } from '@/types'

export function normalizeStatus(status: string): string {
    if (status === 'ENVIADO') return 'sent'
    return status
}

export function getOrderRevenue(order: CateringOrder): number {
    if (order.payment?.paidAmount) return order.payment.paidAmount
    return order.estimatedPrice ?? 0
}

export function formatCurrency(amount: number, isMounted: boolean): string {
    if (!isMounted) return amount.toString()
    return amount.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR'
    })
}

export function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`
}

export const STATUS_COLORS: Record<string, string> = {
    pending: '#f59e0b',
    sent: '#3b82f6',
    approved: '#10b981',
    rejected: '#ef4444',
}

export const STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente',
    sent: 'Enviado',
    approved: 'Aprobado',
    rejected: 'Rechazado',
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    transferencia: 'Transferencia',
    efectivo_blanco: 'Efectivo (Blanco)',
    efectivo_negro: 'Efectivo (Negro)',
}

export const PAYMENT_METHOD_COLORS: Record<string, string> = {
    transferencia: '#3b82f6',
    efectivo_blanco: '#10b981',
    efectivo_negro: '#6b7280',
}
