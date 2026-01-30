'use client';

import { Link } from '@/components/atoms/Link';

interface DesktopNavProps {
  isHomePage: boolean;
}

/**
 * Navigation desktop pour la page d'accueil
 * Affiche les liens Découvrir, Comment ça marche, A propos
 */
export function DesktopNav({ isHomePage }: DesktopNavProps) {
  if (!isHomePage) return null;

  return (
    <nav className="hidden items-center gap-6 lg:flex">
      <Link href="/#discover" variant="nav">
        Découvrir
      </Link>
      <Link href="/#how-it-works" variant="nav">
        Comment ça marche
      </Link>
      <Link href="/#about" variant="nav">
        A propos
      </Link>
    </nav>
  );
}
