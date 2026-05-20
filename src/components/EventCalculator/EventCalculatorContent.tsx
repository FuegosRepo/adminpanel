'use client'

import { Calculator } from 'lucide-react'
import { EventCalculatorHeader } from './components/EventCalculatorHeader'
import { AddEventModal } from './components/modals/AddEventModal'
import { NotesModal } from './components/modals/NotesModal'
import { SelectOrderModal } from './components/modals/SelectOrderModal'
import { HistoryModal } from './components/modals/HistoryModal'
import { MaterialSelectorModal } from './components/modals/MaterialSelectorModal'
import { useEventPDF } from './hooks/useEventPDF'
import { EventListView } from './components/views/EventListView'
import { EventStatsView } from './components/views/EventStatsView'
import { EventComparisonView } from './components/views/EventComparisonView'
import { EventTimelineView } from './components/views/EventTimelineView'
import { useEventCalculator } from './context/EventCalculatorContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const EventCalculatorContent = () => {
    const {
        events,
        loading,
        error,
        filteredEvents,
        saveEvent,
        globalStats,
        grandTotals,
        totalsByCategory,
        comboIngredientsMap,
        products,
        showAddEventModal,
        setShowAddEventModal,
        showSelectOrderModal,
        setShowSelectOrderModal,
        showNotesModal,
        setShowNotesModal,
        showHistoryModal,
        setShowHistoryModal,
        showMaterialSelectorModal,
        setShowMaterialSelectorModal,
        newEventName,
        setNewEventName,
        newEventGuests,
        setNewEventGuests,
        newEventDate,
        setNewEventDate,
        handleAddEvent,
        selectedOrderIds,
        toggleOrderSelection,
        setSelectedOrderIds,
        handleLoadOrdersAsEvents,
        orders,
        currentEventIdForSelector,
        selectedMaterialIds,
        handleMaterialSelectionChange,
        handleAddMaterialsToEvent,
        eventNotes,
        eventVersions,
        restoreVersion,
        availableProducts,
        selectedEventIds,
        setSelectedEventIds,
        handleNotesChange,
        handleObservationsChange,
        handleSaveNotes,
        viewMode,
        setViewMode,
        filters,
        setFilters,
        regeneratingCosts,
        successMessage,
        regenerateAllCosts
    } = useEventCalculator()

    const availableOrders = orders.filter(order =>
        order.status === 'approved' &&
        order.contact.eventDate &&
        order.contact.guestCount > 0
    )

    const { downloadPDF, sharePDF } = useEventPDF({
        filteredEvents,
        products,
        comboIngredientsMap,
        totalsByCategory,
        grandTotals
    })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Calculator className="h-12 w-12 text-primary animate-pulse" />
                <p className="text-muted-foreground">Cargando eventos...</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
            <EventCalculatorHeader
                eventsCount={events.length}
                regeneratingCosts={regeneratingCosts}
                viewMode={viewMode}
                filters={filters}
                successMessage={successMessage}
                error={error}
                onSelectOrders={() => setShowSelectOrderModal(true)}
                onAddManualEvent={() => setShowAddEventModal(true)}
                onRegenerateCosts={regenerateAllCosts}
                onGeneratePDF={downloadPDF}
                onSharePDF={sharePDF}
                onViewModeChange={setViewMode}
                onFiltersChange={setFilters}
            />

            {events.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center py-12">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Calculator className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No hay eventos calculados</h3>
                        <p className="text-muted-foreground text-sm max-w-md mb-6">
                            Selecciona pedidos aprobados para comenzar a calcular ingredientes.
                        </p>
                        <Button onClick={() => setShowSelectOrderModal(true)}>
                            Seleccionar Pedidos
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {viewMode === 'list' && <EventListView />}
                    {viewMode === 'timeline' && <EventTimelineView />}
                    {viewMode === 'comparison' && <EventComparisonView />}
                    {viewMode === 'stats' && <EventStatsView />}
                </>
            )}

            <SelectOrderModal
                isOpen={showSelectOrderModal}
                onClose={() => setShowSelectOrderModal(false)}
                orders={availableOrders}
                selectedOrderIds={selectedOrderIds}
                onOrderToggle={toggleOrderSelection}
                onSelectAll={setSelectedOrderIds}
                onLoadOrders={() => handleLoadOrdersAsEvents(availableOrders)}
            />

            <AddEventModal
                isOpen={showAddEventModal}
                onClose={() => setShowAddEventModal(false)}
                onSubmit={handleAddEvent}
                eventName={newEventName}
                eventDate={newEventDate}
                guestCount={newEventGuests}
                onNameChange={setNewEventName}
                onDateChange={setNewEventDate}
                onGuestCountChange={setNewEventGuests}
            />

            {showNotesModal && (() => {
                const event = events.find(e => e.id === showNotesModal)
                if (!event) return null
                return (
                    <NotesModal
                        isOpen={!!showNotesModal}
                        onClose={() => setShowNotesModal(null)}
                        event={event}
                        onNotesChange={(notes) => handleNotesChange(event.id, notes)}
                        onObservationsChange={(observations) => handleObservationsChange(event.id, observations)}
                        onSave={() => handleSaveNotes(event.id)}
                    />
                )
            })()}

            <HistoryModal
                isOpen={!!showHistoryModal}
                onClose={() => setShowHistoryModal(null)}
                eventId={showHistoryModal}
                events={events}
                eventVersions={eventVersions}
                onRestoreVersion={restoreVersion}
            />

            <MaterialSelectorModal
                isOpen={showMaterialSelectorModal}
                onClose={() => setShowMaterialSelectorModal(false)}
                availableProducts={availableProducts}
                selectedMaterialIds={selectedMaterialIds}
                onMaterialToggle={handleMaterialSelectionChange}
                onAddMaterials={handleAddMaterialsToEvent}
                events={events}
                currentEventId={currentEventIdForSelector}
            />
        </div>
    )
}
