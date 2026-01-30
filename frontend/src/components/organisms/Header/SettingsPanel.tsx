'use client';

import { useState } from 'react';
import { Button, Separator } from '@/components/atoms';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'; // Ajuste le chemin selon ton projet
import { Trash2, ShieldCheck } from 'lucide-react';
import { cn, validate } from '@/lib/utils';
import {
  UpdatePasswordData,
  UpdatePasswordSchema,
} from '@/lib/validation/updatePassword.validation';
import { PasswordInput } from '@/components/atoms/PasswordInput';

interface SettingsPanelProps {
  onPasswordChange: (data: UpdatePasswordData) => void;
  onDeleteAccount: () => void;
}

export function SettingsPanel({
  onPasswordChange,
  onDeleteAccount,
}: SettingsPanelProps) {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [formData, setFormData] = useState<UpdatePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmation: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdatePasswordData, string>>
  >({});
  const [isValidPassword, setIsValidPassword] = useState(false);

  // Function to controll a field in the form
  function updateField<K extends keyof UpdatePasswordData>(
    fieldName: K,
    newValue: string,
  ) {
    // Update the value of the field in formData state
    setFormData((previousFormData) => ({
      ...previousFormData, // keep other fields unchanged
      [fieldName]: newValue, // update the current field with the new value
    }));

    // Reset the error for the field that was just updated
    setErrors((previousErrors) => {
      const updatedErrors = { ...previousErrors }; // create a copy to avoid mutating state directly
      delete updatedErrors[fieldName]; // remove the error for this field
      return updatedErrors; // set the new errors object without the field
    });

    // Check if password is valid (only in register mode)
    if (fieldName === 'newPassword') {
      if (newValue.length < 8) {
        setIsValidPassword(false);
      } else {
        setIsValidPassword(true);
      }
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data with zod(each error is display under his field with 'setErrors')
    if (!validate(UpdatePasswordSchema, formData, setErrors)) {
      return;
    }

    // Throw onPasswordChange event to update the password in API
    setIsUpdateLoading(true);
    onPasswordChange?.({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmation: formData.confirmation,
    });
    setIsUpdateLoading(false);
  };

  function handleDeleteAccount() {
    console.log('loading...');
    setIsDeleteLoading(true);
    console.log('just before');
    onDeleteAccount();
    console.log('just after');
    setIsDeleteLoading(false);
    setIsConfirmDeleteOpen(false);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* --- SECTION : MOT DE PASSE --- */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">
            Changer le mot de passe
          </h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <PasswordInput
              name="currentPassword"
              placeholder="••••••••"
              value={formData.currentPassword}
              onChange={(e) => updateField('currentPassword', e.target.value)}
              error={errors.currentPassword}
              id="currentPassword"
              label="Mot de passe actuel"
            />
          </div>

          <div className="grid gap-2">
            <PasswordInput
              name="newPassword"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={(e) => updateField('newPassword', e.target.value)}
              error={errors.newPassword}
              id="newPassword"
              label="Nouveau mot de passe"
            />
            {!errors.newPassword && (
              <p
                className={cn(
                  'grid gap-2 text-sm text-error',
                  isValidPassword && 'text-green-700',
                )}
              >
                Minimum 8 caractères
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <PasswordInput
              name="confirmation"
              placeholder="••••••••"
              value={formData.confirmation}
              onChange={(e) => updateField('confirmation', e.target.value)}
              error={errors.confirmation}
              id="confirmation"
              label="Confirmer le nouveau mot de passe"
            />
          </div>

          <div className="flex justify-end mt-2">
            <Button type="submit" size="sm" isLoading={isUpdateLoading}>
              Mettre à jour le mot de passe
            </Button>
          </div>
        </form>
      </section>

      <Separator />

      {/* --- SECTION : DANGER ZONE --- */}
      <section className="flex flex-col gap-4 pb-2">
        <h3 className="text-lg font-semibold tracking-tight text-error">
          Zone de danger
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 bg-error/5 rounded-xl border border-error/20">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold ">Supprimer le compte</p>
            <p className="text-xs text-muted-foreground">
              Cette action est irréversible. Toutes vos données seront
              supprimées.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </section>

      {/* --- Confirm delete account dialog --- */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Supprimer mon compte ?"
        question="Êtes-vous absolument sûr de vouloir supprimer"
        subject="votre compte utilisateur"
        description="Toutes vos données, messages et avis seront définitivement effacés de nos serveurs."
        confirmLabel="Supprimer définitivement"
        isLoading={isDeleteLoading}
      />
    </div>
  );
}
