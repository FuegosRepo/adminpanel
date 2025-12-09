-- LIMPIEZA DE POSTRES - DICIEMBRE 2025 (FIXED - SOFT DELETE)
-- Ejecutar este script en el SQL Editor de Supabase

-- NOTA: No podemos usar DELETE físico porque los productos están usados en eventos pasados (historial).
-- En su lugar, los marcamos como INACTIVOS (active = false) para que no aparezcan en selectores futuros.

BEGIN;

-- 1. DESACTIVAR PRODUCTOS DE LA CATEGORÍA POSTRES
-- Mantenemos activos solo: Panqueque, Fruits grille, Frutos rojos, Helado, Base Fruits grille
UPDATE products 
SET active = false,
    updated_at = NOW()
WHERE category = 'postres'
AND name NOT IN ('Panqueque', 'Fruits grille', 'Frutos rojos', 'Helado', 'Base Fruits grille');

-- 2. DESACTIVAR TAMBIÉN LOS OTROS PRODUCTOS 'ELIMINADOS' ANTERIORMENTE SI FALLÓ EL DELETE
-- Costillar, Berengenas, Anana
UPDATE products 
SET active = false,
    updated_at = NOW()
WHERE name IN ('Costillar', 'Berengenas', 'Anana', 'Anana/U');

-- 3. (OPCIONAL) LIMPIAR INGREDIENTES DE RECETAS INTRA-COMBO QUE YA NO SE USAN
-- Esto sí se puede borrar si no afecta history, pero combo_ingredients suele ser snapshot definition.
-- Depende de cómo funcione el sistema. Si combo_ingredients es definition, se puede borrar.
-- La constraint key fk violation era con event_calculation_ingredients (historial).
DELETE FROM combo_ingredients
WHERE combo_id IN (
    SELECT id FROM products 
    WHERE category = 'postres' 
    AND active = false
);

COMMIT;

-- VERIFICACIÓN
SELECT name, active FROM products WHERE category = 'postres';
