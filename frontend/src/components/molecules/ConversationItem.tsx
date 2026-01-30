'use client';

import { memo } from 'react';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Message, UserInfo } from '@/lib/api-types';
import { formatConversationDate } from '@/lib/dateTime.utils';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  participant?: UserInfo;
  conversationTitle: string;
  lastMessage?: Message | null;
  unreadCount?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const ConversationItem = memo(function ConversationItem({
  participant,
  conversationTitle,
  lastMessage,
  unreadCount = 0,
  isActive,
  onClick,
}: ConversationItemProps) {
  const formattedTime = lastMessage
    ? lastMessage.timestamp
      ? formatConversationDate(lastMessage.timestamp)
      : ''
    : '';

  const initials = participant
    ? `${participant.firstname.charAt(0)}${participant.lastname.charAt(0)}`
    : '?';

  const participantName = participant
    ? `${participant.firstname} ${participant.lastname}`
    : 'Utilisateur inconnu';

  return (
    <button
      onClick={onClick}
      aria-label={`Conversation avec ${participantName} : ${conversationTitle}`}
      aria-current={isActive ? 'true' : undefined}
      className={cn(
        'flex items-start gap-3 w-full p-3 text-left transition-all duration-150 ease-in-out',
        'border-l-4 rounded-md',
        'hover:bg-primary-50',
        !isActive && 'border-l-transparent',
        isActive && 'bg-primary-50 border-l-primary-700 hover:bg-muted',
      )}
    >
      <Avatar
        user={participant ?? undefined}
        initials={!participant ? initials : undefined}
        size="md"
        className="shrink-0"
      />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p
            title={conversationTitle}
            className={cn(
              'truncate font-medium',
              unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {conversationTitle}
          </p>

          <span className="shrink-0 text-xs text-muted-foreground">
            {formattedTime}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'truncate text-sm',
              unreadCount > 0
                ? 'font-medium text-foreground'
                : 'text-muted-foreground',
            )}
          >
            {lastMessage && lastMessage.content}
          </p>

          {unreadCount > 0 && (
            <Badge
              variant="default"
              className="shrink-0 rounded-full text-primary-700 bg-primary-100"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
});
