import { useQuery } from '@tanstack/react-query'
import { fetchBudgetsForReports } from '@/services/budgetsService'

export const useReportBudgets = () => {
    const { data: budgets = [], isLoading: loading, error } = useQuery({
        queryKey: ['reportBudgets'],
        queryFn: fetchBudgetsForReports,
        staleTime: 1000 * 60 * 5,
    })

    return { budgets, loading, error }
}
