'use client'

import { useState, useEffect } from 'react'
import { Settings2, Save, Info, FileText, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { SHOPPING_LIST_PROMPT_SEED } from './promptSeed'
import { CALCULATION_MANUAL_SEED } from './calculationManualSeed'
import { getStoredPrompt, getStoredManual, savePrompt } from './promptStorage'

/**
 * Pantalla donde se edita el prompt + manual que usa de verdad el chat
 * de Asistentes (ver /api/ai/shopping-list). Dos pestañas, igual que
 * ChatGPT: "Instructions" (el prompt) y "Knowledge" (el manual).
 *
 * Persistencia: localStorage de este navegador, no la base de datos
 * (ver promptStorage.ts). Guardar acá SÍ cambia lo que el chat usa en
 * la próxima llamada real a OpenAI.
 */
export function PromptEditorDialog() {
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState(SHOPPING_LIST_PROMPT_SEED)
    const [manual, setManual] = useState(CALCULATION_MANUAL_SEED)

    // Cargar lo guardado recién al abrir (localStorage no existe en el
    // servidor, así que no se puede leer en el useState inicial).
    useEffect(() => {
        if (open) {
            setPrompt(getStoredPrompt())
            setManual(getStoredManual())
        }
    }, [open])

    const handleSave = () => {
        const ok = savePrompt(prompt, manual)
        if (ok) {
            toast.success('Guardado. El chat va a usar este prompt y este manual en el próximo mensaje.')
        } else {
            toast.error('No se pudo guardar en este navegador (almacenamiento local no disponible).')
        }
        setOpen(false)
    }

    const handleRestoreDefaults = () => {
        setPrompt(SHOPPING_LIST_PROMPT_SEED)
        setManual(CALCULATION_MANUAL_SEED)
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

                <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 text-blue-900 px-3 py-2 text-xs">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <p>
                        Guardar acá sí cambia lo que usa el chat real, pero queda guardado solo en
                        este navegador (no en la base de datos todavía). Si abrís el panel desde
                        otra computadora vas a ver el original de nuevo.
                    </p>
                </div>

                <Tabs defaultValue="prompt">
                    <TabsList>
                        <TabsTrigger value="prompt" className="gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            Prompt
                        </TabsTrigger>
                        <TabsTrigger value="manual" className="gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            Manual de cálculos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="prompt">
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="min-h-[360px] font-mono text-xs"
                        />
                    </TabsContent>

                    <TabsContent value="manual">
                        <p className="text-xs text-muted-foreground mb-2">
                            Este es el archivo que hoy tenés cargado como &quot;Knowledge&quot; en tu
                            GPT de ChatGPT. El prompt de arriba lo referencia en la regla de prioridad.
                        </p>
                        <Textarea
                            value={manual}
                            onChange={(e) => setManual(e.target.value)}
                            className="min-h-[360px] font-mono text-xs"
                        />
                    </TabsContent>
                </Tabs>

                <DialogFooter className="sm:justify-between">
                    <Button variant="ghost" size="sm" onClick={handleRestoreDefaults}>
                        Restaurar el original
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button size="sm" className="gap-1.5" onClick={handleSave}>
                            <Save className="h-3.5 w-3.5" />
                            Guardar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
