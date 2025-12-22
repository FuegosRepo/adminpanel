import { supabase } from '@/lib/supabaseClient'

export type BudgetsFilters = {
    status?: string
    searchTerm?: string
}

export type FetchBudgetsParams = {
    page?: number
    pageSize?: number
    filters?: BudgetsFilters
}

export const fetchBudgets = async ({
    page = 1,
    pageSize = 10,
    filters
}: FetchBudgetsParams) => {
    // Select only essential fields for the list to save data
    let query = supabase
        .from('budgets')
        .select('id, order_id, version, status, budget_data, created_at, updated_at', { count: 'exact' })

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
        if (filters.status === 'sent') {
            query = query.or('status.eq.sent,status.eq.ENVIADO')
        } else {
            query = query.eq('status', filters.status)
        }
    }

    if (filters?.searchTerm) {
        const term = filters.searchTerm
        // Search in budget_data JSON (clientInfo.name or email)
        query = query.or(`budget_data->clientInfo->>name.ilike.%${term}%,budget_data->clientInfo->>email.ilike.%${term}%`)
    }

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

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
