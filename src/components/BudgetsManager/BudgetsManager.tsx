import React, { useState } from 'react'
import BudgetsList from '../BudgetsList/BudgetsList'
import { BudgetEditor } from '../BudgetEditor'
import { ArrowLeft } from 'lucide-react'
import './BudgetsManager.css'

export default function BudgetsManager() {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null)

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
        <BudgetEditor budgetId={selectedBudgetId} />
      </div>
    )
  }

  return (
    <div className="budgets-manager">
      <BudgetsList onSelectBudget={setSelectedBudgetId} />
    </div>
  )
}

