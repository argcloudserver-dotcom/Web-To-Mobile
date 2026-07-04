---
name: TIL CRM Migration
description: Key lessons from migrating the TIL CRM from tar.gz archive into Replit workspace (api-server + Expo mobile).
---

# TIL CRM Migration Lessons

## Architecture
- Monorepo: lib/{core,shared,permissions,api-client,api-zod,db,i18n,ui} + artifacts/{api-server,mobile}
- API server: Express + drizzle-orm + passport, built with esbuild, runs on PORT env var
- Mobile: Expo Router, connects to API via `EXPO_PUBLIC_DOMAIN` → `https://${domain}`
- Auth: mobile uses Bearer tokens (x-client-platform: mobile header), web uses cookies+CSRF

## Critical: Metro / exceljs conflict
Metro (React Native bundler) crashes when exceljs is installed in workspace root because exceljs creates temp dirs that Metro tries to watch but they disappear. **Fix: add exceljs and other server-only packages to metro.config.js blockList.**

## CORS for React Native
React Native doesn't send an `Origin` header. The CRM's app.ts uses a static `env.CORS_ORIGINS` array — this blocks React Native requests silently. **Fix: use a function-based CORS origin that allows `!origin` (React Native) and any `*.replit.dev` / `*.replit.app` domain.**

## Required env vars for api-server
- DATABASE_URL (auto-set by Replit PostgreSQL)
- JWT_SECRET (≥32 chars)
- JWT_REFRESH_SECRET (≥32 chars)
- CSRF_SECRET (≥32 chars)
- PUBLIC_APP_URL (https://${REPLIT_DEV_DOMAIN})
- AUTH_MODE=mock (for dev without OAuth secrets)

## API server local lib structure
CRM's `apps/api/src/lib/` has local files (auth/, email/, database/, audit.ts, sanitize.ts) that features import via `../../lib/`. These must be copied to `artifacts/api-server/src/lib/` alongside env.ts and logger.ts.

**Why:** esbuild bundles from src/index.ts — it resolves relative paths at build time, not via node_modules, so workspace lib packages don't satisfy `../../lib/` imports.

## DB schema push
`pnpm --filter @workspace/db push` pushes the CRM drizzle schema to Replit PostgreSQL. The drizzle.config.ts uses `SUPABASE_DATABASE_URL || DATABASE_URL`.
