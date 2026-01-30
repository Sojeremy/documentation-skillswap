'use client';

import { useEffect, useState } from 'react';
import { ProfileCard } from '@/components/molecules/ProfileCard';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';
import { api } from '@/lib/api-client';
import type { Member } from '@/lib/api-types';
import { logError } from '@/lib/utils';

// ============================================================================
// Composant MembersSection
// ============================================================================
//
// À QUOI SERT CE FICHIER ?
// Affiche la section "Membres de la communauté" avec une grille de
// ProfileCards montrant quelques membres actifs.
//
// STRATÉGIE ISR:
// - Reçoit `initialMembers` pré-fetchés côté serveur (SSR/ISR)
// - Affiche immédiatement les données (pas de skeleton au premier rendu)
// - Fallback sur fetch client si pas de données initiales
//
// OÙ EST-IL UTILISÉ ?
// - Landing page : quatrième section
//
// ============================================================================

interface MembersSectionProps {
  /** Membres pré-fetchés côté serveur (ISR) */
  initialMembers?: Member[];
}

export function MembersSection({ initialMembers = [] }: MembersSectionProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isLoading, setIsLoading] = useState(initialMembers.length === 0);

  useEffect(() => {
    // Si on a déjà des données initiales, pas besoin de fetch
    if (initialMembers.length > 0) {
      setIsLoading(false);
      return;
    }

    // Fallback: fetch côté client si pas de données initiales
    const fetchMembers = async () => {
      try {
        const response = await api.getTopRatedMembers({ limit: 6 });
        if (response.success && response.data) {
          setMembers(response.data);
        }
      } catch (err) {
        setMembers([]);
        logError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [initialMembers.length]);

  // Ne rien afficher si pas de données
  if (!isLoading && members.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        {/* Titre de la section */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-12">
          Membres de la communauté
        </h2>

        {/* Grille des ProfileCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading
            ? // Skeleton loading
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse"
                />
              ))
            : members.map((member) => (
                <ProfileCard
                  key={member.id}
                  id={member.id}
                  firstname={member.firstname}
                  lastname={member.lastname}
                  avatarUrl={member.avatarUrl}
                  skills={member.skills}
                  rating={member.rating}
                  reviewCount={member.evaluationCount}
                />
              ))}
        </div>

        {/* Bouton "Voir tous les membres" */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild={true}>
            <Link href="/recherche">Voir tous les membres</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
