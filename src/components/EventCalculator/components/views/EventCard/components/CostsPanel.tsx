import { memo, useMemo } from 'react'
import { useIngredientDisplay } from '../hooks/useIngredientDisplay'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import type { EventCost } from '../../../../utils/calculations'
import type { Product } from '@/types'

interface CostsPanelProps {
    costs: EventCost
}

/**
 * Panel que muestra el análisis completo de costos del evento.
 * Incluye resumen, desglose por categoría y desglose por ingrediente.
 */
export const CostsPanel = ({ costs }: CostsPanelProps) => {
    return (
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            {/* Resumen de costos */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-background border p-3">
                    <span className="text-xs text-muted-foreground block mb-0.5">Costo Total</span>
                    <span className="text-lg font-bold text-primary">€{costs.totalCost.toFixed(2)}</span>
                </div>
                <div className="rounded-md bg-background border p-3">
                    <span className="text-xs text-muted-foreground block mb-0.5">Por Invitado</span>
                    <span className="text-lg font-bold">€{costs.avgCostPerGuest.toFixed(2)}</span>
                </div>
            </div>

            {/* Desglose por categoría */}
            <div>
                <h5 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Desglose por Categoría
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(costs.costByCategory).map(([cat, amount]) => (
                        <div key={cat} className="flex justify-between items-center rounded-md bg-background border px-3 py-2 text-sm">
                            <span className="text-muted-foreground capitalize truncate">{cat}</span>
                            <span className="font-medium ml-2">€{amount.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desglose por ingrediente */}
            <div>
                <h5 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Desglose por Ingrediente
                </h5>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ingrediente</TableHead>
                            <TableHead>Cantidad Total</TableHead>
                            <TableHead>Precio Unit.</TableHead>
                            <TableHead className="text-right">Costo Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {costs.ingredientCosts.map((item, idx) => (
                            <CostsTableRow key={idx} item={item} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

/**
 * Fila de la tabla de costos por ingrediente.
 * Usa el hook useIngredientDisplay para eliminar IIFEs.
 */
interface CostsTableRowProps {
    item: {
        product: Product
        quantity: number
        cost: number
    }
}

const CostsTableRow = memo(({ item }: CostsTableRowProps) => {
    const display = useIngredientDisplay(item.product, item.quantity)

    const formattedQuantity = useMemo(
        () => display.format(display.displayValue.value),
        [display]
    )

    const formattedPrice = useMemo(
        () => `€${item.product.price_per_portion.toFixed(2)}/${display.displayUnit}`,
        [item.product.price_per_portion, display.displayUnit]
    )

    const formattedCost = useMemo(
        () => `€${item.cost.toFixed(2)}`,
        [item.cost]
    )

    return (
        <TableRow>
            <TableCell className="font-medium">{item.product.name}</TableCell>
            <TableCell>{formattedQuantity}</TableCell>
            <TableCell>{formattedPrice}</TableCell>
            <TableCell className="text-right font-semibold">{formattedCost}</TableCell>
        </TableRow>
    )
})

CostsTableRow.displayName = 'CostsTableRow'
