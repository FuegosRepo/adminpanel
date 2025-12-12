import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export const useBudgets = () => {
    const queryClient = useQueryClient()

    const {
        data: budgets = [],
        isLoading: loading,
        error
    } = useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('budgets')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data || []
        },
        staleTime: 1000 * 60 * 5 // 5 minutes cache
    })

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
        loading,
        error,
        deleteBudget: deleteBudgetMutation.mutateAsync,
        createManualBudget: createManualBudgetMutation.mutateAsync
    }
}
