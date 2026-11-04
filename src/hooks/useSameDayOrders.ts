import { useQuery } from '@tanstack/react-query'
import { fetchOrdersByEventDate } from '@/services/ordersService'

/**
 * Pedidos ya confirmados/enviados para la misma fecha que `eventDate`,
 * sin contar `excludeOrderId`. Ver OrderDetails/SameDayOrdersAlert.tsx.
 */
export const useSameDayOrders = (eventDate: string | undefined, excludeOrderId?: string) => {
    const { data: orders = [], isLoading: loading } = useQuery({
        queryKey: ['sameDayOrders', eventDate, excludeOrderId],
        queryFn: () => fetchOrdersByEventDate(eventDate!, excludeOrderId),
        enabled: !!eventDate,
        staleTime: 1000 * 60 * 2,
    })

    return { orders, loading }
}
