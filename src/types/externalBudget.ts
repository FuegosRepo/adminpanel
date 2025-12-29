// Tipos para External Budgets (Devis Externos)
export interface ExternalBudget {
    id: string
    client_name: string
    client_email: string
    client_phone: string
    event_date: string | null
    event_type: string | null
    event_address: string | null
    guest_count: string | null
    meal_type: string | null
    status: 'pending' | 'sent' | 'accepted' | 'rejected'
    sent_at: string | null
    last_sent_at: string | null
    notes: string | null
    admin_comments: string | null
    categoria: string | null
    imported_at: string
    original_timestamp: string | null
    created_at: string
    updated_at: string
}

export interface ExternalBudgetFilters {
    status?: 'pending' | 'sent' | 'accepted' | 'rejected' | 'all'
    categoria?: 'Particular' | 'Empresa' | 'all'
    dateFrom?: string
    dateTo?: string
    searchTerm?: string
}
