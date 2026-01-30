'use client';

import { memo } from 'react';
import { Avatar } from '@/components/atoms/Avatar';
import { cn } from '@/lib/utils';
import type { UserInfo } from '@/lib/api-types';
import { formatMessageDate } from '@/lib/dateTime.utils';

interface MessageBubbleProps {
  content: string;
  timestamp?: string;
  isOwn: boolean;
  sender?: UserInfo;
}

export const MessageBubble = memo(function MessageBubble({
  content,
  timestamp,
  isOwn,
  sender,
}: MessageBubbleProps) {
  const initials = sender
    ? `${sender.firstname.charAt(0)}${sender.lastname.charAt(0)}`
    : '?';

  return (
    <div className={cn('flex gap-3', isOwn && 'flex-row-reverse')}>
      {!isOwn && (
        <Avatar
          user={sender}
          initials={!sender ? initials : undefined}
          size="sm"
          className="shrink-0"
        />
      )}

      <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'max-w-md rounded-lg px-4 py-3 text-sm',
            isOwn
              ? 'rounded-br-none bg-primary text-primary-foreground'
              : 'rounded-bl-none border bg-background text-foreground',
          )}
        >
          {content}
        </div>

        <time
          suppressHydrationWarning
          dateTime={timestamp}
          className={cn(
            'mt-1 text-xs text-muted-foreground',
            isOwn ? 'pr-2' : 'pl-2',
          )}
        >
          {formatMessageDate(timestamp)}
        </time>
      </div>
    </div>
  );
});
