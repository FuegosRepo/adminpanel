# Code Context

## Files Retrieved
1. `src/components/OrderCard/OrderCard.tsx` (lines 189-195, 351-363) - `/orders` row price display and generate-budget action.
2. `src/services/ordersService.ts` (lines 66-75, 145-158) - `/orders` data source and `estimated_price` mapping.
3. `src/components/BudgetsList/BudgetsList.tsx` (lines 21-111) - `/budgets` list uses `useBudgets` and `BudgetTableRow`.
4. `src/services/budgetsService.ts` (lines 40-49, 73-88) - `/budgets` list query selects `budgets.budget_data`.
5. `src/components/BudgetsList/components/BudgetTableRow.tsx` (lines 22-24, 65-67) - `/budgets` list displays `budget_data.totals.totalTTC`.
6. `src/components/BudgetEditor/index.tsx` (lines 57-73, 236-239) - editor state is recalculated on load before display/save.
7. `src/components/BudgetEditor/components/TotalsSection.tsx` (lines 12-14, 44-50) - editor TOTAL TTC display.
8. `src/components/BudgetEditor/hooks/useBudgetData.ts` (lines 28-50, 185-273, 298-326) - editor load-time enrichment/material price correction and save call to `/api/update-budget`.
9. `src/components/BudgetEditor/hooks/useBudgetCalculations.ts` (lines 6-25) - field edits recalculate totals.
10. `src/components/BudgetEditor/utils/budgetCalculations.ts` (lines 139-188) - total TTC calculation rules.
11. `src/app/api/update-budget/route.ts` (lines 61-75, 92-118, 145-149) - budget update and `catering_orders` synchronization.
12. `src/app/api/generate-budget-from-order/route.ts` (lines 102-124, 155-190) - initial budget generation and initial order `estimated_price` update.
13. `src/app/api/approve-and-send-budget/route.ts` (lines 75-82) - send route syncs only order status, not price.
14. `src/app/api/mark-budget-as-sent/route.ts` (lines 72-80) - manual sent route syncs order status and price.
15. `src/lib/types/budget.ts` (lines 3-150) - canonical budget fields and totals.
16. `src/types/index.ts` (lines 23-56) - `CateringOrder.estimatedPrice` field.
17. `src/components/EventCalculator/utils/productMapping.ts` (lines 37-60) - material-name-to-product-price mapping used by editor load corrections.
18. `../supabase/migrations/sync_budget_order_data.sql` (lines 43-93) - optional DB trigger intended to sync budget JSON to order price if installed.

## Key Code

### `/orders` amount source

`/orders` does **not** compute from budget JSON. It renders `order.estimatedPrice`:

```tsx
// src/components/OrderCard/OrderCard.tsx:189-195
<TableCell className="text-right whitespace-nowrap">
  {order.estimatedPrice && (
    <div className="font-semibold">
      €{mounted ? order.estimatedPrice.toLocaleString() : order.estimatedPrice}
    </div>
  )}
</TableCell>
```

That value comes from `catering_orders.estimated_price`:

```ts
// src/services/ordersService.ts:72-74,154
.from('catering_orders')
.select('*, budgets(id)', { count: 'exact' })
...
estimatedPrice: row.estimated_price || undefined,
```

### `/budgets` list amount source

The budgets list selects and displays `budgets.budget_data.totals.totalTTC`:

```ts
// src/services/budgetsService.ts:46-48
.from('budgets')
.select('id, order_id, version, status, budget_data, pdf_url, created_at, updated_at, relance_count, catering_orders!order_id(payment_method, status)', { count: 'exact' })
```

```tsx
// src/components/BudgetsList/components/BudgetTableRow.tsx:22-24,65-67
const totals = budget.budget_data?.totals || {}
...
{totals.totalTTC ? `${totals.totalTTC.toFixed(2)} €` : '-'}
```

### Budget editor TOTAL TTC source

The editor does not display the raw DB object directly. On budget load it recalculates a local `editedData`:

```tsx
// src/components/BudgetEditor/index.tsx:68-72
React.useEffect(() => {
  if (budget?.budget_data) {
    const correctedData = recalculateTotals(budget.budget_data)
    setEditedData(correctedData)
  }
}, [budget, setEditedData])
```

Then `TotalsSection` displays `editedData.totals.totalTTC`:

```tsx
// src/components/BudgetEditor/components/TotalsSection.tsx:44-50
<span className="...">TOTAL TTC:</span>
<span className="...">
  {data.totalTTC.toFixed(2)} €
</span>
```

Field edits also recalculate immediately:

```ts
// src/components/BudgetEditor/hooks/useBudgetCalculations.ts:22-25
current[keys[keys.length - 1]] = value
return recalculateTotals(newData)
```

### Total calculation rules

`recalculateTotals()` sums section HT/TVA and sets `totals.totalTTC = totalHT + totalTVA`, with an optional manual discount subtracting from total TTC:

```ts
// src/components/BudgetEditor/utils/budgetCalculations.ts:161-188
if (updated.service) {
  totalHT += updated.service.totalHT
  totalTVA += updated.service.tva
}
let totalTTC = totalHT + totalTVA
if (updated.totals.discount && updated.totals.discount.amount > 0) {
  totalTTC -= updated.totals.discount.amount
}
updated.totals = { ...updated.totals, totalHT, totalTVA, totalTTC }
```

### `/api/update-budget` synchronization

Saving the editor posts to `/api/update-budget`:

```ts
// src/components/BudgetEditor/hooks/useBudgetData.ts:302-310
fetch('/api/update-budget', {
  method: 'POST',
  body: JSON.stringify({ budgetId, budgetData: editedData, editedBy: 'admin', changesSummary: summary })
})
```

The route updates `budgets.budget_data`, increments version, resets status/PDF, then syncs selected order fields including price:

```ts
// src/app/api/update-budget/route.ts:61-71
.update({
  budget_data: budgetData,
  version: newVersion,
  edited_by: editedBy || 'admin',
  edited_at: new Date().toISOString(),
  version_history: versionHistory,
  status: 'pending_review',
  pdf_url: null
})
```

```ts
// src/app/api/update-budget/route.ts:92-118
.from('catering_orders')
.update({
  name: budgetData.clientInfo.name,
  email: budgetData.clientInfo.email,
  phone: budgetData.clientInfo.phone,
  event_date: budgetData.clientInfo.eventDate,
  event_type: budgetData.clientInfo.eventType,
  guest_count: budgetData.clientInfo.guestCount,
  address: budgetData.clientInfo.address,
  menu_type: budgetData.clientInfo.menuType,
  estimated_price: budgetData.totals?.totalTTC || 0,
  entrees: budgetData.menu.selectedItems?.entrees || [],
  viandes: budgetData.menu.selectedItems?.viandes || [],
  dessert: budgetData.menu.selectedItems?.desserts?.[0] || null,
  notes: budgetData.clientInfo.additionalInfo,
  updated_at: new Date().toISOString()
})
```

Important type mismatch: `budgetData.clientInfo.additionalInfo` is not defined in `BudgetData.clientInfo` (`src/lib/types/budget.ts:119-128`), so that sync field is stale/unsafe but unrelated to price.

### Initial generation path

`generate-budget-from-order` currently prices **every equipment item at 5 per guest**, including `serveurs`:

```ts
// src/app/api/generate-budget-from-order/route.ts:102-116
const equipment = order.extras?.equipment || []
if (equipment.length > 0) {
  const costPerPersonPerItem = 5
  const materialItems = equipment.map((name: string) => ({
    name,
    quantity: guestCount,
    pricePerUnit: costPerPersonPerItem,
    total: costPerPersonPerItem * guestCount
  }))
  const materialHT = costPerPersonPerItem * guestCount * equipment.length
```

It stores that generated total in both places:

```ts
// src/app/api/generate-budget-from-order/route.ts:165-190
totals: { totalHT, totalTVA, totalTTC }
...
.insert([{ order_id: orderId, budget_data: budgetData, status: 'pending_review', version: 1 }])
...
.from('catering_orders').update({ estimated_price: totalTTC })
```

### Editor load-time material corrections

On editor load, material items are changed locally before display:

```ts
// src/components/BudgetEditor/hooks/useBudgetData.ts:185-190
.filter(item => {
  const itemNameLower = item.name.toLowerCase()
  return !itemNameLower.includes('serveur') &&
    !itemNameLower.includes('servicio') &&
    !itemNameLower.includes('mozos')
})
```

Then it tries to replace `pricePerUnit` using DB material products, or force suspicious plates/glasses/cutlery to `0.50`:

```ts
// src/components/BudgetEditor/hooks/useBudgetData.ts:217-235
foundProduct = materialProducts.find(p =>
  possibleNames.some((name: string) => p.name.toLowerCase().includes(name))
)
...
correctPrice = foundProduct.price_per_portion || 0.50
```

```ts
// src/components/BudgetEditor/hooks/useBudgetData.ts:239-247
if (correctPrice >= 1.0 && (
  formattedName.toLowerCase().includes('verre') ||
  formattedName.toLowerCase().includes('assiette') ||
  formattedName.toLowerCase().includes('couverts')
)) {
  correctPrice = 0.50
}
```

Then it recalculates the material section:

```ts
// src/components/BudgetEditor/hooks/useBudgetData.ts:256-270
budgetData.material.items.forEach(item => {
  item.total = item.quantity * item.pricePerUnit
  materialHT += item.total
})
const insurance = materialHT * insPct
budgetData.material.totalHT = materialHTWithInsurance
budgetData.material.tva = materialHTWithInsurance * (budgetData.material.tvaPct / 100)
budgetData.material.totalTTC = budgetData.material.totalHT + budgetData.material.tva
```

The mappings that make this happen include `assiettes-*`, `verres-*`, `couverts`, `tables`, `chaises`, and `mange-debout`:

```ts
// src/components/EventCalculator/utils/productMapping.ts:37-60
'assiettes-plat': ['platos grandes', ...]
'assiettes-dessert': ['platos postres', ...]
'verres-eau': ['vasos agua', ...]
'verres-vin': ['copas vino', ...]
'verres-champagne': ['copas champagne', ...]
'couverts': ['tenedores', 'cuchillos', 'cucharas', 'cubiertos']
'tables': ['mesas 10/12', ...]
'chaises': ['sillas basicas', 'silla']
'mange-debout': ['mange debout', ...]
```

### Other status routes

`approve-and-send-budget` updates only `catering_orders.status`, not `estimated_price`:

```ts
// src/app/api/approve-and-send-budget/route.ts:75-82
.from('catering_orders')
.update({ status: 'ENVIADO' })
.eq('id', budget.order_id)
```

`mark-budget-as-sent` does sync price:

```ts
// src/app/api/mark-budget-as-sent/route.ts:72-80
.update({
  status: 'sent',
  estimated_price: budgetData?.totals?.totalTTC || 0,
  updated_at: new Date().toISOString()
})
```

## Architecture

There are two parallel price sources:

1. `catering_orders.estimated_price` -> `ordersService.mapRowToOrder()` -> `OrderCard` -> `/orders` amount.
2. `budgets.budget_data.totals.totalTTC` -> `budgetsService.fetchBudgets()` -> `BudgetTableRow` and `BudgetEditor` -> `/budgets` amount.

They are synchronized only by specific write paths:

- Initial generation (`/api/generate-budget-from-order`) writes both `budgets.budget_data.totals.totalTTC` and `catering_orders.estimated_price`.
- Editor save (`/api/update-budget`) writes `budgets.budget_data` and then copies `budgetData.totals.totalTTC` to `catering_orders.estimated_price`.
- Mark as sent copies the budget total to order price.
- Approve-and-send only updates order status, not price.

The editor has an additional local normalization layer. It may display a corrected/recalculated total that differs from the persisted JSON until the user clicks Save and `/api/update-budget` succeeds.

## Concrete data check: Blondiau Djamel

Read-only Supabase query with anon key found one matching order:

```json
{
  "id": "3ce67b33-f6c6-47d6-8781-6a504cb06fdb",
  "name": "Blondiau Djamel ",
  "estimated_price": 4248,
  "status": "pending",
  "updated_at": "2026-05-20T08:34:20.43011+00:00"
}
```

The linked budget in the database currently also has persisted `budget_data.totals.totalTTC = 4248`:

```json
{
  "id": "171e20fc-1bfc-4956-a240-00c058fb9035",
  "status": "pending_review",
  "version": 1,
  "totalHT": 3680,
  "totalTVA": 568,
  "totalTTC": 4248
}
```

The persisted material section shows the generator issue clearly: 10 equipment items at `pricePerUnit: 5`, `quantity: 40`, `totalHT: 2000`, `totalTTC: 2400`, including `serveurs`. The editor load path removes `serveurs` and replaces many material prices from real product prices, so its displayed value can differ before save.

## Root-cause hypotheses

1. **Most likely: editor-local recalculation is not persisted yet.** Evidence: the DB currently has `orders.estimated_price = 4248` and `budgets.budget_data.totals.totalTTC = 4248`, but the editor recalculates on load (`src/components/BudgetEditor/index.tsx:68-72`) and mutates material pricing/removes `serveurs` before display (`src/components/BudgetEditor/hooks/useBudgetData.ts:185-273`). If the user sees `3786.53 €` in the editor, that is likely local `editedData`, not the stored budget/list value. Clicking Save should call `/api/update-budget`, persist the recalculated total, invalidate `orders` and `budgets`, and sync `catering_orders.estimated_price` (`src/components/BudgetEditor/hooks/useBudgetData.ts:298-326`, `src/app/api/update-budget/route.ts:92-118`).

2. **Initial generator overprices equipment with a placeholder rule.** Evidence: `/api/generate-budget-from-order` uses `costPerPersonPerItem = 5` for every equipment item (`src/app/api/generate-budget-from-order/route.ts:102-116`) and writes that to both budget and order (`src/app/api/generate-budget-from-order/route.ts:165-190`). The editor later applies real product/material rules. This creates an expected mismatch between initial persisted value and editor corrected value until saved.

3. **Approve-and-send can leave stale `estimated_price` if budget JSON was changed outside `/api/update-budget`.** Evidence: `approve-and-send-budget` updates only order status (`src/app/api/approve-and-send-budget/route.ts:75-82`). If any path changes `budgets.budget_data.totals.totalTTC` without `/api/update-budget` or a DB trigger, then approving/sending will not repair order price. `mark-budget-as-sent` does sync price (`src/app/api/mark-budget-as-sent/route.ts:72-80`).

4. **DB trigger may not be installed or may conflict with app sync assumptions.** A migration defines `trigger_sync_budget_to_order` to copy JSON total to `catering_orders.estimated_price` after budget updates (`../supabase/migrations/sync_budget_order_data.sql:68-93`). If this migration is not applied, only app routes sync. If it is applied, direct DB budget updates should sync price; however, the app still contains explicit sync logic, so behavior depends on deployment state.

5. **There is a stale field reference in order sync.** `/api/update-budget` writes `notes: budgetData.clientInfo.additionalInfo` (`src/app/api/update-budget/route.ts:113-114`), but `BudgetData.clientInfo` has no `additionalInfo` (`src/lib/types/budget.ts:119-128`). Not a price bug, but evidence that sync code has drifted and should be tightened.

## Minimal remediation plan

1. **Decide the canonical source:** use `budgets.budget_data.totals.totalTTC` as canonical for budgeted orders; keep `catering_orders.estimated_price` as a denormalized cache for `/orders`, reports, and payments.
2. **Normalize before persistence, not only in editor UI:** move material price correction/recalculation into a shared server-side helper used by both `/api/generate-budget-from-order` and `/api/update-budget`, or update the generator to use the same product pricing/mapping rules as the editor.
3. **Make editor load correction explicit:** if opening a budget changes totals locally, show an “unsaved recalculation” indicator or automatically persist only after explicit Save. Do not silently show a corrected total as if it were stored.
4. **Patch `approve-and-send-budget`:** also sync `estimated_price: budgetData?.totals?.totalTTC || 0` and `updated_at` when it updates the order status.
5. **Add a one-off consistency check/backfill:** query orders with linked budgets where `catering_orders.estimated_price != (budgets.budget_data->'totals'->>'totalTTC')::numeric`, then update `estimated_price` from the latest/active budget.
6. **Add regression coverage:** test that `/api/update-budget`, mark-as-sent, approve-and-send, and initial generation all keep order estimated price aligned with budget total.

## Start Here

Start with `src/components/BudgetEditor/hooks/useBudgetData.ts`. It is where the editor silently changes material items and totals on load, which explains why the editor can show a different TOTAL TTC than `/orders` or the stored `/budgets` list.

## Supervisor coordination

No coordination was needed. Engram memory tools were not available in this child toolset, so I could not save discoveries to Engram.