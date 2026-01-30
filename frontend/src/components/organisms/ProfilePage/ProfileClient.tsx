// ============================================================================
// PROFILE CLIENT - Orchestrateur Teaser/Full
// ============================================================================
//
// Ce composant décide quel affichage montrer selon l'état d'authentification :
//
// - Visiteur NON connecté → ProfileTeaser (données limitées + CTA inscription)
// - Utilisateur connecté → ProfileFull (toutes les données + actions)
//
// STRATÉGIE SEO/CONVERSION :
// Le Server Component (page.tsx) fetch les données teaser pour le SEO
// (generateMetadata). Ensuite, côté client :
// - Si non auth : on affiche directement le teaser (pas de fetch supplémentaire)
// - Si auth : on fetch le profil complet via l'API authentifiée
//
// @see /frontend/src/.code-review/profil-teaser-strategy.md
// ============================================================================

'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { ProfileTeaser } from './ProfileTeaser';
import { ProfileFull } from './ProfileFull';
import type { ProfileTeaser as ProfileTeaserType } from '@/lib/api-types';
import { MainLayout } from '@/components/layouts/MainLayout';

// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

interface ProfileClientProps {
  /** Données teaser pré-fetchées par le Server Component */
  teaserProfile: ProfileTeaserType;
}

// ----------------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------------

export function ProfileClient({ teaserProfile }: ProfileClientProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // ==========================================================================
  // LOADING STATE (pendant la vérification de l'auth)
  // ==========================================================================
  // On affiche le teaser pendant le chargement pour éviter un flash
  // C'est aussi bon pour le SEO car le contenu initial est visible

  if (isLoading) {
    return (
      <MainLayout>
        <section className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-center">
            <p className="text-foreground">Chargement...</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  // ==========================================================================
  // NON AUTHENTIFIÉ → TEASER + CTA
  // ==========================================================================
  // Le visiteur voit une version limitée du profil avec incitation à s'inscrire

  if (!isAuthenticated) {
    return <ProfileTeaser profile={teaserProfile} />;
  }

  // ==========================================================================
  // AUTHENTIFIÉ → PROFIL COMPLET
  // ==========================================================================
  // L'utilisateur connecté voit le profil complet avec toutes les actions

  return <ProfileFull profileId={teaserProfile.id} />;
}
