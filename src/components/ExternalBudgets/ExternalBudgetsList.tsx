'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useExternalBudgets } from '@/hooks/useExternalBudgets'
import { ExternalBudgetFilters } from '@/types'
import ExternalBudgetCard from './ExternalBudgetCard'
import styles from './ExternalBudgets.module.css'

export default function ExternalBudgetsList() {
    const {
        budgets,
        loading,
        totalCount,
        page,
        setPage,
        filters,
        setFilters,
        stats,
        refresh,
        pageSize
    } = useExternalBudgets()

    const [localFilters, setLocalFilters] = useState<ExternalBudgetFilters>(filters)
    const [searchInput, setSearchInput] = useState(filters.searchTerm || '')

    // Debounce search term - apply filter 500ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== localFilters.searchTerm) {
                setLocalFilters(prev => ({ ...prev, searchTerm: searchInput }))
                setFilters(prevFilters => ({ ...prevFilters, searchTerm: searchInput }))
                setPage(1)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchInput, setFilters, setPage, localFilters.searchTerm]) // Added localFilters.searchTerm to dependencies for comparison

    const handleFilterChange = (key: keyof ExternalBudgetFilters, value: any) => {
        const newFilters = { ...localFilters, [key]: value }
        setLocalFilters(newFilters)
        setFilters(newFilters)
        setPage(1)
    }

    const handleResend = async (budgetId: string) => {
        try {
            // TODO: Implement resend email functionality
            toast.info('Funcionalidad de reenvío en desarrollo')
            console.log('Resending budget:', budgetId)
        } catch (error) {
            toast.error('Error al reenviar el devis')
            console.error(error)
        }
    }

    if (loading && budgets.length === 0) {
        return (
            <div className={styles.loading}>
                <div>⏳ Cargando devis externos...</div>
            </div>
        )
    }

    return (
        <div className={styles.externalBudgetsContainer}>
            {/* Filters Section */}
            <div className={styles.filtersSection}>
                <div className={styles.filtersGrid}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>🔍 Buscar</label>
                        <input
                            type="text"
                            className={styles.filterInput}
                            placeholder="Nombre, email o teléfono..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        {loading && searchInput && (
                            <div className={styles.searchingIndicator}>🔄 Buscando...</div>
                        )}
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>📊 Estado</label>
                        <select
                            className={styles.filterSelect}
                            value={localFilters.status || 'all'}
                            onChange={(e) => handleFilterChange('status', e.target.value as any)}
                        >
                            <option value="all">Todos</option>
                            <option value="pending">🟡 Pendiente</option>
                            <option value="sent">📤 Enviado</option>
                            <option value="accepted">✅ Aceptado</option>
                            <option value="rejected">❌ Rechazado</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>🏷️ Categoría</label>
                        <select
                            className={styles.filterSelect}
                            value={localFilters.categoria || 'all'}
                            onChange={(e) => handleFilterChange('categoria', e.target.value as any)}
                        >
                            <option value="all">Todas</option>
                            <option value="Particular">Particular</option>
                            <option value="Empresa">Empresa</option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>📅 Desde</label>
                        <input
                            type="date"
                            className={styles.filterInput}
                            value={localFilters.dateFrom || ''}
                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>📅 Hasta</label>
                        <input
                            type="date"
                            className={styles.filterInput}
                            value={localFilters.dateTo || ''}
                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats Row */}
                <div className={styles.statsRow}>
                    <div className={`${styles.statBadge} ${styles.statPending}`}>
                        🟡 Pendientes: {stats.byStatus['pending'] || 0}
                    </div>
                    <div className={`${styles.statBadge} ${styles.statSent}`}>
                        📤 Enviados: {stats.byStatus['sent'] || 0}
                    </div>
                    <div className={`${styles.statBadge} ${styles.statAccepted}`}>
                        ✅ Aceptados: {stats.byStatus['accepted'] || 0}
                    </div>
                    <div className={`${styles.statBadge} ${styles.statRejected}`}>
                        ❌ Rechazados: {stats.byStatus['rejected'] || 0}
                    </div>
                    <div className={styles.statBadge} style={{ background: '#f3f4f6', color: '#374151' }}>
                        📊 Total: {stats.total}
                    </div>
                </div>
            </div>

            {/* Results */}
            {budgets.length === 0 ? (
                <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>🔍</div>
                    <h3 className={styles.noResultsTitle}>No se encontraron devis externos</h3>
                    <p className={styles.noResultsText}>
                        Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
                    </p>
                </div>
            ) : (
                <>
                    <div className={styles.budgetsGrid}>
                        {budgets.map(budget => (
                            <ExternalBudgetCard
                                key={budget.id}
                                budget={budget}
                                onResend={handleResend}
                                onRefresh={refresh}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalCount > pageSize && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageButton}
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                ← Anterior
                            </button>
                            <span className={styles.pageInfo}>
                                Página {page} de {Math.ceil(totalCount / pageSize)} ({totalCount} registros)
                            </span>
                            <button
                                className={styles.pageButton}
                                disabled={page >= Math.ceil(totalCount / pageSize)}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
