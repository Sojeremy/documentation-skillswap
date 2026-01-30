'use client';

import { Card, CardContent } from '@/components/atoms/Card';
import { Rating } from '@/components/atoms/Rating';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { FollowIcon, MessageIcon } from '@/components/atoms/Icons';
import { Pencil } from 'lucide-react';
import { cn, getInitialsFromName, calculateRating } from '@/lib/utils';
import type { Profile } from '@/lib/api-types';
import { NewMessageDialog } from '@/components/organisms';
import { useState } from 'react';
import type { ContactFormData } from '@/components/organisms/ConversationPage/NewMessageDialog';
import Link from 'next/link';
import { useIsMobile } from '@/hooks';

// ============================================================================
// ProfileHeader
// ============================================================================
//
// Affiche l'en-tête du profil d'un utilisateur :
// - Avatar (image ou initiales)
// - Nom complet
// - Note moyenne + nombre d'avis
// - Description
// - Boutons d'action (Contacter, Suivre, ou Modifier)
//
// ============================================================================

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean; // true si c'est le profil de l'utilisateur connecté
  onContact?: (data: ContactFormData) => void;
  onFollow?: () => void;
  isFollowLoading?: boolean; // true pendant l'appel API follow/unfollow
  className?: string;
}

export function ProfileHeader({
  profile,
  isOwnProfile = false,
  onContact,
  onFollow,
  isFollowLoading = false,
  className,
}: ProfileHeaderProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const isMobile = useIsMobile(640);

  const isFollowing = profile.isFollowing;
  const rating = calculateRating(profile.evaluationsReceived);
  const evaluationCount = profile.evaluationsReceived?.length ?? 0;
  const initials = getInitialsFromName(
    `${profile.firstname} ${profile.lastname}`,
  );

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6 relative">
        {/* Bouton Modifier (en haut à droite, seulement sur son propre profil) */}
        {isOwnProfile && (
          <Button
            variant="default"
            size="sm"
            asChild
            className="absolute top-4 right-4"
          >
            <Link href="/mon-profil" aria-label="Modifier mon profil">
              <Pencil size={16} />
              {!isMobile && 'Modifier mon profil'}
            </Link>
          </Button>
        )}

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* Avatar */}
          <Avatar
            src={profile.avatarUrl}
            alt={`Avatar de ${profile.firstname} ${profile.lastname}`}
            initials={initials}
            size="2xl"
            className="shrink-0"
          />

          {/* Infos */}
          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
            {/* Nom */}
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {profile.firstname} {profile.lastname}
            </h1>

            {/* Rating */}
            <div className="mt-1 flex items-center gap-2">
              <Rating score={rating} size={18} />
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {rating.toFixed(1)} ({evaluationCount} avis)
              </span>
            </div>

            {/* Description */}
            {profile.description && (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                {profile.description}
              </p>
            )}

            {/* Boutons d'action (seulement si ce n'est pas son propre profil) */}
            {!isOwnProfile && (
              <div className="mt-4 flex flex-wrap gap-3">
                {/* Bouton Contacter : visible seulement si follow mutuel */}
                {isFollowing && (
                  <Button
                    variant="default"
                    onClick={() => setIsContactOpen(true)}
                  >
                    <MessageIcon size={18} />
                    Contacter
                  </Button>
                )}
                {/* Bouton Suivre/Suivi */}
                <Button
                  variant={profile.isFollowing ? 'secondary' : 'outline'}
                  onClick={onFollow}
                  isLoading={isFollowLoading}
                >
                  <FollowIcon size={18} />
                  {profile.isFollowing ? 'Ne plus suivre' : 'Suivre'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {onContact && (
        <NewMessageDialog
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          onSubmit={onContact}
        />
      )}
    </Card>
  );
}
