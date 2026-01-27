import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { fetchBudgets, BudgetsFilters } from '@/services/budgetsService'
import { useState } from 'react'

interface UseBudgetsOptions {
    // ✅ Parámetros externos opcionales para persistir paginación desde el padre
    page?: number
    filters?: BudgetsFilters
}

export const useBudgets = (options?: UseBudgetsOptions) => {
    const queryClient = useQueryClient()

    // ✅ Usar valores externos si se pasan, sino fallback a estado interno
    const [internalPage, setInternalPage] = useState(1)
    const [internalFilters, setInternalFilters] = useState<BudgetsFilters>({})

    const page = options?.page ?? internalPage
    const filters = options?.filters ?? internalFilters
    const [pageSize] = useState(10)

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
            console.log('📝 Creating manual budget, first creating order...')

            // 1. Create a minimal order first to link
            const initialOrder = {
                status: 'draft',
                name: 'Nuevo Presupuesto (Manual)',
                email: '',
                event_date: (new Date()).toISOString(),
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString(),
                internal_note: [{
                    text: 'Presupuesto creado manualmente desde panel admin',
                    createdAt: (new Date()).toISOString()
                }]
            }

            const { data: orderData, error: orderError } = await supabase
                .from('catering_orders')
                .insert(initialOrder)
                .select()
                .single()

            if (orderError) {
                console.error('❌ Error creating parent order:', orderError)
                throw orderError
            }

            console.log('✅ Parent order created:', orderData.id)

            // 2. Link budget to new order
            const budgetWithOrder = {
                ...initialData,
                order_id: orderData.id
            }

            const { data, error } = await supabase
                .from('budgets')
                .insert(budgetWithOrder)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] })
            // Also invalidate orders to show the new one immediately
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        }
    })

    return {
        budgets,
        totalCount,
        page,
        pageSize,
        filters,
        loading,
        error,
        deleteBudget: deleteBudgetMutation.mutateAsync,
        createManualBudget: createManualBudgetMutation.mutateAsync
    }
}
