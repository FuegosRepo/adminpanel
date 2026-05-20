import React from 'react'
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { IngredientTotal } from '../types'
import { convertToDisplayUnitForSummary } from '../utils/unitConversions'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface EventSummaryProps {
    totalsByCategory: { [key: string]: IngredientTotal[] }
    isExpanded: boolean
    onToggle: () => void
}

const CATEGORY_NAMES: { [key: string]: string } = {
    'entradas': 'Entradas',
    'carnes_clasicas': 'Carnes Clásicas',
    'carnes_premium': 'Carnes Premium',
    'verduras': 'Acompañamiento',
    'postres': 'Postres',
    'pan': 'Pan',
    'extras': 'Extras',
    'material': 'Material'
}

export function EventSummary({ totalsByCategory, isExpanded, onToggle }: EventSummaryProps) {
    const hasItems = Object.keys(totalsByCategory).length > 0
    if (!hasItems) {
        return null
    }

    return (
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
            <Card className="border-primary/20">
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold text-sm">
                                    Resumen General — Total de Compras
                                </h3>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                        {Object.keys(totalsByCategory).map(category => (
                            <div key={category}>
                                <Badge variant="secondary" className="mb-2 text-xs font-medium">
                                    {CATEGORY_NAMES[category] || category}
                                </Badge>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ingrediente</TableHead>
                                            <TableHead className="text-right">Cantidad Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {totalsByCategory[category].map(item => {
                                            const display = convertToDisplayUnitForSummary(item.product, item.total)
                                            return (
                                                <React.Fragment key={item.product.id}>
                                                    <TableRow>
                                                        <TableCell className={item.subItems ? 'font-semibold' : ''}>
                                                            {item.product.name}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {parseFloat(display.value.toFixed(2))} {display.unit}
                                                        </TableCell>
                                                    </TableRow>
                                                    {item.subItems && item.subItems.map(sub => {
                                                        const subDisplay = convertToDisplayUnitForSummary(sub.product, sub.total)
                                                        return (
                                                            <TableRow key={`${item.product.id}-${sub.product.id}`} className="opacity-70">
                                                                <TableCell className="pl-8 text-muted-foreground">
                                                                    ↳ {sub.product.name}
                                                                </TableCell>
                                                                <TableCell className="text-right text-muted-foreground">
                                                                    {parseFloat(subDisplay.value.toFixed(2))} {subDisplay.unit}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </React.Fragment>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    )
}
