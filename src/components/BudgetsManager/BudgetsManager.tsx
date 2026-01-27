import React, { useState } from 'react'
import BudgetsList from '../BudgetsList/BudgetsList'
import { BudgetEditor } from '../BudgetEditor'
import { ArrowLeft } from 'lucide-react'
import './BudgetsManager.css'
import type { BudgetsFilters } from '@/services/budgetsService'

export default function BudgetsManager() {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null)

  // ✅ Estado de paginación persistido en el padre para no perderlo al navegar
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<BudgetsFilters>({})

  const handleBack = () => {
    setSelectedBudgetId(null)
  }

  if (selectedBudgetId) {
    return (
      <div className="budgets-manager">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          Volver a la lista
        </button>
        <BudgetEditor
          budgetId={selectedBudgetId}
          onBudgetDeleted={() => setSelectedBudgetId(null)}
        />
      </div>
    )
  }

  return (
    <div className="budgets-manager">
      <BudgetsList
        onSelectBudget={setSelectedBudgetId}
        page={page}
        setPage={setPage}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

