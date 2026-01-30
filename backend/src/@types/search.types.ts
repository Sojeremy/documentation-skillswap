export interface MemberDocument {
  id: number;
  firstname: string;
  lastname: string;
  fullname: string; // "Alice Dupont" (pour recherche)
  avatarUrl: string | null;
  city: string | null;
  description: string | null;
  skills: string[]; // ["React", "TypeScript", "Node.js"]
  skillIds: number[]; // [1, 3, 4]
  categoryIds: number[]; // [1] (Developpement Web)
  categorySlugs: string[]; // ["dev-web"]
  rating: number; // Moyenne calculee
  evaluationCount: number;
  createdAt: number; // Timestamp pour tri
}

export interface SearchParams {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface SearchResponse {
  members: MemberDocument[];
  total: number;
  page: number;
  totalPages: number;
  processingTimeMs: number;
}
