'use client';

import { useState } from 'react'; // Ajout de useState
import type { Conversation, UserInfo } from '@/lib/api-types';
import { Button } from '@/components/atoms/Button';
import { MessageCircleOff, Plus } from 'lucide-react';
import { ConversationItem } from '../../molecules/ConversationItem';
import { cn } from '@/lib/utils';
import { EmptyState } from '../../molecules/EmptyState';
import { useRouter } from 'next/navigation';
import { NewConversationDialog } from './NewConversationDialog';
import { AddConversationData } from '@/lib/validation/conversation.validation';
import { ConversationSkeleton } from '../../molecules/ConversationSkeleton';
import { FilterStatus } from './useConversationState';

interface ConversationSectionProps {
  conversations: Conversation[];
  selectedConvId: number | undefined;
  followedUsers: UserInfo[] | undefined;
  setSelectedConvId: (id: number | undefined) => void;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  onNewConversation: () => void;
  onAddConversation: (data: AddConversationData) => void;
  isConversationLoading?: boolean;
}

export function ConversationSection({
  conversations,
  selectedConvId,
  setSelectedConvId,
  filter,
  setFilter,
  followedUsers,
  onNewConversation,
  onAddConversation,
  isConversationLoading = false,
}: ConversationSectionProps) {
  const [isNewConvOpen, setIsNewConvOpen] = useState(false);
  const [isSubmittingNewConv, setIsSubmittingNewConv] = useState(false);
  const router = useRouter();
  const Filteredconversations = conversations.filter(
    (conv) => conv.status === filter,
  );

  const handleNewConversation = () => {
    if (!isNewConvOpen) onNewConversation();
    setIsNewConvOpen(true);
  };

  const handleAddConversation = async (data: AddConversationData) => {
    setIsSubmittingNewConv(true);
    try {
      await onAddConversation(data);
      setIsNewConvOpen(false);
    } finally {
      setIsSubmittingNewConv(false);
    }
  };

  const handleFilterChange = (newStatus: FilterStatus) => {
    setFilter(newStatus);
    setSelectedConvId(undefined);
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 border-r bg-background max-h-full overflow-y-scroll">
      <div className="p-4 flex items-center">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button
            size="sm"
            className="flex items-center gap-2"
            onClick={handleNewConversation}
            disabled={isConversationLoading}
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau</span>
          </Button>
        </div>
      </div>

      {conversations.length > 0 && (
        <div className="py-2 flex gap-2 justify-center border-b">
          <Button
            variant="secondary"
            onClick={() => handleFilterChange('Open')}
            className={cn(
              'hover:text-primary-700 hover:bg-primary-100 transition-colors',
              filter === 'Open' && 'text-primary-700 bg-primary-100',
            )}
          >
            En cours
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleFilterChange('Close')}
            className={cn(
              'hover:text-primary-700 hover:bg-primary-100 transition-colors',
              filter === 'Close' && 'text-primary-700 bg-primary-100',
            )}
          >
            Archivées
          </Button>
        </div>
      )}

      <div className="overflow-y-auto">
        {isConversationLoading ? (
          <ConversationSkeleton />
        ) : Filteredconversations.length ? (
          Filteredconversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              participant={conv.participant}
              conversationTitle={conv.title}
              lastMessage={conv.lastMessage}
              isActive={conv.id === selectedConvId}
              onClick={() => setSelectedConvId(conv.id)}
              unreadCount={0}
            />
          ))
        ) : (
          filter == 'Open' && (
            <EmptyState
              icon={
                <MessageCircleOff
                  className="h-12 w-12 opacity-20"
                  strokeWidth={1.5}
                />
              }
              title="Aucun message"
              description="Vous n'avez pas encore de conversations. Commencez par rechercher des profils qui vous intéressent."
              actionLabel="Découvrir des profils"
              onAction={() => router.push('/recherche')}
            />
          )
        )}
      </div>
      <NewConversationDialog
        isOpen={isNewConvOpen}
        onClose={() => setIsNewConvOpen(false)}
        followedUsers={followedUsers ?? []}
        onSubmit={handleAddConversation}
        isLoading={isSubmittingNewConv}
      />
    </aside>
  );
}
