'use client'

import { useState } from 'react'
import { Settings2, Save, AlertTriangle, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { SHOPPING_LIST_PROMPT_SEED } from './promptSeed'

/**
 * Pantalla donde el cliente podría editar él mismo las reglas de cálculo
 * de la lista de compras, sin depender de pedirle el cambio al developer
 * cada vez. Precargada con el prompt real que ya usa en su GPT de
 * ChatGPT (pasado el 2026-09-14).
 *
 * Vista previa de diseño: "Guardar" no persiste nada todavía, y este
 * texto no está conectado a ningún modelo de IA real.
 */
export function PromptEditorDialog() {
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState(SHOPPING_LIST_PROMPT_SEED)

    const handleSave = () => {
        toast.info('Vista previa de diseño: en la versión conectada esto se guardaría y usaría en el próximo cálculo.')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
                <Settings2 className="h-3.5 w-3.5" />
                Editar prompt del asistente
            </Button>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Reglas de cálculo del asistente de compras
                    </DialogTitle>
                    <DialogDescription>
                        Esto reemplaza tener que pedirle el cambio a soporte: acá editás vos mismo
                        las reglas (gramos por persona, redondeos, prioridades), y el asistente las
                        usa la próxima vez que armes una lista de compras.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 text-amber-900 px-3 py-2 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <p>
                        Vista previa de diseño: este texto es el mismo que ya usás en tu GPT de
                        ChatGPT hoy, precargado acá como punto de partida. Editar y guardar
                        todavía no hace nada real — ni se conecta a tu ChatGPT ni a un modelo de
                        IA en esta pantalla. Pendiente: sumar el &quot;Manual de cálculos&quot; que
                        hoy tenés cargado como Knowledge en ChatGPT, en cuanto lo compartas.
                    </p>
                </div>

                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[360px] font-mono text-xs"
                />

                <DialogFooter>
                    <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button size="sm" className="gap-1.5" onClick={handleSave}>
                        <Save className="h-3.5 w-3.5" />
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
