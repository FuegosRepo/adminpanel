'use client'

import { AlertTriangle, ClipboardList } from 'lucide-react'
import { MiseEnPlaceManager } from '@/components/MiseEnPlace/MiseEnPlaceManager'

/**
 * Organización semanal / mise en place (asistente 2, distinto del de
 * compras). Fuera del sidebar: a futuro es la pestaña "Organización
 * semanal" de la Fase 2 del plan.
 */
export default function OrganizacionPreviewPage() {
    return (
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                    <p className="font-medium">Conectado a OpenAI de verdad — el equipo y las casillas quedan solo en este navegador</p>
                    <p className="text-amber-800/90">
                        Los eventos son los pedidos aprobados reales de la semana elegida. La IA
                        devuelve las tareas con cantidades y el panel suma los totales por su
                        cuenta. Los colaboradores, sus asignaciones y las casillas tildadas se
                        guardan en este navegador, no en la base de datos.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">Organización semanal · Mise en place</h1>
            </div>

            <MiseEnPlaceManager />
        </div>
    )
}
