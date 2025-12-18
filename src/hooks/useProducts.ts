import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/types'

export const fetchProducts = async (includeInactive = false): Promise<Product[]> => {
    let query = supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

    // Only filter by active if includeInactive is false
    if (!includeInactive) {
        query = query.eq('active', true)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
}

export const useProducts = (includeInactive = false) => {
    const {
        data: products = [],
        isLoading: loading,
        error
    } = useQuery({
        queryKey: ['products', includeInactive],
        queryFn: () => fetchProducts(includeInactive),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    })

    return {
        products,
        loading,
        error: error ? (error as Error).message : null
    }
}
