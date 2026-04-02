'use client'

import PaymentTracker from '@/components/PaymentTracker/PaymentTracker'
import { useApprovedOrders } from '@/hooks/useApprovedOrders'
import { useOrders } from '@/hooks/useOrders'

export default function PaymentsPage() {
    const { orders } = useApprovedOrders()
    const { handleUpdatePayment } = useOrders()

    return (
        <PaymentTracker orders={orders} onUpdatePayment={handleUpdatePayment} />
    )
}
