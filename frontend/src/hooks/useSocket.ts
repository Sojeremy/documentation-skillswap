'use client';
import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket-client';
import type { Message } from '@/lib/api-types';

type MessageHandler = (message: Message) => void;
type ConversationUpdateHandler = (
  conversationId: number,
  lastMessage: Message,
) => void;
type ConversationClosedHandler = (
  conversationId: number,
  closedBy: { id: number; firstname: string; lastname: string } | null,
) => void;
type ErrorHandler = (error: { code: string; message: string }) => void;

export function useSocket(conversationId: number | undefined) {
  const socketRef = useRef(getSocket());
  const messageHandlerRef = useRef<MessageHandler | null>(null);
  const conversationUpdateHandlerRef = useRef<ConversationUpdateHandler | null>(
    null,
  );
  const conversationClosedHandlerRef = useRef<ConversationClosedHandler | null>(
    null,
  );
  const errorHandlerRef = useRef<ErrorHandler | null>(null);

  // Connect to socket
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  // Join/leave a conversation (when conversation is selected by user)
  useEffect(() => {
    if (!conversationId) return;

    const socket = socketRef.current;

    socket.emit('conversation:join', { conversationId });

    const handleNewMessage = (payload: {
      conversationId: number;
      message: Message;
    }) => {
      if (payload.conversationId === conversationId) {
        messageHandlerRef.current?.(payload.message);
      }
    };

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

    const handleError = (error: { code: string; message: string }) => {
      errorHandlerRef.current?.(error);
    };

    socket.on('message:new', handleNewMessage);
    socket.on('conversation:updated', handleConversationUpdate);
    socket.on('conversation:closed', handleConversationClosed);
    socket.on('error', handleError);

    return () => {
      socket.emit('conversation:leave', { conversationId });
      socket.off('message:new', handleNewMessage);
      socket.off('conversation:updated', handleConversationUpdate);
      socket.off('conversation:closed', handleConversationClosed);
      socket.off('error', handleError);
    };
  }, [conversationId]);

  // Send a message via socket
  const sendMessage = (content: string) => {
    if (!conversationId) return;

    socketRef.current.emit('message:send', {
      conversationId,
      message: content,
    });
  };

  // Close a conversation via socket
  const closeConversation = () => {
    if (!conversationId) return;

    socketRef.current.emit('conversation:close', {
      conversationId,
    });
  };

  const onMessage = (handler: MessageHandler) => {
    messageHandlerRef.current = handler;
  };

  const onConversationUpdate = (handler: ConversationUpdateHandler) => {
    conversationUpdateHandlerRef.current = handler;
  };

  const onConversationClosed = (handler: ConversationClosedHandler) => {
    conversationClosedHandlerRef.current = handler;
  };

  const onError = (handler: ErrorHandler) => {
    errorHandlerRef.current = handler;
  };

  return {
    sendMessage,
    closeConversation,
    onMessage,
    onConversationUpdate,
    onConversationClosed,
    onError,
  };
}
