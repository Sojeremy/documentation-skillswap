'use client';

import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserHasAvailable } from '@/lib/api-types';

// ============================================================================
// AvailabilitySection
// ============================================================================
//
// Affiche les disponibilités d'un utilisateur.
// Chaque créneau est affiché comme un badge coloré (ex: "Lundi matin").
// En mode édition, permet d'ajouter et supprimer des disponibilités.
//
// ============================================================================

interface AvailabilitySectionProps {
  availabilities: UserHasAvailable[];
  className?: string;
  onRemove?: (availabilityId: number) => void;
  onAdd?: () => void;
}

export function AvailabilitySection({
  availabilities,
  className,
  onRemove,
  onAdd,
}: AvailabilitySectionProps) {
  // Translate timeSlot to french
  const getTimeSlotLabel = (timeSlot: string): string => {
    const mapping: Record<string, string> = {
      Morning: 'Matin',
      Afternoon: 'Après-midi',
      Evening: 'Soir',
    };
    return mapping[timeSlot] || timeSlot;
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3>Disponibilités</h3>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus size={16} />
            Ajouter
          </Button>
        )}
      </div>

      {!availabilities || availabilities.length === 0 ? (
        <Card className={cn(className)}>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Aucune disponibilité ajoutée
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn(className)}>
          <CardContent className="p-4 py-6">
            <div className="flex flex-wrap gap-4">
              {availabilities.map((slot) => (
                <Badge
                  key={slot.available.id}
                  size="lg"
                  variant="availability"
                  onRemove={onRemove && (() => onRemove(slot.availableId))}
                >
                  {slot.available.day}{' '}
                  {getTimeSlotLabel(slot.available.timeSlot)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
