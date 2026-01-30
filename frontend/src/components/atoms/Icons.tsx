import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// ============================================================================
// Composants Icônes SVG - Factory Pattern
// ============================================================================
//
// POURQUOI CE PATTERN ?
// - Réduit la duplication (de ~290 lignes à ~120 lignes)
// - Centralise la configuration SVG
// - Facilite l'ajout de nouvelles icônes
//
// COMMENT AJOUTER UNE NOUVELLE ICÔNE ?
// 1. Trouver le SVG (ex: sur heroicons.com ou iconify.design)
// 2. Utiliser createIcon() avec les options appropriées
// 3. Passer les children (path, circle, etc.)
//
// ============================================================================

// Interface commune pour toutes les icônes
interface IconProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
}

// Options pour la factory
interface IconOptions {
  filled?: boolean; // true = fill="currentColor", false = fill="none"
  strokeWidth?: number; // défaut: 2
}

// Factory function pour créer des icônes
function createIcon(
  displayName: string,
  children: ReactNode,
  options: IconOptions = {},
) {
  const { filled = false, strokeWidth = 2 } = options;

  const Icon = ({ className, size = 24, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );

  Icon.displayName = displayName;
  return Icon;
}

// ============================================================================
// Icônes exportées
// ============================================================================

// MessageIcon - Bulle de conversation
export const MessageIcon = createIcon(
  'MessageIcon',
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
);

// SearchIcon - Loupe de recherche
export const SearchIcon = createIcon(
  'SearchIcon',
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>,
);

// StarIcon - Étoile pleine (ratings)
export const StarIcon = createIcon(
  'StarIcon',
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  { filled: true, strokeWidth: 1 },
);

// StarOutlineIcon - Étoile vide
export const StarOutlineIcon = createIcon(
  'StarOutlineIcon',
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
);

// MenuIcon - Menu burger (3 lignes)
export const MenuIcon = createIcon(
  'MenuIcon',
  <>
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </>,
);

// CloseIcon - Croix (fermer)
export const CloseIcon = createIcon(
  'CloseIcon',
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>,
);

// ChevronDownIcon - Flèche vers le bas
export const ChevronDownIcon = createIcon(
  'ChevronDownIcon',
  <path d="m6 9 6 6 6-6" />,
);

// FollowIcon - Plus (+)
export const FollowIcon = createIcon(
  'FollowIcon',
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
);

// LightbulbIcon - Ampoule (idée/compétence)
export const LightbulbIcon = createIcon(
  'LightbulbIcon',
  <>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </>,
  { filled: true, strokeWidth: 1 },
);

// ZapIcon - Éclair (lightning bolt)
export const ZapIcon = createIcon(
  'ZapIcon',
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  { filled: true, strokeWidth: 1 },
);
