'use client'

import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface WeekSelectorProps {
    label: string
    eventsCount: number
    onPrev: () => void
    onNext: () => void
    onToday: () => void
}

export function WeekSelector({ label, eventsCount, onPrev, onNext, onToday }: WeekSelectorProps) {
    return (
        <div className="bg-card border rounded-lg p-3 flex flex-wrap items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={onPrev} aria-label="Semana anterior">
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 px-1">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{label}</span>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={onNext} aria-label="Semana siguiente">
                <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onToday}>Esta semana</Button>
            <Badge variant="secondary" className="ml-auto">
                {eventsCount} evento{eventsCount !== 1 ? 's' : ''} aprobado{eventsCount !== 1 ? 's' : ''}
            </Badge>
        </div>
    )
}
