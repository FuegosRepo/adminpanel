import React from 'react'
import { BarChart3, Users, Calculator, TrendingUp, Euro } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEventCalculator } from '../../context/EventCalculatorContext'

type StatCardDef = {
    key: string
    label: string
    icon: React.ElementType
    gradient: string
    format?: string
}

const statCards: StatCardDef[] = [
    { key: 'totalEvents', label: 'Total de Eventos', icon: BarChart3, gradient: 'from-blue-500 to-indigo-600' },
    { key: 'totalGuests', label: 'Total de Invitados', icon: Users, gradient: 'from-emerald-500 to-green-600' },
    { key: 'totalCost', label: 'Costo Total', icon: Euro, format: 'currency', gradient: 'from-amber-500 to-orange-600' },
    { key: 'avgCostPerGuest', label: 'Costo Promedio / Invitado', icon: TrendingUp, format: 'currency', gradient: 'from-rose-500 to-red-600' },
    { key: 'avgCostPerEvent', label: 'Costo Promedio / Evento', icon: Calculator, format: 'currency', gradient: 'from-purple-500 to-violet-600' },
]

export const EventStatsView = () => {
    const { globalStats } = useEventCalculator()

    const getValue = (key: string, format?: string) => {
        const val = globalStats[key as keyof typeof globalStats]
        if (format === 'currency') return `€${(val as number).toFixed(2)}`
        return val
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Estadísticas y Métricas
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {statCards.map(({ key, label, icon: Icon, format, gradient }) => (
                        <div
                            key={key}
                            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-4 text-white shadow-lg transition-transform hover:-translate-y-1`}
                        >
                            <Icon className="absolute top-3 right-3 h-8 w-8 opacity-20" />
                            <p className="text-xs font-medium opacity-90 mb-2">{label}</p>
                            <p className="text-2xl font-bold">{getValue(key, format)}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
