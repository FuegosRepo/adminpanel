'use client'

import { useState } from 'react'
import { Users, Plus, Trash2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { STAFF_ROLE_LABEL, type StaffMember, type StaffRole } from '../types'

const ROLE_BADGE: Record<StaffRole, string> = {
    cocina: 'bg-orange-100 text-orange-800',
    servicio: 'bg-blue-100 text-blue-800',
    logistica: 'bg-slate-200 text-slate-800',
}

export function StaffBadge({ member }: { member: StaffMember }) {
    return (
        <Badge variant="outline" className={`gap-1 font-normal ${ROLE_BADGE[member.role]}`}>
            {member.name}
            <span className="opacity-70">· {STAFF_ROLE_LABEL[member.role]}</span>
        </Badge>
    )
}

/** Alta/baja de colaboradores (lista compartida entre semanas). */
export function ManageStaffDialog({ staff, onChange }: { staff: StaffMember[]; onChange: (staff: StaffMember[]) => void }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [role, setRole] = useState<StaffRole>('cocina')

    const add = () => {
        const trimmed = name.trim()
        if (!trimmed) return
        onChange([...staff, { id: `s-${Date.now()}`, name: trimmed, role }])
        setName('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
                <Users className="h-3.5 w-3.5" />
                Equipo ({staff.length})
            </Button>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Colaboradores
                    </DialogTitle>
                    <DialogDescription>
                        La lista de gente que puede trabajar en los eventos. Después se asigna por evento.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && add()}
                        placeholder="Nombre"
                        className="flex-1"
                    />
                    <Select value={role} onValueChange={(v) => setRole(v as StaffRole)}>
                        <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {(Object.keys(STAFF_ROLE_LABEL) as StaffRole[]).map((r) => (
                                <SelectItem key={r} value={r}>{STAFF_ROLE_LABEL[r]}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button size="icon" onClick={add} disabled={!name.trim()} aria-label="Agregar">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {staff.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">Todavía no cargaste a nadie.</p>
                ) : (
                    <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                        {staff.map((m) => (
                            <div key={m.id} className="flex items-center justify-between gap-2 text-sm border rounded-md px-3 py-1.5">
                                <StaffBadge member={m} />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground"
                                    onClick={() => onChange(staff.filter((s) => s.id !== m.id))}
                                    aria-label={`Quitar a ${m.name}`}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter>
                    <Button size="sm" onClick={() => setOpen(false)}>Listo</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface AssignStaffDialogProps {
    open: boolean
    eventLabel: string
    staff: StaffMember[]
    selectedIds: string[]
    onClose: () => void
    onSave: (ids: string[]) => void
}

/** Quién trabaja en un evento puntual. */
export function AssignStaffDialog({ open, eventLabel, staff, selectedIds, onClose, onSave }: AssignStaffDialogProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds))

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-primary" />
                        Equipo para {eventLabel}
                    </DialogTitle>
                    <DialogDescription>Marcá quién trabaja en este evento.</DialogDescription>
                </DialogHeader>

                {staff.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                        Primero cargá colaboradores con el botón &quot;Equipo&quot;.
                    </p>
                ) : (
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                        {staff.map((m) => (
                            <label key={m.id} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent cursor-pointer">
                                <Checkbox checked={selected.has(m.id)} onCheckedChange={() => toggle(m.id)} />
                                <StaffBadge member={m} />
                            </label>
                        ))}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
                    <Button size="sm" onClick={() => onSave([...selected])}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
