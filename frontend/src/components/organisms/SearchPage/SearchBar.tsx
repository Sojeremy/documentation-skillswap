'use client';

import { memo, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  minChars?: number;
}

export const SearchBar = memo(function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  minChars = 3,
}: SearchBarProps) {
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const showMinCharsHint = value.length > 0 && value.length < minChars;

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative">
          <Input
            type="search"
            placeholder="Rechercher par nom ou par compétence..."
            value={value}
            onChange={handleChange}
            className="pr-10 xs:w-sm"
            aria-label="Rechercher par nom ou par compétence"
          />
          <Button
            variant="nav"
            type="submit"
            disabled={isLoading}
            className="absolute right-0 top-1/2 -translate-y-1/2 size-10"
            aria-label="Rechercher"
          >
            <Search size={18} />
          </Button>
        </div>
      </form>
      {showMinCharsHint && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Tapez au moins {minChars} caractères pour rechercher
        </p>
      )}
    </div>
  );
});
