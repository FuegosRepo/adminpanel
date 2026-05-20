import { memo, useCallback } from 'react'
import { useEventCalculator } from '../../../../context/EventCalculatorContext'
import { useIngredientRowData } from '../hooks/useIngredientRowData'
import { useIngredientDisplay } from '../hooks/useIngredientDisplay'
import { parsePortionPerPerson, convertToDisplayUnitForSummary } from '../../../../utils/unitConversions'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import type { EventIngredient } from '../../../../types'

interface IngredientRowProps {
    eventId: string
    ingredient: EventIngredient
    guestCount: number
}

/**
 * Fila individual de ingrediente en la tabla.
 * Muestra nombre, cantidad por persona (editable), total y botón eliminar.
 * Usa hooks personalizados para eliminar IIFEs y memoizar cálculos.
 */
export const IngredientRow = memo(({
    eventId,
    ingredient,
    guestCount
}: IngredientRowProps) => {
    const { handleUpdateQuantity, handleRemoveIngredient } = useEventCalculator()

    // Datos calculados con hook personalizado
    const { display, isUsingDefault, totalQuantity } = useIngredientRowData(
        ingredient,
        guestCount
    )

    // Display para el total (usa convertToDisplayUnitForSummary)
    const totalDisplay = convertToDisplayUnitForSummary(ingredient.product, totalQuantity)

    // Handler para cambio de cantidad
    const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValue = parseFloat(e.target.value) || 0
        const newQuantityInKg = display.parseInput(newInputValue)
        handleUpdateQuantity(eventId, ingredient.id, newQuantityInKg)
    }, [eventId, ingredient.id, display, handleUpdateQuantity])

    // Handler para usar porción estándar
    const handleUseDefault = useCallback(() => {
        const portionFromProduct = ingredient.product.portion_per_person
        if (portionFromProduct) {
            const defaultQty = parsePortionPerPerson(portionFromProduct)
            handleUpdateQuantity(eventId, ingredient.id, defaultQty)
        }
    }, [eventId, ingredient.id, ingredient.product.portion_per_person, handleUpdateQuantity])

    // Handler para eliminar ingrediente
    const handleRemove = useCallback(() => {
        handleRemoveIngredient(eventId, ingredient.id)
    }, [eventId, ingredient.id, handleRemoveIngredient])

    const portionFromProduct = ingredient.product.portion_per_person

    return (
        <TableRow>
            {/* Nombre del ingrediente */}
            <TableCell>
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                        <strong className="text-sm">{ingredient.product.name}</strong>
                        {ingredient.isFixedQuantity && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                                            🔒 Fijo
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>Cantidad fija por evento (no se multiplica por invitados)</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    {!ingredient.isFixedQuantity && portionFromProduct && (
                        <div className="text-[11px] text-muted-foreground space-y-0.5">
                            <span>Porción estándar: {portionFromProduct}</span>
                            {ingredient.product.clarifications && (
                                <span className="block text-[10px] opacity-70" title={ingredient.product.clarifications}>
                                    💡 {ingredient.product.clarifications}
                                </span>
                            )}
                        </div>
                    )}

                    {ingredient.notes &&
                        ingredient.notes !== ingredient.product.clarifications && (
                            <span className="text-[11px] text-muted-foreground block" title={ingredient.notes}>
                                📝 {ingredient.notes}
                            </span>
                        )}
                </div>
            </TableCell>

            {/* Input de cantidad por persona */}
            <TableCell>
                <div className="flex items-center gap-1.5">
                    <Input
                        type="number"
                        min={0}
                        step={display.displayUnit === 'gr' ? 1 : 0.1}
                        value={display.inputValue}
                        onChange={handleQuantityChange}
                        className="w-20 h-7 text-xs text-center"
                        title={
                            portionFromProduct
                                ? `Valor estándar: ${portionFromProduct}`
                                : 'Cantidad personalizada'
                        }
                    />
                    <span className="text-xs text-muted-foreground">{display.displayUnit}</span>

                    {portionFromProduct && isUsingDefault && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={handleUseDefault}
                            className="text-[10px] h-auto p-0 text-primary"
                            title={`Usar valor estándar: ${portionFromProduct}`}
                        >
                            Usar estándar
                        </Button>
                    )}
                </div>
            </TableCell>

            {/* Total calculado */}
            <TableCell className="font-medium text-sm">
                {totalDisplay.value.toFixed(2)} {totalDisplay.unit}
            </TableCell>

            {/* Botón eliminar */}
            <TableCell>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={handleRemove}
                    title="Eliminar"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            </TableCell>
        </TableRow>
    )
})

IngredientRow.displayName = 'IngredientRow'
