'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/atoms/Dialog';
import { SettingsPanel } from '@/components/organisms/Header/SettingsPanel';
import { useAccount } from '@/hooks/useAccount';

interface AccountSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSettingsDialog({
  isOpen,
  onClose,
}: AccountSettingsDialogProps) {
  const { handleDeleteAccount, handlePasswordChange } = useAccount({
    onPasswordChangeSuccess: onClose,
    onDeleteAccountSuccess: onClose,
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="min-w-[calc(100dvw-2rem)] sm:min-w-lg my-2 sm:my-4 mx-auto p-0 border-none bg-transparent shadow-none">
        <div className="bg-background w-full rounded-xl border shadow-lg overflow-hidden flex flex-col">
          <DialogHeader className="p-6 pb-2 text-center shrink-0">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Paramètres du compte
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Gérez vos informations confidentielles
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <SettingsPanel
              onPasswordChange={handlePasswordChange}
              onDeleteAccount={handleDeleteAccount}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
