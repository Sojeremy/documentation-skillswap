/**
 * @module APIClient
 * Centralized API client for communicating with the SkillSwap backend.
 *
 * Features:
 * - **Automatic token refresh**: Handles 401 errors with JWT refresh
 * - **Request cancellation**: AbortController support
 * - **Type-safe responses**: Generic ApiResponse wrapper
 * - **Cookie-based auth**: Uses httpOnly cookies for security
 *
 * @example
 * ```tsx
 * import { api } from '@/lib/api-client';
 *
 * // Authentication
 * const user = await api.login({ email, password });
 *
 * // Search
 * const results = await api.searchMembers({ q: 'javascript', limit: 10 });
 *
 * // Profile
 * const profile = await api.getProfile(userId);
 * ```
 *
 * @packageDocumentation
 */

import type {
  CurrentUser,
  Category,
  Member,
  Profile,
  Conversation,
  ConversationWithMessages,
  Message,
  AddRatingData,
  SearchResults,
  SearchParams,
  Skill,
  UserHasSkill,
  UserHasInterest,
  UserHasAvailable,
} from './api-types';
import type { LoginData, RegisterData } from './validation/auth.validation';
import { AddConversationData } from './validation/conversation.validation';
import { UpdatePasswordData } from './validation/updatePassword.validation';
import {
  AddUserAvailabilityData,
  AddUserInterestData,
  AddUserSkillData,
  UpdateUserProfileData,
} from './validation/updateProfile.validation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Standardized Api response interface
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

interface ApiMessage {
  message: string;
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ==========================================================================
  // Request
  // ==========================================================================

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    isRetry = false,
  ): Promise<ApiResponse<T>> {
    const { params, ...fetchOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
      const queryString = searchParams.toString();
      if (queryString) url += `?${queryString}`;
    }

    const headers: HeadersInit = {};
    if (!(fetchOptions.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers,
      },
      credentials: 'include',
    });

    const hasBody =
      response.headers.get('content-length') !== '0' &&
      response.headers.get('content-type')?.includes('application/json');

    const data = hasBody ? await response.json() : undefined;

    if (!response.ok) {
      // If 401 UNHAUTORIZED -> try to refresh token
      if (response.status === 401 && !isRetry) {
        try {
          await this.refreshToken(); // Refresh token
          return this.request<T>(endpoint, options, true); // If refresh don't fail -> re-fetch the original request
        } catch (err) {
          const errMessage =
            err instanceof Error ? err.message : "Erreur d'authentification";
          // If the retry fail -> logout the user
          console.log(errMessage);
        }
      }

      throw new ApiError(
        data?.error || 'Une erreur est survenue',
        response.status,
      );
    }

    return data ?? { success: true };
  }

  // ==========================================================================
  // Auth
  // ==========================================================================

  async register(data: RegisterData) {
    return this.request<CurrentUser>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData) {
    return this.request<CurrentUser>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<ApiResponse<CurrentUser>> {
    return await this.request<CurrentUser>('/api/v1/auth/me');
  }

  async logout() {
    return this.request<void>('/api/v1/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request<void>(
      `/api/v1/auth/refresh`,
      {
        method: 'POST',
      },
      true,
    );
  }

  // ==========================================================================
  // Account
  // ==========================================================================

  async deleteAccount() {
    console.log('fetching');
    return this.request<void>('/api/v1/profiles', {
      method: 'DELETE',
    });
  }

  async updatePassword(data: UpdatePasswordData) {
    return this.request<ApiMessage>('/api/v1/profiles/password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ==========================================================================
  // Categories
  // ==========================================================================

  async getCategories(params?: { order?: string; limit?: number }) {
    return this.request<Category[]>('/api/v1/categories', { params });
  }

  async getTopCategories(params?: { limit?: number }) {
    return this.request<Category[]>('/api/v1/categories/top-rated', { params });
  }

  // ==========================================================================
  // Skills
  // ==========================================================================

  async getSkills() {
    return this.request<Skill[]>('/api/v1/skills', {
      method: 'GET',
    });
  }

  // ==========================================================================
  // Members / Search
  // ==========================================================================

  async getTopRatedMembers(params?: { limit?: number }) {
    return this.request<Member[]>('/api/v1/search/top-rated', { params });
  }

  /**
   * Recherche de membres via Meilisearch
   * @param params - Paramètres de recherche (q, category, page, limit)
   */
  async searchMembers(params?: SearchParams) {
    return this.request<SearchResults>('/api/v1/search', {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  }

  // ==========================================================================
  // Profile
  // ==========================================================================

  async getProfile(id: number) {
    return this.request<Profile>(`/api/v1/profiles/${id}`);
  }

  async deleteUserSkill(id: number) {
    return this.request<void>(`/api/v1/profiles/skills/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteUserInterest(id: number) {
    return this.request<void>(`/api/v1/profiles/interests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteUserAvailability(id: number) {
    return this.request<void>(`/api/v1/profiles/availabilities/${id}`, {
      method: 'DELETE',
    });
  }

  async addUserSkill(data: AddUserSkillData) {
    return this.request<UserHasSkill>(`/api/v1/profiles/skills`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addUserInterest(data: AddUserInterestData) {
    return this.request<UserHasInterest>(`/api/v1/profiles/interests`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addUserAvailability(data: AddUserAvailabilityData) {
    return this.request<UserHasAvailable>(`/api/v1/profiles/availabilities`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.request<Profile>(`/api/v1/profiles/avatar`, {
      method: 'PATCH',
      body: formData,
    });
  }

  async updateUserProfile(userId: number, data: UpdateUserProfileData) {
    return this.request<void>(`/api/v1/profiles/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAvatar() {
    return this.request<Profile>(`/api/v1/profiles/avatar`, {
      method: 'DELETE',
    });
  }

  // ==========================================================================
  // Conversation
  // ==========================================================================

  async getAllUserConversations(params?: { limit?: number }) {
    return this.request<Conversation[]>('/api/v1/conversations', { params });
  }

  async getOneConversation(id: number) {
    return this.request<ConversationWithMessages>(
      `/api/v1/conversations/${id}`,
    );
  }

  async createConversation(data: AddConversationData) {
    return this.request<Conversation>('/api/v1/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteOneConversation(id: number) {
    return this.request<void>(`/api/v1/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  async closeOneConversation(id: number) {
    return this.request<void>(`/api/v1/conversations/${id}/close`, {
      method: 'PATCH',
    });
  }

  // ==========================================================================
  // Message
  // ==========================================================================

  async addMessage(id: number, data: { message: string }) {
    return this.request<Message>(`/api/v1/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getConversationMessages(
    conversationId: number,
    params?: { limit?: number; cursor?: number },
  ) {
    return this.request<{
      messages: Message[];
      nextCursor: number | null;
    }>(`/api/v1/conversations/${conversationId}/messages`, {
      params,
    });
  }

  // Follow
  // ==========================================================================

  async followUser(userId: number) {
    return this.request<void>(`/api/v1/follows/${userId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId: number) {
    return this.request<void>(`/api/v1/follows/${userId}/follow`, {
      method: 'DELETE',
    });
  }

  async getMyFollows() {
    return this.request<CurrentUser[]>('/api/v1/follows/following');
  }

  // ==========================================================================
  // Rating
  // ==========================================================================

  async rateUser(id: number, data: AddRatingData) {
    return this.request<void>(`/api/v1/profiles/${id}/rating`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// ==========================================================================
// Custom Error Class
// ==========================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ==========================================================================
// Export
// ==========================================================================

export const api = new ApiClient(API_BASE_URL);

export default api;
