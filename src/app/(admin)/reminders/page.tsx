'use client'

import EventReminders from '@/components/EventReminders/EventReminders'
import { useApprovedOrders } from '@/hooks/useApprovedOrders'

export default function RemindersPage() {
    const { orders } = useApprovedOrders()

    return (
        <EventReminders orders={orders} />
    )
}
