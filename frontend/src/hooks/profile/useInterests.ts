// ============================================================================
// USE INTERESTS HOOK - Handle user interests management
// ============================================================================

'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Profile } from '@/lib/api-types';
import type { AddUserInterestData } from '@/lib/validation/updateProfile.validation';
import { logError } from '@/lib/utils';

interface UseInterestsOptions {
  userId: number | undefined;
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

interface UseInterestsReturn {
  addInterest: (data: AddUserInterestData) => Promise<AddInterestResult>;
  deleteInterest: (interestId: number) => Promise<void>;
}

type AddInterestResult =
  | 'success'
  | 'already-exists'
  | 'limit-reached'
  | 'error';

/**
 * Hook to manage user interests (add, delete, check)
 *
 * @param options - Configuration options
 * @returns Functions to manage interests
 */
export function useInterests({
  userId,
  profile,
  setProfile,
}: UseInterestsOptions): UseInterestsReturn {
  // Check if user already has this interest
  const hasInterest = useCallback(
    (skillId: number) => {
      return profile?.interests.some((i) => i.skillId === skillId) ?? false;
    },
    [profile],
  );

  // Add a new interest
  const addInterest = useCallback(
    async (data: AddUserInterestData): Promise<AddInterestResult> => {
      if (!userId || !profile) return 'error';

      if (profile.interests.length === 10) {
        toast.warning("Vous ne pouvez pas ajouter d'interêts supplémentaires");
        return 'limit-reached';
      }

      if (hasInterest(data.skillId)) {
        toast.warning('Cet intérêt est déjà renseigné');
        return 'already-exists';
      }

      try {
        const response = await api.addUserInterest(data);

        if (!response.data?.skill) return 'error';
        const newInterest = response.data;

        // Optimistic update: Update UI only after successful request
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            interests: [...prev.interests, newInterest],
          };
        });

        toast.success('Intérêt ajouté');
        return 'success';
      } catch (err) {
        logError(err);
        toast.error("Erreur lors de l'ajout");
        return 'error';
      }
    },
    [userId, profile, hasInterest, setProfile],
  );

  // Delete an interest
  const deleteInterest = useCallback(
    async (interestId: number) => {
      try {
        await api.deleteUserInterest(interestId);

        // Optimistic update: Update UI only after successful request
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            interests: prev.interests.filter((i) => i.skillId !== interestId),
          };
        });

        toast.success('Intérêt supprimé');
      } catch (err) {
        logError(err);
        toast.error('Erreur lors de la suppression');
      }
    },
    [setProfile],
  );

  return {
    addInterest,
    deleteInterest,
  };
}
