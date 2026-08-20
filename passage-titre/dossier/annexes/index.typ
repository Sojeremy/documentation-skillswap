// =============================================================================
// Annexes du Dossier de Projet — REAC §7 demande explicitement :
// - les maquettes des interfaces utilisateur ;
// - les captures d'écrans d'interfaces utilisateurs et le code correspondant ;
// - le code de composants métier les plus significatifs ;
// - le code de composants d'accès aux données les plus significatifs ;
// - le code d'autres composants (contrôleurs, utilitaires…).
//
// Volume cible : 15-20 pages.
// =============================================================================

= Annexes <sec-annexes>

Les présentes annexes regroupent les éléments matériels demandés par le
référentiel pour la *fonctionnalité la plus représentative* du projet — la
messagerie temps réel. Elles permettent à l'évaluateur d'inspecter le code
réel sans devoir alterner entre le dossier et le dépôt source.

== Annexe A — Schéma Prisma de la fonctionnalité messagerie

Extrait de #raw("backend/prisma/schema.prisma", lang: "txt") couvrant les
modèles directement impliqués dans la messagerie : #raw("Conversation", lang: "sql"),
#raw("UserHasConversation", lang: "sql"), #raw("Message", lang: "sql"),
#raw("Follow", lang: "sql") (gating), et les relations vers
#raw("User", lang: "sql").

```prisma
model Conversation {
  id        Int                  @id @default(autoincrement())
  status    StatusOfConversation @default(Open)
  title     String
  users     UserHasConversation[]
  messages  Message[]

  createdAt DateTime             @default(now()) @map("created_at")
  updatedAt DateTime             @default(now()) @updatedAt @map("updated_at")

  @@map("conversation")
}

enum StatusOfConversation {
  Open
  Close
}

model UserHasConversation {
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId         Int          @map("user_id")
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  conversationId Int          @map("conversation_id")

  createdAt      DateTime     @default(now()) @map("created_at")
  updatedAt      DateTime     @default(now()) @updatedAt @map("updated_at")

  @@id([userId, conversationId])
  @@map("user_has_conversation")
}

model Message {
  id             Int          @id @default(autoincrement())
  sender         User         @relation("SenderUser", fields: [senderId], references: [id], onDelete: Cascade)
  senderId       Int          @map("sender_id")
  receiver       User         @relation("ReceiverUser", fields: [receiverId], references: [id], onDelete: Cascade)
  receiverId     Int          @map("receiver_id")
  content        String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  conversationId Int          @map("conversation_id")

  createdAt      DateTime     @default(now()) @map("created_at")
  updatedAt      DateTime     @default(now()) @updatedAt @map("updated_at")

  @@map("message")
}

model Follow {
  id         Int      @id @default(autoincrement())
  followed   User     @relation("FollowedUser", fields: [followedId], references: [id], onDelete: Cascade)
  followedId Int      @map("followed_id")
  follower   User     @relation("FollowerUser", fields: [followerId], references: [id], onDelete: Cascade)
  followerId Int      @map("follower_id")

  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @default(now()) @updatedAt @map("updated_at")

  @@unique([followedId, followerId])
  @@map("follow")
}
```

=== Extraits SQL générés par Prisma — migrations clés

Migration #raw("init_db", lang: "txt") (création de la table #raw("user", lang: "sql"))
— extrait du fichier #raw("backend/prisma/migrations/20260112133206_init_db/migration.sql", lang: "txt") :

```sql
CREATE TABLE "user" (
    "id"            SERIAL NOT NULL,
    "firstname"     TEXT NOT NULL,
    "lastname"      TEXT NOT NULL,
    "email"         TEXT NOT NULL,
    "password"      TEXT NOT NULL,
    "address"       TEXT,
    "postal_code"   INTEGER,
    "city"          TEXT,
    "age"           INTEGER,
    "avatarUrl"     TEXT,
    "description"   TEXT,
    "role_id"       INTEGER NOT NULL,
    "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

ALTER TABLE "user"
    ADD CONSTRAINT "user_role_id_fkey"
    FOREIGN KEY ("role_id") REFERENCES "role"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
```

Migration #raw("add_unique_constrain", lang: "txt") (matérialisation des
contraintes d'unicité métier) :

```sql
CREATE UNIQUE INDEX "evaluation_evaluator_id_evaluated_id_key"
    ON "evaluation"("evaluator_id", "evaluated_id");

CREATE UNIQUE INDEX "follow_followed_id_follower_id_key"
    ON "follow"("followed_id", "follower_id");
```

== Annexe B — Handler Socket.IO `message:send` (code complet)

Reproduction *verbatim* de #raw("backend/src/realtime/socket.ts:167-347", lang: "txt")
(dépôt d'équipe, branche #raw("main", lang: "txt")) — handler complet de l'envoi
d'un message : validation, vérification de participation, persistance Prisma en
parallèle, et diffusion multi-rooms. Seule adaptation de mise en page : le bloc
est désindenté de quatre espaces, le handler étant imbriqué dans
#raw("io.on('connection')", lang: "ts") dans le fichier source. Commentaires
d'origine conservés en anglais, tels qu'ils figurent dans le livrable.

```ts
socket.on('message:send', async (payload) => {
  const conversationId = Number(payload?.conversationId);
  const content = String(payload?.message ?? '').trim();

  // Validate input
  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    socket.emit('error', {
      code: 'VALIDATION',
      message: 'Invalid conversationId',
    });
    return;
  }

  if (!content || content.length > 2000) {
    socket.emit('error', {
      code: 'VALIDATION',
      message: 'Invalid message',
    });
    return;
  }

  // Get conversation with participants and message count
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      title: true,
      status: true,
      users: {
        select: {
          userId: true,
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              avatarUrl: true,
            },
          },
        },
      },
      _count: {
        select: { messages: true },
      },
    },
  });

  if (!conv || conv.status === 'Close') {
    socket.emit('error', {
      code: 'FORBIDDEN',
      message: 'Conversation closed',
    });
    return;
  }

  // Verify that the sender is a participant in the conversation
  const userIds = conv.users.map((u) => u.userId);
  if (!userIds.includes(userId)) {
    socket.emit('error', {
      code: 'FORBIDDEN',
      message: 'Not a participant',
    });
    return;
  }

  const participantIds = new Set(userIds);
  const receiverId = userIds.find((id) => id !== userId);

  if (!receiverId) {
    socket.emit('error', { code: 'FORBIDDEN', message: 'No receiver' });
    return;
  }

  // Check if this is the first message
  const isFirstMessage = conv._count.messages === 0;

  // Create the message AND update conversation's updatedAt
  const [msg] = await Promise.all([
    prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        receiverId,
        content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
  ]);

  // Prepare DTO
  const dto: MessageDTO = {
    id: msg.id,
    sender:
      msg.sender && participantIds.has(msg.sender.id)
        ? {
            id: msg.sender.id,
            firstname: msg.sender.firstname,
            lastname: msg.sender.lastname,
            avatarUrl: msg.sender.avatarUrl ?? undefined,
          }
        : undefined,
    content: msg.content,
    timestamp: msg.createdAt.toISOString(),
  };

  // Emit message to conversation room (for users actively viewing)
  io.to(room(conversationId)).emit('message:new', {
    conversationId,
    message: dto,
  });

  // If first message, notify the receiver about the new conversation
  if (isFirstMessage) {
    // Get follow/rating status for the receiver
    const [followStatus, ratingStatus] = await Promise.all([
      prisma.follow.findUnique({
        where: {
          followedId_followerId: {
            followerId: receiverId,
            followedId: userId,
          },
        },
      }),
      prisma.rating.findUnique({
        where: {
          evaluatorId_evaluatedId: {
            evaluatorId: receiverId,
            evaluatedId: userId,
          },
        },
      }),
    ]);

    // Get sender info for the receiver's perspective
    const senderUser = conv.users.find((u) => u.userId === userId)?.user;

    if (senderUser) {
      // Emit new conversation to receiver only
      io.to(`user:${receiverId}`).emit('conversation:new', {
        conversation: {
          id: conv.id,
          title: conv.title,
          status: conv.status as 'Open' | 'Close',
          participant: {
            id: senderUser.id,
            firstname: senderUser.firstname,
            lastname: senderUser.lastname,
            avatarUrl: senderUser.avatarUrl ?? undefined,
            isFollowing: !!followStatus,
            isRated: !!ratingStatus,
          },
          lastMessage: dto,
        },
      });
    }
  }

  // Emit conversation update to all participants (via user rooms)
  userIds.forEach((participantId) => {
    io.to(`user:${participantId}`).emit('conversation:updated', {
      conversationId,
      lastMessage: dto,
    });
  });
});
```

== Annexe C — Orchestrateur frontend `useMessaging` (139 LOC, complet)

Reproduction *verbatim* et intégrale de #raw("frontend/src/hooks/useMessaging.ts", lang: "txt")
(dépôt d'équipe, branche #raw("main", lang: "txt")) — la façade qui compose les
sept hooks spécialisés et écoute les trois events Socket globaux
(`conversation:updated`, `conversation:closed`, `conversation:new`).

```ts
'use client';
import {
  useConversationList,
  useSelectedConversation,
  useConversationMessages,
  useConversationActions,
  useFollowedUsers,
  useGlobalSocket,
} from './messaging';
import { useMemo, useEffect } from 'react';
import { ConversationWithMessages } from '@/lib/api-types';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

export function useMessaging() {
  const { user } = useAuth();

  const {
    conversations,
    isLoading: isConversationLoading,
    addConversation,
    updateConversation,
    updateConversationLastMessage,
    updateConversationStatus,
    removeConversation,
  } = useConversationList();

  const { selectedConvId, setSelectedConvId, selectedConv, clearSelection } =
    useSelectedConversation(conversations);

  const {
    messages,
    isLoading: isLoadingMessages,
    hasMore: hasMoreMessages,
    loadMore: loadMoreMessages,
    addMessage,
    addOptimisticMessage,
  } = useConversationMessages({
    conversationId: selectedConvId,
    limit: 30,
  });

  const { followedUsers, fetchFollowedUsers } = useFollowedUsers();

  const { onConversationUpdate, onConversationClosed, onConversationNew } =
    useGlobalSocket();

  // Listen for lastMessage updates
  useEffect(() => {
    onConversationUpdate((conversationId, lastMessage) => {
      updateConversationLastMessage(conversationId, lastMessage);
    });
  }, [onConversationUpdate, updateConversationLastMessage]);

  // Listen for conversation closures
  useEffect(() => {
    onConversationClosed((conversationId, closedBy) => {
      updateConversationStatus(conversationId, 'Close');

      if (closedBy && closedBy.id !== user?.id) {
        toast.info(`${closedBy.firstname} à clôturer un échange`);
      }

      if (conversationId === selectedConvId) {
        clearSelection();
      }
    });
  }, [
    onConversationClosed,
    updateConversationStatus,
    selectedConvId,
    clearSelection,
    user,
  ]);

  useEffect(() => {
    onConversationNew((conversation) => {
      // Add the new conversation to the list
      addConversation(conversation);

      // Show notification
      toast.info(
        `${conversation.participant?.firstname} a démarré un nouvel échange`,
      );
    });
  }, [onConversationNew, addConversation]);

  const selectedConvWithMessages: ConversationWithMessages | undefined =
    useMemo(() => {
      if (!selectedConv) return undefined;

      return {
        ...selectedConv,
        messages,
        hasMoreMessages,
        isLoadingMessages,
      };
    }, [selectedConv, messages, hasMoreMessages, isLoadingMessages]);

  const {
    handleBack,
    handleViewProfile,
    handleNewConversation,
    handleAddConversation,
    handleRatingUser,
    handleEncloseConversation,
    handleDeleteConversation,
    handleSendMessage,
  } = useConversationActions({
    selectedConvId,
    selectedConv: selectedConvWithMessages,
    setSelectedConvId,
    addConversation,
    updateConversation,
    removeConversation,
    clearSelection,
    fetchFollowedUsers,
    addMessage,
    addOptimisticMessage,
  });

  return {
    selectedConvId,
    setSelectedConvId,
    selectedConv: selectedConvWithMessages,
    conversations,
    followedUsers,
    isConversationLoading,
    loadMoreMessages,
    handleBack,
    handleNewConversation,
    handleAddConversation,
    handleSendMessage,
    handleViewProfile,
    handleRatingUser,
    handleEncloseConversation,
    handleDeleteConversation,
  };
}
```

== Annexe D — Composants UI clés de la messagerie

=== `MessageList.tsx` — affichage virtualisé du fil de discussion

Reproduction *verbatim* et intégrale de #raw("frontend/src/components/organisms/ConversationPage/MessageThread/MessageList.tsx", lang: "txt")
(dépôt d'équipe, branche #raw("main", lang: "txt")) — le composant qui rend la
liste de messages, gère le spinner de chargement de la pagination cursor-based,
l'empty state et la détection de doublons.

```tsx
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
```

=== `MessageInput.tsx` — saisie utilisateur et envoi

Reproduction *verbatim* et intégrale de #raw("frontend/src/components/organisms/ConversationPage/MessageThread/MessageInput.tsx", lang: "txt")
(dépôt d'équipe, branche #raw("main", lang: "txt")) — l'input désactivé
automatiquement quand la conversation est clôturée (cohérent avec le refus
serveur dans le handler #raw("message:send", lang: "ts")).

```tsx
'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Send } from 'lucide-react';
import { FilterStatus } from '../useConversationState';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  conversationStatus: FilterStatus;
}

/**
 * Zone de saisie et envoi de message
 */
export function MessageInput({
  value,
  onChange,
  onSend,
  isLoading,
  conversationStatus,
}: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-3">
        <Input
          placeholder="Écrivez un message…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Saisir un message"
          disabled={conversationStatus === 'Close'}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || conversationStatus === 'Close'}
          className="flex items-center gap-2"
          isLoading={isLoading}
        >
          <Send className="h-4 w-4" />
          <span>Envoyer</span>
        </Button>
      </div>
    </div>
  );
}
```

== Annexe E — Plan de tests détaillé de la messagerie

Le plan de tests est détaillé en #ref(<sec-plan-tests>, supplement: [section]) ; les jeux d'essai de
la fonctionnalité représentative figurent en #ref(<sec-jeu-essai>, supplement: [section]).

== Annexe F — Maquettes Figma de la messagerie

// TODO : 4-6 captures Figma (ou wireframes) du périmètre messagerie. À
// exporter manuellement depuis Figma. Placeholders rect en attendant.

#grid(
  columns: (1fr, 1fr),
  gutter: 8pt,
  rect(width: 100%, height: 6cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[Maquette : Liste conversations]]
  ],
  rect(width: 100%, height: 6cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[Maquette : Thread ouvert]]
  ],
  rect(width: 100%, height: 6cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[Maquette : Création conversation]]
  ],
  rect(width: 100%, height: 6cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[Maquette : Évaluation post-clôture]]
  ],
)

== Liens utiles

- *Application en production* : #link("https://skill-swap.fr")[skill-swap.fr]

La documentation Arc42 et le guide utilisateur Diátaxis publiés ci-dessous
constituent une *extension post-projet, hors périmètre du livrable d'équipe* :

- *Documentation technique Arc42* : #link("https://skillswap-docs.vercel.app")[skillswap-docs.vercel.app]
- *Guide utilisateur (Diátaxis)* : #link("https://skillswap-guide.vercel.app")[skillswap-guide.vercel.app]
- *Repo GitHub doc* : #link("https://github.com/Sojeremy/documentation-skillswap")[Sojeremy/documentation-skillswap]
