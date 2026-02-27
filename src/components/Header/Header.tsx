'use client'

import { useState, useEffect } from 'react'
import { useOrderStats } from '@/hooks/useOrderStats'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, CheckCircle2, TrendingUp } from 'lucide-react'

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { data: stats, isLoading } = useOrderStats()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isLoading || !stats) {
    return (
      <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b lg:h-[111px]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 gap-4 h-full">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex flex-col justify-center min-w-0 h-full lg:h-[78px]">
              <h1 className="text-2xl font-bold tracking-tight truncate">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground truncate">Cargando estadísticas...</p>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header id="main-header" className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b lg:h-[111px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 gap-4 max-w-full h-full">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Panel de Administración</h1>
            <p className="text-sm text-muted-foreground truncate">Gestión de pedidos de catering</p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 snap-x hide-scrollbar items-center">
          <Card className="w-[140px] sm:w-[160px] shrink-0 snap-start">
            <CardContent className="p-3 sm:p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                <span className="text-[10px] sm:text-xs font-medium uppercase truncate">Pendientes</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{stats.pendingCount}</div>
            </CardContent>
          </Card>

          <Card className="w-[140px] sm:w-[160px] shrink-0 snap-start">
            <CardContent className="p-3 sm:p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <span className="text-[10px] sm:text-xs font-medium uppercase truncate">Aprobados</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold">{stats.approvedCount}</div>
            </CardContent>
          </Card>

          <Card className="w-[160px] sm:w-[180px] shrink-0 snap-start">
            <CardContent className="p-3 sm:p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-[10px] sm:text-xs font-medium uppercase truncate">Ingresos Totales</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold truncate">
                €{mounted ? stats.totalRevenue.toLocaleString('es-ES') : stats.totalRevenue}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </header>
  )
}