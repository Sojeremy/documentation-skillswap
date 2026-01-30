'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/Dialog';
import { Upload, X } from 'lucide-react';
import { getInitialsFromName } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================================================
// UpdateAvatarDialog
// ============================================================================
//
// Dialog pour mettre à jour la photo de profil.
// Permet l'upload d'une image avec drag & drop ou la suppression de l'avatar actuel.
//
// ============================================================================

interface UpdateAvatarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File | null) => void;
  currentAvatarUrl?: string | null;
  firstname: string;
  lastname: string;
  isLoading?: boolean;
}

export function UpdateAvatarDialog({
  isOpen,
  onClose,
  onSubmit,
  currentAvatarUrl,
  firstname,
  lastname,
  isLoading = false,
}: UpdateAvatarDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragCounter, setDragCounter] = useState(0);

  const initials = getInitialsFromName(`${firstname} ${lastname}`);

  const validateAndSetFile = (file: File) => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') return;
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCount = prev - 1;
      return newCount;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(0);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onSubmit(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit(selectedFile);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDragCounter(0);
    onClose();
  };

  const displayUrl = previewUrl || currentAvatarUrl;
  const isDragging = dragCounter > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="min-w-[calc(100dvw-2rem)] sm:min-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier la photo de profil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar preview */}
          <div className="flex flex-col items-center gap-4">
            <Avatar
              src={displayUrl}
              alt={`Avatar de ${firstname} ${lastname}`}
              initials={initials}
              size="2xl"
            />

            {previewUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePreview}
                className="text-zinc-500 hover:text-zinc-700"
              >
                <X size={16} />
                Annuler la sélection
              </Button>
            )}
          </div>

          {/* Upload area (drag & drop) */}
          <div className="space-y-4">
            <label
              htmlFor="avatar-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-zinc-300 hover:bg-zinc-50'
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload
                  className={`w-8 h-8 mb-2 transition-colors ${
                    isDragging ? 'text-primary' : 'text-zinc-500'
                  }`}
                />
                <p className="mb-2 text-sm text-zinc-50">
                  <span className="font-semibold">
                    {isDragging
                      ? 'Déposez votre image ici'
                      : 'Cliquez ou glissez-déposez'}
                  </span>
                </p>
                <p className="text-xs text-zinc-500">
                  PNG, JPG ou JPEG (max. 5MB)
                </p>
              </div>
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
            </label>

            {currentAvatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveAvatar}
              >
                <X size={16} />
                Supprimer la photo actuelle
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!selectedFile || isLoading}
              isLoading={isLoading}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
