import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
    try {
        // ✅ Use authenticated server client
        const supabase = await createClient()

        // ✅ Verify user session
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'No autorizado. Por favor inicie sesión.' },
                { status: 401 }
            )
        }

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

        // El descuento automático del 10% para déjeuner se sacó (pedido del
        // cliente, 2026-11-04) — ya no se aplica solo por ser almuerzo.
        const discount = null
        const menuHTApresRemise = menuTotalHT

        // TVA se calcula sobre el HT DESPUÉS del descuento
        const menuTVA = menuHTApresRemise * 0.1
        const menuTotalTTC = menuHTApresRemise + menuTVA

        // Extras / Material
        let material = null
        const equipment = order.extras?.equipment || []
        if (equipment.length > 0) {
            const costPerPersonPerItem = 5
            // Mesas y manteles se arman por mesa (1 cada 10 personas), no por
            // persona como el resto del material — antes salían con la misma
            // cantidad que cubiertos y platos, lo cual estaba mal.
            const isPerTableItem = (name: string) => /mesa|mantel|table|nappe/i.test(name)
            const materialItems = equipment.map((name: string) => {
                const quantity = isPerTableItem(name) ? Math.ceil(guestCount / 10) : guestCount
                return {
                    name: name,
                    quantity,
                    pricePerUnit: costPerPersonPerItem,
                    total: costPerPersonPerItem * quantity
                }
            })

            const materialHT = materialItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0)
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

        // Totales globales usan el HT avec remise del menú
        const totalHT = menuHTApresRemise + (material?.totalHT || 0)
        const totalTVA = menuTVA + (material?.tva || 0)
        const totalTTC = menuTotalTTC + (material?.totalTTC || 0)

        const budgetData = {
            generatedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            clientInfo: {
                name: order.name,
                email: order.email,
                phone: order.phone,
                eventDate: order.event_date ? order.event_date.split('T')[0] : order.event_date,
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
                totalHTApresRemise: menuHTApresRemise,  // ✅ Nuevo campo
                tva: menuTVA,
                tvaPct: 10,
                totalTTC: menuTotalTTC,
                discount: discount,
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
                totalTTC
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

    } catch (error) {
        console.error('Error generating budget from order:', error)
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
    }
}
