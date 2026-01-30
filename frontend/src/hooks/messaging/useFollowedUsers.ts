'use client';

import { useState, useCallback } from 'react';
import { UserInfo } from '@/lib/api-types';
import api from '@/lib/api-client';
import { logError } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Hook for managing followed users (used in new conversation dialog)
 * Responsibilities: fetch and store followed users list
 */
export function useFollowedUsers() {
  const [followedUsers, setFollowedUsers] = useState<UserInfo[] | undefined>();

  const fetchFollowedUsers = useCallback(async () => {
    try {
      const response = await api.getMyFollows();
      setFollowedUsers(response.data ?? []);
    } catch (err) {
      logError(err);
      toast.error('Erreur lors de la récupération des utilisateur suivi(e)s');
    }
  }, []);

  return {
    followedUsers,
    fetchFollowedUsers,
  };
}
