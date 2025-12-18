'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface ProductListResolverProps {
    ids: string[] | string | null
    category?: string
}

interface ProductSimple {
    id: string
    name: string
    subcategory?: string | null
}

// Helper to check if string is a valid UUID
function isUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
}

export function ProductListResolver({ ids }: ProductListResolverProps) {
    const [resolvedItems, setResolvedItems] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Normalize IDs to a clean array
    const idsArray = Array.isArray(ids)
        ? ids.filter(Boolean)
        : ids ? [ids] : []

    useEffect(() => {
        async function resolveProducts() {
            if (idsArray.length === 0) {
                setIsLoading(false)
                return
            }

            const resolved: string[] = []
            const uuidsToFetch: string[] = []
            const uuidIndexMap: Map<string, number> = new Map()

            // First pass: separate UUIDs from text
            idsArray.forEach((id, index) => {
                if (isUUID(id)) {
                    uuidsToFetch.push(id)
                    uuidIndexMap.set(id, index)
                } else {
                    // Text: use directly
                    resolved[index] = id
                }
            })

            // Fetch UUIDs from database if any
            if (uuidsToFetch.length > 0) {
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('id, name, subcategory')
                        .in('id', uuidsToFetch)

                    if (!error && data) {
                        // Map UUID results back to correct positions
                        data.forEach(product => {
                            const originalIndex = uuidIndexMap.get(product.id)
                            if (originalIndex !== undefined) {
                                let displayName = product.name
                                if (product.subcategory === 'premium') {
                                    displayName += ' ⭐' // Premium indicator
                                }
                                resolved[originalIndex] = displayName
                            }
                        })

                        // Handle UUIDs that weren't found
                        uuidsToFetch.forEach(uuid => {
                            const originalIndex = uuidIndexMap.get(uuid)
                            if (originalIndex !== undefined && !resolved[originalIndex]) {
                                resolved[originalIndex] = '❌ Produit supprimé'
                            }
                        })
                    }
                } catch (err) {
                    console.error('Error fetching products:', err)
                }
            }

            setResolvedItems(resolved)
            setIsLoading(false)
        }

        resolveProducts()
    }, [JSON.stringify(idsArray)])

    // Render
    if (idsArray.length === 0) {
        return <span className="text-gray-400 italic text-sm">Aucun produit sélectionné</span>
    }

    if (isLoading) {
        return <div className="text-gray-400 text-sm">Chargement...</div>
    }

    return (
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {resolvedItems.map((name, idx) => (
                <li key={idx}>{name}</li>
            ))}
        </ul>
    )
}
