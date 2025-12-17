-- ========================================
-- QUICK EXECUTION GUIDE
-- Execute these commands in Supabase SQL Editor
-- ========================================

-- STEP 1: CREATE BI-DIRECTIONAL SYNC TRIGGERS
-- Copy the entire contents of: sync_budget_order_data.sql
-- Then execute STEP 2 below

-- ========================================
-- STEP 2: BACKFILL EXISTING BUDGETS
-- Execute this immediately after Step 1
-- ========================================

-- Count budgets that need backfilling
DO $$
DECLARE
    budgets_to_update INTEGER;
BEGIN
    SELECT COUNT(*) INTO budgets_to_update
    FROM budgets b
    INNER JOIN catering_orders o ON b.order_id = o.id
    WHERE b.budget_data->'menu'->'selectedItems' IS NULL 
       OR (
           COALESCE(jsonb_array_length(b.budget_data->'menu'->'selectedItems'->'entrees'), 0) = 0
           AND COALESCE(jsonb_array_length(b.budget_data->'menu'->'selectedItems'->'viandes'), 0) = 0
           AND COALESCE(jsonb_array_length(b.budget_data->'menu'->'selectedItems'->'desserts'), 0) = 0
       );
    
    RAISE NOTICE 'Found % budgets that need selectedItems backfilling', budgets_to_update;
END $$;

-- Backfill selectedItems
UPDATE budgets b
SET budget_data = jsonb_set(
    jsonb_set(
        jsonb_set(
            COALESCE(b.budget_data, '{}'::jsonb),
            '{menu,selectedItems,entrees}',
            CASE 
                WHEN o.entrees IS NOT NULL AND array_length(o.entrees, 1) > 0 THEN
                    to_jsonb(o.entrees)
                ELSE 
                    '[]'::jsonb
            END
        ),
        '{menu,selectedItems,viandes}',
        CASE 
            WHEN o.viandes IS NOT NULL AND array_length(o.viandes, 1) > 0 THEN
                to_jsonb(o.viandes)
            ELSE 
                '[]'::jsonb
        END
    ),
    '{menu,selectedItems,desserts}',
    CASE 
        WHEN o.dessert IS NOT NULL AND o.dessert != '' THEN
            jsonb_build_array(o.dessert)
        ELSE 
            '[]'::jsonb
    END
),
updated_at = NOW()
FROM catering_orders o
WHERE b.order_id = o.id
  AND (
      b.budget_data->'menu'->'selectedItems' IS NULL 
      OR (
          COALESCE(jsonb_array_length(b.budget_data->'menu'->'selectedItems'->'entrees'), 0) = 0
          AND COALESCE(jsonb_array_length(b.budget_data->'menu'->'selectedItems'->'viandes'), 0) = 0
          AND COALESCE(jsonb_array_length(b.budget_data->'menu'->'selectedItems'->'desserts'), 0) = 0
      )
  );

-- ========================================
-- STEP 3: VERIFY
-- ========================================

-- Check triggers were created
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'budgets'
ORDER BY trigger_name;

-- Verify backfill worked
SELECT 
    COUNT(*) as total_budgets_with_order,
    SUM(CASE WHEN budget_data->'menu'->'selectedItems' IS NOT NULL THEN 1 ELSE 0 END) as budgets_with_selecteditems
FROM budgets
WHERE order_id IS NOT NULL;
