import React from 'react'
import { Package, Plus, CheckCircle2 } from 'lucide-react'
import { Product } from '@/types'
import { Event } from '@/components/EventCalculator/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface MaterialSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    availableProducts: Product[]
    selectedMaterialIds: string[]
    onMaterialToggle: (productId: string) => void
    onAddMaterials: () => void
    events: Event[]
    currentEventId: string | null
}

export function MaterialSelectorModal({
    isOpen,
    onClose,
    availableProducts,
    selectedMaterialIds,
    onMaterialToggle,
    onAddMaterials,
    events,
    currentEventId
}: MaterialSelectorModalProps) {
    // Filter products to only show materials
    const materialProducts = availableProducts.filter(p => p.category === 'material')

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Agregar Materiales
                    </DialogTitle>
                    <DialogDescription>
                        Selecciona los materiales que deseas agregar al evento. Se agregarán como cantidad fija (1 unidad por defecto).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 min-h-0 max-h-[55vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
                        {materialProducts.map(product => {
                            const isSelected = selectedMaterialIds.includes(product.id)
                            const event = events.find(e => e.id === currentEventId)
                            const alreadyInEvent = event?.ingredients.some(ing => ing.product.id === product.id)

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => !alreadyInEvent && onMaterialToggle(product.id)}
                                    className={cn(
                                        "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all",
                                        isSelected && "border-primary bg-primary/5",
                                        alreadyInEvent && "opacity-50 cursor-not-allowed bg-muted/50",
                                        !alreadyInEvent && !isSelected && "hover:bg-accent/50"
                                    )}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        disabled={alreadyInEvent}
                                        className="mt-0.5"
                                        onCheckedChange={() => !alreadyInEvent && onMaterialToggle(product.id)}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium text-sm">{product.name}</div>
                                        {product.clarifications && (
                                            <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                                {product.clarifications}
                                            </div>
                                        )}
                                        {alreadyInEvent && (
                                            <Badge variant="secondary" className="mt-1 text-xs font-normal">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Ya agregado
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={onAddMaterials}
                        disabled={selectedMaterialIds.length === 0}
                    >
                        <Plus className="h-4 w-4" />
                        Agregar {selectedMaterialIds.length} Material(es)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
