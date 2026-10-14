'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { addWeeks, subWeeks } from 'date-fns'
import { Sparkles, FileDown, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useApprovedOrders } from '@/hooks/useApprovedOrders'
import { fetchLatestBudgetMenus } from '@/services/budgetsService'
import { logUsage } from '@/components/AiChat/usageStorage'
import { UsageSummary } from '@/components/AiChat/UsageSummary'
import { WeekSelector } from './components/WeekSelector'
import { EventSheet } from './components/EventSheet'
import { WeeklyTotals } from './components/WeeklyTotals'
import { OpsPromptDialog } from './components/OpsPromptDialog'
import { ManageStaffDialog, AssignStaffDialog } from './components/StaffDialogs'
import { getWeekRange, weekLabel, ordersInWeek, toEventInput, computeWeeklyTotals } from './utils'
import { getOpsPrompt, getStaff, saveStaff, getAssignments, saveAssignments } from './storage'
import { exportMiseEnPlacePdf } from './pdfExport'
import type { MisePlan, StaffMember } from './types'

/**
 * Organización semanal: elegís la semana, entran solos los pedidos
 * aprobados con fecha en ese rango, la IA devuelve las tareas en JSON, el
 * panel arma las fichas (con casillas), suma los totales por código, y
 * exporta el PDF con el formato que el cliente ya usa.
 */
export function MiseEnPlaceManager() {
    const { orders, loading: loadingOrders } = useApprovedOrders()

    const [anchor, setAnchor] = useState(() => new Date())
    const [excluded, setExcluded] = useState<Set<string>>(new Set())
    const [instructions, setInstructions] = useState('')
    const [plan, setPlan] = useState<MisePlan | null>(null)
    const [appliedInstructions, setAppliedInstructions] = useState('')
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [checked, setChecked] = useState<Set<string>>(new Set())
    const [totalOverrides, setTotalOverrides] = useState<Record<string, number>>({})
    const [staff, setStaff] = useState<StaffMember[]>([])
    const [assignments, setAssignments] = useState<Record<string, string[]>>({})
    const [assignFor, setAssignFor] = useState<string | null>(null)
    const [usageVersion, setUsageVersion] = useState(0)

    // localStorage solo existe en el navegador: cargar después de montar.
    useEffect(() => {
        setStaff(getStaff())
        setAssignments(getAssignments())
    }, [])

    const { start, end } = useMemo(() => getWeekRange(anchor), [anchor])
    const label = useMemo(() => weekLabel(start, end), [start, end])
    const weekOrders = useMemo(() => ordersInWeek(orders, start, end), [orders, start, end])

    const weekOrderIds = useMemo(() => weekOrders.map((o) => o.id), [weekOrders])
    const { data: budgetMenus = {} } = useQuery({
        queryKey: ['budgetMenus', weekOrderIds],
        queryFn: () => fetchLatestBudgetMenus(weekOrderIds),
        enabled: weekOrderIds.length > 0,
    })

    const inputs = useMemo(
        () => weekOrders.map((o) => toEventInput(o, budgetMenus[o.id])),
        [weekOrders, budgetMenus]
    )
    const includedInputs = useMemo(() => inputs.filter((i) => !excluded.has(i.orderId)), [inputs, excluded])
    const totals = useMemo(() => (plan ? computeWeeklyTotals(plan, includedInputs) : []), [plan, includedInputs])

    const staffByOrder = useMemo(() => {
        const byId = new Map(staff.map((s) => [s.id, s]))
        const out: Record<string, StaffMember[]> = {}
        Object.entries(assignments).forEach(([orderId, ids]) => {
            out[orderId] = ids.map((id) => byId.get(id)).filter((s): s is StaffMember => !!s)
        })
        return out
    }, [staff, assignments])

    const changeWeek = (next: Date) => {
        setAnchor(next)
        setPlan(null)
        setChecked(new Set())
        setTotalOverrides({})
        setExcluded(new Set())
        setError(null)
    }

    const handleOverride = (key: string, value: number | null) => {
        setTotalOverrides((prev) => {
            const next = { ...prev }
            if (value === null) delete next[key]
            else next[key] = value
            return next
        })
    }

    const handleGenerate = async () => {
        if (includedInputs.length === 0) return
        setGenerating(true)
        setError(null)
        try {
            const response = await fetch('/api/ai/mise-en-place', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    events: includedInputs,
                    weekLabel: label,
                    instructions,
                    customPrompt: getOpsPrompt(),
                }),
            })
            const data = await response.json()
            if (!response.ok) {
                setError(`${data.error || 'Error al generar'}${data.details ? `: ${data.details}` : ''}`)
                return
            }
            setPlan(data.plan as MisePlan)
            setAppliedInstructions(instructions.trim())
            setChecked(new Set())
            if (data.usage) {
                logUsage({
                    question: `Mise en place · ${label}`,
                    promptTokens: data.usage.promptTokens ?? 0,
                    completionTokens: data.usage.completionTokens ?? 0,
                    estimatedCostUSD: data.usage.estimatedCostUSD ?? 0,
                })
                setUsageVersion((v) => v + 1)
            }
            toast.success('Mise en place generada.')
        } catch (e) {
            setError(`No se pudo conectar con el servidor. ${e instanceof Error ? e.message : ''}`)
        } finally {
            setGenerating(false)
        }
    }

    const handleExport = async () => {
        if (!plan) return
        try {
            await exportMiseEnPlacePdf({ weekLabel: label, inputs: includedInputs, plan, totals, totalOverrides, staffByOrder, instructions: appliedInstructions, checked })
        } catch {
            toast.error('No se pudo generar el PDF.')
        }
    }

    const toggleTask = (id: string) => {
        setChecked((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const updateStaff = (next: StaffMember[]) => {
        setStaff(next)
        saveStaff(next)
    }

    const saveAssignment = (orderId: string, ids: string[]) => {
        const next = { ...assignments, [orderId]: ids }
        setAssignments(next)
        saveAssignments(next)
        setAssignFor(null)
    }

    const assignInput = assignFor ? inputs.find((i) => i.orderId === assignFor) : null

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <WeekSelector
                    label={label}
                    eventsCount={weekOrders.length}
                    onPrev={() => changeWeek(subWeeks(anchor, 1))}
                    onNext={() => changeWeek(addWeeks(anchor, 1))}
                    onToday={() => changeWeek(new Date())}
                />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
                <ManageStaffDialog staff={staff} onChange={updateStaff} />
                <OpsPromptDialog />
                <UsageSummary refreshKey={usageVersion} />
            </div>

            {loadingOrders ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-10 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando pedidos aprobados...
                </div>
            ) : weekOrders.length === 0 ? (
                <div className="border rounded-lg p-10 text-center text-sm text-muted-foreground">
                    No hay pedidos aprobados con fecha en esta semana.
                </div>
            ) : (
                <>
                    <div className="bg-card border rounded-lg p-3 space-y-2">
                        <label className="text-xs font-medium text-muted-foreground" htmlFor="mep-instructions">
                            Instrucciones para esta semana (opcional, prevalecen sobre el devis)
                        </label>
                        <p className="text-[11px] text-muted-foreground">
                            Son órdenes sobre los eventos (cantidades por persona, público, carne aparte). Para
                            redondear un total de la semana, usá el lápiz en el resumen de la derecha.
                        </p>
                        <Textarea
                            id="mep-instructions"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder='Ej.: "Amandine recalcular para 150 personas", "el sábado la carne se compra aparte", "público mayormente masculino en Ramatuelle"'
                            rows={2}
                            className="resize-none text-sm"
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                            <Button onClick={handleGenerate} disabled={generating || includedInputs.length === 0} className="gap-1.5">
                                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                {plan ? 'Volver a generar' : 'Generar mise en place'} ({includedInputs.length})
                            </Button>
                            <Button variant="outline" onClick={handleExport} disabled={!plan} className="gap-1.5">
                                <FileDown className="h-4 w-4" />
                                Exportar PDF
                            </Button>
                            {error && (
                                <span className="text-sm text-destructive flex items-center gap-1.5">
                                    <AlertCircle className="h-4 w-4" /> {error}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_340px] gap-4 items-start">
                        <div className="space-y-3">
                            {inputs.map((input) => (
                                <EventSheet
                                    key={input.orderId}
                                    input={input}
                                    plan={plan?.events.find((e) => e.orderId === input.orderId) ?? null}
                                    excluded={excluded.has(input.orderId)}
                                    staff={staffByOrder[input.orderId] || []}
                                    checked={checked}
                                    onToggleTask={toggleTask}
                                    onToggleExcluded={() =>
                                        setExcluded((prev) => {
                                            const next = new Set(prev)
                                            if (next.has(input.orderId)) next.delete(input.orderId)
                                            else next.add(input.orderId)
                                            return next
                                        })
                                    }
                                    onAssignStaff={() => setAssignFor(input.orderId)}
                                />
                            ))}
                        </div>
                        <div className="lg:sticky lg:top-4">
                            <WeeklyTotals
                                totals={totals}
                                generalTasks={plan?.generalTasks ?? []}
                                notes={plan?.notes ?? ''}
                                overrides={totalOverrides}
                                onOverride={handleOverride}
                            />
                        </div>
                    </div>
                </>
            )}

            {assignInput && (
                <AssignStaffDialog
                    key={assignInput.orderId}
                    open
                    eventLabel={`${assignInput.dayLabel} — ${assignInput.client}`}
                    staff={staff}
                    selectedIds={assignments[assignInput.orderId] || []}
                    onClose={() => setAssignFor(null)}
                    onSave={(ids) => saveAssignment(assignInput.orderId, ids)}
                />
            )}
        </div>
    )
}
