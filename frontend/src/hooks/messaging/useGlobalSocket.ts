'use client';
import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket-client';
import type { Conversation, Message } from '@/lib/api-types';

type ConversationUpdateHandler = (
  conversationId: number,
  lastMessage: Message,
) => void;

type ConversationClosedHandler = (
  conversationId: number,
  closedBy: { id: number; firstname: string; lastname: string } | null,
) => void;

// ✅ NOUVEAU
type ConversationNewHandler = (conversation: Conversation) => void;

/**
 * Global socket hook - listens to events for ALL conversations
 * Used for updating conversation list when not in a specific conversation
 */
export function useGlobalSocket() {
  const socketRef = useRef(getSocket());
  const conversationUpdateHandlerRef = useRef<ConversationUpdateHandler | null>(
    null,
  );
  const conversationClosedHandlerRef = useRef<ConversationClosedHandler | null>(
    null,
  );
  const conversationNewHandlerRef = useRef<ConversationNewHandler | null>(null);

  // Connect to socket
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConversationUpdate = (payload: {
      conversationId: number;
      lastMessage: Message;
    }) => {
      conversationUpdateHandlerRef.current?.(
        payload.conversationId,
        payload.lastMessage,
      );
    };

    const handleConversationClosed = (payload: {
      conversationId: number;
      closedBy: { id: number; firstname: string; lastname: string } | null;
    }) => {
      conversationClosedHandlerRef.current?.(
        payload.conversationId,
        payload.closedBy,
      );
    };

    const handleConversationNew = (payload: { conversation: Conversation }) => {
      conversationNewHandlerRef.current?.(payload.conversation);
    };

    // Listen globally (not tied to a specific conversation)
    socket.on('conversation:updated', handleConversationUpdate);
    socket.on('conversation:closed', handleConversationClosed);
    socket.on('conversation:new', handleConversationNew);

    return () => {
      socket.off('conversation:updated', handleConversationUpdate);
      socket.off('conversation:closed', handleConversationClosed);
      socket.off('conversation:new', handleConversationNew);
    };
  }, []);

  const onConversationUpdate = (handler: ConversationUpdateHandler) => {
    conversationUpdateHandlerRef.current = handler;
  };

  const onConversationClosed = (handler: ConversationClosedHandler) => {
    conversationClosedHandlerRef.current = handler;
  };

  const onConversationNew = (handler: ConversationNewHandler) => {
    conversationNewHandlerRef.current = handler;
  };

  return {
    onConversationUpdate,
    onConversationClosed,
    onConversationNew, // ✅ NOUVEAU
  };
}
