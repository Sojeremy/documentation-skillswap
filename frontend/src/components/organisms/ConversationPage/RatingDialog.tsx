'use client';

import { useState } from 'react';
import {
  Rating,
  Textarea,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/atoms';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { score: number; comment?: string }) => void;
  targetName?: string;
  isLoading?: boolean;
}

export function RatingDialog({
  isOpen,
  onClose,
  onSubmit,
  targetName,
  isLoading = false,
}: RatingDialogProps) {
  const [score, setRating] = useState(0);
  const [comment, setComment] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Fonction de réinitialisation et fermeture
  const handleClose = () => {
    setRating(0);
    setComment(undefined);
    setError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (score === 0) {
      setError('Veuillez sélectionner une note avant de publier.');
      return;
    }

    onSubmit({ score, comment });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:min-w-md lg:min-w-lg min-w-[calc(100dvw-2rem)] p-0 overflow-hidden border-none bg-transparent shadow-none">
        <div className="bg-background rounded-xl border shadow-lg overflow-hidden">
          <DialogHeader className="p-6 pb-0 text-center">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Laisser un avis
            </DialogTitle>

            {targetName && (
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Évaluez votre expérience avec{' '}
                <span className="font-medium text-foreground">
                  {targetName}
                </span>
              </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            {/* Section Note */}
            <div className="flex flex-col gap-3 py-2 bg-secondary/10 rounded-lg">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Votre note *
              </label>
              <Rating
                score={score}
                interactive
                onChange={(newRating) => {
                  setRating(newRating);
                  if (error) setError(null);
                }}
                size={32}
              />
              {score > 0 && (
                <p className="text-xs font-semibold text-primary animate-in fade-in zoom-in-95">
                  {score} étoile{score > 1 ? 's' : ''} sur 5
                </p>
              )}
            </div>

            {/* Commentaire */}
            <Textarea
              label="Votre commentaire"
              placeholder="Partagez votre expérience en quelques mots..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              helperText="Optionnel - Votre avis aide la communauté"
              rows={4}
              id="message"
            />

            {error && (
              <p className="text-xs font-medium text-error text-center animate-shake">
                {error}
              </p>
            )}

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={handleClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={isLoading}
                disabled={score === 0}
              >
                Publier l&apos;avis
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
