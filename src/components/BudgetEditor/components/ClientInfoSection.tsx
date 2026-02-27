import React, { useState } from 'react'
import { BudgetData } from '../types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronRight, UserCircle } from 'lucide-react'

interface ClientInfoSectionProps {
    data: BudgetData['clientInfo']
    onUpdate: (path: string, value: any) => void
}

export function ClientInfoSection({ data, onUpdate }: ClientInfoSectionProps) {
    const [expanded, setExpanded] = useState(true)

    return (
        <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-semibold text-primary m-0">
                            Información del Cliente
                        </CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setExpanded(!expanded)}
                        className="h-8 w-8 text-muted-foreground hover:bg-muted"
                    >
                        {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </Button>
                </div>
            </CardHeader>
            {expanded && (
                <CardContent className="pt-0 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Nombre</Label>
                            <Input
                                value={data.name}
                                onChange={(e) => onUpdate('clientInfo.name', e.target.value)}
                                placeholder="Nombre del cliente"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => onUpdate('clientInfo.email', e.target.value)}
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input
                                type="text"
                                value={data.phone}
                                onChange={(e) => onUpdate('clientInfo.phone', e.target.value)}
                                placeholder="+33 6 12 34 56 78"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Fecha Evento</Label>
                            <Input
                                type="date"
                                value={data.eventDate ? data.eventDate.split('T')[0] : ''}
                                onChange={(e) => onUpdate('clientInfo.eventDate', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo Evento</Label>
                            <select
                                value={data.eventType ? data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1).toLowerCase() : ''}
                                onChange={(e) => onUpdate('clientInfo.eventType', e.target.value)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
                            >
                                <option value="">Sélectionner...</option>
                                <option value="Mariage">Mariage</option>
                                <option value="Anniversaire">Anniversaire</option>
                                <option value="Corporatif">Corporatif</option>
                                <option value="Baptême">Baptême</option>
                                <option value="Fête Privée">Fête Privée</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Invitados</Label>
                            <Input
                                type="number"
                                min="0"
                                value={data.guestCount}
                                onChange={(e) => onUpdate('clientInfo.guestCount', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <Label>Dirección</Label>
                            <Input
                                type="text"
                                value={data.address}
                                onChange={(e) => onUpdate('clientInfo.address', e.target.value)}
                                placeholder="Lugar del evento"
                            />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <Label>Tipo Menú</Label>
                            <select
                                value={data.menuType}
                                onChange={(e) => onUpdate('clientInfo.menuType', e.target.value)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
                            >
                                <option value="dejeuner">Déjeuner</option>
                                <option value="diner">Dîner</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
