import React from 'react'
import { Package, CheckSquare, Plus } from 'lucide-react'
import { Product } from '@/types'
import { getFrenchNameFromSpanish } from '@/components/EventCalculator/utils/productMapping'
import { formatItemName } from '../utils/formatItemName'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MaterialSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    availableMaterials: Product[]
    selectedMaterialIds: string[]
    onToggleSelection: (id: string) => void
    onAddSelected: () => void
    existingItemNames: string[]
}

export function MaterialSelectorModal({
    isOpen,
    onClose,
    availableMaterials,
    selectedMaterialIds,
    onToggleSelection,
    onAddSelected,
    existingItemNames
}: MaterialSelectorModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                        <Package className="h-6 w-6 text-primary" /> Agregar Materiales
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-4 text-muted-foreground">
                    Selecciona los materiales que deseas agregar al presupuesto.
                </div>

                <ScrollArea className="flex-1 px-6 h-[50vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-6">
                        {availableMaterials.map(product => {
                            const isSelected = selectedMaterialIds.includes(product.id)
                            const alreadyInBudget = existingItemNames.includes(product.name)

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => onToggleSelection(product.id)}
                                    className={`
                                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex gap-3
                                        ${isSelected
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                        }
                                        ${alreadyInBudget && !isSelected ? 'opacity-70 bg-muted/30' : ''}
                                    `}
                                >
                                    <div className={`
                                        w-5 h-5 rounded flex-shrink-0 mt-0.5 border flex items-center justify-center transition-colors
                                        ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input bg-background'}
                                    `}>
                                        {isSelected && <CheckSquare className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-foreground truncate">
                                            {formatItemName(getFrenchNameFromSpanish(product.name))}
                                        </div>
                                        {/* Show original name if different, for clarity */}
                                        {getFrenchNameFromSpanish(product.name) !== product.name && (
                                            <div className="italic text-xs text-muted-foreground mt-0.5 truncate">
                                                ({product.name})
                                            </div>
                                        )}
                                        {product.clarifications && (
                                            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {product.clarifications}
                                            </div>
                                        )}
                                        {alreadyInBudget && !isSelected && (
                                            <div className="mt-2 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded w-fit">
                                                Posible duplicado
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>

                <div className="p-6 pt-4 border-t bg-muted/20 flex justify-end gap-3 mt-auto rounded-b-lg">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={onAddSelected}
                        disabled={selectedMaterialIds.length === 0}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar {selectedMaterialIds.length} {selectedMaterialIds.length === 1 ? 'Material' : 'Materiales'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
