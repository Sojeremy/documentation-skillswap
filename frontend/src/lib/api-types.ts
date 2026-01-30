// ==========================================================================
// Auth / User
// ==========================================================================

export interface UserInfo {
  id: number;
  firstname: string;
  lastname: string;
  avatarUrl?: string;
}

export interface CurrentUser extends UserInfo {
  email: string;
}

export interface UserVisit extends UserInfo {
  isRated: boolean;
  isFollowing: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmation?: string;
  firstname?: string;
  lastname?: string;
}

export type AuthFormMode = 'login' | 'register';

// ==========================================================================
// Search
// ==========================================================================

export interface SearchResults {
  members: Member[];
  total: number;
  page: number;
  totalPages: number;
  processingTimeMs: number;
}

export interface SearchParams {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}

// ==========================================================================
// Member
// ==========================================================================

// Quand je recupere une liste de profils
export interface Member {
  id: number;
  firstname: string;
  lastname: string;
  avatarUrl: string | null;
  skills: string[]; // Tableau de skills
  rating: number; // Moyenne des notes de l'user
  evaluationCount: number; // Nombre d'evaluation
}

// ==========================================================================
// Profile (vue détaillée d'un membre)
// ==========================================================================

// Skill nested dans UserHasSkill
export interface SkillItem {
  id: number;
  name: string;
  categoryId: number;
}

export interface UserHasSkill {
  userId: number;
  skillId: number;
  skill?: SkillItem;
  createdAt: string;
  updatedAt: string;
}

export interface UserHasInterest {
  userId: number;
  skillId: number;
  skill?: SkillItem;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableSlot {
  id: number;
  day: string; // "Lundi", "Mardi", etc.
  timeSlot: string; // "Morning", "Afternoon"
  createdAt: string;
  updatedAt: string;
}

export interface UserHasAvailable {
  userId: number;
  availableId: number;
  available: AvailableSlot;
  createdAt: string;
  updatedAt: string;
}

export interface Evaluator {
  id: number;
  firstname: string;
  lastname: string;
  avatarUrl: string | null;
}

export interface Evaluation {
  id: number;
  comments: string;
  score: number; // 1-5
  evaluatorId: number;
  evaluator?: Evaluator; // Inclus par le backend
  evaluatedId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  avatarUrl: string | null;
  description: string | null;
  address: string | null;
  postalCode: number | null;
  city: string | null;
  age: number | null;
  createdAt: string;
  updatedAt: string;
  // Relations (noms identiques au backend Prisma)
  skills: UserHasSkill[];
  interests: UserHasInterest[];
  availabilities: UserHasAvailable[];
  evaluationsReceived: Evaluation[];
  // Champs calculés par le backend (si on consulte le profil d'un autre user)
  isRated?: boolean;
  isFollowing?: boolean; // Est-ce que JE suis ce profil ?
  isFollowedBy?: boolean; // Est-ce que ce profil ME suit ?
}

/**
 * Profile Teaser - Version limitée pour visiteurs non connectés
 *
 * Stratégie SEO/Conversion :
 * - Assez d'infos pour Google (indexation) + visiteur (intérêt)
 * - Pas assez pour satisfaire sans inscription (conversion)
 *
 * @see /frontend/src/.code-review/profil-teaser-strategy.md
 */
export interface ProfileTeaser {
  id: number;
  firstname: string;
  lastnameInitial: string; // "D." au lieu de "Dupont"
  city: string | null;
  avatarUrl: string | null;
  descriptionPreview: string | null; // Tronquée à 150 caractères
  skills: UserHasSkill[];
  averageRating: number | null; // 4.8 (calculée)
  reviewCount: number; // 12 (nombre d'avis, pas le contenu)
}

// ==========================================================================
// Catégories
// ==========================================================================

export interface Category {
  id: number;
  name: string;
  slug: string; // name: "developpement web" slug: "develloppement-web"
}

// ==========================================================================
// Compétences
// ==========================================================================

export interface Skill {
  id: number;
  name: string;
  category: Category;
}

export interface Availability {
  id: number;
  name: string;
  day: Day;
  timeSlot: TimeSlot;
}

export type Day =
  | 'Lundi'
  | 'Mardi'
  | 'Mercredi'
  | 'Jeudi'
  | 'Vendredi'
  | 'Samedi'
  | 'Dimanche';

export type TimeSlot = 'Morning' | 'Afternoon';

// ==========================================================================
// Availabilities
// ==========================================================================

export interface Availaility {
  id: number;
  name: string;
  category: Category;
}

// ==========================================================================
// Conversations
// ==========================================================================

export interface AddRatingData {
  score: number;
  comment?: string;
}

// ==========================================================================
// Conversations
// ==========================================================================

export interface Message {
  id: number;
  sender?: UserInfo; // le sender du message s'il fait toujours parti de la conv
  content: string;
  timestamp: string; // ISO 8601 (DateTime Prisma)
}

// Quand je recupere toutes mes conversations
export interface Conversation {
  id: number;
  participant?: UserVisit; // le deuxieme user de la conv(qui n'est pas celui qui fait la requete) s'il fait toujours parti de la conv
  title: string;
  lastMessage?: Message; // le dernier message par date de creation
  status: 'Open' | 'Close';
}

// Type pour une conversation avec ses messages chargés
export interface ConversationWithMessages extends Conversation {
  messages: Message[];
  hasMoreMessages: boolean;
  isLoadingMessages: boolean;
}
