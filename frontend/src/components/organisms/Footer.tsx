'use client';

import Image from 'next/image';
import { Link } from '@/components/atoms/Link';
import { useAuth } from '@/components/providers/AuthProvider';

// ============================================================================
// Composant Footer
// Pied de page avec affichage conditionnel selon l'authentification
// ============================================================================

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, user } = useAuth();

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ============================================ */}
        {/* Grille 3 colonnes : Légal | Logo | Navigation */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {/* ---------------------------------------- */}
          {/* Colonne gauche : Liens légaux */}
          {/* ---------------------------------------- */}
          <nav
            aria-label="Liens légaux"
            className="flex flex-col items-center gap-3 md:items-start"
          >
            <Link href="/mentions-legales" variant="footer">
              Mentions légales
            </Link>
            <Link href="/confidentialite" variant="footer">
              Confidentialité
            </Link>
            <Link href="/cgu" variant="footer">
              CGU
            </Link>
          </nav>

          {/* ---------------------------------------- */}
          {/* Colonne centrale : Logo */}
          {/* ---------------------------------------- */}
          <div className="flex justify-center">
            <Image
              src="/assets/LOGO-TODOS.png"
              alt="SkillSwap - Échangez vos compétences"
              width={200}
              height={80}
              className="object-contain"
            />
          </div>

          {/* ---------------------------------------- */}
          {/* Colonne droite : Navigation conditionnelle */}
          {/* ---------------------------------------- */}
          <nav
            aria-label="Navigation pied de page"
            className="flex flex-col items-center gap-3 md:items-end"
          >
            {isAuthenticated ? (
              <>
                <Link href="/recherche" variant="footer">
                  Recherche
                </Link>
                <Link href="/conversation" variant="footer">
                  Messages
                </Link>
                <Link
                  href={user ? `/profil/${user.id}` : '/connexion'}
                  variant="footer"
                >
                  Mon profil
                </Link>
              </>
            ) : (
              <>
                <Link href="/inscription" variant="footer">
                  Inscription
                </Link>
                <Link href="/connexion" variant="footer">
                  Connexion
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* ============================================ */}
        {/* Copyright */}
        {/* ============================================ */}
        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            © {currentYear} SkillSwap. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
