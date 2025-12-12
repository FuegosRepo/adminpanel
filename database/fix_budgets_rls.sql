-- Enable RLS on the budgets table
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.budgets;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.budgets;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.budgets;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.budgets;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.budgets;

-- Create comprehensive policy for authenticated users (Admin Panel)
CREATE POLICY "Enable all access for authenticated users"
ON public.budgets
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Optional: If you need public access for viewing (e.g., client viewing their budget), un-comment below:
-- CREATE POLICY "Enable read access for public"
-- ON public.budgets
-- FOR SELECT
-- TO anon
-- USING (true);
