import { EventCard } from './EventCard'
import { EventSummary } from '../EventSummary'
import { useEventCalculator } from '../../context/EventCalculatorContext'

export const EventListView = () => {
    const {
        filteredEvents,
        totalsByCategory,
        showSummary,
        setShowSummary
    } = useEventCalculator()

    return (
        <div className="space-y-4">
            {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No se encontraron eventos</p>
                </div>
            ) : (
                filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                ))
            )}

            {filteredEvents.length > 0 && (
                <EventSummary
                    totalsByCategory={totalsByCategory}
                    isExpanded={showSummary}
                    onToggle={() => setShowSummary(!showSummary)}
                />
            )}
        </div>
    )
}
