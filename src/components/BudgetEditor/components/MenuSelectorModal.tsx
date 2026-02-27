import React, { useEffect, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { simplifyString } from '@/utils/stringUtils'
import { getProductDisplayName } from '@/utils/productDisplay'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Utensils, CheckSquare } from 'lucide-react'

interface MenuSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    selectedItems: {
        entrees: string[]
        viandes: string[]
        desserts: string[]
    }
    onSave: (selection: { entrees: string[], viandes: string[], desserts: string[] }) => void
}

export function MenuSelectorModal({ isOpen, onClose, selectedItems, onSave }: MenuSelectorModalProps) {
    // Use ONLY active products - filtering is done at database level
    const { products, loading } = useProducts(false)
    const [tempSelection, setTempSelection] = useState(selectedItems)

    useEffect(() => {
        if (isOpen) {
            // Helper to convert Name or ID to ID, with validation
            const toId = (item: string) => {
                // Only accept valid UUIDs, reject legacy text
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

                // If it's already a valid UUID, return it
                if (uuidRegex.test(item)) {
                    // Verify it exists in products
                    const exists = products.find(p => p.id === item)
                    return exists ? item : null
                }

                // Try to find by name
                const product = products.find(p => p.name === item || p.name.toLowerCase().trim() === item.toLowerCase().trim())
                return product ? product.id : null
            }

            // Clean and deduplicate selections
            const cleanAndDedupe = (items: string[]) => {
                const validIds = items.map(toId).filter((id): id is string => id !== null)
                return Array.from(new Set(validIds)) // Deduplicate
            }

            const normalizedSelection = {
                entrees: cleanAndDedupe(selectedItems?.entrees || []),
                viandes: cleanAndDedupe(selectedItems?.viandes || []),
                desserts: cleanAndDedupe(selectedItems?.desserts || []),
            }
            setTempSelection(normalizedSelection)
        }
    }, [isOpen, selectedItems, products])

    const handleToggle = (category: 'entrees' | 'viandes' | 'desserts', id: string) => {
        const currentList = tempSelection[category] || []
        const exists = currentList.includes(id)
        let newList

        if (category === 'desserts') {
            // Single selection for desserts
            // If clicking the already selected item, deselect it (empty list)
            // Otherwise, replace selection with new item
            newList = exists ? [] : [id]
        } else {
            // Multiple selection for entrees/viandes
            if (exists) {
                newList = currentList.filter(item => item !== id)
            } else {
                newList = [...currentList, id]
            }
        }

        setTempSelection({ ...tempSelection, [category]: newList })
    }

    const isSelected = (categoryList: string[] | undefined, product: any) => {
        if (!categoryList) return false
        return categoryList.includes(product.id)
    }

    // Palabras clave para EXCLUIR ingredientes o versiones desglosadas
    const EXCLUDED_KEYWORDS = [
        'pan ', 'queso ', 'base', 'carne ', 'salsa ', 'focaccia', 'salade',
        'acompañamiento', 'ingrédient', 'supplément', 'flambes',
        'tomate', 'jamon', 'mozza', 'tapas au chorizo', 'chorizo grillé',
        'entraña', 'hampe', 'skirt steak'
    ]

    // Palabras clave para INCLUIR (Platos principales)
    const MAIN_DISH_KEYWORDS = {
        entrees: ['brochet', 'burg', 'choripan', 'empanada', 'secreto'],
        desserts: ['panqueque', 'fruits grill'] // Solo estos 2
    }

    const isMainDish = (product: any, keywords: string[]) => {
        const name = product.name.toLowerCase()
        const exactName = name.trim()

        // 1. FILTRO DE EXCLUSIÓN ESPECÍFICO
        if (exactName === 'chori' || exactName === 'chorizo' || exactName === 'panqueque') return false

        // 2. FILTRO DE EXCLUSIÓN GENERAL
        if (EXCLUDED_KEYWORDS.some(k => name.includes(k))) return false

        // 3. FILTRO DE CATEGORÍA VIANDES (Carnes)
        if (product.category === 'carnes_clasicas' || product.category === 'carnes_premium') return true

        // 4. FILTRO DE INCLUSIÓN (Entradas y Postres)
        return keywords.some(k => name.includes(k))
    }

    // Helper to deduplicate products by name (keep first occurrence)
    const deduplicateByName = (products: any[]) => {
        const seen = new Set<string>()
        return products.filter(p => {
            const normalizedName = p.name.toLowerCase().trim()
            if (seen.has(normalizedName)) return false
            seen.add(normalizedName)
            return true
        })
    }

    // Update filtering
    const entreesList = deduplicateByName(products.filter(p => {
        if (p.category !== 'entrees') return false
        const name = p.name.toLowerCase()
        return !EXCLUDED_KEYWORDS.some(k => name.includes(k))
    }))
    const viandesList = deduplicateByName(products.filter(p => {
        if (p.category !== 'viandes') return false
        const name = p.name.toLowerCase()
        return !EXCLUDED_KEYWORDS.some(k => name.includes(k))
    }))

    // DESSERTS: Mostrar TODOS los desserts activos (filtrado se hace en BD)
    const dessertsList = deduplicateByName(products.filter(p => {
        if (p.category !== 'desserts') return false
        return true
    }))

    const renderColumn = (title: string, list: any[], category: 'entrees' | 'viandes' | 'desserts') => (
        <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-500 border-b border-amber-200 dark:border-amber-900 pb-2 mb-1">
                {title}
            </h3>
            <div className="flex flex-col gap-2">
                {list.map(p => {
                    const selected = isSelected(tempSelection[category], p)
                    return (
                        <div
                            key={p.id}
                            onClick={() => handleToggle(category, p.id)}
                            className={`
                                p-3 rounded-md border flex items-center gap-3 cursor-pointer transition-colors
                                ${selected
                                    ? 'border-primary bg-primary/5 text-primary-foreground'
                                    : 'border-border hover:border-primary/30 hover:bg-muted/50 text-foreground'
                                }
                            `}
                        >
                            <div className={`
                                w-4 h-4 rounded-sm flex-shrink-0 border flex items-center justify-center transition-colors
                                ${category === 'desserts' ? 'rounded-full' : ''}
                                ${selected ? 'bg-primary border-primary' : 'border-input bg-background'}
                            `}>
                                {selected && <CheckSquare className="h-3 w-3 text-white" />}
                            </div>
                            <span className={`text-sm font-medium ${selected ? 'font-semibold text-primary' : ''}`}>
                                {getProductDisplayName(p.name)}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                        <Utensils className="h-6 w-6 text-primary" /> Seleccionar Menú
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="p-12 text-center text-muted-foreground flex items-center justify-center">
                        <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full mr-3"></div>
                        Cargando productos...
                    </div>
                ) : (
                    <ScrollArea className="flex-1 px-6 py-4 h-[60vh]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {renderColumn('Entradas', entreesList, 'entrees')}
                            {renderColumn('Carnes', viandesList, 'viandes')}
                            {renderColumn('Postres', dessertsList, 'desserts')}
                        </div>
                    </ScrollArea>
                )}

                <div className="p-6 border-t bg-muted/20 flex justify-end gap-3 rounded-b-lg">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={() => onSave(tempSelection)} disabled={loading}>
                        Guardar Selección
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
