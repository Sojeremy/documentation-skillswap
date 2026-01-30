'use client';

import { Link, Button, Separator } from '@/components/atoms';
import type { CurrentUser } from '@/lib/api-types';

interface MobileNavProps {
  isOpen: boolean;
  isHomePage: boolean;
  user: CurrentUser | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

/**
 * Menu mobile hamburger
 * Affiche navigation + boutons auth selon l'état de connexion
 */
export function MobileNav({
  isOpen,
  isHomePage,
  user,
  isAuthenticated,
  isLoading,
  onClose,
  onLogout,
  onOpenSettings,
}: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="border-t border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="flex flex-col gap-2 px-4 py-4">
        {/* Navigation UNIQUEMENT sur Page d'accueil */}
        {isHomePage && (
          <>
            <Link
              href="/#discover"
              variant="nav"
              className="py-2"
              onClick={onClose}
            >
              Découvrir
            </Link>
            <Link
              href="/#how-it-works"
              variant="nav"
              className="py-2"
              onClick={onClose}
            >
              Comment ça marche
            </Link>
            <Link
              href="/#about"
              variant="nav"
              className="py-2"
              onClick={onClose}
            >
              À propos
            </Link>
            <Separator />
          </>
        )}

        {/* Boutons selon l'état d'authentification */}
        {isAuthenticated && user ? (
          <>
            <Link
              href="/recherche"
              variant="nav"
              className="py-2"
              onClick={onClose}
            >
              Recherche
            </Link>
            <Link
              href="/conversation"
              variant="nav"
              className="py-2"
              onClick={onClose}
            >
              Messages
            </Link>
            <Link
              href={`/profil/${user.id}`}
              variant="nav"
              className="py-2"
              onClick={onClose}
            >
              Mon profil
            </Link>
            <Button className="px-0" variant="nav" onClick={onOpenSettings}>
              Paramètres
            </Button>
            <Separator />
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="p-0 w-full justify-start text-red-500 hover:text-red-600"
            >
              Déconnexion
            </Button>
          </>
        ) : (
          !isLoading && (
            <>
              <Link href="/connexion" onClick={onClose}>
                <Button variant="ghost" size="sm" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link href="/inscription" onClick={onClose}>
                <Button size="sm" className="w-full">
                  Inscription
                </Button>
              </Link>
            </>
          )
        )}
      </nav>
    </div>
  );
}
