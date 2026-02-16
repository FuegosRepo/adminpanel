-- Add relance_count column to budgets table
ALTER TABLE budgets 
ADD COLUMN IF NOT EXISTS relance_count INTEGER DEFAULT 0;

-- Backfill relance_count from email_logs
-- Count how many 'Relance' emails have been sent for each order linked to a budget
WITH relance_counts AS (
  SELECT 
    order_id, 
    COUNT(*) as count
  FROM email_logs
  WHERE subject LIKE '%Relance%' OR content LIKE '%Relance%'
  GROUP BY order_id
)
UPDATE budgets
SET relance_count = rc.count
FROM relance_counts rc
WHERE budgets.order_id = rc.order_id;
