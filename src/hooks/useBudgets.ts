import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { fetchBudgets, BudgetsFilters } from '@/services/budgetsService'
import { useState } from 'react'

export const useBudgets = (initialFilters?: BudgetsFilters) => {
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [pageSize] = useState(10)
    const [filters, setFilters] = useState<BudgetsFilters>(initialFilters || {})

    const {
        data: budgetsData,
        isLoading: loading,
        error
    } = useQuery({
        queryKey: ['budgets', page, pageSize, filters],
        queryFn: () => fetchBudgets({ page, pageSize, filters }),
        placeholderData: (previousData) => previousData
    })

    const budgets = budgetsData?.data || []
    const totalCount = budgetsData?.count || 0

    const deleteBudgetMutation = useMutation({
        mutationFn: async (budgetId: string) => {
            console.log('Intentando eliminar presupuesto:', budgetId)
            const { error, data } = await supabase
                .from('budgets')
                .delete()
                .eq('id', budgetId)
                .select()

            if (error) {
                console.error('Error supabase delete:', error)
                throw error
            }
            console.log('Presupuesto eliminado:', data)
        },
        onSuccess: () => {
            console.log('Invalidating queries after delete')
            queryClient.invalidateQueries({ queryKey: ['budgets'] })
        },
    })

    const createManualBudgetMutation = useMutation({
        mutationFn: async (initialData: any) => {
            const { data, error } = await supabase
                .from('budgets')
                .insert(initialData)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] })
        }
    })

    return {
        budgets,
        totalCount,
        page,
        setPage,
        pageSize,
        filters,
        setFilters,
        loading,
        error,
        deleteBudget: deleteBudgetMutation.mutateAsync,
        createManualBudget: createManualBudgetMutation.mutateAsync
    }
}
