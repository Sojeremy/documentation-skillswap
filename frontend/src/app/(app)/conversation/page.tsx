'use client';

import { Suspense } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ConversationSection, MessageThread } from '@/components/organisms';
import { EmptyState } from '@/components/molecules';
import { useAuth } from '@/components/providers/AuthProvider';
import { useIsMobile, useMessaging } from '@/hooks';
import { useConversationState } from '@/components/organisms/ConversationPage/useConversationState';

function ConversationContent() {
  const isMobile = useIsMobile(768);
  const { user } = useAuth();
  const {
    selectedConvId,
    setSelectedConvId,
    selectedConv,
    conversations,
    isConversationLoading,
    followedUsers,
    loadMoreMessages,
    handleBack,
    handleNewConversation,
    handleAddConversation,
    handleSendMessage,
    handleViewProfile,
    handleRatingUser,
    handleEncloseConversation,
    handleDeleteConversation,
  } = useMessaging();

  const conversationState = useConversationState();

  return (
    <MainLayout isFullHeight={true}>
      <div className="flex flex-1 overflow-hidden h-full">
        {(!isMobile || !selectedConv) && (
          <ConversationSection
            conversations={conversations}
            isConversationLoading={isConversationLoading}
            selectedConvId={selectedConvId}
            followedUsers={followedUsers}
            setSelectedConvId={setSelectedConvId}
            onNewConversation={handleNewConversation}
            onAddConversation={handleAddConversation}
            filter={conversationState.filter}
            setFilter={conversationState.setFilter}
          />
        )}

        <section className="flex flex-1 flex-col min-w-0 h-full overflow-y-scroll">
          {selectedConv ? (
            <MessageThread
              selectedConv={selectedConv}
              currentUserId={user?.id}
              onBack={handleBack}
              showBackButton={isMobile}
              onViewProfile={handleViewProfile}
              onRatingUser={handleRatingUser}
              onEncloseConversation={handleEncloseConversation}
              onDeleteConversation={handleDeleteConversation}
              onSendMessage={handleSendMessage}
              conversationStatus={conversationState.filter}
              onLoadMore={loadMoreMessages}
            />
          ) : (
            !isMobile && (
              <EmptyState
                title="Sélectionnez une conversation"
                description="Choisissez une conversation pour commencer"
              />
            )
          )}
        </section>
      </div>
    </MainLayout>
  );
}

export default function ConversationPage() {
  return (
    <Suspense
      fallback={
        <MainLayout isFullHeight={true}>
          <div />
        </MainLayout>
      }
    >
      <ConversationContent />
    </Suspense>
  );
}
