-- CLEANUP AND HIDE INGREDIENTS SCRIPT
-- Goal: Hide ingredients from the "Postres" tab but keep them active for combos.
-- Remove obsolete items.

-- 1. Deactivate obsolete items
-- 'Fruits flambes' (old non-combo or simple item causing clutter if exists as non-combo)
-- 'Panqueques con dulce de leche' (old)
-- 'Frutos Rojos' (duplicate with capital R, if it exists and is not the one used)
-- Note: We need to be careful not to deactivate the *new* combo if it has similar name.
-- The new combo is 'Fruits grille' and 'Panqueque'.

UPDATE products
SET active = false,
    updated_at = NOW()
WHERE name IN ('Fruits flambes', 'Panqueques con dulce de leche', 'Frutos Rojos');

-- 2. Move ingredients to a hidden category
-- We use 'insumos_postres' which is not in the UI tabs list.
-- Items to move: 'Helado', 'Base Fruits grille', 'Frutos rojos' (lowercase r, assuming this is the active one used in combos)
-- Also 'Panqueques' if it refers to the ingredient "masas" and not the combo.
-- Wait, the combo is named 'Panqueque' (singular).
-- If there is a product 'Panqueques' (plural) that caused clutter, check if it's the ingredient or old product.
-- User listed 'Panqueques' -> 'Panqueques con dulce de leche'. That was likely a category header or item.
-- User listed 'Frutos rojos' (active) and 'Frutos Rojos' (duplicate).
-- Let's move the active ingredients.

UPDATE products
SET category = 'insumos_postres',
    updated_at = NOW()
WHERE name IN ('Helado', 'Base Fruits grille', 'Frutos rojos');

-- Verify: The combos 'Panqueque' and 'Fruits grille' should remain in 'postres'.
-- They are NOT touched by above queries.
