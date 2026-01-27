import { ExternalBudget } from '@/types'
import { useState } from 'react'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { updateExternalBudget } from '@/services/externalBudgetsService'
import styles from './ExternalBudgets.module.css'

interface ExternalBudgetCardProps {
    budget: ExternalBudget
    onResend: (budgetId: string) => void
    onViewDetails?: (budget: ExternalBudget) => void
    onRefresh?: () => void
}

export default function ExternalBudgetCard({ budget, onResend, onViewDetails, onRefresh }: ExternalBudgetCardProps) {
    const [isUpdating, setIsUpdating] = useState(false)

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Fecha no especificada'
        try {
            const date = new Date(dateStr)
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        } catch {
            return 'Fecha inválida'
        }
    }

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'pending':
                return styles.statusPending
            case 'sent':
                return styles.statusSent
            case 'accepted':
                return styles.statusAccepted
            case 'rejected':
                return styles.statusRejected
            default:
                return styles.statusPending
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return '🟡 Pendiente'
            case 'sent':
                return '📤 Enviado'
            case 'accepted':
                return '✅ Aceptado'
            case 'rejected':
                return '❌ Rechazado'
            default:
                return status
        }
    }

    const getTimeAgo = (dateStr: string | null) => {
        if (!dateStr) return ''

        try {
            const sentDate = new Date(dateStr)
            const now = new Date()
            const diffMs = now.getTime() - sentDate.getTime()
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
            const diffMinutes = Math.floor(diffMs / (1000 * 60))

            if (diffDays > 0) {
                return `Enviado hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
            } else if (diffHours > 0) {
                return `Enviado hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
            } else if (diffMinutes > 0) {
                return `Enviado hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`
            } else {
                return 'Enviado hace unos segundos'
            }
        } catch {
            return ''
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true)

        try {
            const { error } = await updateExternalBudget(budget.id, {
                status: newStatus as any
            })

            if (error) throw error

            toast.success(`Estado actualizado a: ${getStatusLabel(newStatus)}`)

            // Refresh the list if callback provided
            if (onRefresh) {
                onRefresh()
            }
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Error al actualizar el estado')
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className={styles.budgetCard}>
            <div className={styles.cardHeader}>
                <div className={styles.clientInfo}>
                    <h3>👤 {budget.client_name}</h3>
                    <div className={styles.clientEmail}>
                        📧 {budget.client_email}
                    </div>
                    {budget.client_phone && (
                        <div className={styles.clientPhone}>
                            📞 {budget.client_phone}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select
                            className={`${styles.statusSelect} ${getStatusBadgeClass(budget.status)}`}
                            value={budget.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={isUpdating}
                        >
                            <option value="pending">🟡 Pendiente</option>
                            <option value="sent">📤 Enviado</option>
                            <option value="accepted">✅ Aceptado</option>
                            <option value="rejected">❌ Rechazado</option>
                        </select>
                        {/* ✅ Badge de relance */}
                        {budget.relance_count > 0 && (
                            <span className={styles.relanceBadge} title={`Relanzado ${budget.relance_count} ${budget.relance_count === 1 ? 'vez' : 'veces'}`}>
                                🔄 {budget.relance_count}x
                            </span>
                        )}
                    </div>
                    {budget.last_sent_at && (
                        <div className={styles.sentTimeAgo}>
                            🕐 {getTimeAgo(budget.last_sent_at)}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.eventDetails}>
                {budget.event_date && (
                    <div className={styles.eventDetail}>
                        <span>📅</span>
                        <span><strong>Fecha:</strong> {formatDate(budget.event_date)}</span>
                    </div>
                )}
                {budget.event_type && (
                    <div className={styles.eventDetail}>
                        <span>🎉</span>
                        <span><strong>Tipo:</strong> {budget.event_type}</span>
                    </div>
                )}
                {budget.event_address && (
                    <div className={styles.eventDetail}>
                        <span>📍</span>
                        <span><strong>Lugar:</strong> {budget.event_address}</span>
                    </div>
                )}
                {budget.guest_count && (
                    <div className={styles.eventDetail}>
                        <span>👥</span>
                        <span><strong>Personas:</strong> {budget.guest_count}</span>
                    </div>
                )}
                {budget.categoria && (
                    <div className={styles.eventDetail}>
                        <span>🏷️</span>
                        <span><strong>Categoría:</strong> {budget.categoria}</span>
                    </div>
                )}
            </div>

            {budget.admin_comments && (
                <div className={styles.eventDetail} style={{ marginBottom: '1rem', fontSize: '0.8125rem', fontStyle: 'italic', color: '#6b7280' }}>
                    💬 {budget.admin_comments}
                </div>
            )}

            <div className={styles.cardActions}>
                {onViewDetails && (
                    <button
                        className={styles.actionButton}
                        onClick={() => onViewDetails(budget)}
                    >
                        👁️ Ver Detalles
                    </button>
                )}
                <button
                    className={`${styles.actionButton} ${styles.emailButton}`}
                    onClick={() => onResend(budget.id)}
                >
                    <Mail size={16} />
                    Relanzar Devis
                </button>
            </div>
        </div>
    )
}
