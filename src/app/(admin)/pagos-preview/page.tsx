'use client'

import { AlertTriangle, CreditCard } from 'lucide-react'
import { PaymentsManager } from '@/components/Payments/PaymentsManager'

/**
 * Pantalla de cobros con Stripe (ver plan, "FASE PAGOS — Stripe"). Ya
 * conectada a las rutas reales (create-checkout, webhook, record). Fuera
 * del sidebar principal solo hasta terminar de probarla; cuando esté
 * lista reemplaza a /payments (PaymentTracker).
 */
export default function PagosPreviewPage() {
    return (
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                    <p className="font-medium">Stripe conectado en modo test — revisar antes de usar en un pedido real</p>
                    <p className="text-amber-800/90">
                        Los pedidos son reales (aprobados). Los cobros manuales se guardan de
                        verdad en el pedido. Los links de Stripe se generan de verdad (modo test,
                        no mueve plata real) y mandan un email real desde el dominio verificado.
                        Cuando el cliente paga, el webhook registra el cobro y manda un recibo por
                        email al cliente y un aviso al admin. Todavía falta: pasar a claves live
                        para cobrar de verdad, y adjuntar el PDF del presupuesto al email del link.
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
