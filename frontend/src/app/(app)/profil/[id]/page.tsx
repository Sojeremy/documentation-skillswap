// ============================================================================
// PROFILE PAGE - /profil/[id] (Server Component)
// ============================================================================
//
// PURPOSE:
// Server-side rendered profile page with dynamic SEO metadata.
// Fetches TEASER data for SEO, then client decides what to show based on auth.
//
// TEASER STRATEGY:
// - Server fetches limited "teaser" profile data (public endpoint, no auth)
// - generateMetadata() uses teaser data for SEO (title, description, OG tags)
// - ProfileClient receives teaser and shows:
//   - Non-authenticated: ProfileTeaser + CTA inscription
//   - Authenticated: ProfileFull (fetches complete data client-side)
//
// @see /frontend/src/.code-review/profil-teaser-strategy.md
//
// ============================================================================

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProfileClient } from '@/components/organisms/ProfilePage';
import type { ProfileTeaser } from '@/lib/api-types';

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// URL interne pour les appels serveur (Docker) ou URL publique (local)
const apiUrl =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000';

// ISR: Revalider la page toutes les heures
export const revalidate = 3600;

// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ id: string }>;
}

// ----------------------------------------------------------------------------
// DATA FETCHING
// ----------------------------------------------------------------------------

/**
 * Fetch TEASER profile data from the API (server-side, no auth)
 *
 * Returns limited data for SEO + conversion strategy:
 * - firstname, lastnameInitial (not full lastname)
 * - descriptionPreview (truncated)
 * - skills, averageRating, reviewCount
 * - NO: full description, detailed reviews, availabilities, interests
 */
async function getProfileTeaser(id: string): Promise<ProfileTeaser | null> {
  try {
    const response = await fetch(`${apiUrl}/api/v1/profiles/public/${id}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!response.ok) {
      console.error(`Profile fetch error: ${response.status} for id ${id}`);
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
}

// ----------------------------------------------------------------------------
// METADATA (SEO)
// ----------------------------------------------------------------------------

/**
 * Generate dynamic metadata for SEO
 * Uses TEASER data - limited but sufficient for Google indexing
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfileTeaser(id);

  // Profil non trouvé → metadata par défaut
  if (!profile) {
    return {
      title: 'Profil non trouvé - SkillSwap',
      description: "Ce profil n'existe pas ou a été supprimé.",
    };
  }

  // Extraire les compétences pour le titre et la description
  const skills =
    profile.skills?.map((s) => s.skill?.name).filter(Boolean) || [];
  const mainSkill = skills[0] || 'Membre';
  const skillsList = skills.slice(0, 3).join(', ');

  // Construire le titre SEO (avec initiale du nom pour la confidentialité)
  const displayName = `${profile.firstname} ${profile.lastnameInitial}`;
  const title = `${displayName} - ${mainSkill} | SkillSwap`;

  // Construire la description SEO (utilise descriptionPreview déjà tronquée)
  const description = profile.descriptionPreview
    ? profile.descriptionPreview
    : `${profile.firstname} propose ses compétences sur SkillSwap : ${skillsList || 'découvrez son profil'}.`;

  // URL canonique du profil
  const profileUrl = `${siteUrl}/profil/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: profileUrl,
      siteName: 'SkillSwap',
      images: profile.avatarUrl
        ? [
            {
              url: profile.avatarUrl,
              width: 400,
              height: 400,
              alt: `Photo de ${displayName}`,
            },
          ]
        : [],
    },
    alternates: {
      canonical: profileUrl,
    },
  };
}

// ----------------------------------------------------------------------------
// PAGE COMPONENT (Server Component)
// ----------------------------------------------------------------------------

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  const profile = await getProfileTeaser(id);

  // Profil non trouvé → page 404
  if (!profile) {
    notFound();
  }

  // Passer les données teaser au client
  // ProfileClient décide d'afficher Teaser ou Full selon l'authentification
  return <ProfileClient teaserProfile={profile} />;
}
