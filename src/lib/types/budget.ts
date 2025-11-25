// Tipos para el sistema de presupuestos

export interface BudgetMenuItem {
  name: string
  quantity: number
  pricePerUnit: number
  total: number
}

export interface BudgetMenuSection {
  pricePerPerson: number
  totalPersons: number
  entrees: BudgetMenuItem[]
  viandes: BudgetMenuItem[]
  dessert: BudgetMenuItem
  accompagnements: string[]
  totalHT: number
  tva: number
  tvaPct: number
  totalTTC: number
  notes?: string
}

export interface BudgetMaterialSection {
  items: BudgetMenuItem[]
  gestionFee?: number
  deliveryFee?: number
  totalHT: number
  tva: number
  tvaPct: number
  totalTTC: number
  notes?: string
}

export interface BudgetDeplacementSection {
  distance: number
  pricePerKm: number
  totalHT: number
  tva: number
  tvaPct: number
  totalTTC: number
  notes?: string
}

export interface BudgetServiceSection {
  mozos: number
  hours: number
  pricePerHour: number
  totalHT: number
  tva: number
  tvaPct: number
  totalTTC: number
  notes?: string
}

export interface BudgetTotals {
  totalHT: number
  totalTVA: number
  totalTTC: number
  discount?: {
    reason: string
    percentage: number
    amount: number
  }
}

export interface BudgetData {
  // Información del cliente
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
  
  // Secciones del presupuesto
  menu: BudgetMenuSection
  material?: BudgetMaterialSection
  deplacement?: BudgetDeplacementSection
  service?: BudgetServiceSection
  
  // Totales generales
  totals: BudgetTotals
  
  // Notas y observaciones
  notes?: string
  internalNotes?: string
  
  // Metadata
  generatedAt: string
  validUntil: string
}

export interface Budget {
  id: string
  order_id: string
  version: number
  status: 'draft' | 'pending_review' | 'approved' | 'sent' | 'rejected'
  budget_data: BudgetData
  pdf_url?: string
  ai_prompt_used?: string
  ai_response?: string
  ai_model?: string
  generated_by: 'ai' | 'manual'
  generated_at: string
  edited_by?: string
  edited_at?: string
  approved_by?: string
  approved_at?: string
  sent_at?: string
  admin_notes?: string
  internal_notes?: string
  version_history: BudgetVersionHistory[]
  created_at: string
  updated_at: string
}

export interface BudgetVersionHistory {
  version: number
  changed_by: string
  changed_at: string
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  summary: string
}

