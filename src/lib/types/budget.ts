// Tipos para el sistema de presupuestos

export interface BudgetMenuItem {
  name: string
  quantity: number
  pricePerUnit: number
  total: number
  description?: string // Optional description for special items like birthday cakes
  isManualPrice?: boolean // \u2705 Flag to preserve admin-edited prices
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
  insurancePct?: number
  insuranceAmount?: number
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
export interface BudgetDeliverySection {
  deliveryCost: number
  pickupCost: number
  totalHT: number
  tva: number
  tvaPct: number
  totalTTC: number
  notes?: string
}

export interface BudgetBoissonsSection {
  pricePerPerson: number
  totalPersons: number
  totalHT: number
  tva: number
  tvaPct: number
  totalTTC: number
}

export interface BudgetExtrasSection {
  items: {
    description: string
    priceHT: number
    tvaPct: number // 10 or 20
    tva: number
    priceTTC: number
  }[]
  totalHT: number
  totalTVA: number
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
  deliveryReprise?: BudgetDeliverySection
  boissonsSoft?: BudgetBoissonsSection
  extras?: BudgetExtrasSection

  // Totales generales
  totals: BudgetTotals

  // Notas y observaciones
  notes?: string
  internalNotes?: string
  adminNotes?: string // Custom notes from admin to include in PDF

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

