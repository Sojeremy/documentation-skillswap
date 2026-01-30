'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Link } from '@/components/atoms/Link';
import { api } from '@/lib/api-client';
import type { Category } from '@/lib/api-types';
import { logError } from '@/lib/utils';

// ============================================================================
// Composant CategoriesSection
// ============================================================================
//
// À QUOI SERT CE FICHIER ?
// Affiche la section "Catégories populaires" avec des badges cliquables
// permettant de filtrer les compétences par domaine.
//
// STRATÉGIE ISR:
// - Reçoit `initialCategories` pré-fetchées côté serveur (SSR/ISR)
// - Affiche immédiatement les données (pas de skeleton au premier rendu)
// - Fallback sur fetch client si pas de données initiales
//
// OÙ EST-IL UTILISÉ ?
// - Landing page : troisième section
//
// ============================================================================

interface CategoriesSectionProps {
  /** Catégories pré-fetchées côté serveur (ISR) */
  initialCategories?: Category[];
}

export function CategoriesSection({
  initialCategories = [],
}: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(initialCategories.length === 0);

  useEffect(() => {
    // Si on a déjà des données initiales, pas besoin de fetch
    if (initialCategories.length > 0) {
      setIsLoading(false);
      return;
    }

    // Fallback: fetch côté client si pas de données initiales
    const fetchCategories = async () => {
      try {
        const response = await api.getTopCategories({ limit: 8 });
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        // Fallback sur les données mockées si l'API n'est pas disponible
        setCategories([]);
        logError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [initialCategories.length]);

  // Ne rien afficher si pas de données
  if (!isLoading && categories.length === 0) {
    return null;
  }

  return (
    <section id="about" className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        {/* Titre de la section */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-12">
          Catégories populaires
        </h2>

        {/* Grille de badges cliquables */}
        <div className="flex flex-wrap justify-center gap-4">
          {isLoading
            ? // Skeleton loading
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-32 bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse"
                />
              ))
            : categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/recherche?categorie=${category.slug}`}
                >
                  <Badge variant="category" size="lg">
                    {category.name}
                  </Badge>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
