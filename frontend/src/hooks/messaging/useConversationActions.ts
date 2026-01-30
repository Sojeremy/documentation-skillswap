'use client';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api-client';
import { logError } from '@/lib/utils';
import type {
  AddRatingData,
  Conversation,
  ConversationWithMessages,
  Message,
} from '@/lib/api-types';
import type { AddConversationData } from '@/lib/validation/conversation.validation';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/components/providers/AuthProvider';

interface UseConversationActionsProps {
  selectedConvId: number | undefined;
  selectedConv?: ConversationWithMessages;
  setSelectedConvId: (id: number | undefined) => void;
  addConversation: (conv: Conversation) => void;
  updateConversation: (id: number, updates: Partial<Conversation>) => void;
  removeConversation: (id: number) => void;
  clearSelection: () => void;
  fetchFollowedUsers: () => void;
  addMessage: (message: Message) => void;
  addOptimisticMessage: (
    tempId: number,
    content: string,
    sender: Message['sender'],
  ) => void;
}

export function useConversationActions({
  selectedConvId,
  selectedConv,
  setSelectedConvId,
  addConversation,
  updateConversation,
  removeConversation,
  clearSelection,
  fetchFollowedUsers,
  addMessage,
  addOptimisticMessage,
}: UseConversationActionsProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Socket.IO
  const {
    sendMessage: socketSendMessage,
    closeConversation: socketCloseConversation,
    onMessage,
  } = useSocket(selectedConvId);

  // Listen for new messages in real time
  useEffect(() => {
    onMessage((newMessage) => {
      // Ignore own messages (we already added them optimistically)
      if (newMessage.sender?.id === user?.id) {
        return;
      }
      addMessage(newMessage);
    });
  }, [onMessage, addMessage, user?.id]);

  const handleBack = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const handleViewProfile = useCallback(
    (userId: number) => {
      router.push(`/profil/${userId}`);
    },
    [router],
  );

  const handleNewConversation = useCallback(() => {
    fetchFollowedUsers();
  }, [fetchFollowedUsers]);

  const handleAddConversation = useCallback(
    async (data: AddConversationData) => {
      try {
        const response = await api.createConversation(data);
        if (!response.data) throw new Error('An error occurred');

        addConversation(response.data);
        setSelectedConvId(response.data.id);
        toast.success('La conversation a bien été créée');
      } catch (err) {
        logError(err);
        toast.error("Erreur lors de l'ajout de la conversation");
        throw err;
      }
    },
    [addConversation, setSelectedConvId],
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedConvId || !content.trim()) return;

      const tempId = -Date.now();
      const sender = user
        ? {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            avatarUrl: user.avatarUrl,
          }
        : undefined;

      addOptimisticMessage(tempId, content, sender);
      socketSendMessage(content);
    },
    [selectedConvId, socketSendMessage, addOptimisticMessage, user],
  );

  const handleRatingUser = useCallback(
    async (data: AddRatingData) => {
      if (!selectedConv?.participant?.id || !selectedConvId) return;

      try {
        await api.rateUser(selectedConv.participant.id, data);

        if (!selectedConv) return;

        updateConversation(selectedConvId, {
          ...selectedConv,
          participant: selectedConv.participant
            ? {
                ...selectedConv.participant,
                isRated: true,
              }
            : undefined,
        });
      } catch (err) {
        logError(err);
        toast.error("Une erreur est survenue lors de l'évaluation");
        throw err;
      }
    },
    [selectedConv, selectedConvId, updateConversation],
  );

  const handleEncloseConversation = useCallback(async () => {
    if (!selectedConvId || !selectedConv) return;

    try {
      socketCloseConversation();
      toast.success('La conversation a été archivée');
    } catch (err) {
      logError(err);
      throw err;
    }
  }, [selectedConvId, selectedConv, socketCloseConversation]);

  const handleDeleteConversation = useCallback(async () => {
    if (!selectedConvId) return;

    try {
      await api.deleteOneConversation(selectedConvId);
      removeConversation(selectedConvId);
      clearSelection();
      toast.success('La conversation a bien été supprimée');
    } catch (err) {
      logError(err);
      toast.error('Erreur lors de la suppression de la conversation');
      throw err;
    }
  }, [selectedConvId, removeConversation, clearSelection]);

  return {
    handleBack,
    handleViewProfile,
    handleNewConversation,
    handleAddConversation,
    handleSendMessage,
    handleRatingUser,
    handleEncloseConversation,
    handleDeleteConversation,
  };
}
