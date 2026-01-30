// ============================================================================
// USE PROFILE HOOK - Fetch and manage user profile
// ============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';
import type { Profile } from '@/lib/api-types';
import { toast } from 'sonner';
import { logError } from '@/lib/utils';

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  refetchProfile: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

/**
 * Hook to fetch and manage user profile data
 *
 * @param userId - The user ID to fetch the profile for
 * @returns Profile data, loading state, error, and refetch function
 */
export function useProfile(userId: number | undefined): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    if (!userId) return;

    try {
      const response = await api.getProfile(userId);

      if (response.data) {
        setProfile(response.data);
      }
    } catch (err) {
      logError(err);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    refetchProfile: fetchProfile,
    setProfile,
  };
}
