'use client';

import { Card, CardContent } from '@/components/atoms/Card';
import { LightbulbIcon } from '@/components/atoms/Icons';
import { Button } from '@/components/atoms/Button';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserHasSkill } from '@/lib/api-types';

// ============================================================================
// SkillsSection
// ============================================================================
//
// Affiche la liste des compétences d'un utilisateur.
// Chaque compétence est affichée dans une card séparée avec une icône éclair.
// En mode édition, un bouton de suppression est disponible.
//
// ============================================================================

interface SkillsSectionProps {
  skills: UserHasSkill[];
  className?: string;
  editable?: boolean;
  onDeleteSkill?: (skillId: number) => void;
  onAdd?: () => void;
}

export function SkillsSection({
  skills,
  className,
  onDeleteSkill,
  onAdd,
}: SkillsSectionProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3>Compétences</h3>
        {onAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            aria-label="ajouter une compétence"
          >
            <Plus size={16} />
            Ajouter
          </Button>
        )}
      </div>
      {!skills || skills.length === 0 ? (
        <Card className={cn(className)}>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Aucun intérêt ajouté
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={cn('flex flex-col gap-4', className)}>
          {skills.map((userSkill) => (
            <Card key={userSkill.skillId} className="overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 shrink-0">
                  <LightbulbIcon size={20} className="text-yellow-500" />
                </div>
                <span className="font-medium text-foreground flex-1 min-w-0 truncate">
                  {userSkill.skill?.name || 'Compétence inconnue'}
                </span>
                {onDeleteSkill && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteSkill(userSkill.skillId)}
                    className="h-8 w-8 p-0 shrink-0 text-foreground hover:text-destructive hover:-translate-y-px"
                    aria-label={`Supprimer ${userSkill.skill?.name || 'cette compétence'}`}
                  >
                    <X size={16} />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
