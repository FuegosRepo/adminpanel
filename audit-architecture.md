# PanelAdmin Architecture Audit

Scope: read-only audit of `C:/Users/FrancoCorujo/FuegosDirectorio/PanelAdmin`. Reviewed project guidance, config, App Router routes, Supabase clients, API routes, services/hooks/types, and representative modules. Applied `.agents/skills/vercel-react-best-practices/SKILL.md` for React/Next.js performance review. Engram save was requested, but no Engram/memory tool is callable in this subagent session.

## Architecture map

- **Runtime/config**
  - Next/React versions are from `package.json` lines 36-40: Next `^16.1.6`, React `^19.2.4`, despite `CLAUDE.md` saying Next 14/React 18.
  - `next.config.js` lines 3-16 enables strict mode, disables image optimization, ignores TypeScript build errors, and externalizes Chromium/Puppeteer packages.
  - Netlify deploy target is configured in `netlify.toml` with Node 20 and `@netlify/plugin-nextjs`.
- **Routing**
  - App Router under `src/app`:
    - Protected admin pages: `src/app/(admin)/orders|budgets|payments|reports|calendar|reminders|prices|calculator/page.tsx`.
    - API handlers: `src/app/api/**/route.ts` for budgets, email, products, payments, PDF.
    - Public-ish pages: `src/app/login/page.tsx`, `src/app/page.tsx`, `src/app/pdf-preview/page.tsx`, `src/app/test-email/page.tsx`.
  - Root layout injects font, React Query provider, and toaster in `src/app/layout.tsx` lines 1-38.
  - Admin shell is a client component with Sidebar/Header in `src/app/(admin)/layout.tsx` lines 1-23.
- **Auth/Supabase**
  - Next 16 proxy auth is in `src/proxy.ts` lines 1-40, using Supabase SSR cookies and redirecting unauthenticated requests.
  - Browser client is `src/lib/supabaseClient.ts` lines 1-5.
  - Server client is `src/utils/supabase/server.ts` lines 1-25.
  - Most authenticated API routes call `createClient()` and `supabase.auth.getUser()` (example: `src/app/api/products/route.ts` lines 1-70).
- **Data layer**
  - Services query Supabase directly from client-side React Query hooks. Example: `src/services/ordersService.ts` lines 1-3, 66-90, 128-160; `src/services/budgetsService.ts` lines 1-87.
  - Hooks combine React Query with direct Supabase mutations. Example: `src/hooks/useOrders.ts` lines 1-22 and 34-75; `src/hooks/useBudgets.ts` lines 1-110.
  - Shared domain types are centralized in `src/types/index.ts`, but several important shapes still use `any` in feature internals.
- **Feature modules**
  - Orders page (`src/app/(admin)/orders/page.tsx`) owns page state, modals, email calls, and direct deletes; see lines 1-30 and 102-125.
  - Budgets flow: page -> `BudgetsManager` -> `BudgetsList` -> `BudgetEditor`; editor composes feature hooks and sections (`src/components/BudgetEditor/index.tsx`).
  - Budget editor data hook performs multi-step client-side reads/enrichment in `src/components/BudgetEditor/hooks/useBudgetData.ts` lines 18-120 and client-side PDF generation/upload in lines 401-448.
  - Price manager uses feature-local hooks and direct Supabase writes in `src/components/PriceManager/hooks/useProducts.ts`.
  - Reports/calendar are mostly client-side derived views over React Query-loaded datasets.

## Strengths

1. **Clear feature modularity**: large domains are grouped under `src/components/BudgetEditor`, `BudgetsList`, `PriceManager`, `EventsCalendar`, `FinancialReports`, etc.
2. **React Query is consistently used for read caching** with sensible defaults in `src/providers/ReactQueryProvider.tsx` lines 1-24.
3. **Supabase SSR auth pattern is present** via `src/proxy.ts` and `src/utils/supabase/server.ts`.
4. **Many API routes verify users server-side** before sensitive operations, e.g. `src/app/api/update-budget/route.ts` lines 8-18 and `src/app/api/generate-budget-pdf/route.ts` lines 8-18.
5. **Some performance work already exists**: pagination in order/budget services, batched bulk relance (`src/app/api/bulk-relance/route.ts`), and dynamic PDF import in `src/components/BudgetEditor/hooks/useBudgetData.ts` lines 418-425.
6. **Operational utilities exist**: structured logger in `src/utils/logger.ts`, query sanitization/pagination in `src/utils/queryHelpers.ts`, and isolated email templates/services.

## Architectural risks / findings

### P0 - Payment webhook is likely blocked by proxy auth

`src/proxy.ts` only treats `/login`, `/api/auth`, and static assets as public (lines 36-40). The matcher covers almost all paths. `src/app/api/payments/webhook/route.ts` is designed for unauthenticated Systempay callbacks and uses signature verification plus service role at lines 50-68, but the proxy can redirect unauthenticated webhook requests to `/login` before the route runs.

**Impact:** card payments may never update orders in production.

### P0 - API route uses browser Supabase client and lacks explicit auth

`src/app/api/products/[id]/route.ts` imports `supabase` from the browser client at line 2 and does PUT/DELETE without `createClient()` + `auth.getUser()` checks (lines 21-32 and 67-70). This differs from `src/app/api/products/route.ts`, which authenticates at lines 7-11 and 40-44.

**Impact:** inconsistent security model; route behavior depends on proxy/RLS rather than explicit route auth and may fail or bypass intended invariants.

### P1 - Build is configured to ignore TypeScript errors

`next.config.js` lines 13-15 sets `typescript.ignoreBuildErrors: true` while the repo uses `strict: true` in `tsconfig.json`. This hides correctness regressions in a data-heavy admin app.

**Impact:** broken API contracts and unsafe casts can ship.

### P1 - Version/config drift between guidance and package

`CLAUDE.md` says Next 14/React 18, but `package.json` lines 36-40 uses Next 16/React 19. ESLint config extends `eslint-config-next` `^15.5.12` while Next is `^16.1.6`.

**Impact:** agents/developers may use wrong framework conventions; lint rules may lag runtime behavior.

### P1 - Business invariants are split between client mutations and API routes

Examples:
- Order status mutation syncs budget statuses in client hook `src/hooks/useOrders.ts` lines 34-66.
- Order deletion manually deletes related budgets in the client page `src/app/(admin)/orders/page.tsx` lines 102-125.
- Budget update is server-side in `src/app/api/update-budget/route.ts`, syncing parent order after budget update.

**Impact:** partial updates are possible; different screens can bypass each other’s invariants. Prefer server-side transactions/RPC/API handlers for multi-table writes.

### P1 - Data fetching waterfalls and client-heavy pages

`src/components/BudgetEditor/hooks/useBudgetData.ts` fetches budget, then conditionally order, then products (lines 22-100), with some material fetch parallelization. Most admin pages are client components, and `src/app/(admin)/layout.tsx` is also client-only.

**Impact:** slower first load and bigger client bundles. Vercel best-practice priorities: reduce waterfalls, move secure/non-interactive data to server/API, and dynamically load heavy modules.

### P1 - Product API schema appears stale compared with Product type/current UI

`src/app/api/products/route.ts` POST expects `{ name, category, price, active }` and inserts `price` (lines 46-64). `Product` in `src/types/index.ts` uses `price_per_kg`, `price_per_portion`, `unit_type`, `is_combo`, etc.; `PriceManager` writes those fields directly via Supabase.

**Impact:** API endpoints may be unused or broken for current schema.

### P2 - Type safety erosion in domain-critical code

Examples:
- `mapRowToOrder(row: any)` in `src/services/ordersService.ts` lines 128-160.
- `setBudget(data as any)` and note parsing `n: any` in `src/components/BudgetEditor/hooks/useBudgetData.ts` lines 32-69.
- `version_data`, `comparison_data`, etc. are `any` in `src/types/index.ts`.

**Impact:** shape changes in Supabase JSON columns can silently break budget/order flows.

### P2 - Large feature hooks mix IO, normalization, business rules, and UI state

`src/components/BudgetEditor/hooks/useBudgetData.ts` handles fetching, legacy note parsing, product normalization, material price correction, save/delete/approve/PDF/mark-sent/create-linked-order. `src/hooks/useOrders.ts` handles reads plus status/payment/internal-note mutations.

**Impact:** hard to test, hard to reuse, and high regression risk.

### P2 - Logging is inconsistent

A structured logger exists (`src/utils/logger.ts`), but many modules still use direct `console.log/error`, including PDF generation (`src/lib/budgetPDFService.ts` lines 12-53), order page deletes, and hooks.

**Impact:** noisy production logs, potential PII leakage, harder observability.

### P2 - PDF architecture is split

Server-side Puppeteer generation exists in `src/lib/budgetPDFService.ts` and API route `src/app/api/generate-budget-pdf/route.ts`, while budget editor currently uses client-side React PDF service via dynamic import (`src/components/BudgetEditor/hooks/useBudgetData.ts` lines 418-425). Both define filename helpers with different accent normalization behavior (`src/lib/budgetPDFService.ts` lines 98-127 vs `src/lib/pdf/pdfClientService.tsx`).

**Impact:** inconsistent output and duplicated maintenance.

## Performance / maintainability notes

- **Good:** services paginate list views (`src/services/ordersService.ts` lines 66-90; `src/services/budgetsService.ts` lines 27-87).
- **Concern:** report/calendar flows fetch broad datasets without pagination (`fetchAllOrdersForReports`, `fetchOrdersWithEvents` in `src/services/ordersService.ts` lines 184-218), acceptable for small data but risky as history grows.
- **Concern:** root `ReactQueryProvider` is fine, but making the whole admin shell client (`src/app/(admin)/layout.tsx` line 1) reduces server-component opportunities.
- **Concern:** heavy libraries exist in dependencies (`@react-pdf/renderer`, `jspdf`, `puppeteer-core`, `recharts`, `react-calendar`). Use route-level and interaction-level dynamic imports for BudgetEditor PDF, reports charts, calendar, and calculator where not already deferred.
- **Concern:** `next.config.js` line 11 disables image optimization globally; if remote images are mostly email/PDF assets, scope this decision and avoid using it for UI images.

## Prioritized improvements

1. **Fix public webhook routing immediately**
   - Update `src/proxy.ts` to explicitly allow `/api/payments/webhook` while keeping signature validation in `src/app/api/payments/webhook/route.ts`.
   - Add a route-level test or integration note for unauthenticated webhook POST.

2. **Standardize API auth and Supabase clients**
   - Replace browser client usage in `src/app/api/products/[id]/route.ts` with `createClient()` from `src/utils/supabase/server.ts` and `auth.getUser()`.
   - Audit all `src/app/api/**/route.ts` for consistent auth/public exceptions.

3. **Move multi-table mutations server-side**
   - Convert order delete/status sync and budget/order sync to API handlers or Supabase RPCs.
   - Candidate files: `src/app/(admin)/orders/page.tsx`, `src/hooks/useOrders.ts`, `src/hooks/useBudgets.ts`, `src/components/BudgetEditor/hooks/useBudgetData.ts`.

4. **Re-enable type safety in builds**
   - Remove `typescript.ignoreBuildErrors` from `next.config.js` after fixing current errors.
   - Align ESLint config/dependency with Next 16.

5. **Update project guidance and dependency alignment**
   - Update `CLAUDE.md` to Next 16/React 19 or pin package versions back to documented stack.
   - Confirm Netlify Next 16 support and Node/React compatibility.

6. **Refactor BudgetEditor data orchestration**
   - Split `useBudgetData` into smaller units: fetch/enrich, note operations, budget mutations, PDF operations.
   - Consider React Query for budget detail instead of manual `useEffect` + local state.

7. **Unify product data access**
   - Decide whether products are managed via API routes or direct Supabase client.
   - Update `src/app/api/products/route.ts` and `[id]/route.ts` to current `Product` schema or remove unused stale endpoints.

8. **Unify PDF generation path**
   - Pick client React-PDF or server Puppeteer as the primary path.
   - Consolidate filename generation and storage upload helpers.

9. **Reduce client bundle and waterfalls**
   - Keep pages thin; dynamically import heavy feature modules where appropriate (`FinancialReports`, `EventsCalendar`, `EventCalculator`, `BudgetEditor`).
   - Move initial reads for detail pages behind API/RSC where possible; start independent requests in parallel.

10. **Improve tests around core flows**
   - Add tests for `queryHelpers`, order/budget mapping, budget status transitions, webhook signature/payment update, and product API schema.
   - Current Vitest config exists, but coverage appears minimal.
