import { supabase } from '@/lib/supabaseClient'
import { CateringOrder, PaymentMethod } from '@/types'
import { sanitizeSearchTerm, getPaginationRange } from '@/utils/queryHelpers'

export type OrdersFilters = {
    status?: string
    searchTerm?: string
    dateFrom?: string
    dateTo?: string
    year?: string
    eventType?: string
}

export type FetchOrdersParams = {
    page?: number
    pageSize?: number
    filters?: OrdersFilters
}

export type OrdersResponse = {
    data: CateringOrder[]
    count: number
    error: string | null
}

/**
 * Parses internal_notes with defensive handling for array/object/string formats
 * @param rawData - Raw internal_note data from database
 * @returns Normalized array of notes or undefined
 */
function parseInternalNotes(rawData: unknown): { text: string; createdAt: string }[] | undefined {
    if (!rawData) return undefined

    let data: unknown = rawData

    // If it's a string, try to parse it
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch {
            // Return the raw string as a note
            return [{ text: String(rawData), createdAt: new Date().toISOString() }]
        }
    }

    // If it's an array (new format)
    if (Array.isArray(data)) {
        return data.map((note: { text?: string; createdAt?: string; created_at?: string }) => ({
            text: note.text || '',
            createdAt: note.createdAt || note.created_at || new Date().toISOString()
        }))
    }

    // If it's a single object (old format), wrap in array
    if (typeof data === 'object' && data !== null) {
        const obj = data as { text?: string; createdAt?: string; updatedAt?: string; updated_at?: string }
        return [{
            text: obj.text || '',
            createdAt: obj.createdAt || obj.updatedAt || obj.updated_at || new Date().toISOString()
        }]
    }

    return undefined
}

export const fetchOrders = async ({
    page = 1,
    pageSize = 50,
    filters
}: FetchOrdersParams): Promise<OrdersResponse> => {
    // Optimization: Select only necessary fields instead of '*'
    let query = supabase
        .from('catering_orders')
        .select('*, budgets(id)', { count: 'exact' })

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
    }

    if (filters?.searchTerm) {
        // ✅ Use shared sanitization helper
        const term = sanitizeSearchTerm(filters.searchTerm)
        if (term.length > 0) {
            // Search in multiple columns using OR syntax
            query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%`)
        }
    }

    // Apply date filters
    if (filters?.dateFrom) {
        query = query.gte('event_date', filters.dateFrom)
    }
    if (filters?.dateTo) {
        query = query.lte('event_date', filters.dateTo)
    }

    if (filters?.year) {
        query = query.gte('event_date', `${filters.year}-01-01`).lte('event_date', `${filters.year}-12-31`)
    }

    if (filters?.eventType) {
        query = query.ilike('event_type', `%${filters.eventType}%`)
    }

    // ✅ Use shared pagination helper
    const { from, to } = getPaginationRange(page, pageSize)

    query = query
        .order('created_at', { ascending: false })
        .range(from, to)

    const { data, error, count } = await query

    if (error) {
        throw error
    }

    const mapped = (data || []).map(mapRowToOrder)

    return {
        data: mapped,
        count: count || 0,
        error: null
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToOrder(row: any): CateringOrder {
    return {
        id: row.id,
        contact: {
            email: row.email,
            name: row.name,
            phone: row.phone || '',
            eventDate: row.event_date || '',
            eventType: row.event_type || '',
            address: row.address || '',
            guestCount: row.guest_count || 0
        },
        menu: { type: (row.menu_type as 'dejeuner' | 'diner') || null },
        entrees: row.entrees || [],
        viandes: row.viandes || [],
        dessert: row.dessert || null,
        extras: {
            wines: row.extras?.wines ?? false,
            equipment: row.extras?.equipment ?? [],
            decoration: row.extras?.decoration ?? false,
            specialRequest: row.extras?.specialRequest ?? ''
        },
        status: (row.status || 'pending') as 'pending' | 'sent' | 'approved' | 'rejected' | 'ENVIADO',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        estimatedPrice: row.estimated_price || undefined,
        notes: row.notes || undefined,
        internalNotes: parseInternalNotes(row.internal_note),
        payment: row.payment,
        paymentMethod: (row.payment_method as PaymentMethod) || null,
        hasBudget: row.budgets && row.budgets.length > 0
    }
}

/**
 * Fetch all approved orders (status = 'approved'), no pagination.
 * Used by Calculator, Reminders, Reports, Payments.
 */
export const fetchApprovedOrders = async (): Promise<CateringOrder[]> => {
    const { data, error } = await supabase
        .from('catering_orders')
        .select('*, budgets(id)')
        .eq('status', 'approved')
        .order('event_date', { ascending: true })

    if (error) throw error
    return (data || []).map(mapRowToOrder)
}

/**
 * Fetch all orders (all statuses) for reporting, no pagination.
 * Optionally filter by created_at date range.
 * Used by Reports page for historical analysis.
 */
export const fetchAllOrdersForReports = async (
    dateFrom?: string,
    dateTo?: string
): Promise<CateringOrder[]> => {
    let query = supabase
        .from('catering_orders')
        .select('*, budgets(id)')

    if (dateFrom) {
        query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
        query = query.lte('created_at', dateTo)
    }

    query = query.order('created_at', { ascending: true })

    const { data, error } = await query

    if (error) throw error
    return (data || []).map(mapRowToOrder)
}

/**
 * Fetch all orders that have an event_date (any status), no pagination.
 * Used by Calendar to show all events.
 */
export const fetchOrdersWithEvents = async (): Promise<CateringOrder[]> => {
    const { data, error } = await supabase
        .from('catering_orders')
        .select('*, budgets(id)')
        .not('event_date', 'is', null)
        .order('event_date', { ascending: true })

    if (error) throw error
    return (data || []).map(mapRowToOrder)
}
