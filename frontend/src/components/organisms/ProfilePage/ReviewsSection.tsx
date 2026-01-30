'use client';

import { memo } from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import { Rating } from '@/components/atoms/Rating';
import { Avatar } from '@/components/atoms/Avatar';
import { cn, getInitialsFromName } from '@/lib/utils';
import type { Evaluation } from '@/lib/api-types';

// ============================================================================
// ReviewsSection
// ============================================================================
//
// Affiche les avis/évaluations reçus par l'utilisateur.
// Chaque avis est affiché dans une card séparée.
//
// ============================================================================

interface ReviewsSectionProps {
  evaluations: Evaluation[];
  className?: string;
}

export const ReviewsSection = memo(function ReviewsSection({
  evaluations,
  className,
}: ReviewsSectionProps) {
  if (!evaluations || evaluations.length === 0) {
    return null;
  }

  return (
    <>
      <h3>Avis ({evaluations.length})</h3>
      <div className={cn('flex flex-col gap-4', className)}>
        {evaluations.map((evaluation) => (
          <ReviewItem key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </>
  );
});

// Composant interne pour un avis individuel
const ReviewItem = memo(function ReviewItem({
  evaluation,
}: {
  evaluation: Evaluation;
}) {
  const evaluator = evaluation.evaluator;
  const initials = evaluator
    ? getInitialsFromName(`${evaluator.firstname} ${evaluator.lastname}`)
    : '?';

  // Formater la date
  const formattedDate = new Date(evaluation.createdAt).toLocaleDateString(
    'fr-FR',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar
            src={evaluator?.avatarUrl}
            alt={
              evaluator
                ? `Avatar de ${evaluator.firstname} ${evaluator.lastname}`
                : 'Avatar'
            }
            initials={initials}
            size="md"
            className="shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {evaluator
                  ? `${evaluator.firstname} ${evaluator.lastname}`
                  : 'Utilisateur inconnu'}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {formattedDate}
              </span>
            </div>
            <Rating score={evaluation.score} size={14} className="mt-1" />
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {evaluation.comments}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
