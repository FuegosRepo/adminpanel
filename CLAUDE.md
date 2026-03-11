# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fuegos d'Azur Admin Panel — a catering management system for orders, budgets/quotes, payments, financial reports, event calendar, and product pricing. The team communicates in Spanish.

## Commands

```bash
npm run dev      # Dev server on port 3001
npm run build    # Production build (ignores TS/ESLint errors)
npm run lint     # ESLint
npx vitest       # Run tests (vitest with jsdom, globals enabled)
npx vitest run src/utils/logger.test.ts  # Run a single test
```

## Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript 5
- **Database/Auth**: Supabase (PostgreSQL) with SSR cookie-based sessions
- **Styling**: Tailwind CSS 3.4 (CSS variables, HSL) + CSS Modules for some pages
- **UI Components**: shadcn/ui (Radix UI) in `src/components/ui/`
- **State**: TanStack React Query 5 (60s stale time, 1 retry)
- **Notifications**: Sonner toasts
- **PDFs**: jsPDF + Puppeteer Core (Chromium via @sparticuz/chromium)
- **Email**: Resend
- **Charts**: Recharts
- **Deployment**: Netlify, Node 20 LTS

## Architecture

### Path alias
`@/*` maps to `./src/*` (configured in tsconfig.json).

### App Router structure (`src/app/`)
- `(admin)/` — Protected admin routes (orders, budgets, payments, reports, calendar, reminders, prices, calculator) wrapped in a layout with Sidebar + Header
- `api/` — Route Handlers for email sending, PDF generation, budget operations, products CRUD
- `login/` — Auth page
- `page.tsx` — Redirects to `/orders`
- `budget-v2/`, `budget-v3/`, `orders-v2/`, `orders-v3/` — Versioned feature pages

### Authentication flow
- `src/middleware.ts` protects routes, redirects unauthenticated users to `/login`
- Browser client: `src/lib/supabaseClient.ts` (createBrowserClient)
- Server client: `src/utils/supabase/server.ts` (createClient with cookies)
- API routes verify session via `supabase.auth.getSession()`

### Data layer
- **Services** (`src/services/`): `ordersService.ts`, `budgetsService.ts`, `externalBudgetsService.ts` — fetch data from Supabase with pagination and filters
- **Hooks** (`src/hooks/`): `useOrders`, `useBudgets`, `useProducts`, etc. — wrap services with React Query (queries + mutations with cache invalidation and toast notifications)
- **Types** (`src/types/`): `index.ts` (CateringOrder, Product, etc.), `externalBudget.ts`

### Component organization (`src/components/`)
- Feature modules: `BudgetEditor/`, `OrderCard/`, `OrderDetails/`, `PaymentTracker/`, `PriceManager/`, `EventsCalendar/`, `FinancialReports/`, etc.
- `ui/` — shadcn/ui primitives (Button, Dialog, Card, Table, Tabs, Select, etc.)
- `common/` — Shared components

### Key utilities
- `src/utils/queryHelpers.ts` — Pagination helpers, input sanitization
- `src/lib/budgetPDFTemplate.ts` / `budgetPDFService.ts` — PDF generation
- `src/lib/emails/` — Email service (Resend), types, and templates
- `src/lib/productNormalization.ts`, `entreeMapping.ts`, `meatMapping.ts` — Product data normalization

## Conventions

- Components use `'use client'` directive when needed (hooks, state, browser APIs)
- API calls from components use `fetch('/api/...')` to Next.js route handlers
- Mutations use React Query's `useMutation` with `onSuccess` cache invalidation and `toast` feedback
- Forms use controlled inputs with `useState` (no form library)
- Primary brand color is orange (`--primary: 30 78% 56%`)
- Font: Mulish (Google Fonts)
