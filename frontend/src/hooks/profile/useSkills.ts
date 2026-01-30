// ============================================================================
// USE SKILLS HOOK - Handle user skills management
// ============================================================================

'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { Profile } from '@/lib/api-types';
import type { AddUserSkillData } from '@/lib/validation/updateProfile.validation';
import { logError } from '@/lib/utils';

interface UseSkillsOptions {
  userId: number | undefined;
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

interface UseSkillsReturn {
  addSkill: (data: AddUserSkillData) => Promise<AddSkillResult>;
  deleteSkill: (skillId: number) => Promise<void>;
}

type AddSkillResult = 'success' | 'already-exists' | 'limit-reached' | 'error';

/**
 * Hook to manage user skills (add, delete, check)
 *
 * @param options - Configuration options
 * @returns Functions to manage skills
 */
export function useSkills({
  userId,
  profile,
  setProfile,
}: UseSkillsOptions): UseSkillsReturn {
  // Check if user already has this skill
  const hasSkill = useCallback(
    (skillId: number) => {
      return profile?.skills.some((s) => s.skillId === skillId) ?? false;
    },
    [profile],
  );

  // Add a new skill
  const addSkill = useCallback(
    async (data: AddUserSkillData): Promise<AddSkillResult> => {
      if (!userId || !profile) return 'error';

      if (profile.skills.length === 10) {
        toast.warning(
          'Vous ne pouvez pas ajouter de compétences supplémentaires',
        );
        return 'limit-reached';
      }

      if (hasSkill(data.skillId)) {
        toast.warning('Vous possédez déjà cette compétence');
        return 'already-exists';
      }

      try {
        const response = await api.addUserSkill(data);

        if (!response.data?.skill) return 'error';
        const newSkill = response.data;

        // Optimistic update: Update UI only after successful request
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            skills: [...prev.skills, newSkill],
          };
        });

        toast.success('Compétence ajoutée');
        return 'success';
      } catch (err) {
        logError(err);
        toast.error("Erreur lors de l'ajout");
        return 'error';
      }
    },
    [userId, profile, hasSkill, setProfile],
  );

  // Delete a skill
  const deleteSkill = useCallback(
    async (skillId: number) => {
      try {
        await api.deleteUserSkill(skillId);

        // Optimistic update: Update UI only after successful request
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            skills: prev.skills.filter((s) => s.skillId !== skillId),
          };
        });

        toast.success('Compétence supprimée');
      } catch (err) {
        logError(err);
        toast.error('Erreur lors de la suppression');
      }
    },
    [setProfile],
  );

  return {
    addSkill,
    deleteSkill,
  };
}
