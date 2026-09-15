'use client'

import { useEffect, useState } from 'react'
import { Settings2, Save, Info, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { OPS_PROMPT_SEED } from '../opsPromptSeed'
import { getOpsPrompt, saveOpsPrompt } from '../storage'

/** Edición del prompt de operaciones. Mismo mecanismo que el de compras, con su propia clave. */
export function OpsPromptDialog() {
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState(OPS_PROMPT_SEED)

    useEffect(() => {
        if (open) setPrompt(getOpsPrompt())
    }, [open])

    const handleSave = () => {
        if (saveOpsPrompt(prompt)) toast.success('Guardado. La próxima generación usa este prompt.')
        else toast.error('No se pudo guardar en este navegador.')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
                <Settings2 className="h-3.5 w-3.5" />
                Editar prompt
            </Button>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Reglas del asistente de operaciones
                    </DialogTitle>
                    <DialogDescription>
                        Gramos por persona, entradas, material estándar, ajustes por público. Es el prompt que ya usás en ChatGPT, editable acá.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 text-blue-900 px-3 py-2 text-xs">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <p>Queda guardado en este navegador. El formato de salida (JSON con tareas y cantidades) lo agrega el panel por su cuenta, no hace falta escribirlo acá.</p>
                </div>
                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[380px] font-mono text-xs" />
                <DialogFooter className="sm:justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setPrompt(OPS_PROMPT_SEED)}>Restaurar el original</Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button size="sm" className="gap-1.5" onClick={handleSave}><Save className="h-3.5 w-3.5" /> Guardar</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
