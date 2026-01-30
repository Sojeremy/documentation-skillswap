'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/lib/api-types';
import api from '@/lib/api-client';
import { logError } from '@/lib/utils';
import { toast } from 'sonner';

interface UseConversationMessagesOptions {
  conversationId: number | undefined;
  limit?: number;
}

export function useConversationMessages({
  conversationId,
  limit = 50,
}: UseConversationMessagesOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isLoadingRef = useRef(false);
  const currentConversationIdRef = useRef<number | undefined>(undefined);
  const loadedConversationRef = useRef<number | undefined>(undefined);
  // Track optimistic messages: Map<tempId, content>
  const optimisticMessagesRef = useRef<Map<number, string>>(new Map());

  // Reset when conversation changes
  useEffect(() => {
    currentConversationIdRef.current = conversationId;
    setMessages([]);
    setNextCursor(null);
    setHasMore(true);
    isLoadingRef.current = false;
    loadedConversationRef.current = undefined;
    optimisticMessagesRef.current.clear();
  }, [conversationId]);

  // Load initial messages
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    if (loadedConversationRef.current === conversationId) {
      return;
    }

    const loadInitialMessages = async () => {
      setIsLoading(true);

      try {
        const response = await api.getConversationMessages(conversationId, {
          limit,
        });

        if (currentConversationIdRef.current !== conversationId) {
          return;
        }

        if (!response.data) {
          throw new Error('An error occurred');
        }

        setMessages(response.data.messages);
        setNextCursor(response.data.nextCursor);
        setHasMore(response.data.nextCursor !== null);
        loadedConversationRef.current = conversationId;
      } catch (err) {
        logError(err);
        toast.error('Erreur lors du chargement de la conversation');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMessages();
  }, [conversationId, limit]);

  // Load more messages (infinite scroll)
  const loadMore = useCallback(async () => {
    if (!conversationId || !hasMore || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const response = await api.getConversationMessages(conversationId, {
        limit,
        cursor: nextCursor ?? undefined,
      });

      if (currentConversationIdRef.current !== conversationId) {
        return;
      }

      if (!response.data) {
        throw new Error('An error occurred');
      }

      setMessages((prev) => {
        if (!response.data) return prev;

        const existingIds = new Set(prev.map((m) => m.id));
        const newUniqueMessages = response.data.messages.filter(
          (m) => !existingIds.has(m.id),
        );
        return [...newUniqueMessages, ...prev];
      });

      setNextCursor(response.data.nextCursor);
      setHasMore(response.data.nextCursor !== null);
    } catch (err) {
      logError(err);
      toast.error('Erreur lors du chargement des anciens messages');
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [conversationId, limit, nextCursor, hasMore]);

  // Add optimistic message (before server confirmation)
  const addOptimisticMessage = useCallback(
    (tempId: number, content: string, sender: Message['sender']) => {
      const optimisticMessage: Message = {
        id: tempId,
        content,
        timestamp: new Date().toISOString(),
        sender,
      };

      // Track this optimistic message
      optimisticMessagesRef.current.set(tempId, content);

      setMessages((prev) => [...prev, optimisticMessage]);
    },
    [],
  );

  // Add a new message from Socket.IO
  const addMessage = useCallback((newMessage: Message) => {
    setMessages((prev) => {
      // Check if message already exists (by real ID)
      const messageExists = prev.some((m) => m.id === newMessage.id);
      if (messageExists) {
        return prev;
      }

      // Add new message
      return [...prev, newMessage];
    });
  }, []);

  return {
    messages,
    isLoading,
    hasMore,
    loadMore,
    addMessage,
    addOptimisticMessage,
  };
}
