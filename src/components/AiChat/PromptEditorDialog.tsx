'use client'

import { useState } from 'react'
import { Settings2, Save, AlertTriangle, FileText, BookOpen } from 'lucide-react'
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

/**
 * Pantalla donde el cliente podría editar él mismo las reglas de cálculo
 * de la lista de compras, sin depender de pedirle el cambio al developer
 * cada vez. Dos pestañas, igual que en ChatGPT: "Instructions" (el prompt)
 * y "Knowledge" (el manual de cálculos). Ambas precargadas con los
 * archivos reales que el cliente ya usa (pasados el 2026-09-14).
 *
 * Vista previa de diseño: "Guardar" no persiste nada todavía, y este
 * texto no está conectado a ningún modelo de IA real.
 */
export function PromptEditorDialog() {
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState(SHOPPING_LIST_PROMPT_SEED)
    const [manual, setManual] = useState(CALCULATION_MANUAL_SEED)

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
                        Vista previa de diseño: las dos pestañas son el mismo prompt y el mismo
                        manual que ya usás en tu GPT de ChatGPT hoy, precargados acá tal cual.
                        Editar y guardar todavía no hace nada real, ni se conecta a tu ChatGPT ni
                        a un modelo de IA en esta pantalla.
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
