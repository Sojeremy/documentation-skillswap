// ============================================================================
// LANDING PAGE - / (Server Component avec ISR)
// ============================================================================
//
// Page d'accueil de SkillSwap avec:
// - Fetch côté serveur pour le SEO (membres et catégories pré-rendus)
// - ISR: revalidation toutes les heures
// - Metadata statiques (pas besoin de dynamiques pour la home)
//
// ============================================================================

import type { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import {
  CategoriesSection,
  HeroSection,
  HowItWorksSection,
  MembersSection,
} from '@/components/organisms/HomePage';
import type { Member, Category } from '@/lib/api-types';

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------

// URL interne pour les appels serveur (Docker) ou URL publique (local)
const apiUrl =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000';

// ISR: Revalider la page toutes les heures
export const revalidate = 3600;

// ----------------------------------------------------------------------------
// METADATA
// ----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'SkillSwap - Échangez vos compétences',
  description:
    'SkillSwap est une plateforme collaborative pour échanger des compétences. Apprenez de nouvelles choses en partageant ce que vous savez faire.',
  openGraph: {
    title: 'SkillSwap - Échangez vos compétences',
    description:
      'Plateforme collaborative pour échanger des compétences entre particuliers.',
    type: 'website',
  },
};

// ----------------------------------------------------------------------------
// DATA FETCHING (Server-side)
// ----------------------------------------------------------------------------

/**
 * Fetch top-rated members for the landing page
 */
async function getTopMembers(): Promise<Member[]> {
  try {
    const response = await fetch(`${apiUrl}/api/v1/search/top-rated?limit=6`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('Landing: erreur fetch membres', response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Landing: erreur fetch membres', error);
    return [];
  }
}

/**
 * Fetch top categories for the landing page
 */
async function getTopCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${apiUrl}/api/v1/categories/top-rated?limit=8`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.error('Landing: erreur fetch catégories', response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Landing: erreur fetch catégories', error);
    return [];
  }
}

// ----------------------------------------------------------------------------
// PAGE COMPONENT (Server Component)
// ----------------------------------------------------------------------------

export default async function Home() {
  // Fetch data server-side (en parallèle pour la performance)
  const [members, categories] = await Promise.all([
    getTopMembers(),
    getTopCategories(),
  ]);

  return (
    <MainLayout>
      <HeroSection />
      <HowItWorksSection />
      <CategoriesSection initialCategories={categories} />
      <MembersSection initialMembers={members} />
    </MainLayout>
  );
}
