import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { calculateEventCost } from '../../utils/calculations'
import { useEventCalculator } from '../../context/EventCalculatorContext'

export const EventTimelineView = () => {
    const { filteredEvents } = useEventCalculator()

    const sortedEvents = filteredEvents
        .filter(e => e.eventDate)
        .sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime())

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    Timeline de Eventos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {sortedEvents.map(event => {
                        const costs = calculateEventCost(event)
                        return (
                            <div
                                key={event.id}
                                className="flex items-start gap-4 rounded-lg border-l-4 border-l-primary bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                            >
                                <div className="shrink-0 w-28">
                                    <Badge variant="outline" className="text-xs font-medium">
                                        {new Date(event.eventDate!).toLocaleDateString()}
                                    </Badge>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm mb-1">{event.name}</h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                        <span>👥 {event.guestCount} invitados</span>
                                        <span>🍽️ {event.ingredients.length} ingredientes</span>
                                        <span className="font-medium text-foreground">💰 €{costs.totalCost.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {sortedEvents.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-8">
                            No hay eventos con fecha asignada.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
