import { AlertCircle, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WarningBoxProps {
    message: string
    onRepair: () => void
    isSaving: boolean
}

/**
 * Componente que muestra una advertencia cuando hay items no encontrados
 * en el evento y permite repararlos.
 */
export const WarningBox = ({ message, onRepair, isSaving }: WarningBoxProps) => {
    return (
        <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
            <p className="flex-1 text-xs leading-relaxed">{message}</p>
            <Button
                variant="outline"
                size="sm"
                onClick={onRepair}
                disabled={isSaving}
                className="shrink-0 text-xs h-7 border-amber-300 text-amber-700 hover:bg-amber-100"
            >
                <Wrench className="h-3.5 w-3.5" />
                {isSaving ? 'Reparando...' : 'Reparar'}
            </Button>
        </div>
    )
}
