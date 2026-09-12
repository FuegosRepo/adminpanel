'use client'

import { AlertTriangle, Mail } from 'lucide-react'
import { EmailTemplatesPreview } from '@/components/EmailTemplates/EmailTemplatesPreview'

/**
 * Vista previa de diseño de la pestaña "Plantillas" (Fase 1.5 del plan).
 *
 * No está en el sidebar a propósito: es solo para revisar la interfaz.
 * Los datos son las 5 plantillas de mockData.ts en memoria — nada se lee
 * ni se escribe en la tabla real `email_templates`, y "Guardar" no
 * persiste nada.
 */
export default function TemplatesPreviewPage() {
    return (
        <div className="w-full max-w-[1100px] mx-auto p-4 md:p-6 space-y-4">
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                    <p className="font-medium">Vista previa de diseño — sin persistencia real</p>
                    <p className="text-amber-800/90">
                        Esta pantalla no está en el menú. Las plantillas son las mismas 5 que
                        hoy están hardcodeadas para el envío de emails, cargadas en memoria acá.
                        Editar y guardar no toca la base de datos todavía.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">Plantillas</h1>
            </div>

            <EmailTemplatesPreview />
        </div>
    )
}
