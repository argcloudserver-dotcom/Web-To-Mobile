/**
 * RBAC permission guard.
 *
 * AUDIT FIX: This module previously contained a second, divergent
 * implementation that read `(req as any).user.permissions`. That property is
 * never populated — `requireAuth` attaches the authenticated user to
 * `req.currentUser` — so every guarded route rejected legitimate, authenticated
 * users with `401 Unauthorized`. It also used `any`, duplicated the permission
 * registry, and bypassed the database-backed role/override resolver.
 *
 * It now delegates to the single canonical implementation in
 * `@workspace/permissions`, which reads `req.currentUser` and resolves
 * permissions through role defaults + per-user overrides. The typed
 * `Permission` union is kept in sync with the canonical PERMISSIONS constant.
 */
import { withPermission as canonicalWithPermission } from "@workspace/permissions";
import type { PermissionKey, PermissionAliasKey } from "@workspace/permissions";

// Re-export the canonical + known-alias permission keys so call sites get
// compile-time safety that is always in sync with the permissions registry
// (canonical keys) and the alias map in resolver.ts (legacy keys).
export type Permission = PermissionKey | PermissionAliasKey;

export const withPermission = (perm: Permission) => canonicalWithPermission(perm);
