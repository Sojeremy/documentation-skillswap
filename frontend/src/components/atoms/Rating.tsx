'use client';

import { memo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { StarIcon, StarOutlineIcon } from './Icons';

interface RatingProps {
  score: number; // Note actuelle
  maxScore?: number;
  size?: number;
  showCount?: boolean;
  count?: number;
  className?: string;
  interactive?: boolean;
  onChange?: (newScore: number) => void;
}

export const Rating = memo(function Rating({
  score,
  maxScore = 5,
  size = 16,
  showCount = false,
  count = 0,
  className,
  interactive = false,
  onChange,
}: RatingProps) {
  // Arrondir pour l'affichage statique, mais garder tel quel pour l'interactif
  const roundedScore = Math.round(score);
  const stars = Array.from({ length: maxScore }, (_, index) => index + 1);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, starNumber: number) => {
      if (!interactive || !onChange) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(starNumber);
      } else if (e.key === 'ArrowRight' && starNumber < maxScore) {
        e.preventDefault();
        onChange(starNumber + 1);
      } else if (e.key === 'ArrowLeft' && starNumber > 1) {
        e.preventDefault();
        onChange(starNumber - 1);
      }
    },
    [interactive, onChange, maxScore],
  );

  return (
    <div
      role={interactive ? 'group' : undefined}
      aria-label={
        interactive
          ? `Note: ${roundedScore} sur ${maxScore} etoiles`
          : undefined
      }
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {stars.map((starNumber) => {
        const isFilled = starNumber <= roundedScore;

        // Version interactive avec button accessible
        if (interactive) {
          return (
            <button
              key={starNumber}
              type="button"
              onClick={() => onChange?.(starNumber)}
              onKeyDown={(e) => handleKeyDown(e, starNumber)}
              aria-label={`${starNumber} etoile${starNumber > 1 ? 's' : ''}`}
              aria-pressed={isFilled}
              tabIndex={0}
              className={cn(
                'cursor-pointer transition-transform hover:scale-110',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded',
              )}
            >
              {isFilled ? (
                <StarIcon size={size} className="text-yellow-400" />
              ) : (
                <StarOutlineIcon
                  size={size}
                  className="text-zinc-300 dark:text-zinc-600"
                />
              )}
            </button>
          );
        }

        // Version statique (non interactive)
        return (
          <span key={starNumber}>
            {isFilled ? (
              <StarIcon size={size} className="text-yellow-400" />
            ) : (
              <StarOutlineIcon
                size={size}
                className="text-zinc-300 dark:text-zinc-600"
              />
            )}
          </span>
        );
      })}

      {showCount && (
        <span className="ml-1 text-sm text-zinc-500 dark:text-zinc-400">
          ({count})
        </span>
      )}
    </div>
  );
});
