'use client';

import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@/components/atoms';
import { validate } from '@/lib/utils';
import {
  AddConversationWithMessageData,
  AddConversationWithMessageSchema,
} from '@/lib/validation/conversation.validation';
import { useState } from 'react';

export interface ContactFormData {
  title: string;
  message: string;
}

interface NewMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddConversationWithMessageData) => void;
}

export function NewMessageDialog({
  isOpen,
  onClose,
  onSubmit,
}: NewMessageDialogProps) {
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    title: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setContactFormData({ title: '', message: '' });
    setErrors({});
    onClose();
  };

  function updateField<K extends keyof typeof contactFormData>(
    field: K,
    value: string | number,
  ) {
    setContactFormData((prev) => ({ ...prev, [field]: value }));
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

    if (!validate(AddConversationWithMessageSchema, contactFormData, setErrors))
      return;

    setIsLoading(true);
    onSubmit({
      title: contactFormData.title,
      message: contactFormData.message,
    });
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-112.5 p-0 overflow-hidden border-none bg-transparent shadow-none">
        <div className="bg-background rounded-xl border shadow-lg overflow-hidden">
          <DialogHeader className="p-6 pb-0 text-center">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Nouvelle discussion
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Lancez un nouvel échange avec l&apos;un de vos contacts.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            <Input
              label="Titre de la discussion *"
              placeholder="Ex: Collaboration projet SkillSwap"
              value={contactFormData.title}
              onChange={(e) => updateField('title', e.target.value)}
              error={errors.title}
              id="title"
            />

            <Textarea
              label="Votre message *"
              placeholder="Écrivez votre premier message ici..."
              value={contactFormData.message}
              onChange={(e) => updateField('message', e.target.value)}
              error={errors.message}
              rows={4}
              id="message"
            />

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={handleClose}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1" isLoading={isLoading}>
                Créer et envoyer
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
