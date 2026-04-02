import { useQuery } from '@tanstack/react-query'
import { fetchApprovedOrders } from '@/services/ordersService'

export const useApprovedOrders = () => {
    const { data: orders = [], isLoading: loading, error } = useQuery({
        queryKey: ['approvedOrders'],
        queryFn: fetchApprovedOrders,
        staleTime: 1000 * 60 * 2,
    })

    return { orders, loading, error }
}
