'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { Pencil } from 'lucide-react';
import { cn, getInitialsFromName } from '@/lib/utils';
import { Separator } from '@/components/atoms';

// ============================================================================
// ProfileUpdateCard
// ============================================================================
//
// Card pour modifier l'avatar et la description du profil.
// Permet l'édition inline de la biographie avec validation de longueur.
//
// ============================================================================

interface ProfileUpdateCardProps {
  firstname: string;
  lastname: string;
  avatarUrl?: string | null;
  description?: string | null;
  onUpdateAvatar?: () => void;
  onUpdateDescription?: (data: { description: string }) => void;
  className?: string;
}

export function ProfileUpdateCard({
  firstname,
  lastname,
  avatarUrl,
  description,
  onUpdateAvatar,
  onUpdateDescription,
  className,
}: ProfileUpdateCardProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(description || '');

  const initials = getInitialsFromName(`${firstname} ${lastname}`);
  const charCount = tempDescription.length;
  const maxChars = 500;

  const handleSaveDescription = () => {
    if (onUpdateDescription) {
      onUpdateDescription({ description: tempDescription });
    }
    setIsEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setTempDescription(description || '');
    setIsEditingDescription(false);
  };

  const handleEditDescription = () => {
    setTempDescription(description || '');
    setIsEditingDescription(true);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6 space-y-8">
        {/* Section Photo de profil */}
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-semibold">Photo de profil</h3>
          <div className="flex gap-5 justify-center sm:justify-start">
            <Avatar
              src={avatarUrl}
              alt={`Avatar de ${firstname} ${lastname}`}
              initials={initials}
              size="2xl"
            />
            {onUpdateAvatar && (
              <Button variant="outline" size="sm" onClick={onUpdateAvatar}>
                <Pencil size={16} />
                Changer
              </Button>
            )}
          </div>
        </div>

        <Separator />
        {/* Section Biographie */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">Biographie</h3>
            {!isEditingDescription && onUpdateDescription && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditDescription}
              >
                <Pencil size={16} />
                Modifier
              </Button>
            )}
          </div>

          {isEditingDescription ? (
            <>
              <textarea
                value={tempDescription}
                onChange={(e) =>
                  setTempDescription(e.target.value.slice(0, maxChars))
                }
                className={cn(
                  'w-full min-h-30 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors',
                  'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1',
                  'placeholder:text-muted-foreground',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'resize-y',
                )}
                placeholder="Décrivez-vous en quelques mots..."
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Maximum {maxChars} caractères ({charCount}/{maxChars})
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelDescription}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveDescription}
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
              {description || 'Aucune biographie renseignée'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
