// ============================================================================
// USE DIALOGS HOOK - Manage dialog states
// ============================================================================

'use client';

import { useState, useCallback } from 'react';

interface UseDialogsReturn {
  isAddSkillOpen: boolean;
  isAddInterestOpen: boolean;
  isAddAvailabilityOpen: boolean;
  isAvatarDialogOpen: boolean;
  openAddSkill: () => void;
  closeAddSkill: () => void;
  openAddInterest: () => void;
  closeAddInterest: () => void;
  openAddAvailability: () => void;
  closeAddAvailability: () => void;
  openAvatarDialog: () => void;
  closeAvatarDialog: () => void;
}

/**
 * Hook to manage all dialog states in the profile update page
 */
export function useDialogs(): UseDialogsReturn {
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddInterestOpen, setIsAddInterestOpen] = useState(false);
  const [isAddAvailabilityOpen, setIsAddAvailabilityOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const openAddSkill = useCallback(() => setIsAddSkillOpen(true), []);
  const closeAddSkill = useCallback(() => setIsAddSkillOpen(false), []);

  const openAddInterest = useCallback(() => setIsAddInterestOpen(true), []);
  const closeAddInterest = useCallback(() => setIsAddInterestOpen(false), []);

  const openAddAvailability = useCallback(
    () => setIsAddAvailabilityOpen(true),
    [],
  );
  const closeAddAvailability = useCallback(
    () => setIsAddAvailabilityOpen(false),
    [],
  );

  const openAvatarDialog = useCallback(() => setIsAvatarDialogOpen(true), []);
  const closeAvatarDialog = useCallback(() => setIsAvatarDialogOpen(false), []);

  return {
    isAddSkillOpen,
    isAddInterestOpen,
    isAddAvailabilityOpen,
    isAvatarDialogOpen,
    openAddSkill,
    closeAddSkill,
    openAddInterest,
    closeAddInterest,
    openAddAvailability,
    closeAddAvailability,
    openAvatarDialog,
    closeAvatarDialog,
  };
}
