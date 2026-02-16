import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { CateringOrder, PaymentInfo } from '@/types'
import { fetchOrders, OrdersFilters } from '@/services/ordersService'
import { useState } from 'react'
import { toast } from 'sonner'

export const useOrders = (initialFilters?: OrdersFilters) => {
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [pageSize] = useState(10)
    const [filters, setFilters] = useState<OrdersFilters>(initialFilters || {})

    const {
        data: ordersData,
        isLoading: loading,
        error
    } = useQuery({
        queryKey: ['orders', page, pageSize, filters],
        queryFn: () => fetchOrders({ page, pageSize, filters }),
        placeholderData: (previousData) => previousData
    })

    // Reset page to 1 whenever filters change
    // Note: This logic might cause a double render or need a better place, 
    // but typically we want to go back to page 1 if we search/filter.
    // However, since `page` is in dependency array of useQuery, we need to be careful.
    // A better pattern is to handle setPage(1) in the UI when filters change.


    const orders = ordersData?.data || []
    const totalCount = ordersData?.count || 0

    // Mutation for status update
    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, newStatus }: { orderId: string, newStatus: CateringOrder['status'] }) => {
            const { data, error } = await supabase
                .from('catering_orders')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', orderId)
                .select()
                .single()

            if (error) throw error
            if (newStatus === 'rejected') {
                const { error: budgetError } = await supabase
                    .from('budgets')
                    .update({ status: 'rejected', updated_at: new Date().toISOString() })
                    .eq('order_id', orderId)

                if (budgetError) console.error('Error syncing budget status:', budgetError)
            } else if (newStatus === 'pending') {
                const { error: budgetError } = await supabase
                    .from('budgets')
                    .update({ status: 'pending_review', updated_at: new Date().toISOString() })
                    .eq('order_id', orderId)

                if (budgetError) console.error('Error syncing budget status:', budgetError)
            }

            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['budgets'] }) // ✅ Ensure budgets are refreshed
            toast.success('Estado actualizado correctamente')
        },
        onError: (err: any) => {
            console.error('❌ Error al actualizar estado:', err)
            toast.error(`Error al actualizar: ${err.message}`)
        }
    })

    // ✅ Mutation for adding internal note to thread
    const addInternalNoteMutation = useMutation({
        mutationFn: async ({ orderId, note }: { orderId: string, note: string }) => {
            if (!note.trim()) throw new Error('Nota vacía')

            // First, get existing notes
            const { data: existing, error: fetchError } = await supabase
                .from('catering_orders')
                .select('internal_note')
                .eq('id', orderId)
                .single()

            if (fetchError) throw fetchError

            // Parse existing notes array
            let notes: { text: string; createdAt: string }[] = []
            if (existing?.internal_note) {
                const data = existing.internal_note
                if (Array.isArray(data)) {
                    notes = data
                } else if (typeof data === 'object') {
                    // Old format: single object -> wrap in array
                    notes = [{
                        text: data.text || '',
                        createdAt: data.createdAt || data.updatedAt || new Date().toISOString()
                    }]
                }
            }

            // Add new note at the beginning (newest first)
            const newNote = {
                text: note.trim(),
                createdAt: new Date().toISOString()
            }
            notes = [newNote, ...notes]

            // Save updated array
            const { data, error } = await supabase
                .from('catering_orders')
                .update({
                    internal_note: notes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            toast.success('Nota agregada')
        },
        onError: (err: any) => {
            console.error('❌ Error al agregar nota:', err)
            toast.error(`Error: ${err.message}`)
        }
    })

    // ✅ Mutation for deleting a specific note from the thread
    const deleteInternalNoteMutation = useMutation({
        mutationFn: async ({ orderId, noteIndex }: { orderId: string, noteIndex: number }) => {
            // Get existing notes
            const { data: existing, error: fetchError } = await supabase
                .from('catering_orders')
                .select('internal_note')
                .eq('id', orderId)
                .single()

            if (fetchError) throw fetchError

            let notes: { text: string; createdAt: string }[] = []
            if (existing?.internal_note && Array.isArray(existing.internal_note)) {
                notes = [...existing.internal_note]
            }

            // Remove the note at the specified index
            if (noteIndex >= 0 && noteIndex < notes.length) {
                notes.splice(noteIndex, 1)
            }

            // Save updated array (or null if empty)
            const { data, error } = await supabase
                .from('catering_orders')
                .update({
                    internal_note: notes.length > 0 ? notes : null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            toast.success('Nota eliminada')
        },
        onError: (err: any) => {
            console.error('❌ Error al eliminar nota:', err)
            toast.error(`Error: ${err.message}`)
        }
    })

    const handleStatusChange = async (orderId: string, newStatus: CateringOrder['status']) => {
        updateStatusMutation.mutate({ orderId, newStatus })
    }

    const handleUpdatePayment = (orderId: string, updatedPayment: PaymentInfo) => {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
    }

    const handleUpdateOrder = (orderId: string, updates: Partial<CateringOrder>) => {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
    }

    // ✅ Handler for adding new note to thread
    const handleAddInternalNote = async (orderId: string, note: string) => {
        return addInternalNoteMutation.mutateAsync({ orderId, note })
    }

    // ✅ Handler for deleting a note from thread
    const handleDeleteInternalNote = async (orderId: string, noteIndex: number) => {
        return deleteInternalNoteMutation.mutateAsync({ orderId, noteIndex })
    }

    return {
        orders,
        totalCount,
        loading,
        error,
        page,
        setPage,
        pageSize,
        filters,
        setFilters,
        handleStatusChange,
        handleUpdatePayment,
        handleUpdateOrder,
        handleAddInternalNote,  // ✅ Add note to thread
        handleDeleteInternalNote,  // ✅ Delete note from thread
        isAddingNote: addInternalNoteMutation.isPending,
        isDeletingNote: deleteInternalNoteMutation.isPending
    }
}

