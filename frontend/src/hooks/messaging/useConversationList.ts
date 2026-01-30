'use client';
import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from '@/lib/api-types';
import api from '@/lib/api-client';
import { logError } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

/**
 * Hook for managing the list of conversations
 * Responsibilities: fetch, add, update, remove conversations
 */
export function useConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      try {
        const response = await api.getAllUserConversations();
        if (!response.data) {
          setConversations([]);
          return;
        }
        setConversations(response.data);
      } catch (err) {
        logError(err);
        toast.error('Erreur lors du chargement des conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated]);

  // Add a new conversation to the array (local)
  const addConversation = useCallback((conv: Conversation) => {
    setConversations((prev) => [conv, ...prev]);
  }, []);

  // Update a conversation in the array by id (local)
  const updateConversation = useCallback(
    (id: number, updates: Partial<Conversation>) => {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? { ...conv, ...updates } : conv)),
      );
    },
    [],
  );

  // Update the lastMessage of a conversation (without re-sorting)
  const updateConversationLastMessage = useCallback(
    (conversationId: number, lastMessage: Message) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, lastMessage } : conv,
        ),
      );
    },
    [],
  );

  // Update the status of a conversation (e.g., Close)
  const updateConversationStatus = useCallback(
    (conversationId: number, status: 'Open' | 'Close') => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, status } : conv,
        ),
      );
    },
    [],
  );

  // Remove a conversation from the array (local)
  const removeConversation = useCallback((id: number) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
  }, []);

  return {
    conversations,
    isLoading,
    addConversation,
    updateConversation,
    updateConversationLastMessage,
    updateConversationStatus,
    removeConversation,
  };
}
