'use client';

import { Link } from '@/components/atoms/Link';
import { Button } from '@/components/atoms/Button';
import { MessageIcon, SearchIcon } from '@/components/atoms/Icons';
import { UserDropdown } from '@/components/molecules/UserDropdown';
import type { CurrentUser } from '@/lib/api-types';

interface AuthButtonsProps {
  user: CurrentUser | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  onLogout: () => void;
  onOpenSettings: () => void;
}

/**
 * Boutons d'authentification desktop
 * Affiche les icônes et dropdown si connecté, sinon boutons connexion/inscription
 */
export function AuthButtons({
  user,
  isAuthenticated,
  isLoading,
  onLogout,
  onOpenSettings,
}: AuthButtonsProps) {
  return (
    <nav aria-label="Navigation principale">
      <ul className="hidden items-center gap-4 md:flex">
        {isAuthenticated && user ? (
          <>
            <li>
              <Link
                href="/recherche"
                aria-label="Rechercher une compétence"
                className="flex rounded-full p-0.5"
              >
                <SearchIcon size={24} />
              </Link>
            </li>
            <li>
              <Link
                href="/conversation"
                aria-label="Voir les messages"
                className="flex rounded-full p-0.5"
              >
                <MessageIcon size={24} />
              </Link>
            </li>
            <li>
              <UserDropdown
                user={user}
                onLogout={onLogout}
                onOpenSettings={onOpenSettings}
              />
            </li>
          </>
        ) : (
          !isLoading && (
            <>
              <li>
                <Link href="/connexion">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/inscription">
                  <Button size="sm">Inscription</Button>
                </Link>
              </li>
            </>
          )
        )}
      </ul>
    </nav>
  );
}
