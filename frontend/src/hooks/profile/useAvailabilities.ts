// ============================================================================
// USE AVAILABILITIES HOOK - Handle user availabilities management
// ============================================================================

'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Profile } from '@/lib/api-types';
import type { AddUserAvailabilityData } from '@/lib/validation/updateProfile.validation';
import { logError } from '@/lib/utils';

interface UseAvailabilitiesOptions {
  userId: number | undefined;
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  refetchProfile: () => Promise<void>;
}

interface UseAvailabilitiesReturn {
  addAvailability: (
    data: AddUserAvailabilityData,
  ) => Promise<AddAvailabilityResult>;
  deleteAvailability: (availabilityId: number) => Promise<void>;
}

type AddAvailabilityResult = 'success' | 'already-exists' | 'error';

/**
 * Hook to manage user availabilities (add, delete, check)
 *
 * @param options - Configuration options
 * @returns Functions to manage availabilities
 */
export function useAvailabilities({
  userId,
  profile,
  setProfile,
  refetchProfile,
}: UseAvailabilitiesOptions): UseAvailabilitiesReturn {
  // Check if user already has this availability
  const hasAvailability = useCallback(
    (day: string, timeSlot: string) => {
      return (
        profile?.availabilities.some(
          (a) => a.available.day === day && a.available.timeSlot === timeSlot,
        ) ?? false
      );
    },
    [profile],
  );

  // Add a new availability
  const addAvailability = useCallback(
    async (data: AddUserAvailabilityData): Promise<AddAvailabilityResult> => {
      if (!userId || !profile) return 'error';

      if (hasAvailability(data.day, data.timeSlot)) {
        toast.warning('Cette disponibilité est déjà renseignée');
        return 'already-exists';
      }

      try {
        await api.addUserAvailability(data);

        await refetchProfile();

        toast.success('Disponibilité ajoutée');
        return 'success';
      } catch (err) {
        logError(err);
        toast.error("Erreur lors de l'ajout");
        return 'error';
      }
    },
    [userId, profile, hasAvailability, refetchProfile],
  );

  // Delete an availability
  const deleteAvailability = useCallback(
    async (availabilityId: number) => {
      try {
        await api.deleteUserAvailability(availabilityId);

        // Optimistic update: Update UI only after successful request
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            availabilities: prev.availabilities.filter(
              (a) => a.availableId !== availabilityId,
            ),
          };
        });

        toast.success('Disponibilité supprimée');
      } catch (err) {
        logError(err);
        toast.error('Erreur lors de la suppression');
      }
    },
    [setProfile],
  );

  return {
    addAvailability,
    deleteAvailability,
  };
}
