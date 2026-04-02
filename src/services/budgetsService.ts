import { supabase } from '@/lib/supabaseClient'
import { sanitizeSearchTerm, getPaginationRange } from '@/utils/queryHelpers'

export type BudgetsFilters = {
    status?: string
    searchTerm?: string
}

export type FetchBudgetsParams = {
    page?: number
    pageSize?: number
    filters?: BudgetsFilters
}

export interface ReportBudget {
    id: string
    order_id: string
    status: string
    relance_count: number
    created_at: string
    updated_at: string
}

/**
 * Fetch all budgets (no pagination) for reporting.
 * Only selects fields needed for relance/conversion analysis.
 */
export const fetchBudgetsForReports = async (): Promise<ReportBudget[]> => {
    const { data, error } = await supabase
        .from('budgets')
        .select('id, order_id, status, relance_count, created_at, updated_at')
        .order('created_at', { ascending: true })

    if (error) throw error
    return (data || []) as ReportBudget[]
}

export const fetchBudgets = async ({
    page = 1,
    pageSize = 10,
    filters
}: FetchBudgetsParams) => {
    // Select only essential fields for the list to save data
    let query = supabase
        .from('budgets')
        .select('id, order_id, version, status, budget_data, pdf_url, created_at, updated_at, relance_count, catering_orders!order_id(payment_method, status)', { count: 'exact' })

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
        if (filters.status === 'sent') {
            query = query.or('status.eq.sent,status.eq.ENVIADO')
        } else if (filters.status === 'approved') {
            // ✅ Handle case sensitivity for approved status
            query = query.or('status.eq.approved,status.eq.APPROVED')
        } else if (filters.status.startsWith('relance_')) {
            // Filter by number of relances, excluding approved/rejected budgets
            const count = parseInt(filters.status.split('_')[1])
            if (!isNaN(count)) {
                query = query.not('status', 'in', '(approved,APPROVED,rejected)')
                if (count >= 3) {
                    query = query.gte('relance_count', 3)
                } else {
                    query = query.eq('relance_count', count)
                }
            }
        } else {
            query = query.eq('status', filters.status)
        }
    }

    if (filters?.searchTerm) {
        // ✅ Use shared sanitization helper
        const term = sanitizeSearchTerm(filters.searchTerm)
        if (term.length > 0) {
            // Search in budget_data JSON (clientInfo.name or email)
            query = query.or(`budget_data->clientInfo->>name.ilike.%${term}%,budget_data->clientInfo->>email.ilike.%${term}%`)
        }
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

    return {
        data: data || [],
        count: count || 0
    }
}
