'use client';
import { RefObject, useEffect } from 'react';
import { MessageBubble } from '@/components/molecules/MessageBubble';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Loader2 } from 'lucide-react';
import type { Message } from '@/lib/api-types';

interface MessageListProps {
  messages: Message[] | undefined;
  currentUserId?: number;
  scrollRef: RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
  hasMore?: boolean;
}

export function MessageList({
  messages,
  currentUserId,
  scrollRef,
  isLoading = false,
  hasMore = false,
}: MessageListProps) {
  useEffect(() => {
    if (messages) {
      const ids = messages.map((m) => m.id);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

      if (duplicates.length > 0) {
        console.error('Duplicate message IDs detected:', duplicates);
        console.error('All messages:', messages);
      }
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6"
      style={{ overflowAnchor: 'none' }} // Important pour éviter le scroll jump
    >
      <div className="flex flex-col">
        {/* Indicateur de chargement en haut */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Indicateur de début de conversation */}
        {!hasMore && messages && messages.length > 0 && (
          <div className="flex justify-center py-4">
            <p className="text-sm text-muted-foreground">
              Début de la conversation
            </p>
          </div>
        )}

        {/* Messages */}
        {messages && messages.length > 0 ? (
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                content={m.content}
                timestamp={m.timestamp}
                isOwn={m.sender?.id === currentUserId}
                sender={m.sender}
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <EmptyState
              title="Aucun message"
              description="Commencez la conversation"
            />
          )
        )}
      </div>
    </div>
  );
}
