import { toast } from 'sonner'
import { AlertTriangle, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MigrationBannerProps {
  saving: boolean
  createLinkedOrder: (data: any) => Promise<{ success: boolean }>
  editedData: any
}

export function MigrationBanner({ saving, createLinkedOrder, editedData }: MigrationBannerProps) {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-amber-500">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 shrink-0" />
        <div>
          <strong className="block text-amber-600">Presupuesto sin pedido vinculado</strong>
          <p className="m-0 text-sm opacity-80 text-amber-600/80">
            Este presupuesto no aparece en la lista de Pedidos. Migralo para corregirlo.
          </p>
        </div>
      </div>
      <Button
        onClick={async () => {
          const toastId = toast.loading('Creando pedido vinculado...')
          const result = await createLinkedOrder(editedData)
          if (result.success) {
            toast.success('✅ Pedido creado y vinculado correctamente', { id: toastId })
          } else {
            toast.error('❌ Error al migrar presupuesto', { id: toastId })
          }
        }}
        disabled={saving}
        className="bg-amber-500 hover:bg-amber-600 text-black shrink-0"
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        {saving ? 'Migrando...' : 'Vincular a nuevo Pedido'}
      </Button>
    </div>
  )
}
