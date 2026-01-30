'use client';

import { ConfirmDialog } from '@/components/molecules';
import { RatingDialog } from '@/components/organisms';

interface ThreadDialogsProps {
  conversationTitle: string;
  participantFirstname?: string;
  // Rating dialog
  isRatingOpen: boolean;
  onRatingClose: () => void;
  onRatingSubmit: (data: { score: number; comment?: string }) => void;
  isSubmittingRating: boolean;
  // Enclose dialog
  isConfirmEncloseOpen: boolean;
  onEncloseClose: () => void;
  onEncloseConfirm: () => void;
  isEncloseLoading: boolean;
  // Delete dialog
  isConfirmDeleteOpen: boolean;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;
  isDeleteLoading: boolean;
}

/**
 * Dialogs pour le thread de messages
 * - Dialog de notation
 * - Dialog de clôture
 * - Dialog de suppression
 */
export function ThreadDialogs({
  conversationTitle,
  participantFirstname,
  isRatingOpen,
  onRatingClose,
  onRatingSubmit,
  isSubmittingRating,
  isConfirmEncloseOpen,
  onEncloseClose,
  onEncloseConfirm,
  isEncloseLoading,
  isConfirmDeleteOpen,
  onDeleteClose,
  onDeleteConfirm,
  isDeleteLoading,
}: ThreadDialogsProps) {
  return (
    <>
      {/* Rating dialog */}
      <RatingDialog
        key={isRatingOpen ? 'open' : 'closed'}
        isOpen={isRatingOpen}
        onClose={onRatingClose}
        onSubmit={onRatingSubmit}
        targetName={participantFirstname}
        isLoading={isSubmittingRating}
      />

      {/* Enclose confirm dialog */}
      <ConfirmDialog
        isOpen={isConfirmEncloseOpen}
        onClose={onEncloseClose}
        onConfirm={onEncloseConfirm}
        title="Clôturer la discussion ?"
        question="Êtes-vous sûr de vouloir clôturer l'échange"
        subject={conversationTitle}
        description="Cette action indique que vous avez trouvé ce que vous cherchiez."
        confirmLabel="Confirmer"
        isLoading={isEncloseLoading}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={onDeleteConfirm}
        title="Supprimer la discussion ?"
        question="Êtes-vous sûr de vouloir supprimer la conversation"
        subject={conversationTitle}
        description="Vous serez retiré de cette conversation. Vos messages resteront visibles mais ne seront plus associés à votre profil."
        confirmLabel="Supprimer"
        isLoading={isDeleteLoading}
      />
    </>
  );
}
