// ============================================================================
// USE PROFILE UPDATE HOOK - Handle profile updates
// ============================================================================

'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { getChangedFields, logError } from '@/lib/utils';
import type { Profile } from '@/lib/api-types';
import type { UpdateUserProfileData } from '@/lib/validation/updateProfile.validation';

interface UseProfileUpdateOptions {
  userId: number | undefined;
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  refresh: () => Promise<void>;
}

interface UseProfileUpdateReturn {
  updateProfile: (data: UpdateUserProfileData) => Promise<void>;
  updateAvatar: (file: File | null) => Promise<void>;
}

/**
 * Hook to handle profile updates (info and avatar)
 *
 * @param options - Configuration options
 * @returns Functions to update profile and avatar
 */
export function useProfileUpdate({
  userId,
  profile,
  refresh,
  setProfile,
}: UseProfileUpdateOptions): UseProfileUpdateReturn {
  const updateProfile = useCallback(
    async (data: UpdateUserProfileData) => {
      if (!userId || !profile) return;

      // Prepare original data(profile from API) for comparison
      // Convert null values to undefined to match Zod schema requirements
      const originalData = {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        address: profile.address ?? undefined,
        postalCode: profile.postalCode ?? undefined,
        city: profile.city ?? undefined,
        age: profile.age ?? undefined,
        description: profile.description ?? undefined,
      };

      // Detect changes
      const changes = getChangedFields(originalData, data);

      // If no changes, don't make the request
      if (!changes) {
        toast.info('Aucune modification effectuée');
        return;
      }

      try {
        // Update only modified fields in API
        await api.updateUserProfile(userId, changes);

        // Update only modified fields in local if request does not fail
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...changes,
          };
        });

        toast.success('Profil mis à jour avec succès');
      } catch (err) {
        logError(err);
        toast.error('Erreur lors de la mise à jour du profil');
      }
    },
    [userId, profile, setProfile],
  );

  const updateAvatar = useCallback(
    async (file: File | null) => {
      if (!userId) return;

      try {
        if (file) {
          // Upload new avatar
          const response = await api.updateAvatar(file);
          if (!response.data) return;
          setProfile(response.data);
          toast.success('Photo de profil mise à jour');
        } else {
          // Delete avatar
          const response = await api.deleteAvatar();
          if (!response.data) return;
          setProfile(response.data);
          toast.success('Photo de profil supprimée');
        }
        await refresh();
      } catch (err) {
        logError(err);
        toast.error('Erreur lors de la mise à jour du profil');
      }
    },
    [userId, refresh, setProfile],
  );

  return {
    updateProfile,
    updateAvatar,
  };
}
