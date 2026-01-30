// Barrel export for organisms

// Root-level organisms
export { AuthForm } from './AuthForm';
export { Footer } from './Footer';

// Folder-based organisms (re-export from their index files)
export { Header } from './Header';
export {
  HeroSection,
  HowItWorksSection,
  CategoriesSection,
  MembersSection,
} from './HomePage';

export {
  ProfileHeader,
  SkillsSection,
  InterestsSection,
  AvailabilitySection,
  PersonalInfoSection,
  ProfileUpdateCard,
  UpdateAvatarDialog,
  ReviewsSection,
} from './ProfilePage';

export {
  NewConversationDialog,
  NewMessageDialog,
  MessageThread,
  RatingDialog,
  ConversationSection,
} from './ConversationPage';

export { SearchPage } from './SearchPage';
