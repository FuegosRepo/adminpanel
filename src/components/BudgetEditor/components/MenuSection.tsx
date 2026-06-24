import React, { useState } from 'react'
import { BudgetData } from '../types'
import { useProducts } from '@/hooks/useProducts'
import { formatItemName } from '../utils/formatItemName'
import { simplifyString } from '@/utils/stringUtils'
import { getProductDisplayName } from '@/utils/productDisplay'
import { MenuSelectorModal } from './MenuSelectorModal'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronRight, UtensilsCrossed, Trash2, Plus } from 'lucide-react'

interface MenuSectionProps {
    data: BudgetData['menu']
    onUpdate: (path: string, value: any) => void
}

export function MenuSection({ data, onUpdate }: MenuSectionProps) {
    const [expanded, setExpanded] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const { products } = useProducts(true) // Include inactive products

    // Helper to resolve UUID or text to display name
    const resolveProductName = (nameOrId: string): string => {
        if (!nameOrId) return ''

        // Check if it's a UUID (with or without spaces/dashes)
        const cleanId = nameOrId.replace(/\s/g, '-').toLowerCase()
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

        let resolved = ''
        if (uuidRegex.test(cleanId)) {
            // It's a UUID - try to find product
            const product = products.find(p => p.id.toLowerCase() === cleanId)
            resolved = product ? product.name : '❓ Produit inconnu'
        } else {
            // Not a UUID - return formatted name
            resolved = getProductDisplayName(nameOrId)
        }

        return resolved
    }

    // Helper to add manual item
    const addManualItem = (category: string, name: string) => {
        if (!name.trim()) return
        const newItem = {
            name: name.trim(),
            quantity: 0,
            pricePerUnit: 0,
            total: 0
        }

        if (category === 'dessert') {
            onUpdate('menu.dessert', newItem)
        } else {
            // @ts-ignore
            const currentList = data[category] || []
            onUpdate(`menu.${category}`, [...currentList, newItem])
        }
    }

    const removeManualItem = (category: string, index: number) => {
        if (category === 'dessert') {
            onUpdate('menu.dessert', null)
            // Also clear from selectedItems
            onUpdate('menu.selectedItems.desserts', [])
        } else {
            // @ts-ignore
            const currentList = [...(data[category] || [])]
            const removedItem = currentList[index]
            currentList.splice(index, 1)
            onUpdate(`menu.${category}`, currentList)

            // Sync selectedItems - remove the deleted item
            const selectedKey = category // 'entrees' or 'viandes'
            // @ts-ignore
            const currentSelected = data.selectedItems?.[selectedKey] || []
            // Remove by both name and id to handle both cases
            const newSelected = currentSelected.filter((id: string) =>
                id !== removedItem.name && id !== removedItem.id
            )
            onUpdate(`menu.selectedItems.${selectedKey}`, newSelected)
        }
    }

    // Component for manual adder
    const ManualAdder = ({ category, placeholder }: { category: string, placeholder: string }) => {
        const [val, setVal] = useState('')
        return (
            <div className="flex items-center gap-2 mt-3">
                <Input
                    type="text"
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            addManualItem(category, val)
                            setVal('')
                        }
                    }}
                />
                <Button
                    size="icon"
                    onClick={() => {
                        addManualItem(category, val)
                        setVal('')
                    }}
                    className="shrink-0"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <Card className="border-l-4 border-l-primary shadow-sm mt-6">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-semibold text-primary m-0">
                            Menú
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
                <CardContent className="pt-0 pb-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Precio por Persona (€)</Label>
                            <Input
                                type="number"
                                value={data.pricePerPerson}
                                onChange={(e) => onUpdate('menu.pricePerPerson', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Personas</Label>
                            <Input
                                type="number"
                                value={data.totalPersons}
                                onChange={(e) => onUpdate('menu.totalPersons', parseInt(e.target.value) || 0)}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>TVA (%)</Label>
                            <Input
                                type="number"
                                value={data.tvaPct}
                                onChange={(e) => onUpdate('menu.tvaPct', parseFloat(e.target.value) || 0)}
                                step="0.1"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className="py-6 border-y border-border">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium">Selección de Platos</h3>
                            <Button onClick={() => setShowModal(true)}>
                                Abrir Catálogo
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Entradas */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Entradas</h4>
                                <ul className="space-y-2">
                                    {data.entrees?.map((item, i) => (
                                        <li key={i} className="flex items-start justify-between gap-2 p-2 rounded-md bg-muted/50 border border-border/50">
                                            <span className="text-sm font-medium leading-tight">
                                                • {resolveProductName(item.name)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeManualItem('entrees', i)}
                                                className="h-6 w-6 text-destructive hover:bg-destructive/10 shrink-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                                <ManualAdder category="entrees" placeholder="Agregar entrada manual..." />
                            </div>

                            {/* Carnes */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Carnes</h4>
                                <ul className="space-y-2">
                                    {data.viandes?.map((item, i) => (
                                        <li key={i} className="flex items-start justify-between gap-2 p-2 rounded-md bg-muted/50 border border-border/50">
                                            <span className="text-sm font-medium leading-tight">
                                                • {resolveProductName(item.name)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeManualItem('viandes', i)}
                                                className="h-6 w-6 text-destructive hover:bg-destructive/10 shrink-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                                <ManualAdder category="viandes" placeholder="Agregar carne manual..." />
                            </div>

                            {/* Postres */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Postres</h4>
                                <ul className="space-y-2">
                                    {data.dessert && (
                                        <li className="flex items-start justify-between gap-2 p-2 rounded-md bg-muted/50 border border-border/50">
                                            <span className="text-sm font-medium leading-tight">
                                                • {resolveProductName(data.dessert.name)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeManualItem('dessert', 0)}
                                                className="h-6 w-6 text-destructive hover:bg-destructive/10 shrink-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </li>
                                    )}
                                </ul>
                                {!data.dessert && (
                                    <ManualAdder category="dessert" placeholder="Agregar postre manual..." />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg space-y-2 max-w-sm ml-auto">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Total HT:</span>
                            <strong className="text-foreground">{data.totalHT.toFixed(2)} €</strong>
                        </div>
                        {data.discount && data.discount.amount > 0 && (
                            <>
                                <div className="flex justify-between items-center text-sm text-green-600">
                                    <span className="font-medium">Remise ({data.discount.percentage}%):</span>
                                    <strong>- {data.discount.amount.toFixed(2)} €</strong>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-muted-foreground">Total HT Avec Remise:</span>
                                    <strong className="text-foreground">{(data.totalHTApresRemise ?? data.totalHT).toFixed(2)} €</strong>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">TVA ({data.tvaPct}%):</span>
                            <strong className="text-foreground">{data.tva.toFixed(2)} €</strong>
                        </div>
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-border bg-amber-100 dark:bg-amber-900/30 p-2 rounded text-base">
                            <span className="font-semibold text-amber-900 dark:text-amber-400">Total TTC:</span>
                            <strong className="text-amber-900 dark:text-amber-400">{data.totalTTC.toFixed(2)} €</strong>
                        </div>
                    </div>

                    <MenuSelectorModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        selectedItems={{
                            entrees: (data.entrees && data.entrees.length > 0)
                                ? data.entrees.map(e => e.name)
                                : (data.selectedItems?.entrees || []),
                            viandes: (data.viandes && data.viandes.length > 0)
                                ? data.viandes.map(v => v.name)
                                : (data.selectedItems?.viandes || []),
                            desserts: (data.dessert)
                                ? [data.dessert.name]
                                : (data.selectedItems?.desserts || [])
                        }}
                        onSave={(selection) => {
                            const hydrateItems = (ids: string[]) => {
                                const uniqueIds = Array.from(new Set(ids))
                                return uniqueIds.map(id => {
                                    const idSimple = simplifyString(id)
                                    const product = products.find(p => {
                                        if (p.id === id || p.name === id) return true
                                        const pNameSimple = simplifyString(p.name)
                                        return pNameSimple === idSimple
                                    })
                                    const finalName = product ? product.name : formatItemName(id)
                                    return {
                                        name: finalName,
                                        quantity: 0,
                                        pricePerUnit: 0,
                                        total: 0
                                    }
                                })
                            }
                            onUpdate('menu.entrees', hydrateItems(selection.entrees))
                            onUpdate('menu.viandes', hydrateItems(selection.viandes))

                            if (selection.desserts.length > 0) {
                                const dId = selection.desserts[0]
                                const dIdSimple = simplifyString(dId)
                                const product = products.find(p => {
                                    if (p.id === dId || p.name === dId) return true
                                    return simplifyString(p.name) === dIdSimple
                                })
                                const finalName = product ? product.name : formatItemName(dId)

                                onUpdate('menu.dessert', {
                                    name: finalName,
                                    description: product?.description || undefined,
                                    quantity: 0,
                                    pricePerUnit: 0,
                                    total: 0
                                })
                            } else {
                                onUpdate('menu.dessert', null)
                            }

                            onUpdate('menu.selectedItems', selection)
                            setShowModal(false)
                        }}
                    />
                </CardContent>
            )}
        </Card>
    )
}
