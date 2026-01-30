'use client';

import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserHasInterest } from '@/lib/api-types';

// ============================================================================
// InterestsSection
// ============================================================================
//
// Affiche les centres d'intérêt (ce que l'utilisateur souhaite apprendre).
// Chaque intérêt est affiché comme un badge.
// En mode édition, permet d'ajouter et supprimer des intérêts.
//
// ============================================================================

interface InterestsSectionProps {
  interests: UserHasInterest[];
  className?: string;
  onAdd?: () => void;
  onRemove?: (interestId: number) => void;
}

export function InterestsSection({
  interests,
  className,
  onAdd,
  onRemove,
}: InterestsSectionProps) {
  return (
    <>
      <div className="flex items-end justify-between">
        <h3>Intérêts</h3>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus size={16} />
            Ajouter
          </Button>
        )}
      </div>

      {!interests || interests.length === 0 ? (
        <Card className={cn(className)}>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Aucun intérêt ajouté
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn(className)}>
          <CardContent className="p-4 py-6">
            <div className="flex flex-wrap gap-4">
              {interests.map((userInterest) => (
                <Badge
                  key={userInterest.skillId}
                  variant="primary"
                  size="lg"
                  onRemove={onRemove && (() => onRemove(userInterest.skillId))}
                >
                  {userInterest.skill?.name || 'Intérêt inconnu'}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
