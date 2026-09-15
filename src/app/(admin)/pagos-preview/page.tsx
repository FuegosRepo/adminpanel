'use client'

import { AlertTriangle, CreditCard } from 'lucide-react'
import { PaymentsManager } from '@/components/Payments/PaymentsManager'

/**
 * Vista previa de diseño de la pantalla de cobros con Stripe (ver plan,
 * "FASE PAGOS — Stripe"). Fuera del sidebar a propósito: cuando Stripe
 * esté conectado y exista la tabla `payments`, esta pantalla reemplaza a
 * /payments (PaymentTracker).
 */
export default function PagosPreviewPage() {
    return (
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                    <p className="font-medium">Vista previa de diseño — Stripe no conectado, nada se guarda</p>
                    <p className="text-amber-800/90">
                        Los pedidos son reales (aprobados). Los links de Stripe que ves en los
                        historiales son de ejemplo, y los cobros que registres acá quedan solo en
                        esta pantalla hasta que se cierre y no tocan la base de datos. Sirve para
                        validar el flujo: adelanto del 30% editable, saldo, y cobros manuales en el
                        mismo historial.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">Cobros</h1>
            </div>

            <PaymentsManager />
        </div>
    )
}
