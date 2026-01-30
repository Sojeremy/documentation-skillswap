import { memo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { cn, getInitialsFromUser } from '@/lib/utils';
import { UserInfo } from '@/lib/api-types';

// ============================================================================
// Composant Avatar
// ============================================================================
//
// À QUOI SERT CE FICHIER ?
// Affiche l'avatarUrl d'un utilisateur de deux manières possibles :
// 1. Si l'utilisateur a une photo (avatarUrl) → affiche l'image
// 2. Sinon → affiche ses initiales dans un cercle coloré (ex: "SO" pour Sophie)
//
// OÙ EST-IL UTILISÉ ?
// - Header (quand l'utilisateur est connecté)
// - Cartes profil (membres de la communauté)
// - Page conversation (avatarUrl des participants)
// - Page profil
//
// COMMENT L'UTILISER ?
//   <Avatar user={user} />                    // Taille moyenne (défaut)
//   <Avatar user={user} size="lg" />          // Grande taille
//   <Avatar initials="SO" />                  // Sans objet user, juste les initiales
//   <Avatar user={user} showStatus />         // Avec indicateur de statut en ligne
//
// ============================================================================

// Définition des variantes de taille avec CVA
const avatarVariants = cva(
  // Classes de base : cercle, centré, overflow hidden pour l'image
  'relative inline-flex items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-600 dark:bg-primary-900 dark:text-primary-300',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs', // 32px - pour les listes compactes
        md: 'h-10 w-10 text-sm', // 40px - pour le header
        lg: 'h-12 w-12 text-base', // 48px - pour les cartes profil
        xl: 'h-16 w-16 text-lg', // 64px - pour la page profil
        '2xl': 'h-24 w-24 text-2xl', // 96px - pour l'en-tête page profil
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

// Interface des props du composant
interface AvatarProps extends VariantProps<typeof avatarVariants> {
  user?: UserInfo | null; // Objet utilisateur (avec firstname, lastname, avatarUrl)
  src?: string | null; // URL de l'image (prioritaire sur user.avatarUrl)
  alt?: string; // Texte alternatif pour l'image
  initials?: string; // Initiales à afficher si pas de user (ex: "SO")
  className?: string; // Classes CSS additionnelles
  showStatus?: boolean; // Afficher un point de statut (en ligne/hors ligne)
  isOnline?: boolean; // Statut en ligne (si showStatus=true)
}

export const Avatar = memo(function Avatar({
  user,
  src,
  alt,
  initials,
  size = 'md',
  className,
  showStatus = false,
  isOnline = false,
}: AvatarProps) {
  // Détermine les initiales à afficher
  // Priorité : prop initials > initiales calculées depuis user > "?"
  const displayInitials = initials || (user ? getInitialsFromUser(user) : '?');

  // Vérifie si on a une image (src prioritaire sur user.avatarUrl)
  const imageUrl = src || user?.avatarUrl;

  // Texte alternatif pour l'image
  const imageAlt =
    alt || (user ? `Avatar de ${user.firstname} ${user.lastname}` : 'Avatar');

  // Taille en pixels pour l'attribut sizes (optimisation Next.js Image)
  const sizeMap = {
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px',
    '2xl': '96px',
  };
  const imageSizes = sizeMap[size || 'md'];

  return (
    <span className={cn(avatarVariants({ size }), className)}>
      {/* Si on a une image, on l'affiche */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes={imageSizes}
          className="rounded-full object-cover"
        />
      ) : (
        // Sinon, on affiche les initiales
        <span>{displayInitials}</span>
      )}

      {/* Indicateur de statut en ligne (optionnel) */}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900',
            isOnline ? 'bg-green-500' : 'bg-zinc-400',
          )}
          aria-label={isOnline ? 'En ligne' : 'Hors ligne'}
        />
      )}
    </span>
  );
});
