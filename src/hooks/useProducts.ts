import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/types'

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('category', { ascending: true })
                    .order('name', { ascending: true })

                if (error) {
                    throw error
                }

                setProducts(data || [])
            } catch (err: any) {
                console.error('Error cargando productos:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    return {
        products,
        loading,
        error
    }
}
