import React, { useState } from 'react'
import BudgetsList from '../BudgetsList/BudgetsList'
import { BudgetEditor } from '../BudgetEditor'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BudgetsFilters } from '@/services/budgetsService'

export default function BudgetsManager() {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<BudgetsFilters>({})

  const handleBack = () => {
    setSelectedBudgetId(null)
  }

  if (selectedBudgetId) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>
        <BudgetEditor
          budgetId={selectedBudgetId}
          onBudgetDeleted={() => setSelectedBudgetId(null)}
        />
      </div>
    )
  }

  return (
    <div>
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
