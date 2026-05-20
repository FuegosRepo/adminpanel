import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { calculateEventCost } from '../../utils/calculations'
import { useEventCalculator } from '../../context/EventCalculatorContext'

export const EventComparisonView = () => {
    const {
        filteredEvents,
        events,
        selectedEventIds,
        handleSelectEvent
    } = useEventCalculator()

    const handleCheckboxChange = (eventId: string, checked: boolean) => {
        handleSelectEvent(eventId, checked)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Comparación de Eventos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Selection */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Selecciona eventos para comparar:</p>
                    <div className="flex flex-wrap gap-2">
                        {filteredEvents.map(event => (
                            <label
                                key={event.id}
                                className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm cursor-pointer transition-colors hover:bg-accent/50"
                            >
                                <Checkbox
                                    checked={selectedEventIds.includes(event.id)}
                                    onCheckedChange={(checked) => handleCheckboxChange(event.id, checked as boolean)}
                                />
                                {event.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                {selectedEventIds.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Métrica</TableHead>
                                {selectedEventIds.map(id => {
                                    const event = events.find(e => e.id === id)
                                    return event ? <TableHead key={id}>{event.name}</TableHead> : null
                                })}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Invitados</TableCell>
                                {selectedEventIds.map(id => {
                                    const event = events.find(e => e.id === id)
                                    return <TableCell key={id}>{event?.guestCount || 0}</TableCell>
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Costo Total</TableCell>
                                {selectedEventIds.map(id => {
                                    const event = events.find(e => e.id === id)
                                    const costs = event ? calculateEventCost(event) : null
                                    return <TableCell key={id} className="font-semibold">€{costs?.totalCost.toFixed(2) || '0.00'}</TableCell>
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Costo por Invitado</TableCell>
                                {selectedEventIds.map(id => {
                                    const event = events.find(e => e.id === id)
                                    const costs = event ? calculateEventCost(event) : null
                                    return <TableCell key={id}>€{costs?.avgCostPerGuest.toFixed(2) || '0.00'}</TableCell>
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Nº de Ingredientes</TableCell>
                                {selectedEventIds.map(id => {
                                    const event = events.find(e => e.id === id)
                                    return <TableCell key={id}>{event?.ingredients.length || 0}</TableCell>
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
