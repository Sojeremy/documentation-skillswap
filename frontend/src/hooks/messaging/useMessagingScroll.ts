'use client';
import { Message } from '@/lib/api-types';
import { useEffect, useRef, useCallback } from 'react';

interface UseMessageScrollOptions {
  messages: Message[];
  conversationId: number | undefined;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
}

export function useMessageScroll({
  messages,
  conversationId,
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
}: UseMessageScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const isNearBottomRef = useRef<boolean>(true);
  const previousConversationIdRef = useRef<number | undefined>(undefined);
  const previousMessageCountRef = useRef<number>(0);

  // Function to scroll to bottom
  const scrollToBottom = useCallback((smooth = false) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
    isNearBottomRef.current = true;
  }, []);

  // Check if user is near the bottom of the scroll
  const checkIfNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollThreshold = 150;
    const isNear =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      scrollThreshold;
    isNearBottomRef.current = isNear;
  }, []);

  // Handle scroll event (to load more messages AND update isNearBottom)
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    checkIfNearBottom();

    // Load more messages if near the top
    if (!isLoading && hasMore && container.scrollTop < threshold) {
      previousScrollHeightRef.current = container.scrollHeight;
      onLoadMore();
    }
  }, [onLoadMore, hasMore, isLoading, threshold, checkIfNearBottom]);

  // Auto-scroll when conversation changes
  useEffect(() => {
    if (conversationId !== previousConversationIdRef.current) {
      previousConversationIdRef.current = conversationId;
      previousMessageCountRef.current = 0;
      // Small delay to allow messages to load
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [conversationId, scrollToBottom]);

  // Auto-scroll when a new message arrives (only if near bottom)
  useEffect(() => {
    const hasNewMessage = messages.length > previousMessageCountRef.current;
    previousMessageCountRef.current = messages.length;

    if (hasNewMessage && isNearBottomRef.current) {
      // Smooth scroll only if already at the bottom
      setTimeout(() => scrollToBottom(true), 50);
    }
  }, [messages.length, scrollToBottom]);

  // Maintain scroll position after loading old messages
  useEffect(() => {
    const container = containerRef.current;
    if (!container || previousScrollHeightRef.current === 0) return;

    const newScrollHeight = container.scrollHeight;
    const heightDifference = newScrollHeight - previousScrollHeightRef.current;

    if (heightDifference > 0) {
      container.scrollTop += heightDifference;
      previousScrollHeightRef.current = 0;

      checkIfNearBottom();
    }
  }, [messages, checkIfNearBottom]);

  // Attach scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { containerRef, scrollToBottom };
}
