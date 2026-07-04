import React from "react";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../Dialog/Dialog";
import { Button } from "../Button/Button";

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Renders the confirm button with the destructive variant, for delete-style confirmations */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

/** Confirmation dialog for destructive or important actions, RN equivalent of the web AlertDialog. */
export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} closeOnBackdropPress={false}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description ? <DialogDescription>{description}</DialogDescription> : null}
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onPress={() => {
            onCancel?.();
            onOpenChange(false);
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={destructive ? "destructive" : "default"}
          onPress={() => {
            onConfirm();
            onOpenChange(false);
          }}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
AlertDialog.displayName = "AlertDialog";
