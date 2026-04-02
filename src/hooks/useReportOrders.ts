import { useQuery } from '@tanstack/react-query'
import { fetchAllOrdersForReports } from '@/services/ordersService'

export const useReportOrders = (dateFrom?: string, dateTo?: string) => {
    const { data: orders = [], isLoading: loading, error } = useQuery({
        queryKey: ['reportOrders', dateFrom, dateTo],
        queryFn: () => fetchAllOrdersForReports(dateFrom, dateTo),
        staleTime: 1000 * 60 * 5,
    })

    return { orders, loading, error }
}
