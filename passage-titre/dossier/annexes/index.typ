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

Extrait de #raw("backend/src/realtime/socket.ts:167-347", lang: "txt") — handler
complet de l'envoi d'un message, incluant validation, vérification de
participation, persistance Prisma en parallèle, et diffusion multi-rooms.

```ts
socket.on('message:send', async (payload) => {
  const conversationId = Number(payload?.conversationId);
  const content = String(payload?.message ?? '').trim();

  // 1. Validation des bornes
  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    socket.emit('error', { code: 'VALIDATION', message: 'Invalid conversationId' });
    return;
  }
  if (!content || content.length > 2000) {
    socket.emit('error', { code: 'VALIDATION', message: 'Invalid message' });
    return;
  }

  // 2. Récupération de la conversation + participants + nombre de messages
  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true, title: true, status: true,
      users: {
        select: {
          userId: true,
          user: {
            select: { id: true, firstname: true, lastname: true, avatarUrl: true },
          },
        },
      },
      _count: { select: { messages: true } },
    },
  });

  // 3. Refus si conversation absente ou clôturée
  if (!conv || conv.status === 'Close') {
    socket.emit('error', { code: 'FORBIDDEN', message: 'Conversation closed' });
    return;
  }

  // 4. Vérification participant (defense in depth, indépendant du join préalable)
  const userIds = conv.users.map((u) => u.userId);
  if (!userIds.includes(userId)) {
    socket.emit('error', { code: 'FORBIDDEN', message: 'Not a participant' });
    return;
  }

  const participantIds = new Set(userIds);
  const receiverId = userIds.find((id) => id !== userId);

  if (!receiverId) {
    socket.emit('error', { code: 'FORBIDDEN', message: 'No receiver' });
    return;
  }

  // 5. Détection du premier message (déclenche la branche conversation:new)
  const isFirstMessage = conv._count.messages === 0;

  // 6. Persistance parallèle : message + bumping de updatedAt sur conversation
  const [msg] = await Promise.all([
    prisma.message.create({
      data: { conversationId, senderId: userId, receiverId, content },
      select: {
        id: true, content: true, createdAt: true,
        sender: {
          select: { id: true, firstname: true, lastname: true, avatarUrl: true },
        },
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
  ]);

  // 7. Préparation du DTO (sender omis si plus participant)
  const dto: MessageDTO = {
    id: msg.id,
    sender: msg.sender && participantIds.has(msg.sender.id)
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

  // 8. Diffusion ciblée : room conversation (clients actifs sur le thread)
  io.to(room(conversationId)).emit('message:new', {
    conversationId,
    message: dto,
  });

  // 9. Cas particulier — premier message : notifier le receveur (room user:)
  if (isFirstMessage) {
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

    const senderUser = conv.users.find((u) => u.userId === userId)?.user;

    if (senderUser) {
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

  // 10. Notification de mise à jour à TOUS les participants (via leur room user:)
  userIds.forEach((participantId) => {
    io.to(`user:${participantId}`).emit('conversation:updated', {
      conversationId,
      lastMessage: dto,
    });
  });
});
```

== Annexe C — Orchestrateur frontend `useMessaging` (139 LOC, complet)

Extrait intégral de #raw("frontend/src/hooks/useMessaging.ts", lang: "txt") — la
façade qui compose les sept hooks spécialisés et écoute les trois events
Socket globaux (`conversation:updated`, `conversation:closed`, `conversation:new`).

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
      addConversation(conversation);
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

Extrait de #raw("frontend/src/components/organisms/ConversationPage/MessageThread/MessageList.tsx", lang: "txt") — le composant qui rend la liste de messages, gère le
spinner de chargement de la pagination cursor-based, l'empty state et la
détection de doublons (sentinelle de cohérence).

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
  // Sentinelle de cohérence : alerter en console si un doublon d'id est détecté
  useEffect(() => {
    if (messages) {
      const ids = messages.map((m) => m.id);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicates.length > 0) {
        console.error('Duplicate message IDs detected:', duplicates);
      }
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6"
      style={{ overflowAnchor: 'none' }} // Anti scroll-jump lors du load-more
    >
      <div className="flex flex-col">
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!hasMore && messages && messages.length > 0 && (
          <div className="flex justify-center py-4">
            <p className="text-sm text-muted-foreground">
              Début de la conversation
            </p>
          </div>
        )}

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

Extrait de #raw("frontend/src/components/organisms/ConversationPage/MessageThread/MessageInput.tsx", lang: "txt") — l'input désactivé automatiquement quand la conversation est
clôturée (cohérent avec le refus serveur dans le handler #raw("message:send", lang: "ts")).

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

export function MessageInput({
  value,
  onChange,
  onSend,
  isLoading,
  conversationStatus,
}: MessageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSend();
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
- *Documentation technique Arc42* : #link("https://skillswap-docs.vercel.app")[skillswap-docs.vercel.app]
- *Guide utilisateur (Diátaxis)* : #link("https://skillswap-guide.vercel.app")[skillswap-guide.vercel.app]
- *Repo GitHub doc* : #link("https://github.com/Sojeremy/documentation-skillswap")[Sojeremy/documentation-skillswap]
