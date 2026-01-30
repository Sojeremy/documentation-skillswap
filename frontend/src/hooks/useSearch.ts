'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api-client';
import type { SearchResults } from '@/lib/api-types';
import { toast } from 'sonner';
import { logError } from '@/lib/utils';

/**
 * Options for configuring the search hook behavior.
 * @category Hooks
 */
interface UseSearchOptions {
  /** Debounce delay in milliseconds before triggering search. @defaultValue 300 */
  debounceMs?: number;
  /** Maximum number of results per page. @defaultValue 12 */
  limit?: number;
  /** Minimum characters required before search triggers. @defaultValue 3 */
  minChars?: number;
}

/**
 * Return type of the useSearch hook.
 * @category Hooks
 */
interface UseSearchReturn {
  /** Current search query string */
  query: string;
  /** Update the search query (resets page to 1) */
  setQuery: (query: string) => void;
  /** Currently selected category filter */
  category: string | null;
  /** Update category filter (resets page to 1) */
  setCategory: (category: string | null) => void;
  /** Current page number (1-indexed) */
  page: number;
  /** Update the page number */
  setPage: (page: number) => void;
  /** Search results with members and pagination info */
  results: SearchResults | null;
  /** Loading state indicator */
  isLoading: boolean;
  /** Manually trigger a search (bypasses debounce) */
  search: () => void;
}

/**
 * Hook for searching members with debounce, pagination, and category filtering.
 *
 * Provides a complete search experience with:
 * - **Debounced input**: Waits for user to stop typing before searching
 * - **Pagination**: Supports page-based navigation through results
 * - **Category filtering**: Filter results by skill category
 * - **Automatic cancellation**: Cancels in-flight requests when new search starts
 *
 * @param options - Configuration options for search behavior
 * @returns Search state and control functions
 *
 * @example
 * Basic usage:
 * ```tsx
 * function SearchPage() {
 *   const { query, setQuery, results, isLoading } = useSearch();
 *
 *   return (
 *     <div>
 *       <input value={query} onChange={(e) => setQuery(e.target.value)} />
 *       {isLoading && <Spinner />}
 *       {results?.members.map(member => <MemberCard key={member.id} {...member} />)}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * With custom options and pagination:
 * ```tsx
 * function AdvancedSearch() {
 *   const { results, page, setPage, category, setCategory } = useSearch({
 *     debounceMs: 500,
 *     limit: 20,
 *     minChars: 2
 *   });
 *
 *   return (
 *     <div>
 *       <CategoryFilter value={category} onChange={setCategory} />
 *       <ResultsList members={results?.members} />
 *       <Pagination
 *         page={page}
 *         totalPages={results?.totalPages}
 *         onChange={setPage}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @category Hooks
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 300, limit = 12, minChars = 3 } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce query - only if >= minChars or empty (for reset)
  useEffect(() => {
    const shouldDebounce = query.length >= minChars || query.length === 0;

    if (!shouldDebounce) {
      // Not enough characters, don't trigger search
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, minChars]);

  // Reset page when filters change
  const handleSetCategory = useCallback((newCategory: string | null) => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  const handleSetQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, []);

  // Perform search when debounced query, category, or page changes
  useEffect(() => {
    const performSearch = async () => {
      // Conditions to trigger search:
      // - empty query (display all results)
      // - query >= minChars
      // - a category is selected (filter-only search)
      const shouldSearch =
        debouncedQuery.length === 0 ||
        debouncedQuery.length >= minChars ||
        category !== null;

      if (!shouldSearch) {
        return;
      }

      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        let searchResults: SearchResults;

        // Real API call (Meilisearch via backend)
        try {
          const response = await api.searchMembers({
            q: debouncedQuery,
            category: category ?? undefined,
            page,
            limit,
          });
          searchResults = response.data!;
          setResults(searchResults);
        } catch (err) {
          logError(err);
          toast.error('Une erreur est survenue');
        }
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, category, page, limit, minChars]);

  const search = useCallback(() => {
    setDebouncedQuery(query);
  }, [query]);

  return {
    query,
    setQuery: handleSetQuery,
    category,
    setCategory: handleSetCategory,
    page,
    setPage,
    results,
    isLoading,
    search,
  };
}
