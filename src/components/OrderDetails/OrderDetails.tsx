import React from 'react'
import { CateringOrder } from '@/types'
import { Calendar, Users, MapPin, Clock, Mail, Phone, User, CreditCard } from 'lucide-react'
import { ProductListResolver } from '../admin/ProductListResolver'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface OrderDetailsProps {
    isOpen: boolean
    order: CateringOrder
    onClose: () => void
}

export default function OrderDetails({ isOpen, order, onClose }: OrderDetailsProps) {
    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return 'No especificado'
        try {
            return new Date(dateStr).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        } catch (error) {
            return 'Fecha inválida'
        }
    }

    const formatEventType = (type: string) => {
        const types: { [key: string]: string } = {
            wedding: 'Boda',
            birthday: 'Cumpleaños',
            corporate: 'Evento Corporativo',
            other: 'Otro'
        }
        return types[type] || type
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col gap-0 border-none shadow-2xl">
                {/* Header Section (sticky) */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shrink-0">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            Detalles del Pedido
                        </DialogTitle>
                        <DialogDescription className="text-slate-300 mt-1">
                            Información completa del evento y selección de menú para {order.contact.name}.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <ScrollArea className="flex-1 p-6 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">

                        {/* Column 1: Info (Client & Event) */}
                        <div className="space-y-6">
                            {/* Client Info Card */}
                            <Card className="shadow-sm border-slate-200/60 overflow-hidden">
                                <CardHeader className="bg-slate-100/50 pb-3 border-b border-slate-100">
                                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                        <User className="h-5 w-5 text-fuegos-orange" />
                                        Información del Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                            <User className="h-4 w-4 text-fuegos-orange" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{order.contact.name}</p>
                                            <p className="text-xs text-slate-500">Nombre completo</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                            <Mail className="h-4 w-4 text-fuegos-orange" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{order.contact.email}</p>
                                            <p className="text-xs text-slate-500">Correo electrónico</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                            <Phone className="h-4 w-4 text-fuegos-orange" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{order.contact.phone || 'No proporcionado'}</p>
                                            <p className="text-xs text-slate-500">Teléfono</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Event Info Card */}
                            <Card className="shadow-sm border-slate-200/60 overflow-hidden">
                                <CardHeader className="bg-slate-100/50 pb-3 border-b border-slate-100">
                                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                        <Calendar className="h-5 w-5 text-fuegos-orange" />
                                        Información del Evento
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 grid grid-cols-2 gap-y-4 gap-x-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                            <Calendar className="h-3 w-3" /> Fecha
                                        </span>
                                        <span className="font-medium text-sm text-slate-900">{formatDate(order.contact.eventDate)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                            <CreditCard className="h-3 w-3" /> Tipo
                                        </span>
                                        <Badge variant="secondary" className="w-fit text-xs font-normal">
                                            {formatEventType(order.contact.eventType)}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                            <Users className="h-3 w-3" /> Invitados
                                        </span>
                                        <span className="font-medium text-sm text-slate-900">{order.contact.guestCount} pax</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                            <Clock className="h-3 w-3" /> Momento
                                        </span>
                                        <Badge variant="outline" className="w-fit text-xs font-normal border-slate-300">
                                            {order.menu.type === 'dejeuner' ? 'Almuerzo' : 'Cena'}
                                        </Badge>
                                    </div>
                                    <div className="col-span-2 pt-1">
                                        <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                                            <MapPin className="h-3 w-3" /> Lugar
                                        </span>
                                        <p className="text-sm font-medium text-slate-900 bg-white border border-slate-100 rounded-md p-2">
                                            {order.contact.address || 'No especificado'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Notes */}
                            {order.extras?.specialRequest && (
                                <Card className="shadow-sm border-amber-200 overflow-hidden bg-amber-50/30">
                                    <CardHeader className="bg-amber-100/50 pb-2 border-b border-amber-100/50">
                                        <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
                                            Notas del Cliente (Petición Especial)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-3">
                                        <p className="text-sm text-amber-900 italic">"{order.extras.specialRequest}"</p>
                                    </CardContent>
                                </Card>
                            )}

                            {order.notes && (
                                <Card className="shadow-sm border-slate-200/60 overflow-hidden">
                                    <CardHeader className="bg-slate-100/50 pb-2 border-b border-slate-100">
                                        <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
                                            Información Adicional (Interna)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-3">
                                        <p className="text-sm text-slate-800">{order.notes}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Column 2: Menu Selection */}
                        <div className="h-full">
                            <Card className="shadow-sm border-slate-200/60 h-full flex flex-col">
                                <CardHeader className="bg-slate-100/50 pb-3 border-b border-slate-100 shrink-0">
                                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                        🍽️ Selección de Menú
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 flex-1 space-y-6">
                                    {(!order.entrees?.length && !order.viandes?.length && !order.dessert?.length) ? (
                                        <div className="text-center py-10 text-slate-500 italic">
                                            No hay selección de menú registrada en este pedido.
                                        </div>
                                    ) : (
                                        <>
                                            {order.entrees && order.entrees.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Entradas</h4>
                                                    <div className="pl-2 border-l-2 border-slate-200">
                                                        <ProductListResolver ids={order.entrees} category="entrees" />
                                                    </div>
                                                </div>
                                            )}

                                            {order.viandes && order.viandes.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 mt-4">Carnes principales</h4>
                                                    <div className="pl-2 border-l-2 border-slate-200">
                                                        <ProductListResolver ids={order.viandes} category="viandes" />
                                                    </div>
                                                </div>
                                            )}

                                            {order.dessert && order.dessert.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 mt-4">Postres</h4>
                                                    <div className="pl-2 border-l-2 border-slate-200">
                                                        <ProductListResolver ids={order.dessert} category="desserts" />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer Section */}
                <div className="bg-slate-100/80 p-4 border-t border-slate-200 flex flex-row items-center justify-between shrink-0 text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                        <span>Recibido: <strong className="text-slate-700">{formatDate(order.createdAt)}</strong></span>
                        <Separator orientation="vertical" className="h-4 bg-slate-300" />
                        <span>Modificado: <strong className="text-slate-700">{formatDate(order.updatedAt)}</strong></span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
