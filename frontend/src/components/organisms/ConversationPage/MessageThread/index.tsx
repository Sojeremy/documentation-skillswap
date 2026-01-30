'use client';

import type { AddRatingData, ConversationWithMessages } from '@/lib/api-types';

import { ThreadHeader } from './ThreadHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ThreadDialogs } from './ThreadDialogs';
import { useThreadState } from './useThreadState';
import { toast } from 'sonner';
import { FilterStatus } from '../useConversationState';
import { useMessageScroll } from '@/hooks/messaging/useMessagingScroll';

interface MessageThreadProps {
  selectedConv: ConversationWithMessages;
  currentUserId?: number;
  onBack?: () => void;
  showBackButton?: boolean;
  onViewProfile: (id: number) => void;
  onRatingUser: (data: AddRatingData) => void;
  onEncloseConversation: () => void;
  onDeleteConversation: () => void;
  onSendMessage: (content: string) => void;
  conversationStatus: FilterStatus;
  onLoadMore: () => void; // Nouveau
}

/**
 * Thread de messages complet
 * Compose: ThreadHeader, MessageList, MessageInput et les dialogs
 */
export function MessageThread({
  selectedConv,
  currentUserId,
  onBack,
  showBackButton,
  onViewProfile,
  onRatingUser,
  onEncloseConversation,
  onDeleteConversation,
  onSendMessage,
  conversationStatus,
  onLoadMore,
}: MessageThreadProps) {
  const state = useThreadState();

  // Autoscroll to bottom of message when a conversation is selected or a message is added
  const { containerRef } = useMessageScroll({
    messages: selectedConv.messages || [],
    conversationId: selectedConv.id,
    onLoadMore,
    hasMore: selectedConv.hasMoreMessages,
    isLoading: selectedConv.isLoadingMessages,
    threshold: 100,
  });

  const handleViewProfile = () => {
    if (!selectedConv.participant) return;
    onViewProfile(selectedConv.participant.id);
  };

  const handleRatingOpen = () => {
    if (!selectedConv.participant) return;
    if (!selectedConv.participant.isFollowing) {
      toast.error("Vous devez suivre cette personne pour l'évaluer");
      return;
    }
    state.setIsRatingOpen(true);
  };

  const handleEncloseRequest = () => {
    if (selectedConv.participant && !selectedConv.participant.isRated) {
      if (!selectedConv.participant.isFollowing) {
        toast.error(
          'Vous devez suivre cette personne pour pouvoir clôturer la conversation',
        );
        return;
      }
      state.setShouldEncloseAfterRating(true);
      state.setIsRatingOpen(true);
      toast.info("Veuillez d'abord évaluer votre échange avant de clôturer");
    } else {
      state.setIsConfirmEncloseOpen(true);
    }
  };

  const handleConfirmEnclose = async () => {
    state.setIsConversationEnclosing(true);
    try {
      await onEncloseConversation();
      state.setIsConfirmEncloseOpen(false);
    } finally {
      state.setIsConversationEnclosing(false);
    }
  };

  const handleConfirmDelete = async () => {
    state.setIsConversationDeleting(true);
    try {
      await onDeleteConversation();
      state.setIsConfirmDeleteOpen(false);
    } finally {
      state.setIsConversationDeleting(false);
    }
  };

  const handleRatingSubmit = async (data: AddRatingData) => {
    if (!selectedConv.participant) return;

    state.setIsSubmittingRating(true);
    try {
      await onRatingUser(data);
      toast.success('Évaluation envoyée avec succès');
      state.setIsRatingOpen(false);

      if (state.shouldEncloseAfterRating) {
        state.setShouldEncloseAfterRating(false);
        state.setIsConfirmEncloseOpen(true);
      }
    } finally {
      state.setIsSubmittingRating(false);
    }
  };

  const handleRatingClose = () => {
    state.setIsRatingOpen(false);
    if (state.shouldEncloseAfterRating) {
      state.setShouldEncloseAfterRating(false);
      toast.info('Clôture annulée');
    }
  };

  const handleSend = () => {
    if (!state.messageContent.trim()) return;
    state.setIsSubmittingMessage(true);
    onSendMessage(state.messageContent);
    state.setMessageContent('');
    state.setIsSubmittingMessage(false);
  };

  return (
    <div className="flex h-full flex-col bg-muted w-full min-w-0">
      <ThreadHeader
        selectedConv={selectedConv}
        showBackButton={showBackButton}
        onBack={onBack}
        onViewProfile={handleViewProfile}
        onRatingOpen={handleRatingOpen}
        onEncloseOpen={handleEncloseRequest}
        onDeleteOpen={() => state.setIsConfirmDeleteOpen(true)}
      />

      <MessageList
        messages={selectedConv.messages}
        currentUserId={currentUserId}
        scrollRef={containerRef}
        isLoading={selectedConv.isLoadingMessages}
        hasMore={selectedConv.hasMoreMessages}
      />

      <MessageInput
        value={state.messageContent}
        onChange={state.setMessageContent}
        onSend={handleSend}
        isLoading={state.isSubmittingMessage}
        conversationStatus={conversationStatus}
      />

      <ThreadDialogs
        conversationTitle={selectedConv.title}
        participantFirstname={selectedConv.participant?.firstname}
        isRatingOpen={state.isRatingOpen}
        onRatingClose={handleRatingClose}
        onRatingSubmit={handleRatingSubmit}
        isSubmittingRating={state.isSubmittingRating}
        isConfirmEncloseOpen={state.isConfirmEncloseOpen}
        onEncloseClose={() => state.setIsConfirmEncloseOpen(false)}
        onEncloseConfirm={handleConfirmEnclose}
        isEncloseLoading={state.isConversationEnclosing}
        isConfirmDeleteOpen={state.isConfirmDeleteOpen}
        onDeleteClose={() => state.setIsConfirmDeleteOpen(false)}
        onDeleteConfirm={handleConfirmDelete}
        isDeleteLoading={state.isConversationDeleting}
      />
    </div>
  );
}
