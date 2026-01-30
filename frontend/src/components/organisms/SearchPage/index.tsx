'use client';

import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { SearchResults } from './SearchResults';
import { useTopCategories } from '@/hooks/useTopCategories';
import { useAuth } from '@/components/providers/AuthProvider';

export function SearchPage() {
  const {
    query,
    setQuery,
    category,
    setCategory,
    page,
    setPage,
    results,
    isLoading: searchIsLoading,
    search,
  } = useSearch();

  const { categories } = useTopCategories();
  const { isLoading: userIsLoading } = useAuth();

  const isLoading = searchIsLoading || userIsLoading;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4">Rechercher une compétence</h2>

      <div className="mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={search}
          isLoading={isLoading}
        />
      </div>

      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
      </div>

      <SearchResults
        members={results?.members ?? []}
        isLoading={isLoading}
        total={results?.total ?? 0}
        page={page}
        totalPages={results?.totalPages ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}
