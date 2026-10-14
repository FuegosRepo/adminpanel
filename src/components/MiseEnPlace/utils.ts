import { startOfWeek, endOfWeek, format, isWithinInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import type { CateringOrder } from '@/types'
import type { BudgetMenuSection } from '@/lib/types/budget'
import type { MiseEventInput, MisePlan, WeeklyTotal } from './types'

export function getWeekRange(anchor: Date): { start: Date; end: Date } {
    return {
        start: startOfWeek(anchor, { weekStartsOn: 1 }),
        end: endOfWeek(anchor, { weekStartsOn: 1 }),
    }
}

/** "Semana del 20 al 26 de julio 2026" / "Semana del 29 de junio al 5 de julio 2026". */
export function weekLabel(start: Date, end: Date): string {
    const sameMonth = start.getMonth() === end.getMonth()
    const month = (d: Date) => format(d, 'MMMM', { locale: es })
    if (sameMonth) {
        return `Semana del ${format(start, 'd')} al ${format(end, 'd')} de ${month(end)} ${format(end, 'yyyy')}`
    }
    return `Semana del ${format(start, 'd')} de ${month(start)} al ${format(end, 'd')} de ${month(end)} ${format(end, 'yyyy')}`
}

export function parseEventDate(order: CateringOrder): Date | null {
    const raw = order.contact.eventDate
    if (!raw) return null
    // Las fechas vienen como 'yyyy-mm-dd' o ISO; interpretarlas a mediodía
    // local evita que un desfase de zona horaria mueva el evento de día.
    const d = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T12:00:00`) : new Date(raw)
    return Number.isNaN(d.getTime()) ? null : d
}

export function ordersInWeek(orders: CateringOrder[], start: Date, end: Date): CateringOrder[] {
    return orders
        .filter((o) => {
            const d = parseEventDate(o)
            return d ? isWithinInterval(d, { start, end }) : false
        })
        .sort((a, b) => {
            const da = parseEventDate(a)!.getTime()
            const db = parseEventDate(b)!.getTime()
            if (da !== db) return da - db
            // Mismo día: almuerzo antes que cena (regla 18 del manual de compras).
            const ma = a.menu.type === 'dejeuner' ? 0 : a.menu.type === 'diner' ? 1 : 2
            const mb = b.menu.type === 'dejeuner' ? 0 : b.menu.type === 'diner' ? 1 : 2
            return ma - mb
        })
}

export function momentFor(order: CateringOrder): string {
    if (order.menu.type === 'dejeuner') return 'Almuerzo'
    if (order.menu.type === 'diner') return 'Cena'
    return 'Horario a definir'
}

export function dayLabel(date: Date): string {
    const raw = format(date, 'EEEE d', { locale: es })
    return raw.charAt(0).toUpperCase() + raw.slice(1)
}

/**
 * El menú real (lo que el admin terminó aprobando en el devis) vive en
 * budgets.budget_data.menu, no en catering_orders.entrees/viandes/dessert
 * — esos campos son lo que el cliente tildó en el formulario de la web y
 * suelen quedar vacíos o desactualizados. Si hay presupuesto, se usa ese;
 * si no, se cae a los campos del pedido como antes.
 */
export function toEventInput(order: CateringOrder, menu?: BudgetMenuSection): MiseEventInput {
    const date = parseEventDate(order)
    return {
        orderId: order.id,
        client: order.contact.name || 'Sin nombre',
        date: date ? format(date, 'yyyy-MM-dd') : '',
        dayLabel: date ? dayLabel(date) : 'Sin fecha',
        moment: momentFor(order),
        time: order.contact.eventTime || undefined,
        place: order.contact.address || '',
        guests: order.contact.guestCount || 0,
        eventType: order.contact.eventType || '',
        entrees: menu?.entrees?.map((i) => i.name) ?? order.entrees ?? [],
        viandes: menu?.viandes?.map((i) => i.name) ?? order.viandes ?? [],
        dessert: menu?.dessert?.name ?? order.dessert,
        equipment: order.extras?.equipment || [],
        specialRequest: order.extras?.specialRequest || undefined,
    }
}

function normalizeLabel(label: string): string {
    return label.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Totales de la semana calculados por código (no por la IA): agrupa por
 * tarea + unidad y suma. Convierte gr → kg cuando la misma tarea aparece
 * en las dos unidades, para no tener "Papas 12 kg" y "Papas 500 gr" separados.
 */
export function computeWeeklyTotals(plan: MisePlan, inputs: MiseEventInput[]): WeeklyTotal[] {
    const clientById = new Map(inputs.map((i) => [i.orderId, i.client]))
    const groups = new Map<string, WeeklyTotal & { order: number }>()
    let order = 0

    plan.events.forEach((ev) => {
        const client = clientById.get(ev.orderId) || ev.orderId
        const tasks = [...ev.tasks, ...ev.specificMaterial]
        tasks.forEach((t) => {
            if (t.quantity === null || !t.unit) return
            let qty = t.quantity
            let unit = t.unit.toLowerCase()
            if (unit === 'gr' || unit === 'g') {
                qty = qty / 1000
                unit = 'kg'
            }
            const key = `${normalizeLabel(t.label)}|${unit}`
            const existing = groups.get(key)
            if (existing) {
                existing.total += qty
                existing.breakdown.push({ client, quantity: qty })
            } else {
                groups.set(key, { key, label: t.label.trim(), unit, total: qty, breakdown: [{ client, quantity: qty }], order: order++ })
            }
        })
    })

    return [...groups.values()]
        .sort((a, b) => a.order - b.order)
        .map((g) => ({
            key: g.key,
            label: g.label,
            unit: g.unit,
            total: Math.round(g.total * 100) / 100,
            breakdown: g.breakdown,
        }))
}

export function formatQty(quantity: number | null, unit: string | null): string {
    if (quantity === null) return '—'
    const n = Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(2).replace(/\.?0+$/, '')
    return unit ? `${n.replace('.', ',')} ${unit}` : n.replace('.', ',')
}
