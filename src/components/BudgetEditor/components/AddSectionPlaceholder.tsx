import { Button } from '@/components/ui/button'

interface AddSectionPlaceholderProps {
  label: string
  buttonText: string
  onAdd: () => void
}

export function AddSectionPlaceholder({ label, buttonText, onAdd }: AddSectionPlaceholderProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">No hay {label} configurado</p>
      <Button onClick={onAdd}>{buttonText}</Button>
    </div>
  )
}
