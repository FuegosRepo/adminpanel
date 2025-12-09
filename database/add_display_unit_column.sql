-- Add display_unit column to combo_ingredients table
-- This allows per-ingredient preference of unit display (e.g. 'gr' vs 'kg') while keeping 'quantity' normalized.

ALTER TABLE combo_ingredients
ADD COLUMN display_unit text DEFAULT 'storage';

-- Comment check to ensure we know valid values: 'kg', 'gr', 'u', 'storage'
