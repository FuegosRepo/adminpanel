# Safe Client Info Backfill - Implementation Guide

## Overview
This document explains the non-destructive backfill strategy for populating missing client information in budgets from linked orders.

---

## 🎯 Strategy: Fill Blanks, Preserve Edits

### Core Principle
**ONLY update fields that are NULL, undefined, or empty strings**
**NEVER overwrite existing values**

### Example Scenarios

#### Scenario 1: Empty Budget Field
- **Budget**: `guestCount = null`
- **Order**: `guest_count = 50`
- **Result**: Budget updated to `guestCount = 50` ✅

#### Scenario 2: Existing Budget Value (Preserve)
- **Budget**: `guestCount = 55` (manually edited)
- **Order**: `guest_count = 50`
- **Result**: Budget keeps `guestCount = 55` ✅ (manual edit preserved)

#### Scenario 3: Empty String
- **Budget**: `name = ""`
- **Order**: `name = "Jean Dupont"`
- **Result**: Budget updated to `name = "Jean Dupont"` ✅

---

## 📋 Implementation

### 1. SQL Backfill Script

**File**: `safe_backfill_client_info.sql`

**What it does**:
- Creates helper function `safe_update_client_field()` that returns fallback only if current is empty
- Updates all budgets with linked orders
- Only touches fields that are NULL or empty
- Logs preview before execution

**How to use**:
```sql
-- Step 1: Preview changes (no modifications)
-- Run the SELECT query at the top of the script

-- Step 2: Execute backfill
-- Run the UPDATE statement

-- Step 3: Verify
-- Run the verification queries
```

**Safety Features**:
- ✅ Preview mode shows what WILL change
- ✅ Conditional updates (only if field is empty)
- ✅ Transaction-safe (can rollback if needed)

---

### 2. Frontend Fallback Logic

**File**: `useBudgetData.ts` (lines 33-84)

**What it does**:
- When loading a budget, fetches linked order data
- Fills clientInfo fields that are empty
- Never overwrites existing values
- Always updates selectedItems (for menu sync)

**Code Pattern**:
```typescript
// ✅ CORRECT - Safe fallback
if (!budgetData.clientInfo.name && orderData.name) {
    budgetData.clientInfo.name = orderData.name
}

// ❌ WRONG - Would overwrite
budgetData.clientInfo.name = orderData.name
```

**Display vs Save**:
- Fallback data is loaded into `budgetData` object
- User sees complete info in UI
- Data is NOT saved to database until user clicks "Save"
- This allows user to review and modify before persisting

---

## 🔍 Field-by-Field Behavior

| Field | Empty Check | Fallback Source | Notes |
|-------|-------------|-----------------|-------|
| `name` | `!budgetData.clientInfo.name` | `order.name` | Common empty field |
| `email` | `!budgetData.clientInfo.email` | `order.email` | |
| `phone` | `!budgetData.clientInfo.phone` | `order.phone` | |
| `address` | `!budgetData.clientInfo.address` | `order.address` | |
| `eventDate` | `!budgetData.clientInfo.eventDate` | `order.event_date` | Critical for PDF |
| `eventType` | `!budgetData.clientInfo.eventType` | `order.event_type` | |
| `guestCount` | `!budgetData.clientInfo.guestCount` | `order.guest_count` | Number field |

---

## 🧪 Testing Checklist

### SQL Script Testing
- [ ] Run preview query - verify it shows correct budgets
- [ ] Check "action" columns - should say "WILL UPDATE" only for empty fields
- [ ] Execute backfill
- [ ] Run verification query - confirm updates
- [ ] Spot check 3-5 budgets manually in Supabase UI

### Frontend Testing
1. **Test Case: Empty Budget**
   - [ ] Create budget from order with full client info
   - [ ] Budget should auto-fill all fields
   - [ ] Save and reload - data should persist

2. **Test Case: Partial Manual Edit**
   - [ ] Open existing budget
   - [ ] Manually edit guest count to 75
   - [ ] Reload page
   - [ ] Guest count should still be 75 (not overwritten)

3. **Test Case: Standalone Budget**
   - [ ] Create budget WITHOUT order_id
   - [ ] Should work normally, no errors
   - [ ] No attempt to fetch order data

---

## ⚠️ Edge Cases Handled

### 1. Budget with No Order
- **Situation**: Budget created manually, no order_id
- **Behavior**: No fallback attempted, budget works independently
- **Safety**: No errors, graceful degradation

### 2. Order Deleted
- **Situation**: Linked order was deleted from DB
- **Behavior**: SQL query returns no rows, budget unchanged
- **Safety**: Error logged, budget continues to work

### 3. Null vs Empty String
- **Situation**: Field might be `null`, `undefined`, or `""`
- **Behavior**: All three treated as "empty"
- **Safety**: Function checks `COALESCE(value, '') = ''`

### 4. Number Fields (guestCount)
- **Situation**: Number stored as string in JSON
- **Behavior**: SQL casts to integer, frontend uses number directly
- **Safety**: Type conversion handled correctly

---

## 🚀 Deployment Steps

### Pre-Production
1. Backup budgets table (Supabase → Export)
2. Test SQL on 1-2 budgets manually
3. Verify frontend works in dev

### Production
1. Run SQL preview query first
2. Review output carefully
3. Execute backfill during low-traffic period
4. Monitor for errors
5. Verify 5-10 random budgets

### Rollback Plan
If something goes wrong:
```sql
-- Restore from backup
-- OR manually update affected budgets
UPDATE budgets SET budget_data = [old_value] WHERE id = [budget_id];
```

---

## 📊 Expected Results

### Database
- All budgets with order_id should have complete clientInfo
- Manual edits preserved
- Empty fields filled with order data

### User Experience
- Users opening old budgets see complete client info
- No "missing data" warnings in PDF
- Consistent data between orders and budgets

---

## 🔧 Troubleshooting

### Problem: Field still empty after backfill
**Check**:
1. Does order have that field populated?
2. Is budget linked to order (order_id exists)?
3. Run preview query to see what's being matched

### Problem: Manual edit was overwritten
**Check**:
1. Was field truly empty before edit?
2. Did user save after editing?
3. Check SQL condition - should be `COALESCE(...) = ''`

### Problem: Frontend not showing data
**Check**:
1. Console for order fetch errors
2. order_id in budget record
3. Network tab - verify API call succeeded

---

## 📝 Maintenance

### Future Backfills
To run additional backfills:
1. Use the same SQL script
2. It's idempotent - safe to run multiple times
3. Only empty fields will be updated

### Adding New Fields
To add new client info field:
1. Add to SQL script with same safe pattern
2. Add to frontend fallback logic  
3. Test with one budget first
