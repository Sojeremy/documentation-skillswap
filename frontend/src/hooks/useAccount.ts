'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api-client';
import { displayError } from '@/lib/utils';
import type { UpdatePasswordData } from '@/lib/validation/updatePassword.validation';

interface UseAccountOptions {
  onPasswordChangeSuccess?: () => void;
  onDeleteAccountSuccess?: () => void;
}

/**
 * Hook for user account management actions.
 *
 * @description
 * Provides account-related operations:
 * - **Password change**: Update user password with validation
 * - **Account deletion**: Permanently delete user account with redirect
 *
 * All actions include error handling and toast notifications.
 *
 * @returns Object containing account management functions
 *
 * @example
 * ```tsx
 * function AccountSettings() {
 *   const { handlePasswordChange, handleDeleteAccount } = useAccount();
 *
 *   const onSubmit = async (data: UpdatePasswordData) => {
 *     await handlePasswordChange(data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <PasswordFields />
 *       <Button type="submit">Changer le mot de passe</Button>
 *       <Button variant="destructive" onClick={handleDeleteAccount}>
 *         Supprimer le compte
 *       </Button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @category Hooks
 */
export function useAccount(options?: UseAccountOptions) {
  // Change password
  const handlePasswordChange = useCallback(
    async (data: UpdatePasswordData) => {
      try {
        const response = await api.updatePassword(data);
        toast.success(
          response.data?.message || 'Mot de passe modifié avec succès',
        );
        // Send success event (use to close the dialog)
        options?.onPasswordChangeSuccess?.();
      } catch (err) {
        displayError(err);
      }
    },
    [options],
  );

  // Delete account
  const handleDeleteAccount = useCallback(async () => {
    try {
      await api.deleteAccount();
      toast.success('Votre compte a été supprimé');
      // Send success event (use to close the dialog)
      options?.onDeleteAccountSuccess?.();
      // Redirect to home or login page after deletion
      window.location.href = '/inscription';
    } catch (err) {
      displayError(err);
    }
  }, [options]);

  return {
    handlePasswordChange,
    handleDeleteAccount,
  };
}
