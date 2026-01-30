'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/Dialog';
import { validate, getInitialsFromName } from '@/lib/utils';
import Image from 'next/image';
import {
  AddConversationData,
  AddConversationSchema,
} from '@/lib/validation/conversation.validation';
import { useState } from 'react';
import { UserInfo } from '@/lib/api-types';

interface formData {
  receiverId: number | undefined;
  title: string;
}

interface NewConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  followedUsers: UserInfo[];
  onSubmit: (data: AddConversationData) => void;
  isLoading?: boolean;
}

export function NewConversationDialog({
  isOpen,
  onClose,
  followedUsers,
  onSubmit,
  isLoading = false,
}: NewConversationDialogProps) {
  const [formData, setFormData] = useState<formData>({
    receiverId: undefined,
    title: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // clean-up function
  const cleanForm = () => {
    setFormData({ receiverId: undefined, title: '' });
    setSearchQuery('');
    setIsSearchFocused(false);
    setErrors({});
  };

  const handleClose = () => {
    cleanForm();
    onClose();
  };

  function updateField<K extends keyof AddConversationData>(
    field: K,
    value: string | number | undefined,
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // if we select a receiver we close the search list
    if (field === 'receiverId') {
      setIsSearchFocused(false);
      setSearchQuery('');
    }
    // Reset the error for the field that was just updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !validate(AddConversationSchema, formData, setErrors) ||
      !formData.receiverId
    )
      return;

    onSubmit({
      receiverId: formData.receiverId,
      title: formData.title,
    });

    cleanForm();
  };

  // Filter users with the search query
  const filteredUsers = followedUsers.filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Select a user if we select him in the list
  const selectedUser = followedUsers.find(
    (user) => user.id === formData.receiverId,
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => !open && handleClose()}
    >
      <DialogContent className="sm:min-w-md lg:min-w-lg min-w-[calc(100dvw-2rem)] p-0 overflow-hidden border-none bg-transparent shadow-none">
        <div className="bg-background rounded-xl border shadow-lg overflow-hidden">
          <DialogHeader className="p-6 pb-0 text-center">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Nouvelle discussion
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Lancez un nouvel échange avec l&apos;un de vos contacts.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            <div className="grid gap-3">
              <label htmlFor="contacts" className="text-sm font-medium">
                Destinataire *
              </label>

              {/* Barre de recherche */}
              <div className="relative">
                <Input
                  placeholder="Rechercher un contact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                />

                {/* Liste déroulante des utilisateurs */}
                {isSearchFocused && !selectedUser && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10 max-h-36 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      <div className="divide-y">
                        {filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => updateField('receiverId', user.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                          >
                            <div className="h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0 relative border-2 border-background shadow-sm">
                              {user.avatarUrl ? (
                                <Image
                                  src={user.avatarUrl}
                                  alt={`${user.firstname} ${user.lastname}`}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-xs font-bold text-primary">
                                  {getInitialsFromName(
                                    `${user.firstname || ''} ${user.lastname || ''}`.trim(),
                                  ) || '?'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {user.firstname} {user.lastname}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          {searchQuery
                            ? 'Aucun contact trouvé'
                            : 'Aucun contact suivi'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedUser && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary">
                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0 relative border-2 border-background shadow-sm">
                    {selectedUser.avatarUrl ? (
                      <Image
                        src={selectedUser.avatarUrl}
                        alt={`${selectedUser.firstname} ${selectedUser.lastname}`}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-xs font-bold text-primary">
                        {getInitialsFromName(
                          `${selectedUser.firstname || ''} ${selectedUser.lastname || ''}`.trim(),
                        ) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {selectedUser.firstname} {selectedUser.lastname}
                    </p>
                    <p className="text-xs text-muted-foreground">Sélectionné</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updateField('receiverId', undefined);
                      setIsSearchFocused(true);
                    }}
                    className="text-xs"
                  >
                    Changer
                  </Button>
                </div>
              )}

              {errors.receiverId && (
                <p className="text-xs text-error">{errors.receiverId}</p>
              )}
            </div>

            <Input
              id="title"
              label="Titre de la discussion *"
              placeholder="Ex: Collaboration projet SkillSwap"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              error={errors.title}
            />
            <div className="flex gap-3 mt-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1" isLoading={isLoading}>
                Créer
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
