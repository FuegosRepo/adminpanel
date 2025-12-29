import { useState, useEffect, useCallback } from 'react'
import { ExternalBudget, ExternalBudgetFilters } from '@/types'
import { getExternalBudgets, getExternalBudgetsStats } from '@/services/externalBudgetsService'

export function useExternalBudgets(
    initialFilters: ExternalBudgetFilters = {},
    initialPage: number = 1,
    pageSize: number = 20
) {
    const [budgets, setBudgets] = useState<ExternalBudget[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(initialPage)
    const [filters, setFilters] = useState<ExternalBudgetFilters>(initialFilters)
    const [stats, setStats] = useState({
        total: 0,
        byStatus: {} as Record<string, number>,
        byCategoria: {} as Record<string, number>
    })

    const fetchBudgets = useCallback(async () => {
        setLoading(true)
        setError(null)

        const result = await getExternalBudgets(filters, page, pageSize)

        if (result.error) {
            setError(result.error)
            setBudgets([])
            setTotalCount(0)
        } else {
            setBudgets(result.data)
            setTotalCount(result.totalCount)
        }

        setLoading(false)
    }, [filters, page, pageSize])

    const fetchStats = useCallback(async () => {
        const statsData = await getExternalBudgetsStats()
        setStats(statsData)
    }, [])

    useEffect(() => {
        fetchBudgets()
    }, [fetchBudgets])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    const refresh = useCallback(() => {
        fetchBudgets()
        fetchStats()
    }, [fetchBudgets, fetchStats])

    return {
        budgets,
        loading,
        error,
        totalCount,
        page,
        setPage,
        filters,
        setFilters,
        stats,
        refresh,
        pageSize
    }
}
