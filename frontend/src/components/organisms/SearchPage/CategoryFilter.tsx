'use client';

import { memo, useCallback } from 'react';
import type { Category } from '@/lib/api-types';
import { Badge } from '@/components/atoms/Badge';

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export const CategoryFilter = memo(function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const handleSelect = useCallback(
    (slug: string | null) => () => {
      onSelect(slug);
    },
    [onSelect],
  );

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filtrer par catégorie"
    >
      <Badge
        variant={selected === null ? 'selected' : 'category'}
        size="lg"
        onClick={handleSelect(null)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(null)}
      >
        Tous
      </Badge>

      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={selected === category.slug ? 'selected' : 'category'}
          size="lg"
          onClick={handleSelect(category.slug)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(category.slug)}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  );
});
