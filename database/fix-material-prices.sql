-- Fix material prices that might have been incorrectly entered as integers (e.g. 5 instead of 0.5)

-- Update specific products by name (matching both Spanish and likely French keys)
UPDATE products 
SET price_per_portion = 0.50 
WHERE category = 'material' 
  AND (
    name ILIKE '%plato%' OR 
    name ILIKE '%assiette%' OR 
    name ILIKE '%copa%' OR 
    name ILIKE '%verre%' OR 
    name ILIKE '%vaso%' OR 
    name ILIKE '%tenedor%' OR 
    name ILIKE '%fourchette%' OR 
    name ILIKE '%cuchillo%' OR 
    name ILIKE '%couteau%' OR 
    name ILIKE '%cuchara%' OR 
    name ILIKE '%cuillere%'
  )
  AND price_per_portion >= 1.0; -- Only update if price looks surprisingly high (>= 1 euro for a plate/cutlery is high if it was meant to be 0.5)

-- You can add specific updates if needed:
-- UPDATE products SET price_per_portion = 0.50 WHERE name = 'Assiettes plates';
-- UPDATE products SET price_per_portion = 0.50 WHERE name = 'Assiettes creuses';
