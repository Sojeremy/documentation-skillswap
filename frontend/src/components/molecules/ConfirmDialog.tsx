'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/atoms/Dialog';
import { Button } from '@/components/atoms/Button';

interface ConfirmEncloseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  question?: string;
  subject?: string;
  confirmLabel?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  question,
  subject,
  description,
  confirmLabel,
  isLoading = false,
}: ConfirmEncloseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="min-w-[calc(100dvw-2rem)] sm:min-w-lg p-0 overflow-hidden border-none bg-transparent shadow-none">
        <div className="bg-background rounded-xl border shadow-lg p-6">
          <DialogHeader className="flex flex-col items-center text-center">
            <DialogTitle className="text-xl font-semibold">
              {title ?? 'Etes vous sûr de vouloir continuer ?'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-4">
              {question}{' '}
              <span className="font-medium text-foreground">
                &quot;{subject}&quot;
              </span>
              {' ? '}
            </DialogDescription>

            <DialogDescription className="text-primary-700">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button variant="ghost" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              isLoading={isLoading}
            >
              {confirmLabel ?? 'Confirmer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
