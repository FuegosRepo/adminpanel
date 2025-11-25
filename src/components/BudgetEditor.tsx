import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import './BudgetEditor.css'

// Tipos (importa estos desde Fuegos/lib/types/budget.ts en producción)
interface BudgetData {
  clientInfo: {
    name: string
    email: string
    phone: string
    eventDate: string
    eventType: string
    guestCount: number
    address: string
    menuType: 'dejeuner' | 'diner'
  }
  menu: {
    pricePerPerson: number
    totalPersons: number
    totalHT: number
    tva: number
    tvaPct: number
    totalTTC: number
    notes?: string
  }
  material?: {
    totalHT: number
    tva: number
    tvaPct: number
    totalTTC: number
    notes?: string
  }
  deplacement?: {
    distance: number
    pricePerKm: number
    totalHT: number
    tva: number
    tvaPct: number
    totalTTC: number
  }
  service?: {
    mozos: number
    hours: number
    pricePerHour: number
    totalHT: number
    tva: number
    tvaPct: number
    totalTTC: number
  }
  totals: {
    totalHT: number
    totalTVA: number
    totalTTC: number
    discount?: {
      reason: string
      percentage: number
      amount: number
    }
  }
  notes?: string
}

interface Budget {
  id: string
  order_id: string
  version: number
  status: 'draft' | 'pending_review' | 'approved' | 'sent' | 'rejected'
  budget_data: BudgetData
  pdf_url?: string
  created_at: string
  updated_at: string
}

interface BudgetEditorProps {
  budgetId: string
}

export const BudgetEditor: React.FC<BudgetEditorProps> = ({ budgetId }) => {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [editedData, setEditedData] = useState<BudgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar presupuesto
  useEffect(() => {
    loadBudget()
  }, [budgetId])

  const loadBudget = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', budgetId)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setBudget(data as any)
        setEditedData(data.budget_data)
      }
    } catch (err) {
      setError('Error cargando presupuesto')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Actualizar campo del presupuesto
  const updateField = (path: string, value: any) => {
    if (!editedData) return

    setEditedData((prev) => {
      if (!prev) return prev
      const newData = { ...prev }
      const keys = path.split('.')
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      
      // Recalcular totales automáticamente
      return recalculateTotals(newData)
    })
  }

  // Recalcular totales automáticamente
  const recalculateTotals = (data: BudgetData): BudgetData => {
    const updated = { ...data }

    // Recalcular menú
    if (updated.menu) {
      const menuHT = updated.menu.pricePerPerson * updated.menu.totalPersons
      updated.menu.totalHT = menuHT
      updated.menu.tva = menuHT * (updated.menu.tvaPct / 100)
      updated.menu.totalTTC = menuHT + updated.menu.tva
    }

    // Recalcular servicio
    if (updated.service) {
      const serviceHT = updated.service.mozos * updated.service.hours * updated.service.pricePerHour
      updated.service.totalHT = serviceHT
      updated.service.tva = serviceHT * (updated.service.tvaPct / 100)
      updated.service.totalTTC = serviceHT + updated.service.tva
    }

    // Recalcular desplazamiento
    if (updated.deplacement) {
      const deplacementHT = updated.deplacement.distance * updated.deplacement.pricePerKm
      updated.deplacement.totalHT = deplacementHT
      updated.deplacement.tva = deplacementHT * (updated.deplacement.tvaPct / 100)
      updated.deplacement.totalTTC = deplacementHT + updated.deplacement.tva
    }

    // Recalcular totales generales
    let totalHT = updated.menu.totalHT
    let totalTVA = updated.menu.tva

    if (updated.material) {
      totalHT += updated.material.totalHT
      totalTVA += updated.material.tva
    }

    if (updated.deplacement) {
      totalHT += updated.deplacement.totalHT
      totalTVA += updated.deplacement.tva
    }

    if (updated.service) {
      totalHT += updated.service.totalHT
      totalTVA += updated.service.tva
    }

    updated.totals = {
      ...updated.totals,
      totalHT,
      totalTVA,
      totalTTC: totalHT + totalTVA
    }

    return updated
  }

  // Guardar cambios
  const saveChanges = async () => {
    if (!editedData) return

    try {
      setSaving(true)
      
      const response = await fetch('/api/update-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetId,
          budgetData: editedData,
          editedBy: 'admin', // Aquí deberías usar el usuario actual
          changesSummary: 'Presupuesto editado manualmente desde Panel Admin'
        })
      })

      if (!response.ok) {
        throw new Error('Error al guardar')
      }

      const result = await response.json()
      console.log('✅ Cambios guardados:', result)
      alert('Cambios guardados exitosamente')
      
      // Recargar presupuesto
      await loadBudget()
    } catch (err) {
      console.error('Error guardando:', err)
      alert('Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  // Aprobar y enviar
  const approveAndSend = async () => {
    if (!editedData) return

    if (!budget?.pdf_url) {
      alert('⚠️ Por favor genera el PDF antes de aprobar y enviar')
      return
    }

    const confirmMessage = `¿Estás seguro de aprobar y enviar este presupuesto?\n\nCliente: ${editedData.clientInfo.name}\nEmail: ${editedData.clientInfo.email}\nTotal: ${editedData.totals.totalTTC.toFixed(2)}€`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      setSaving(true)
      
      const response = await fetch('/api/approve-and-send-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budgetId: budgetId,
          clientEmail: editedData.clientInfo.email,
          clientName: editedData.clientInfo.name
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al aprobar y enviar')
      }

      if (result.note) {
        // Mostrar nota si el email no se envió automáticamente
        alert(`✅ Presupuesto aprobado exitosamente!\n\n⚠️ ${result.note}\n\nPDF: ${result.pdfUrl}`)
      } else {
        alert('✅ Presupuesto aprobado y enviado al cliente por email')
      }
      
      await loadBudget()
    } catch (err) {
      console.error('Error aprobando:', err)
      alert(`❌ Error al aprobar presupuesto: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setSaving(false)
    }
  }

  // Generar PDF
  const generatePDF = async () => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/generate-budget-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error del servidor:', errorData)
        throw new Error(errorData.error || 'Error al generar PDF')
      }

      const result = await response.json()
      console.log('✅ PDF generado:', result.pdfUrl)
      
      // Abrir PDF en nueva pestaña
      window.open(result.pdfUrl, '_blank')
      
      await loadBudget()
    } catch (err) {
      console.error('Error generando PDF:', err)
      alert(`Error al generar PDF: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="budget-editor-loading">Cargando presupuesto...</div>
  }

  if (error) {
    return <div className="budget-editor-error">{error}</div>
  }

  if (!editedData) {
    return <div className="budget-editor-error">No se pudo cargar el presupuesto</div>
  }

  return (
    <div className="budget-editor">
      <div className="budget-editor-header">
        <h1>Editor de Presupuesto</h1>
        <div className="budget-editor-status">
          <span className={`status-badge status-${budget?.status}`}>
            {budget?.status}
          </span>
          <span className="version-badge">v{budget?.version}</span>
        </div>
      </div>

      {/* Información del Cliente */}
      <section className="budget-section">
        <h2>📋 Información del Cliente</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Nombre:</strong> {editedData.clientInfo.name}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {editedData.clientInfo.email}
          </div>
          <div className="info-item">
            <strong>Teléfono:</strong> {editedData.clientInfo.phone}
          </div>
          <div className="info-item">
            <strong>Evento:</strong> {editedData.clientInfo.eventType}
          </div>
          <div className="info-item">
            <strong>Fecha:</strong> {new Date(editedData.clientInfo.eventDate).toLocaleDateString('fr-FR')}
          </div>
          <div className="info-item">
            <strong>Invitados:</strong> {editedData.clientInfo.guestCount}
          </div>
        </div>
      </section>

      {/* MENÚ - EDITABLE */}
      <section className="budget-section editable">
        <h2>🍽️ Menú</h2>
        <div className="edit-grid">
          <div className="edit-field">
            <label>Precio por Persona (€)</label>
            <input
              type="number"
              value={editedData.menu.pricePerPerson}
              onChange={(e) => updateField('menu.pricePerPerson', parseFloat(e.target.value))}
              step="0.01"
            />
          </div>
          <div className="edit-field">
            <label>Total Personas</label>
            <input
              type="number"
              value={editedData.menu.totalPersons}
              onChange={(e) => updateField('menu.totalPersons', parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="totals-box">
          <div className="total-row">
            <span>Total HT:</span>
            <strong>{editedData.menu.totalHT.toFixed(2)} €</strong>
          </div>
          <div className="total-row">
            <span>TVA ({editedData.menu.tvaPct}%):</span>
            <strong>{editedData.menu.tva.toFixed(2)} €</strong>
          </div>
          <div className="total-row highlight">
            <span>Total TTC:</span>
            <strong>{editedData.menu.totalTTC.toFixed(2)} €</strong>
          </div>
        </div>
      </section>

      {/* SERVICIO - EDITABLE */}
      {editedData.service && (
        <section className="budget-section editable">
          <h2>👔 Servicio</h2>
          <div className="edit-grid">
            <div className="edit-field">
              <label>Mozos</label>
              <input
                type="number"
                value={editedData.service.mozos}
                onChange={(e) => updateField('service.mozos', parseInt(e.target.value))}
              />
            </div>
            <div className="edit-field">
              <label>Horas</label>
              <input
                type="number"
                value={editedData.service.hours}
                onChange={(e) => updateField('service.hours', parseInt(e.target.value))}
              />
            </div>
            <div className="edit-field">
              <label>Precio/Hora (€)</label>
              <input
                type="number"
                value={editedData.service.pricePerHour}
                onChange={(e) => updateField('service.pricePerHour', parseFloat(e.target.value))}
                step="0.01"
              />
            </div>
          </div>
          <div className="totals-box">
            <div className="total-row highlight">
              <span>Total TTC:</span>
              <strong>{editedData.service.totalTTC.toFixed(2)} €</strong>
            </div>
          </div>
        </section>
      )}

      {/* TOTALES FINALES */}
      <section className="budget-section totals-final">
        <h2>💰 Totales Finales</h2>
        <div className="final-totals-box">
          <div className="total-row">
            <span>Total HT:</span>
            <strong>{editedData.totals.totalHT.toFixed(2)} €</strong>
          </div>
          <div className="total-row">
            <span>TVA Total:</span>
            <strong>{editedData.totals.totalTVA.toFixed(2)} €</strong>
          </div>
          <div className="total-row highlight-green">
            <span>TOTAL TTC:</span>
            <strong className="final-amount">{editedData.totals.totalTTC.toFixed(2)} €</strong>
          </div>
        </div>
      </section>

      {/* ACCIONES */}
      <div className="budget-actions">
        <button 
          className="btn btn-secondary"
          onClick={generatePDF}
          disabled={saving}
        >
          👁️ Vista Previa PDF
        </button>
        <button 
          className="btn btn-primary"
          onClick={saveChanges}
          disabled={saving}
        >
          💾 Guardar Cambios
        </button>
        <button 
          className="btn btn-success"
          onClick={approveAndSend}
          disabled={saving}
        >
          ✅ Aprobar y Enviar
        </button>
      </div>
    </div>
  )
}

