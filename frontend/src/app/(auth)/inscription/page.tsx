'use client';

import { MainLayout } from '@/components/layouts/MainLayout';
import { AuthForm } from '@/components/organisms';
import { useAuth } from '@/components/providers/AuthProvider';
import { ApiError } from '@/lib/api-client';
import { AuthFormData } from '@/lib/api-types';
import { displayError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { isLoading, register } = useAuth();
  const router = useRouter();
  const [localError, setLocalError] = useState<string | undefined>();

  async function handleSubmit(data: AuthFormData) {
    setLocalError('');

    // Verify if all field are filled before register to API
    if (!data.firstname || !data.lastname || !data.confirmation) {
      setLocalError('Tous les champs sont requis');
      return;
    }

    try {
      await register({
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        confirmation: data.confirmation,
      });

      toast.success('Bienvenue sur SkillSwap !', {
        description: 'Votre compte a été créé avec succès.',
      });

      // Redirection vers la page profil après inscription
      window.location.href = '/mon-profil';
    } catch (err) {
      // Check if validation / conflict error -> display error in form
      if (err instanceof ApiError) {
        if (err.status === 422) setLocalError(err.message);
        if (err.status === 409) setLocalError("L'email est déjà utilisé");
        return;
      }
      displayError(err);
    }
  }

  return (
    <MainLayout>
      <main className="w-full h-full flex justify-center items-center py-6 md:py-10">
        <AuthForm
          onSubmit={handleSubmit}
          mode="register"
          isLoading={isLoading}
          error={localError}
        ></AuthForm>
      </main>
    </MainLayout>
  );
}
