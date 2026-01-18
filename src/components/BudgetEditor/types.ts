// Re-export all budget types from the canonical source
// This ensures consistency across the codebase
export type {
    BudgetStatus,
    BudgetMenuItem,
    BudgetMenuSection,
    BudgetMaterialSection,
    BudgetDeplacementSection,
    BudgetServiceSection,
    BudgetDeliverySection,
    BudgetBoissonsSection,
    BudgetExtrasSection,
    BudgetTotals,
    BudgetData,
    Budget,
    BudgetVersionHistory
} from '@/lib/types/budget'

// BudgetEditor-specific props
export interface BudgetEditorProps {
    budgetId: string
    onBudgetDeleted?: () => void
}
