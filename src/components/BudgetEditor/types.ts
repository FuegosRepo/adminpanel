export interface BudgetData {
    clientInfo: {
        name: string
        email: string
        phone: string
        eventDate: string
        eventType: string
        guestCount: number
        address: string
        menuType: 'dejeuner' | 'diner'
    }
    menu: {
        pricePerPerson: number
        totalPersons: number
        totalHT: number
        tva: number
        tvaPct: number
        totalTTC: number
        notes?: string
        selectedItems?: {
            entrees: string[]
            viandes: string[]
            desserts: string[]
        }
        entrees?: Array<{
            name: string
            quantity: number
            pricePerUnit: number
            total: number
        }>
        viandes?: Array<{
            name: string
            quantity: number
            pricePerUnit: number
            total: number
        }>
        dessert?: {
            name: string
            quantity: number
            pricePerUnit: number
            total: number
        } | null
        accompagnements?: string[]
    }
    material?: {
        items: Array<{
            name: string
            quantity: number
            pricePerUnit: number
            total: number
        }>
        insurancePct?: number
        insuranceAmount?: number
        totalHT: number
        tva: number
        tvaPct: number
        totalTTC: number
        notes?: string
    }
    deliveryReprise?: {
        deliveryCost: number
        pickupCost: number
        totalHT: number
        tva: number
        tvaPct: number
        totalTTC: number
    }
    deplacement?: {
        distance: number
        pricePerKm: number
        totalHT: number
        tva: number
        tvaPct: number
        totalTTC: number
    }
    extras?: {
        items: Array<{
            description: string
            priceHT: number
            tvaPct: number
            tva: number
            priceTTC: number
        }>
        totalHT: number
        totalTVA: number
        totalTTC: number
        notes?: string
    }
    boissonsSoft?: {
        pricePerPerson: number
        totalPersons: number
        totalHT: number
        tva: number
        tvaPct: number
        totalTTC: number
    }
    service?: {
        mozos: number
        hours: number
        pricePerHour: number
        totalHT: number
        tva: number
        tvaPct: number
        totalTTC: number
    }
    totals: {
        totalHT: number
        totalTVA: number
        totalTTC: number
        discount?: {
            reason: string
            percentage: number
            amount: number
        }
    }
    notes?: string
    adminNotes?: string // Custom notes from admin to include in PDF
}

export interface Budget {
    id: string
    order_id: string
    version: number
    status: 'draft' | 'pending_review' | 'approved' | 'sent' | 'rejected'
    budget_data: BudgetData
    pdf_url?: string
    created_at: string
    updated_at: string
}

export interface BudgetEditorProps {
    budgetId: string
    onBudgetDeleted?: () => void
}
