import { useQuery } from '@tanstack/react-query'
import { fetchSameDayCounts } from '@/services/ordersService'

/**
 * Cuántos pedidos confirmados/enviados hay por fecha, para toda la lista
 * visible de una vez (ver OrderCard "indicador de capacidad del día").
 */
export const useSameDayCounts = (eventDates: string[]) => {
    const key = [...new Set(eventDates.filter(Boolean))].sort().join(',')

    const { data: counts = {} } = useQuery({
        queryKey: ['sameDayCounts', key],
        queryFn: () => fetchSameDayCounts(eventDates),
        enabled: eventDates.length > 0,
        staleTime: 1000 * 60 * 2,
    })

    return counts
}
