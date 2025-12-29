import { supabase } from '@/lib/supabaseClient'
import { ExternalBudget, ExternalBudgetFilters } from '@/types'

export interface GetExternalBudgetsResult {
    data: ExternalBudget[]
    totalCount: number
    error: Error | null
}

/**
 * Get external budgets with optional filters and pagination
 */
export async function getExternalBudgets(
    filters: ExternalBudgetFilters = {},
    page: number = 1,
    pageSize: number = 20
): Promise<GetExternalBudgetsResult> {
    try {
        let query = supabase
            .from('external_budgets')
            .select('*', { count: 'exact' })

        // Apply status filter
        if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status)
        }

        // Apply categoria filter
        if (filters.categoria && filters.categoria !== 'all') {
            query = query.eq('categoria', filters.categoria)
        }

        // Apply date range filter
        if (filters.dateFrom) {
            query = query.gte('event_date', filters.dateFrom)
        }
        if (filters.dateTo) {
            query = query.lte('event_date', filters.dateTo)
        }

        // Apply search term (searchin name, email, phone)
        if (filters.searchTerm && filters.searchTerm.trim()) {
            const searchTerm = filters.searchTerm.trim()
            query = query.or(
                `client_name.ilike.%${searchTerm}%,client_email.ilike.%${searchTerm}%,client_phone.ilike.%${searchTerm}%`
            )
        }

        // Apply pagination
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)

        // Order by event date descending
        query = query.order('event_date', { ascending: false, nullsFirst: false })

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching external budgets:', error)
            return { data: [], totalCount: 0, error }
        }

        return {
            data: data as ExternalBudget[],
            totalCount: count || 0,
            error: null
        }
    } catch (error) {
        console.error('Error in getExternalBudgets:', error)
        return {
            data: [],
            totalCount: 0,
            error: error as Error
        }
    }
}

/**
 * Get a single external budget by ID
 */
export async function getExternalBudgetById(id: string) {
    const { data, error } = await supabase
        .from('external_budgets')
        .select('*')
        .eq('id', id)
        .single()

    return { data: data as ExternalBudget | null, error }
}

/**
 * Update an external budget
 */
export async function updateExternalBudget(
    id: string,
    updates: Partial<ExternalBudget>
) {
    const { data, error } = await supabase
        .from('external_budgets')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

    return { data: data as ExternalBudget | null, error }
}

/**
 * Delete an external budget
 */
export async function deleteExternalBudget(id: string) {
    const { error } = await supabase
        .from('external_budgets')
        .delete()
        .eq('id', id)

    return { error }
}

/**
 * Mark external budget as sent
 */
export async function markExternalBudgetAsSent(id: string) {
    return updateExternalBudget(id, {
        status: 'sent',
        last_sent_at: new Date().toISOString()
    })
}

/**
 * Get stats for external budgets
 */
export async function getExternalBudgetsStats() {
    const { data, error } = await supabase
        .from('external_budgets')
        .select('status, categoria')

    if (error || !data) {
        return {
            total: 0,
            byStatus: {},
            byCategoria: {}
        }
    }

    const stats = {
        total: data.length,
        byStatus: data.reduce((acc: Record<string, number>, budget) => {
            acc[budget.status] = (acc[budget.status] || 0) + 1
            return acc
        }, {}),
        byCategoria: data.reduce((acc: Record<string, number>, budget) => {
            const cat = budget.categoria || 'Unknown'
            acc[cat] = (acc[cat] || 0) + 1
            return acc
        }, {})
    }

    return stats
}
