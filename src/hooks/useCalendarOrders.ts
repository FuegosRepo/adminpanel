import { useQuery } from '@tanstack/react-query'
import { fetchOrdersWithEvents } from '@/services/ordersService'

export const useCalendarOrders = () => {
    const { data: orders = [], isLoading: loading, error } = useQuery({
        queryKey: ['calendarOrders'],
        queryFn: fetchOrdersWithEvents,
        staleTime: 1000 * 60 * 2,
    })

    return { orders, loading, error }
}
