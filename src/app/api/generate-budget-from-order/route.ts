import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
    try {
        const { orderId } = await request.json()

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
        }

        // 1. Fetch order data
        const { data: order, error: orderError } = await supabase
            .from('catering_orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // 2. Fetch product names for UUIDs if necessary
        const allProductIds = [
            ...(order.entrees || []),
            ...(order.viandes || []),
            order.dessert
        ].filter(id => id && id.length === 36) // Simple UUID check

        let productNamesMap: Record<string, string> = {}
        if (allProductIds.length > 0) {
            const { data: products } = await supabase
                .from('products')
                .select('id, name')
                .in('id', allProductIds)

            products?.forEach(p => {
                productNamesMap[p.id] = p.name
            })
        }

        const getName = (idOrName: string) => productNamesMap[idOrName] || idOrName

        // 3. Generate budget data (following Fuegos/app/api/generate-budget logic)
        const guestCount = order.guest_count || 0
        const menuType = order.menu_type || 'diner'
        const basePrice = menuType === 'dejeuner' ? 35 : 42

        const entreesItems = (order.entrees || []).map((id: string) => ({
            name: getName(id),
            quantity: guestCount,
            pricePerUnit: 3,
            total: 3 * guestCount
        }))

        const viandesItems = (order.viandes || []).map((id: string) => ({
            name: getName(id),
            quantity: guestCount,
            pricePerUnit: 8,
            total: 8 * guestCount
        }))

        const dessertItem = order.dessert ? {
            name: getName(order.dessert),
            quantity: guestCount,
            pricePerUnit: 4,
            total: 4 * guestCount
        } : null

        const menuTotalHT = basePrice * guestCount
        const menuTVA = menuTotalHT * 0.1
        const menuTotalTTC = menuTotalHT + menuTVA

        let discount = null
        if (menuType === 'dejeuner') {
            const discountAmount = menuTotalTTC * 0.1
            discount = {
                percentage: 10,
                amount: discountAmount,
                reason: 'Événement à midi - 10%'
            }
        }

        // Extras / Material
        let material = null
        const equipment = order.extras?.equipment || []
        if (equipment.length > 0) {
            const costPerPersonPerItem = 5
            const materialItems = equipment.map((name: string) => ({
                name: name,
                quantity: guestCount,
                pricePerUnit: costPerPersonPerItem,
                total: costPerPersonPerItem * guestCount
            }))

            const materialHT = costPerPersonPerItem * guestCount * equipment.length
            const materialTVA = materialHT * 0.2
            const materialTTC = materialHT + materialTVA

            material = {
                items: materialItems,
                totalHT: materialHT,
                tvaPct: 20,
                tva: materialTVA,
                totalTTC: materialTTC
            }
        }

        const totalHT = menuTotalHT + (material?.totalHT || 0)
        const totalTVA = menuTVA + (material?.tva || 0)
        let totalTTC = menuTotalTTC + (material?.totalTTC || 0)
        if (discount) totalTTC -= discount.amount

        const budgetData = {
            generatedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            clientInfo: {
                name: order.name,
                email: order.email,
                phone: order.phone,
                eventDate: order.event_date,
                eventType: order.event_type,
                address: order.address,
                guestCount: order.guest_count,
                menuType: menuType
            },
            menu: {
                pricePerPerson: basePrice,
                totalPersons: guestCount,
                entrees: entreesItems,
                viandes: viandesItems,
                dessert: dessertItem,
                accompagnements: ['Salade', 'Pain', 'Sauces maison'],
                totalHT: menuTotalHT,
                tva: menuTVA,
                tvaPct: 10,
                totalTTC: menuTotalTTC,
                selectedItems: {
                    entrees: (order.entrees || []).map(getName),
                    viandes: (order.viandes || []).map(getName),
                    desserts: order.dessert ? [getName(order.dessert)] : []
                }
            },
            material: material,
            totals: {
                totalHT,
                totalTVA,
                totalTTC,
                discount: discount
            }
        }

        // 4. Insert into budgets
        const { data: budget, error: insertError } = await supabase
            .from('budgets')
            .insert([{
                order_id: orderId,
                budget_data: budgetData,
                status: 'pending_review',
                version: 1,
                created_at: new Date().toISOString()
            }])
            .select()
            .single()

        if (insertError) throw insertError

        // 5. Update order estimated price
        await supabase
            .from('catering_orders')
            .update({ estimated_price: totalTTC })
            .eq('id', orderId)

        return NextResponse.json({ success: true, budgetId: budget.id })

    } catch (error: any) {
        console.error('Error generating budget from order:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
