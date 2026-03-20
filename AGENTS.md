# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a Next.js 14 portfolio site (TypeScript, SCSS, MDX content, `next-intl` i18n). No database or Docker required — all content is file-based.

### Running the application

- **Dev server:** `npm run dev` (port 3000)
- **Production server:** `npm run build && npm start` (port 3001 by default, configurable via `PORT` env var)
- **Lint:** `npm run lint`
- **Build:** `npm run build`

### Environment setup

Copy `.env.example` to `.env` before running. Placeholder values are fine for rendering all pages; only the contact form submission (`/api/contact`) requires real SMTP and Cloudflare Turnstile credentials.

### Gotchas

- The default locale is Arabic (RTL). The homepage at `/` redirects to `/ar`. English is at `/en`.
- Build emits an SMTP timeout warning when `SMTP_*` env vars contain placeholder values — this is harmless and does not fail the build.
- The `next-intl` deprecation warning about `getRequestConfig` locale parameter is cosmetic and does not affect functionality.
- No automated test suite exists (no `test` script in `package.json`). Validation is done via `npm run lint` and `npm run build`.
