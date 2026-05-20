## Review

- Correct:
  - Most API routes use `createClient()` and explicitly call `supabase.auth.getUser()` before sensitive operations, e.g. `src/app/api/generate-budget-pdf/route.ts:8-18`, `src/app/api/send-email/route.ts:8-18`, `src/app/api/products/route.ts:8-13`.
  - Supabase env usage mostly keeps secret values server-side; public browser client only uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `src/lib/supabaseClient.ts`.
  - `.gitignore` excludes `.env`, `.env*.local`, `.netlify`, `.vercel`, and `*.pem`.

- Note:
  - `plan.md` and `progress.md` were requested but do not exist in this checkout.
  - I did not write `audit-security.md` because the task also says “read-only” / “Do not modify files”; per instructions, no-edit wins.
  - Engram tools are not available in this subagent environment, so I could not save discoveries there.
  - `npm audit --omit=dev --audit-level=moderate --json` was run read-only and reported 10 production vulnerabilities: 2 critical, 3 high, 5 moderate.

## Findings

### Critical

1. **Next.js version has known proxy/middleware bypass advisories while auth relies heavily on `src/proxy.ts`**
   - Evidence:
     - Auth gate is centralized in `src/proxy.ts:32-45`.
     - `package.json:36` pins `next` to `^16.1.6`.
     - `npm audit` reports multiple high Next.js advisories for versions `<16.2.5` / `<16.2.6`, including Middleware / Proxy bypasses.
   - Risk:
     - Routes or pages protected only by proxy may become reachable if the deployed Next.js version is affected.
   - Remediation:
     - Upgrade Next.js to a patched version per advisory, then rerun `npm audit`.
     - Keep route-level authorization checks on every sensitive API route; do not rely on proxy alone.

2. **Product update/delete API lacks route-level authentication and uses the browser Supabase client**
   - Evidence:
     - `src/app/api/products/[id]/route.ts:1-2` imports `supabase` from `@/lib/supabaseClient`.
     - `PUT` updates products without `getUser()` check at `src/app/api/products/[id]/route.ts:21-32`.
     - `DELETE` deletes products without `getUser()` check at `src/app/api/products/[id]/route.ts:67-70`.
   - Risk:
     - If proxy is bypassed/misconfigured, this route has no local auth barrier. It also uses the browser client in a server route, so auth/RLS behavior is fragile.
   - Remediation:
     - Replace with `createClient()` from `src/utils/supabase/server.ts`.
     - Add `supabase.auth.getUser()` check like `src/app/api/products/route.ts`.
     - Optionally verify admin role/claim before mutation.

3. **Stored XSS risk in budget HTML/PDF preview generation**
   - Evidence:
     - `preview-budget-html` returns generated HTML directly as `text/html` at `src/app/api/preview-budget-html/route.ts:49-57`.
     - Budget fields are interpolated into HTML after `cleanText()`, which removes emojis but does not HTML-escape, e.g. `src/lib/budgetPDFTemplate.ts:424`, `429`, `434`, `439`, `445`, `765`.
   - Risk:
     - A malicious customer/order/budget field containing HTML/script can execute in an authenticated admin’s browser when previewing HTML.
   - Remediation:
     - Add centralized HTML escaping for all interpolated text.
     - Treat generated preview as untrusted: add CSP headers, or render inside sandboxed iframe.
     - Do not use `text/html` for unescaped user-derived templates.

### High

1. **Any authenticated Supabase user appears to get broad admin-level data access**
   - Evidence:
     - Login accepts any Supabase email/password user: `src/app/login/page.tsx:26-29`.
     - Proxy checks only that a user exists: `src/proxy.ts:32-45`.
     - RLS migration grants all authenticated users access to orders/products:
       - Orders select/write/delete: `database/secure-rls.sql:14-38`.
       - Products all operations: `database/secure-rls.sql:57-62`.
   - Risk:
     - If non-admin users exist in the same Supabase project, they can access/administer catering orders and products.
   - Remediation:
     - Add admin authorization via Supabase custom claims, `profiles.role`, or allowlist table.
     - Enforce role checks in proxy, every API route, and RLS policies.

2. **Payment link creation trusts client-supplied amount and recipient**
   - Evidence:
     - `orderId`, `amount`, `customerEmail`, `customerName` are read directly from request body at `src/app/api/payments/create-link/route.ts:18`.
     - Amount is sent to Systempay from client input at `src/app/api/payments/create-link/route.ts:40-60`.
   - Risk:
     - An authenticated but unauthorized/malicious admin session could create payment links for arbitrary amounts/emails not matching the order.
   - Remediation:
     - Fetch order/budget server-side by `orderId`.
     - Derive amount and customer email from DB.
     - Validate amount bounds and order status.

3. **Payment webhook is not idempotent**
   - Evidence:
     - Webhook appends a transaction at `src/app/api/payments/webhook/route.ts:91-99`.
     - It increments `paidAmount` unconditionally at `src/app/api/payments/webhook/route.ts:101`.
   - Risk:
     - Retried or replayed valid webhooks can double-count payments.
   - Remediation:
     - Store processed transaction UUIDs in a separate table with unique constraint.
     - Before incrementing, verify transaction was not already processed.
     - Use a DB transaction/RPC for atomic update.

4. **Critical/high vulnerable dependencies in production tree**
   - Evidence:
     - `package.json:32-34` includes `jspdf`, `jspdf-autotable`, and `lodash`.
     - `package.json:36` includes vulnerable Next version.
     - `npm audit` reported critical `jspdf`, high `jspdf-autotable`, high `lodash`, high `next`, plus transitive issues.
   - Remediation:
     - Upgrade Next.js to patched version.
     - Upgrade `jspdf`/`jspdf-autotable` or remove if no longer used.
     - Upgrade lodash when patched version is available, or avoid vulnerable APIs.

### Medium

1. **Sensitive/customer PII is logged**
   - Evidence:
     - Full `clientInfo` logged in `src/lib/budgetPDFTemplate.ts:152-153`.
     - Client email logged in `src/app/api/approve-and-send-budget/route.ts:31`.
     - Generated public PDF URL logged in `src/app/api/generate-budget-pdf/route.ts:96`.
   - Risk:
     - Logs may contain customer names, email, phone, event details, and PDF links.
   - Remediation:
     - Use structured logger with redaction.
     - Remove full object logs in production.
     - Log IDs only unless explicitly needed.

2. **Public Supabase Storage URLs for budget PDFs**
   - Evidence:
     - `getPublicUrl()` is used for budget PDFs at `src/app/api/generate-budget-pdf/route.ts:76-84`.
   - Risk:
     - Anyone with the URL can access quote PDFs containing customer/event details.
   - Remediation:
     - Use private bucket + signed URLs with short TTL.
     - Avoid storing permanent public links in `budgets.pdf_url`.

3. **Payment webhook signature comparison is not timing-safe**
   - Evidence:
     - Plain string comparison at `src/app/api/payments/webhook/route.ts:48`.
   - Risk:
     - Minor HMAC verification hardening issue.
   - Remediation:
     - Use `crypto.timingSafeEqual()` after validating equal buffer lengths.

4. **Build ignores TypeScript errors**
   - Evidence:
     - `next.config.js:13-15`.
   - Risk:
     - Type/auth regressions can deploy unnoticed.
   - Remediation:
     - Remove `typescript.ignoreBuildErrors`.
     - Make CI fail on TypeScript and lint errors.

### Low

1. **No explicit security headers/CSP observed**
   - Evidence:
     - `next.config.js` has no `headers()` config.
   - Risk:
     - XSS impact is higher without CSP, especially with HTML preview routes.
   - Remediation:
     - Add CSP, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `X-Content-Type-Options`, and permissions policy.

2. **Payment integration hardcodes test key selection**
   - Evidence:
     - `SYSTEMPAY_TEST_KEY` is used in create-link at `src/app/api/payments/create-link/route.ts:28-29`.
     - Webhook also uses `SYSTEMPAY_TEST_KEY` at `src/app/api/payments/webhook/route.ts:36`.
   - Risk:
     - Production/test confusion can cause payment failures or validation mismatch.
   - Remediation:
     - Use env-driven mode selection.
     - Prefer dedicated webhook/IPN key variable.
     - Fail closed if production runs with test key.