'use client';

import { Suspense, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { AuthForm } from '@/components/organisms';
import { useAuth } from '@/components/providers/AuthProvider';
import { ApiError } from '@/lib/api-client';
import type { AuthFormData } from '@/lib/api-types';
import { displayError } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function LoginContent() {
  const { isLoading, login } = useAuth();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  const redirectPath = searchParams.get('redirect') || '/recherche';

  async function handleSubmit(data: AuthFormData) {
    setError('');
    try {
      await login(data.email, data.password);
      toast.success('Bienvenue sur SkillSwap !', {
        description: 'Vous êtes connecté.',
      });
      // Redirect to the page we were looking for or '/recherche'
      window.location.href = redirectPath;
    } catch (err) {
      // Check if error is auth error -> display error in form
      if (err instanceof ApiError && err.status === 401) {
        setError('Email ou mot de passe incorrect');
        return;
      }

      displayError(err);
    }
  }

  return (
    <section className="w-full h-full flex justify-center items-center py-6 md:py-10">
      <AuthForm
        onSubmit={handleSubmit}
        mode="login"
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
}

export default function LoginPage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-10">
            Chargement...
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </MainLayout>
  );
}
