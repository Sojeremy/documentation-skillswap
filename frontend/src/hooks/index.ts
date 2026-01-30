/**
 * @module Hooks
 * Custom React hooks for SkillSwap frontend application.
 *
 * This module provides reusable hooks for:
 * - **UI**: Auto-scroll, mobile detection, form state management
 * - **Search**: Debounced search with pagination and filters
 * - **Messaging**: Conversation management, real-time updates, followed users
 *
 * @example
 * ```tsx
 * import { useSearch, useMessaging, useIsMobile } from '@/hooks';
 *
 * function MyComponent() {
 *   const { query, setQuery, results } = useSearch();
 *   const { conversations } = useMessaging();
 *   const isMobile = useIsMobile();
 * }
 * ```
 *
 * @packageDocumentation
 */

// UI Hooks
export { useAutoScroll } from './useAutoScroll';
export { useFormState } from './useFormState';
export { useIsMobile } from './useIsMobile';

// Feature Hooks
export { useMessaging } from './useMessaging';
export { useSearch } from './useSearch';

// Messaging sub-hooks for granular access
export {
  useConversationList,
  useSelectedConversation,
  useConversationActions,
  useFollowedUsers,
} from './messaging';

// Re-export profile hooks for granular access
export {
  useProfile,
  useProfileUpdate,
  useSkills,
  useInterests,
  useAvailabilities,
  useDialogs,
} from './profile';
