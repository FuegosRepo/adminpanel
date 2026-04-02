'use client'

import dynamic from 'next/dynamic'
import { useApprovedOrders } from '@/hooks/useApprovedOrders'
import { useProducts } from '@/hooks/useProducts'

const EventCalculator = dynamic(
  () => import('@/components/EventCalculator/EventCalculator'),
  { loading: () => <div className="p-8 text-center text-muted-foreground">Cargando calculadora...</div> }
)

export default function CalculatorPage() {
    const { orders } = useApprovedOrders()
    const { products, loading: productsLoading } = useProducts()

    return (
        <EventCalculator
            products={products}
            orders={orders}
            isLoading={productsLoading}
        />
    )
}
