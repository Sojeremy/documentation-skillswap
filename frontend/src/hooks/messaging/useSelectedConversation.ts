'use client';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Conversation } from '@/lib/api-types';

/**
 * Hook for managing the currently selected conversation
 * Responsibilities: selection state and deriving selected conversation from list
 */
export function useSelectedConversation(conversations: Conversation[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initializedRef = useRef(false);

  // Initialize with query param
  const [selectedConvId, setSelectedConvId] = useState<number | undefined>(
    () => {
      const param = searchParams.get('id');
      return param ? Number(param) : undefined;
    },
  );

  // Validate and sync selection when conversations load
  const validatedConvId = useMemo(() => {
    if (!selectedConvId) return undefined;

    const exists = conversations.some((conv) => conv.id === selectedConvId);
    return exists ? selectedConvId : undefined;
  }, [selectedConvId, conversations]);

  // Clean URL after first valid selection
  useEffect(() => {
    if (
      !initializedRef.current &&
      conversations.length > 0 &&
      searchParams.get('id')
    ) {
      initializedRef.current = true;

      // Delay URL cleanup to next tick
      const timeoutId = setTimeout(() => {
        router.replace('/conversation', { scroll: false });
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [conversations, searchParams, router]);

  const selectedConv = useMemo(() => {
    if (!validatedConvId) return undefined;
    return conversations.find((conv) => conv.id === validatedConvId);
  }, [validatedConvId, conversations]);

  const clearSelection = useCallback(() => {
    setSelectedConvId(undefined);
  }, []);

  return {
    selectedConvId: validatedConvId,
    setSelectedConvId,
    selectedConv,
    clearSelection,
  };
}
