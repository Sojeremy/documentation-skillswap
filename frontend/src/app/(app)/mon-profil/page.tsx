// ============================================================================
// UPDATE PROFILE PAGE - /profil/update (REFACTORED)
// ============================================================================

'use client';

import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  PersonalInfoSection,
  UpdateAvatarDialog,
  ProfileUpdateCard,
  SkillsSection,
  InterestsSection,
  AvailabilitySection,
} from '@/components/organisms';
import { AddSkillDialog } from '@/components/organisms/ProfilePage/EditPage/AddSkillDialog';
import { AddAvailabilityDialog } from '@/components/organisms/ProfilePage/EditPage/AddAvailabilityDialog';
import {
  useProfile,
  useProfileUpdate,
  useSkills,
  useInterests,
  useAvailabilities,
  useDialogs,
} from '@/hooks';
import {
  AddUserAvailabilityData,
  AddUserInterestData,
  AddUserSkillData,
} from '@/lib/validation/updateProfile.validation';

export default function UpdateProfilPage() {
  const { user, refresh } = useAuth();

  // Profile data
  const { profile, setProfile, isLoading, refetchProfile } = useProfile(
    user?.id,
  );

  // Profile update handlers
  const { updateProfile, updateAvatar } = useProfileUpdate({
    userId: user?.id,
    profile,
    setProfile,
    refresh,
  });

  // Skills management
  const { addSkill, deleteSkill } = useSkills({
    userId: user?.id,
    profile,
    setProfile,
  });

  // Interests management
  const { addInterest, deleteInterest } = useInterests({
    userId: user?.id,
    profile,
    setProfile,
  });

  // Availabilities management
  const { addAvailability, deleteAvailability } = useAvailabilities({
    userId: user?.id,
    profile,
    setProfile,
    refetchProfile,
  });

  // Dialog states
  const {
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
  } = useDialogs();

  // ==========================================================================
  // HANDLERS WITH DIALOG CLOSE
  // ==========================================================================

  const handleAddSkill = async (data: AddUserSkillData) => {
    const result = await addSkill(data);
    if (result !== 'already-exists') {
      closeAddSkill();
    }
  };

  const handleAddInterest = async (data: AddUserInterestData) => {
    const result = await addInterest(data);
    if (result !== 'already-exists') {
      closeAddInterest();
    }
  };

  const handleAddAvailability = async (data: AddUserAvailabilityData) => {
    const result = await addAvailability(data);
    if (result !== 'already-exists') {
      closeAddAvailability();
    }
  };

  const handleUpdateAvatar = async (file: File | null) => {
    await updateAvatar(file);
    closeAvatarDialog();
  };

  // ==========================================================================
  // CONDITIONAL RENDERING
  // ==========================================================================

  // Loading state
  if (isLoading && !profile) {
    return (
      <MainLayout>
        <section className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-center">
            <p className="text-foreground">Chargement...</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  // Not found state
  if (!profile) {
    return (
      <MainLayout>
        <section className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-center">
            <p className="text-primary">Profil introuvable</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  return (
    <MainLayout>
      <section className="container mx-auto px-4 py-6 md:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <ProfileUpdateCard
            firstname={profile.firstname}
            lastname={profile.lastname}
            avatarUrl={profile.avatarUrl}
            description={profile.description}
            onUpdateAvatar={openAvatarDialog}
            onUpdateDescription={updateProfile}
          />

          <PersonalInfoSection
            info={{
              firstname: profile.firstname,
              lastname: profile.lastname,
              address: profile.address,
              email: profile.email,
              postalCode: profile.postalCode,
              city: profile.city,
              age: profile.age,
            }}
            onUpdate={updateProfile}
          />

          <SkillsSection
            skills={profile.skills}
            editable
            onDeleteSkill={deleteSkill}
            onAdd={openAddSkill}
          />

          <InterestsSection
            interests={profile.interests}
            onRemove={deleteInterest}
            onAdd={openAddInterest}
          />

          <AvailabilitySection
            availabilities={profile.availabilities}
            onRemove={deleteAvailability}
            onAdd={openAddAvailability}
          />

          {/* Dialogs */}
          <UpdateAvatarDialog
            isOpen={isAvatarDialogOpen}
            onClose={closeAvatarDialog}
            onSubmit={handleUpdateAvatar}
            currentAvatarUrl={profile.avatarUrl}
            firstname={profile.firstname}
            lastname={profile.lastname}
          />

          <AddSkillDialog
            isOpen={isAddSkillOpen}
            onClose={closeAddSkill}
            onSubmit={handleAddSkill}
            mode="skill"
          />

          <AddSkillDialog
            isOpen={isAddInterestOpen}
            onClose={closeAddInterest}
            onSubmit={handleAddInterest}
            mode="interest"
          />

          <AddAvailabilityDialog
            isOpen={isAddAvailabilityOpen}
            onClose={closeAddAvailability}
            onSubmit={handleAddAvailability}
          />
        </div>
      </section>
    </MainLayout>
  );
}
