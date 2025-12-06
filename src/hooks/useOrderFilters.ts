import { useState, useMemo } from 'react'
import { CateringOrder, FilterOptions } from '@/types'

export const useOrderFilters = (orders: CateringOrder[]) => {
    const [filters, setFilters] = useState<FilterOptions>({
        searchTerm: '',
        status: 'all',
        dateFrom: '',
        dateTo: ''
    })

    // Filtrar pedidos basado en los filtros aplicados
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Filtro de búsqueda
            if (filters.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase()
                const matchesSearch =
                    order.contact.name.toLowerCase().includes(searchTerm) ||
                    order.contact.email.toLowerCase().includes(searchTerm)
                if (!matchesSearch) return false
            }

            // Filtro de estado
            if (filters.status !== 'all' && order.status !== filters.status) {
                return false
            }

            // Filtro de fecha de inicio
            if (filters.dateFrom) {
                const orderDate = new Date(order.contact.eventDate)
                const startDate = new Date(filters.dateFrom)
                if (orderDate < startDate) return false
            }

            // Filtro de fecha de fin
            if (filters.dateTo) {
                const orderDate = new Date(order.contact.eventDate)
                const endDate = new Date(filters.dateTo)
                if (orderDate > endDate) return false
            }

            return true
        })
    }, [orders, filters])

    return {
        filters,
        setFilters,
        filteredOrders
    }
}
