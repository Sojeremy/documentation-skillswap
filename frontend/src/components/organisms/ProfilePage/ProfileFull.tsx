// ============================================================================
// PROFILE FULL COMPONENT - Profil complet pour utilisateurs connectés
// ============================================================================
//
// Affiche le profil complet avec toutes les fonctionnalités :
// - Informations complètes (nom, description, etc.)
// - Bouton Contact (crée une conversation)
// - Bouton Suivre/Ne plus suivre
// - Avis détaillés, disponibilités, centres d'intérêt
//
// Ce composant est affiché uniquement aux utilisateurs authentifiés.
// Les visiteurs non connectés voient ProfileTeaser à la place.
//
// @see /frontend/src/.code-review/profil-teaser-strategy.md
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { MainLayout } from '@/components/layouts/MainLayout';
import {
  ProfileHeader,
  SkillsSection,
  InterestsSection,
  AvailabilitySection,
  ReviewsSection,
} from '@/components/organisms/ProfilePage';

import { useAuth } from '@/components/providers/AuthProvider';
import { api, ApiError } from '@/lib/api-client';
import type { Profile } from '@/lib/api-types';
import { toast } from 'sonner';
import { logError } from '@/lib/utils';
import { getSocket } from '@/lib/socket-client';

// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

interface ProfileFullProps {
  /** Profile ID to fetch complete data */
  profileId: number;
}

// ----------------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------------

export function ProfileFull({ profileId }: ProfileFullProps) {
  // ==========================================================================
  // HOOKS & STATE
  // ==========================================================================

  const router = useRouter();
  const { user } = useAuth();

  // Profile state - fetched client-side (authenticated endpoint)
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Loading state for follow button
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // ==========================================================================
  // DATA FETCHING - Full profile (authenticated)
  // ==========================================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.getProfile(profileId);

        if (response.data) {
          setProfile(response.data);
        } else {
          setError('Profil non trouvé');
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Erreur lors du chargement du profil');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  // ==========================================================================
  // DERIVED VALUES
  // ==========================================================================

  const isOwnProfile = user?.id === profile?.id;

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Handler for the "Contact" button
   * Creates a conversation and redirects to it via WebSocket
   */
  const handleContact = async (data: { title: string; message: string }) => {
    if (!profile || !user) return;

    try {
      // 1. Create a new conversation via REST API
      const newConv = await api.createConversation({
        title: data.title,
        receiverId: profile.id,
      });

      if (!newConv.data) throw new Error('Une erreur est survenue');

      const conversationId = newConv.data.id;

      // 2. Get socket and ensure connection
      const socket = getSocket();

      // 3. Connect and wait if not connected
      if (!socket.connected) {
        socket.connect();
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error('Connection timeout')),
            5000,
          );
          socket.once('connect', () => {
            clearTimeout(timeout);
            resolve();
          });
        });
      }

      // 4. Join room and wait for confirmation
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('Join timeout')),
          5000,
        );

        const handleJoined = (payload: { conversationId: number }) => {
          if (payload.conversationId === conversationId) {
            clearTimeout(timeout);
            socket.off('conversation:joined', handleJoined);
            resolve();
          }
        };

        socket.on('conversation:joined', handleJoined);
        socket.emit('conversation:join', { conversationId });
      });

      // 5. Send message via WebSocket
      socket.emit('message:send', {
        conversationId,
        message: data.message,
      });

      // 6. Redirect to conversation page
      router.push(`/conversation?id=${conversationId}`);
    } catch (err) {
      logError(err);
      toast.error('Erreur lors de la création de la conversation');
    }
  };

  /**
   * Handler for the "Follow" button
   * Toggles follow/unfollow state with optimistic update
   */
  const handleFollow = async () => {
    if (!profile || isFollowLoading) return;

    setIsFollowLoading(true);
    const wasFollowing = profile.isFollowing;

    // Optimistic update
    setProfile({ ...profile, isFollowing: !wasFollowing });

    try {
      if (wasFollowing) {
        await api.unfollowUser(profile.id);
      } else {
        await api.followUser(profile.id);
      }
    } catch (err) {
      // Rollback on error
      setProfile({ ...profile, isFollowing: wasFollowing });

      logError(err);
      toast.error('Une erreur est survenue');
    } finally {
      setIsFollowLoading(false);
    }
  };

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (isLoading) {
    return (
      <MainLayout>
        <section className="container mx-auto px-4 py-6 md:py-10">
          <div className="mx-auto max-w-3xl">
            <div className="animate-pulse space-y-6">
              {/* Avatar skeleton */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              </div>
              {/* Content skeleton */}
              <div className="h-32 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  // ==========================================================================
  // ERROR STATE
  // ==========================================================================

  if (error || !profile) {
    return (
      <MainLayout>
        <section className="container mx-auto px-4 py-6 md:py-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-2xl font-bold mb-4">Erreur</h1>
            <p className="text-muted-foreground">
              {error || 'Profil non trouvé'}
            </p>
          </div>
        </section>
      </MainLayout>
    );
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <MainLayout>
      <section className="container mx-auto px-4 py-6 md:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <ProfileHeader
            profile={profile}
            isOwnProfile={isOwnProfile}
            onContact={handleContact}
            onFollow={handleFollow}
            isFollowLoading={isFollowLoading}
          />

          <SkillsSection skills={profile.skills} />

          <InterestsSection interests={profile.interests} />

          <AvailabilitySection availabilities={profile.availabilities} />

          <ReviewsSection evaluations={profile.evaluationsReceived} />
        </div>
      </section>
    </MainLayout>
  );
}
