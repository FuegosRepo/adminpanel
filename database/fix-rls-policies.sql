-- =========================================
-- POLÍTICAS RLS PARA ACCESO PÚBLICO
-- Sin autenticación requerida
-- =========================================

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Permitir INSERT público en catering_orders" ON public.catering_orders;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer todo en catering_orders" ON public.catering_orders;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar catering_orders" ON public.catering_orders;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar catering_orders" ON public.catering_orders;
DROP POLICY IF EXISTS "Allow public insert on catering_orders" ON public.catering_orders;
DROP POLICY IF EXISTS "Allow authenticated select on catering_orders" ON public.catering_orders;
DROP POLICY IF EXISTS "Allow authenticated update on catering_orders" ON public.catering_orders;
DROP POLICY IF EXISTS "Allow authenticated delete on catering_orders" ON public.catering_orders;
DROP POLICY IF EXISTS "TEMP Allow anon update on catering_orders" ON public.catering_orders;

-- Crear políticas públicas (sin autenticación)
CREATE POLICY "Public access - INSERT"
  ON public.catering_orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public access - SELECT"
  ON public.catering_orders
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public access - UPDATE"
  ON public.catering_orders
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public access - DELETE"
  ON public.catering_orders
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Asegurar que RLS está habilitado
ALTER TABLE public.catering_orders ENABLE ROW LEVEL SECURITY;

-- Verificar políticas
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'catering_orders';
