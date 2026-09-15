'use client'

import { MapPin, Users, HelpCircle, UserPlus, EyeOff, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StaffBadge } from './StaffDialogs'
import { formatQty } from '../utils'
import type { MiseEventInput, MiseEventPlan, MiseTask, StaffMember } from '../types'

interface EventSheetProps {
    input: MiseEventInput
    plan: MiseEventPlan | null
    excluded: boolean
    staff: StaffMember[]
    checked: Set<string>
    onToggleTask: (taskId: string) => void
    onToggleExcluded: () => void
    onAssignStaff: () => void
}

function TaskRow({ task, checked, onToggle }: { task: MiseTask; checked: boolean; onToggle: () => void }) {
    return (
        <label className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2 border-b last:border-b-0 cursor-pointer hover:bg-accent/50 ${checked ? 'opacity-60' : ''}`}>
            <Checkbox checked={checked} onCheckedChange={onToggle} />
            <div className="min-w-0">
                <p className={`text-sm ${checked ? 'line-through' : ''}`}>{task.label}</p>
                {task.note && <p className="text-xs text-muted-foreground">{task.note}</p>}
            </div>
            <span className={`text-sm font-mono tabular-nums shrink-0 ${task.toConfirm ? 'text-amber-700' : ''}`}>
                {task.toConfirm ? 'A confirmar' : formatQty(task.quantity, task.unit)}
            </span>
        </label>
    )
}

/**
 * Ficha de un evento: mismo contenido que las fichas de los PDF del
 * cliente (día, cliente, personas, momento, lugar, tareas con casilla,
 * material estándar y específico), más el equipo asignado.
 */
export function EventSheet({ input, plan, excluded, staff, checked, onToggleTask, onToggleExcluded, onAssignStaff }: EventSheetProps) {
    const menu = [...input.entrees, ...input.viandes, input.dessert].filter(Boolean).join(', ')

    return (
        <Card className={excluded ? 'opacity-50' : ''}>
            <CardHeader className="pb-2 space-y-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                        <p className="text-xs font-medium text-primary uppercase tracking-wide">{input.dayLabel}</p>
                        <h3 className="text-base font-semibold leading-tight">
                            {input.client}
                            <span className="font-normal text-muted-foreground"> · {input.guests} personas · {input.moment}{input.time ? ` ${input.time}` : ''}</span>
                        </h3>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={onAssignStaff} disabled={excluded}>
                            <UserPlus className="h-3.5 w-3.5" />
                            Equipo
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-muted-foreground"
                            onClick={onToggleExcluded}
                            title={excluded ? 'Volver a incluir en la semana' : 'Sacar de la mise en place de esta semana'}
                        >
                            {excluded ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            {excluded ? 'Incluir' : 'Excluir'}
                        </Button>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                    {input.place && (
                        <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {input.place}</p>
                    )}
                    {menu && <p>Menú: {menu}</p>}
                    {input.eventType && <p>Tipo: {input.eventType}</p>}
                </div>
                {staff.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {staff.map((m) => <StaffBadge key={m.id} member={m} />)}
                    </div>
                )}
            </CardHeader>

            {!excluded && (
                <CardContent className="pt-0">
                    {!plan ? (
                        <p className="text-sm text-muted-foreground border rounded-md px-3 py-3">
                            Todavía no se generó la mise en place de esta semana.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            <div className="border rounded-md overflow-hidden">
                                <div className="grid grid-cols-[auto_1fr_auto] gap-3 px-3 py-1.5 bg-muted text-xs font-medium text-muted-foreground">
                                    <span className="w-4">✓</span>
                                    <span>Tarea</span>
                                    <span>Cantidad</span>
                                </div>
                                {plan.tasks.map((t) => (
                                    <TaskRow key={t.id} task={t} checked={checked.has(t.id)} onToggle={() => onToggleTask(t.id)} />
                                ))}
                                {plan.standardMaterial.map((m, i) => {
                                    const id = `${input.orderId}-std-${i}`
                                    return (
                                        <TaskRow
                                            key={id}
                                            task={{ id, label: m, quantity: 1, unit: 'un.' }}
                                            checked={checked.has(id)}
                                            onToggle={() => onToggleTask(id)}
                                        />
                                    )
                                })}
                                {plan.specificMaterial.map((t) => (
                                    <TaskRow key={t.id} task={{ ...t, label: `Material: ${t.label}` }} checked={checked.has(t.id)} onToggle={() => onToggleTask(t.id)} />
                                ))}
                            </div>

                            {plan.pendingQuestions.length > 0 && (
                                <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 space-y-1">
                                    <p className="font-medium flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" /> A confirmar con el cliente</p>
                                    <ul className="list-disc pl-4 space-y-0.5">
                                        {plan.pendingQuestions.map((q, i) => <li key={i}>{q}</li>)}
                                    </ul>
                                </div>
                            )}

                            {input.specialRequest && (
                                <p className="text-xs text-muted-foreground">
                                    <Badge variant="outline" className="mr-1.5 text-[10px]">Solicitud especial</Badge>
                                    {input.specialRequest}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    )
}
