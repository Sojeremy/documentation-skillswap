'use client';

import { memo } from 'react';
import { Search } from 'lucide-react';
import type { Member } from '@/lib/api-types';
import { ProfileCard } from '@/components/molecules/ProfileCard';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Pagination } from '@/components/molecules/Pagination';
import { ResultsSkeleton } from './SearchResultSkeleton';

interface SearchResultsProps {
  members: Member[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const SearchResults = memo(function SearchResults({
  members,
  isLoading,
  total,
  page,
  totalPages,
  onPageChange,
}: SearchResultsProps) {
  if (isLoading) {
    return <ResultsSkeleton />;
  } else if (members.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-12 w-12 opacity-20" />}
        title="Aucun résultat trouvé"
        description="Essayez de modifier vos filtres ou votre recherche."
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-500">
        {total} résultat{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <ProfileCard
            key={member.id}
            id={member.id}
            firstname={member.firstname}
            lastname={member.lastname}
            avatarUrl={member.avatarUrl}
            skills={member.skills}
            rating={member.rating}
            reviewCount={member.evaluationCount}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});
