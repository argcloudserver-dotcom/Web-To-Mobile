/**
 * Backward-compatible alias. Prefer importing `Dialog` from "@workspace/ui" directly —
 * this file is kept so existing `import { Modal } from "@workspace/ui"` call sites
 * keep working while screens are migrated.
 */
export { Dialog as Modal, type DialogProps as ModalProps } from "../Dialog/Dialog";
