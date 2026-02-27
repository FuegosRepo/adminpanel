import React, { useState } from 'react'
import { Trash2, Plus, ChevronDown, ChevronRight, Package, Search } from 'lucide-react'
import { BudgetData } from '../types'
import { BudgetMenuItem } from '@/lib/types/budget'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface MaterialSectionProps {
    data: BudgetData['material']
    deliveryReprise?: BudgetData['deliveryReprise']
    onUpdate: (path: string, value: any) => void
    onDelete: () => void
    onOpenSelector: () => void
}

export function MaterialSection({ data, deliveryReprise, onUpdate, onDelete, onOpenSelector }: MaterialSectionProps) {
    const [expanded, setExpanded] = useState(false)
    const [newMatName, setNewMatName] = useState('')
    const [newMatQty, setNewMatQty] = useState<number>(1)
    const [newMatPrice, setNewMatPrice] = useState<number>(0)

    if (!data) return null

    const handleAddManual = () => {
        if (!newMatName) return

        const newItems = [...data.items]
        newItems.push({
            name: newMatName,
            quantity: newMatQty,
            pricePerUnit: newMatPrice,
            total: newMatQty * newMatPrice
        })

        onUpdate('material.items', newItems)
        setNewMatName('')
        setNewMatQty(1)
        setNewMatPrice(0)
    }

    const handleDeleteItem = (index: number) => {
        const newItems = [...data.items]
        newItems.splice(index, 1)
        onUpdate('material.items', newItems)
    }

    const handleItemChange = (index: number, field: keyof BudgetMenuItem, value: any) => {
        const newItems = [...(data.items || [])]

        // ✅ Type assertion to allow isManualPrice
        const item = newItems[index] as BudgetMenuItem & { isManualPrice?: boolean }

        if (field === 'pricePerUnit') {
            item.isManualPrice = true
        }

        item[field] = value as never

        if (field === 'quantity' || field === 'pricePerUnit') {
            item.total = item.quantity * item.pricePerUnit
        }

        onUpdate('material', { ...data, items: newItems })
    }

    return (
        <Card className="border-l-4 border-l-primary shadow-sm mt-6">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-semibold text-primary m-0">
                            Material
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDelete}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            title="Eliminar sección de material"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpanded(!expanded)}
                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                        >
                            {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            {expanded && (
                <CardContent className="pt-0 pb-6 space-y-6">
                    {/* Items List */}
                    <div className="space-y-4">
                        {data.items.length > 0 ? (
                            <div className="rounded-md border border-border bg-card">
                                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 p-3 border-b bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <div>Nombre</div>
                                    <div>Cant.</div>
                                    <div>Precio (€)</div>
                                    <div>Total</div>
                                    <div className="text-center">Acción</div>
                                </div>
                                <div className="divide-y">
                                    {data.items.map((item, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 p-4 md:p-3 items-center hover:bg-muted/20 transition-colors">
                                            <div className="space-y-1">
                                                <Label className="md:hidden text-xs text-muted-foreground">Nombre</Label>
                                                <Input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                                                    className="h-9"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="md:hidden text-xs text-muted-foreground">Cant.</Label>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                                                    min="0"
                                                    className="h-9"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="md:hidden text-xs text-muted-foreground">Precio (€)</Label>
                                                <Input
                                                    type="number"
                                                    value={item.pricePerUnit}
                                                    onChange={(e) => handleItemChange(idx, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                                                    step="0.01"
                                                    className="h-9"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="md:hidden text-xs text-muted-foreground">Total</Label>
                                                <Input
                                                    type="number"
                                                    value={item.total}
                                                    disabled
                                                    className="bg-muted text-muted-foreground cursor-not-allowed border-dashed h-9"
                                                />
                                            </div>
                                            <div className="flex justify-end md:justify-center pt-2 md:pt-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteItem(idx)}
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                    title="Eliminar item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                                No hay materiales configurados en esta sección.
                            </div>
                        )}
                    </div>

                    {/* Add Item Actions */}
                    <div className="bg-muted/40 p-4 rounded-lg border border-border space-y-4">
                        <Label className="text-sm font-medium">Agregar Item Manual</Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                type="text"
                                placeholder="Nombre del item"
                                value={newMatName}
                                onChange={(e) => setNewMatName(e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                type="number"
                                placeholder="Cant."
                                value={newMatQty}
                                onChange={(e) => setNewMatQty(parseInt(e.target.value) || 0)}
                                className="w-full sm:w-24"
                            />
                            <Input
                                type="number"
                                placeholder="Precio"
                                value={newMatPrice}
                                onChange={(e) => setNewMatPrice(parseFloat(e.target.value) || 0)}
                                className="w-full sm:w-28"
                            />
                            <Button
                                onClick={handleAddManual}
                                disabled={!newMatName}
                                className="w-full sm:w-auto shrink-0"
                            >
                                <Plus className="h-4 w-4 mr-2" /> Agregar
                            </Button>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={onOpenSelector}
                                className="w-full sm:w-auto"
                            >
                                <Search className="h-4 w-4 mr-2" /> Seleccionar del Catálogo
                            </Button>
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="bg-muted p-4 rounded-lg space-y-3 max-w-sm ml-auto mt-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Subtotal Material:</span>
                            <strong className="text-foreground">{((data.items.reduce((acc, item) => acc + item.total, 0))).toFixed(2)} €</strong>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-muted-foreground">Seguro (%):</span>
                                <Input
                                    type="number"
                                    value={data.insurancePct}
                                    onChange={(e) => onUpdate('material.insurancePct', parseFloat(e.target.value) || 0)}
                                    step="0.1"
                                    className="w-16 h-8 py-1 px-2 text-xs"
                                />
                            </div>
                            <strong className="text-foreground">{data.insuranceAmount?.toFixed(2)} €</strong>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-muted-foreground">Livraison et reprise:</span>
                                <Input
                                    type="number"
                                    value={deliveryReprise?.deliveryCost || 0}
                                    onChange={(e) => onUpdate('deliveryReprise.deliveryCost', parseFloat(e.target.value) || 0)}
                                    step="0.01"
                                    className="w-20 h-8 py-1 px-2 text-xs"
                                />
                            </div>
                            <strong className="text-foreground">{(deliveryReprise?.deliveryCost || 0).toFixed(2)} €</strong>
                        </div>

                        <div className="border-t border-border pt-2 mt-2" />

                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Total HT:</span>
                            <strong className="text-foreground">{data.totalHT.toFixed(2)} €</strong>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">TVA ({data.tvaPct}%):</span>
                            <strong className="text-foreground">{data.tva.toFixed(2)} €</strong>
                        </div>
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-border bg-amber-100 dark:bg-amber-900/30 p-2 rounded text-base">
                            <span className="font-semibold text-amber-900 dark:text-amber-400">Total TTC:</span>
                            <strong className="text-amber-900 dark:text-amber-400">{data.totalTTC.toFixed(2)} €</strong>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
