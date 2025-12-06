import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { CateringOrder, PaymentInfo } from '@/types'

export const useOrders = () => {
    const [orders, setOrders] = useState<CateringOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('catering_orders')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) {
                    throw error
                }

                const mapped: CateringOrder[] = (data || []).map((row: any) => {
                    return {
                        id: row.id,
                        contact: {
                            email: row.email,
                            name: row.name,
                            phone: row.phone || '',
                            eventDate: row.event_date || '',
                            eventType: row.event_type || '',
                            eventTime: row.event_time || undefined,
                            address: row.address || '',
                            guestCount: row.guest_count || 0
                        },
                        menu: { type: row.menu_type },
                        entrees: row.entrees || [],
                        viandes: row.viandes || [],
                        dessert: row.dessert || null,
                        extras: row.extras || { wines: false, equipment: [], decoration: false, specialRequest: '' },
                        status: row.status || 'pending',
                        createdAt: row.created_at,
                        updatedAt: row.updated_at,
                        estimatedPrice: row.estimated_price || undefined,
                        notes: row.notes || undefined,
                        payment: row.payment // Preserving payment info if present on row
                    }
                })

                setOrders(mapped)
            } catch (err: any) {
                console.error('Error cargando pedidos:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadOrders()
    }, [])

    const handleStatusChange = async (orderId: string, newStatus: CateringOrder['status']) => {
        try {
            console.log('🔄 Cambiando estado del pedido:', { orderId, newStatus })

            const { data, error } = await supabase
                .from('catering_orders')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()

            if (error) throw error

            console.log('✅ Estado actualizado en BD:', data)

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
                        : order
                )
            )
        } catch (error: any) {
            console.error('❌ Error al actualizar estado del pedido:', error)
            alert(`Error al actualizar el estado del pedido: ${error.message || 'Error desconocido'}`)
        }
    }

    const handleUpdatePayment = (orderId: string, updatedPayment: PaymentInfo) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId
                    ? { ...order, payment: updatedPayment, updatedAt: new Date().toISOString() }
                    : order
            )
        )
    }

    const handleUpdateOrder = (orderId: string, updates: Partial<CateringOrder>) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId
                    ? { ...order, ...updates, updatedAt: new Date().toISOString() }
                    : order
            )
        )
    }

    return {
        orders,
        loading,
        error,
        handleStatusChange,
        handleUpdatePayment,
        handleUpdateOrder
    }
}
