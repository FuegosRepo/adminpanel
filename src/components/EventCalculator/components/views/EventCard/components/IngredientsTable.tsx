import { useEventCalculator } from '../../../../context/EventCalculatorContext'
import { useAvailableProducts } from '../hooks/useAvailableProducts'
import { IngredientRow } from './IngredientRow'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { Event } from '../../../../types'

interface IngredientsTableProps {
    event: Event
    onOpenMaterialSelector: () => void
}

/**
 * Tabla de ingredientes del evento.
 * Incluye la lista de ingredientes y el selector para agregar nuevos.
 */
export const IngredientsTable = ({ event, onOpenMaterialSelector }: IngredientsTableProps) => {
    const { availableProducts, handleAddIngredient } = useEventCalculator()

    // Filtrar productos ya utilizados usando hook personalizado
    const usedProductIds = event.ingredients.map(ing => ing.product.id)
    const filteredProducts = useAvailableProducts(availableProducts, usedProductIds)

    return (
        <div className="space-y-3">
            {/* Tabla o mensaje vacío */}
            {event.ingredients.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground border rounded-md bg-muted/20">
                    No hay ingredientes agregados
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ingrediente</TableHead>
                            <TableHead>Cant./Persona</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {event.ingredients.map(ingredient => (
                            <IngredientRow
                                key={ingredient.id}
                                eventId={event.id}
                                ingredient={ingredient}
                                guestCount={event.guestCount}
                            />
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Selector de ingredientes */}
            <div className="flex items-center gap-2">
                <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    onChange={(e) => {
                        if (e.target.value) {
                            handleAddIngredient(event.id, e.target.value)
                            e.target.value = ''
                        }
                    }}
                >
                    <option value="">Seleccionar ingrediente...</option>
                    {filteredProducts.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                            {product.portion_per_person && ` - ${product.portion_per_person} por persona`}
                            {product.clarifications && ` (${product.clarifications.substring(0, 30)}...)`}
                        </option>
                    ))}
                </select>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenMaterialSelector}
                    className="shrink-0"
                >
                    <Package className="h-4 w-4" />
                    Materiales
                </Button>
            </div>
        </div>
    )
}
