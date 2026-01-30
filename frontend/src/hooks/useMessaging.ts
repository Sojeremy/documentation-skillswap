'use client';
import {
  useConversationList,
  useSelectedConversation,
  useConversationMessages,
  useConversationActions,
  useFollowedUsers,
  useGlobalSocket,
} from './messaging';
import { useMemo, useEffect } from 'react';
import { ConversationWithMessages } from '@/lib/api-types';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

export function useMessaging() {
  const { user } = useAuth();

  const {
    conversations,
    isLoading: isConversationLoading,
    addConversation,
    updateConversation,
    updateConversationLastMessage,
    updateConversationStatus,
    removeConversation,
  } = useConversationList();

  const { selectedConvId, setSelectedConvId, selectedConv, clearSelection } =
    useSelectedConversation(conversations);

  const {
    messages,
    isLoading: isLoadingMessages,
    hasMore: hasMoreMessages,
    loadMore: loadMoreMessages,
    addMessage,
    addOptimisticMessage,
  } = useConversationMessages({
    conversationId: selectedConvId,
    limit: 30,
  });

  const { followedUsers, fetchFollowedUsers } = useFollowedUsers();

  const { onConversationUpdate, onConversationClosed, onConversationNew } =
    useGlobalSocket();

  // Listen for lastMessage updates
  useEffect(() => {
    onConversationUpdate((conversationId, lastMessage) => {
      updateConversationLastMessage(conversationId, lastMessage);
    });
  }, [onConversationUpdate, updateConversationLastMessage]);

  // Listen for conversation closures
  useEffect(() => {
    onConversationClosed((conversationId, closedBy) => {
      updateConversationStatus(conversationId, 'Close');

      if (closedBy && closedBy.id !== user?.id) {
        toast.info(`${closedBy.firstname} à clôturer un échange`);
      }

      if (conversationId === selectedConvId) {
        clearSelection();
      }
    });
  }, [
    onConversationClosed,
    updateConversationStatus,
    selectedConvId,
    clearSelection,
    user,
  ]);

  useEffect(() => {
    onConversationNew((conversation) => {
      // Add the new conversation to the list
      addConversation(conversation);

      // Show notification
      toast.info(
        `${conversation.participant?.firstname} a démarré un nouvel échange`,
      );
    });
  }, [onConversationNew, addConversation]);

  const selectedConvWithMessages: ConversationWithMessages | undefined =
    useMemo(() => {
      if (!selectedConv) return undefined;

      return {
        ...selectedConv,
        messages,
        hasMoreMessages,
        isLoadingMessages,
      };
    }, [selectedConv, messages, hasMoreMessages, isLoadingMessages]);

  const {
    handleBack,
    handleViewProfile,
    handleNewConversation,
    handleAddConversation,
    handleRatingUser,
    handleEncloseConversation,
    handleDeleteConversation,
    handleSendMessage,
  } = useConversationActions({
    selectedConvId,
    selectedConv: selectedConvWithMessages,
    setSelectedConvId,
    addConversation,
    updateConversation,
    removeConversation,
    clearSelection,
    fetchFollowedUsers,
    addMessage,
    addOptimisticMessage,
  });

  return {
    selectedConvId,
    setSelectedConvId,
    selectedConv: selectedConvWithMessages,
    conversations,
    followedUsers,
    isConversationLoading,
    loadMoreMessages,
    handleBack,
    handleNewConversation,
    handleAddConversation,
    handleSendMessage,
    handleViewProfile,
    handleRatingUser,
    handleEncloseConversation,
    handleDeleteConversation,
  };
}
