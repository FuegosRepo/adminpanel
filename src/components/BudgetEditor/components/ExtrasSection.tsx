'use client'

import { BudgetExtrasSection } from '@/lib/types/budget'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Plus, Trash2, HelpCircle } from 'lucide-react'

interface ExtrasSectionProps {
    extras?: BudgetExtrasSection
    onUpdate: (path: string, value: any) => void
}

export default function ExtrasSection({ extras, onUpdate }: ExtrasSectionProps) {
    const handleAddExtra = () => {
        const newExtras = extras ? { ...extras } : {
            items: [],
            totalHT: 0,
            totalTVA: 0,
            totalTTC: 0
        }

        newExtras.items.push({
            description: '',
            priceHT: 0,
            tvaPct: 20,
            tva: 0,
            priceTTC: 0
        })

        recalculateTotals(newExtras)
        onUpdate('extras', newExtras)
    }

    const handleRemoveExtra = (index: number) => {
        if (!extras) return

        const newExtras = { ...extras }
        newExtras.items = newExtras.items.filter((_, i) => i !== index)
        recalculateTotals(newExtras)
        onUpdate('extras', newExtras)
    }

    const handleUpdateExtra = (index: number, field: string, value: any) => {
        if (!extras) return

        const newExtras = { ...extras }
        const item = newExtras.items[index]

        if (field === 'description') {
            item.description = value
        } else if (field === 'priceHT') {
            item.priceHT = parseFloat(value) || 0
            item.tva = item.priceHT * (item.tvaPct / 100)
            item.priceTTC = item.priceHT + item.tva
        } else if (field === 'tvaPct') {
            item.tvaPct = parseFloat(value) || 0
            item.tva = item.priceHT * (item.tvaPct / 100)
            item.priceTTC = item.priceHT + item.tva
        }

        recalculateTotals(newExtras)
        onUpdate('extras', newExtras)
    }

    const recalculateTotals = (extrasSection: BudgetExtrasSection) => {
        extrasSection.totalHT = extrasSection.items.reduce((sum, item) => sum + item.priceHT, 0)
        extrasSection.totalTVA = extrasSection.items.reduce((sum, item) => sum + item.tva, 0)
        extrasSection.totalTTC = extrasSection.items.reduce((sum, item) => sum + item.priceTTC, 0)
    }

    const handleDeleteSection = () => {
        if (confirm('¿Estás seguro de eliminar toda la sección de Extras?')) {
            onUpdate('extras', undefined)
        }
    }

    if (!extras) {
        return (
            <Card className="border-l-4 border-l-primary shadow-sm mt-6 mb-6">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <HelpCircle className="h-10 w-10 text-muted-foreground/50 mb-4" />
                    <p className="mb-4 text-base">No hay extras configurados en este presupuesto</p>
                    <Button onClick={handleAddExtra} variant="outline" className="border-primary text-primary hover:bg-primary/10">
                        <Plus className="h-4 w-4 mr-2" /> Agregar Extra
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-l-4 border-l-primary shadow-sm mt-6 mb-6">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-primary m-0 flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Extras
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDeleteSection}
                            className="text-destructive hover:bg-destructive/10 h-8"
                        >
                            <Trash2 className="h-4 w-4 mr-2" /> Eliminar Sección
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6 space-y-6">
                <div className="space-y-4">
                    {extras.items.length > 0 ? (
                        extras.items.map((item, index) => (
                            <div key={index} className="rounded-lg border border-border p-4 bg-card shadow-sm hover:border-primary/50 transition-colors">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label className="text-muted-foreground">Descripción</Label>
                                        <Input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleUpdateExtra(index, 'description', e.target.value)}
                                            placeholder="Ej: Decoración especial, servicio extra..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Precio HT (€)</Label>
                                        <Input
                                            type="number"
                                            value={item.priceHT}
                                            onChange={(e) => handleUpdateExtra(index, 'priceHT', e.target.value)}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">TVA</Label>
                                        <Select
                                            value={item.tvaPct.toString()}
                                            onValueChange={(val: string) => handleUpdateExtra(index, 'tvaPct', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">10%</SelectItem>
                                                <SelectItem value="20">20%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Action and Read-only totals section grouped together */}
                                    <div className="flex flex-col justify-end space-y-2">
                                        <div className="text-sm space-y-1 bg-muted/50 p-2 rounded border border-border">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">TVA:</span>
                                                <span className="font-medium">{item.tva.toFixed(2)} €</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">TTC:</span>
                                                <span className="font-medium text-primary">{item.priceTTC.toFixed(2)} €</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveExtra(index)}
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" /> Eliminar Item
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                            <p>No hay extras agregados. Click en "Agregar Extra" para comenzar.</p>
                        </div>
                    )}
                </div>

                <Button onClick={handleAddExtra} variant="outline" className="w-full sm:w-auto mt-2 border-primary/50 hover:bg-primary/5 border-dashed">
                    <Plus className="h-4 w-4 mr-2" /> Agregar {extras.items.length > 0 ? 'Otro' : ''} Extra
                </Button>

                {/* Totals */}
                {extras.items.length > 0 && (
                    <div className="bg-muted p-4 rounded-lg space-y-2 max-w-sm ml-auto mt-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Total HT:</span>
                            <strong className="text-foreground">{extras.totalHT.toFixed(2)} €</strong>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-muted-foreground">Total TVA:</span>
                            <strong className="text-foreground">{extras.totalTVA.toFixed(2)} €</strong>
                        </div>
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-border bg-amber-100 dark:bg-amber-900/30 p-2 rounded text-base">
                            <span className="font-semibold text-amber-900 dark:text-amber-400">Total TTC:</span>
                            <strong className="text-amber-900 dark:text-amber-400">{extras.totalTTC.toFixed(2)} €</strong>
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div className="space-y-2 pt-6 border-t border-border">
                    <Label className="text-lg font-medium flex items-center gap-2">
                        <span className="text-xl">📝</span> Notas sobre Extras
                    </Label>
                    <Textarea
                        value={extras.notes || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            const newExtras = { ...extras, notes: e.target.value }
                            onUpdate('extras', newExtras)
                        }}
                        placeholder="Notes additionnelles sur les extras..."
                        rows={3}
                        className="resize-none"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
