'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import FilterBar from '@/components/FilterBar/FilterBar'
import OrderCard from '@/components/OrderCard/OrderCard'
import EmailModal from '@/components/EmailModal/EmailModal'
import OrderDetails from '@/components/OrderDetails/OrderDetails'
import ExternalBudgetsList from '@/components/ExternalBudgets/ExternalBudgetsList'
import { CateringOrder, EmailTemplate, FilterOptions } from '@/types'
import { emailTemplates } from '@/data/mockData'
import { useOrders } from '@/hooks/useOrders'
import { supabase } from '@/lib/supabaseClient'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { Table, TableBody, TableHeader, TableRow, TableHead } from '@/components/ui/table'

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<'orders' | 'external'>('orders')

    const {
        orders,
        handleStatusChange,
        handleUpdateOrder,
        handleAddInternalNote,
        handleDeleteInternalNote,
        isAddingNote,
        isDeletingNote,
        page,
        setPage,
        totalCount,
        pageSize,
        filters,
        setFilters
    } = useOrders()

    useEffect(() => {
        setPage(1)
    }, [filters, setPage])

    const dataToDisplay = orders

    const [emailModal, setEmailModal] = useState<{
        isOpen: boolean
        order?: CateringOrder
        template?: EmailTemplate
    }>({ isOpen: false })
    const [detailsModal, setDetailsModal] = useState<{
        isOpen: boolean
        order?: CateringOrder
    }>({ isOpen: false })

    const handleOpenEmailModal = (order: CateringOrder, template?: EmailTemplate) => {
        setEmailModal({ isOpen: true, order, template })
    }

    const handleCloseEmailModal = () => {
        setEmailModal({ isOpen: false })
    }

    const handleSendEmail = async (orderId: string, subject: string, content: string) => {
        try {
            const promise = fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, customSubject: subject, customContent: content })
            }).then(async res => {
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Error al enviar email')
                return data
            })

            toast.promise(promise, {
                loading: 'Enviando email...',
                success: 'Email enviado correctamente',
                error: (err) => `Error: ${err.message}`
            })

            await promise
            handleCloseEmailModal()
        } catch (error) {
            console.error('Error al enviar email:', error)
        }
    }

    const handleOpenDetails = (order: CateringOrder) => {
        setDetailsModal({ isOpen: true, order })
    }

    const handleCloseDetails = () => {
        setDetailsModal({ isOpen: false })
    }

    const handleDelete = async (orderId: string) => {
        try {
            const { data: relatedBudgets } = await supabase
                .from('budgets')
                .select('id')
                .eq('order_id', orderId)

            const { error: orderError } = await supabase
                .from('catering_orders')
                .delete()
                .eq('id', orderId)

            if (orderError) throw orderError

            if (relatedBudgets && relatedBudgets.length > 0) {
                const budgetIds = relatedBudgets.map(b => b.id)
                const { error: budgetError } = await supabase
                    .from('budgets')
                    .delete()
                    .in('id', budgetIds)
                if (budgetError) {
                    console.warn('⚠️ Failed to delete related budgets:', budgetError)
                } else {
                    console.log(`✅ Deleted ${budgetIds.length} related budget(s)`)
                }
            }
            toast.success('Pedido eliminado correctamente')
            window.location.reload()
        } catch (error) {
            console.error('Error deleting order:', error)
            toast.error('Error al eliminar el pedido')
        }
    }

    const totalPages = Math.ceil(totalCount / pageSize)

    return (
        <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'orders' | 'external')}>
                <div className="bg-card border-b rounded-t-lg">
                    <TabsList className="px-4">
                        <TabsTrigger value="orders" className="gap-2">
                            📦 Pedidos Actuales
                            <Badge variant="secondary" className="ml-1 text-[11px]">{totalCount}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="external" className="gap-2">
                            📁 Devis Externos
                            <Badge variant="secondary" className="ml-1 text-[11px]">462</Badge>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="orders">
                    <FilterBar
                        filters={filters as FilterOptions}
                        onFiltersChange={(f: FilterOptions) => setFilters(f)}
                        resultsCount={totalCount}
                    />

                    {dataToDisplay.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground bg-card rounded-md border">
                            <div className="text-5xl mb-4 opacity-50">🔍</div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron pedidos</h3>
                            <p className="text-base">
                                Intenta ajustar los filtros de búsqueda para encontrar los pedidos que buscas.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Evento</TableHead>
                                        <TableHead className="text-right">Monto</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                        <TableHead className="text-right pr-4">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dataToDisplay.map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            isSelected={false}
                                            onStatusChange={handleStatusChange}
                                            onSendEmail={handleOpenEmailModal}
                                            onViewDetails={handleOpenDetails}
                                            onSelectionChange={() => { }}
                                            onUpdateOrder={handleUpdateOrder}
                                            onDelete={handleDelete}
                                            onAddInternalNote={handleAddInternalNote}
                                            onDeleteInternalNote={handleDeleteInternalNote}
                                            isAddingNote={isAddingNote}
                                            isDeletingNote={isDeletingNote}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalCount > pageSize && (
                        <div className="flex justify-center items-center gap-4 mt-8 pb-4">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Anterior
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Página {page} de {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}

                    {/* Email Modal */}
                    {emailModal.isOpen && emailModal.order && (
                        <EmailModal
                            isOpen={emailModal.isOpen}
                            order={emailModal.order}
                            onClose={handleCloseEmailModal}
                            onSend={handleSendEmail}
                        />
                    )}

                    {/* Details Modal */}
                    {detailsModal.isOpen && detailsModal.order && (
                        <OrderDetails
                            isOpen={detailsModal.isOpen}
                            order={detailsModal.order}
                            onClose={handleCloseDetails}
                        />
                    )}
                </TabsContent>

                <TabsContent value="external">
                    <ExternalBudgetsList />
                </TabsContent>
            </Tabs>
        </div>
    )
}
