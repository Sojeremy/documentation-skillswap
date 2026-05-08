// =============================================================================
// Section 07 — Réalisations (REAC §7) — SECTION CENTRALE DU DOSSIER
// Volume cible : 8-12 pages
// Fonctionnalité représentative : Messagerie temps réel
// Réf. choix : docs/audits/feature-inventory-cda.md
// Sous-sections obligatoires : 7.1 à 7.4
// IMPORTANT : tous les extraits de code en thème light (style code-block du
// template, déjà appliqué automatiquement via `show raw.where(block: true)`)
// =============================================================================

= Réalisations — Messagerie temps réel

// Introduction de la section : pourquoi cette fonctionnalité ?
// TODO : 1 paragraphe expliquant que la messagerie est la fonctionnalité la
// plus représentative du projet (cf. audit feature-inventory-cda.md, score
// 25/25). Elle couvre toutes les couches CDA en un seul périmètre : REST +
// Socket.IO + Prisma + Zod + middleware métier + 11 organismes React +
// 8 hooks. Sans elle, SkillSwap est un annuaire.

== Captures d'écran d'interfaces utilisateur

// TODO : intégrer 4-6 captures dans assets/captures-ui/
// - Liste des conversations (ConversationSection, mobile + desktop)
// - Thread de message ouvert (MessageThread, plusieurs messages échangés)
// - Dialog de création de conversation (NewConversationDialog)
// - Dialog d'évaluation déclenché à la clôture (RatingDialog)
// - État conversation fermée (input désactivé)

#figure(
  rect(width: 100%, height: 6cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      // TODO : assets/captures-ui/conversation-list.png
    ]]
  ],
  caption: [Liste des conversations — vue desktop],
)

#figure(
  rect(width: 100%, height: 6cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      // TODO : assets/captures-ui/message-thread.png
    ]]
  ],
  caption: [Thread de messages avec messages échangés],
)

== Composants métier — orchestrateur `useMessaging` et optimistic UI

// TODO : présenter useMessaging.ts (frontend/src/hooks/useMessaging.ts, 139 LOC)
// comme l'orchestrateur central — compose 7 sous-hooks, écoute 3 events Socket
// (updated, closed, new), gère les notifications toast contextuelles.

// Extrait à inclure (raccourci pour la lisibilité) :
```ts
// frontend/src/hooks/useMessaging.ts (extrait)
export function useMessaging() {
  const { user } = useAuth();

  const { conversations, addConversation, updateConversationLastMessage,
          updateConversationStatus, removeConversation } = useConversationList();

  const { selectedConvId, setSelectedConvId, selectedConv, clearSelection } =
    useSelectedConversation(conversations);

  const { messages, hasMore, loadMore, addOptimisticMessage } =
    useConversationMessages({ conversationId: selectedConvId, limit: 30 });

  const { onConversationUpdate, onConversationClosed, onConversationNew } =
    useGlobalSocket();

  // Réagit à un nouveau message reçu sur n'importe quelle conversation
  useEffect(() => {
    onConversationUpdate((conversationId, lastMessage) => {
      updateConversationLastMessage(conversationId, lastMessage);
    });
  }, [onConversationUpdate, updateConversationLastMessage]);

  // ... (close, new conversation, actions composées)
}
```

// TODO : commentaire — pourquoi cette décomposition ? Lisibilité, testabilité
// indépendante des sous-hooks, séparation claire entre listening (events
// globaux) et action (mutations).

== Composants d'accès aux données — services Prisma

// TODO : extraits de services/conv.service.ts et services/message.service.ts
// Montrer la sélection explicite des champs (anti-overfetch),
// les Promise.all pour mutations parallèles, la pagination cursor.

```ts
// backend/src/realtime/socket.ts (extrait — création message + update conv)
const [msg] = await Promise.all([
  prisma.message.create({
    data: { conversationId, senderId: userId, receiverId, content },
    select: {
      id: true, content: true, createdAt: true,
      sender: { select: { id: true, firstname: true, lastname: true,
                          avatarUrl: true } },
    },
  }),
  prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  }),
]);
```

== Autres composants — Socket.IO + middleware métier

=== Handler Socket.IO `message:send`

// TODO : extrait commenté de backend/src/realtime/socket.ts — flux complet
// d'un envoi de message : validation → fetch conv + participants → vérif
// participant + status → création + update → diffusion 2 rooms + premier
// message branch.

```ts
// backend/src/realtime/socket.ts:88-122 — authentification socket par cookie JWT
io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie ?? '';
    const cookies = cookie.parse(cookieHeader);
    const token = cookies.accessToken;
    if (!token) return next(new Error('Unauthorized'));

    const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
    const userId = Number(decoded.id ?? decoded.userId ?? decoded.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return next(new Error('Unauthorized'));
    }
    socket.data.userId = userId;
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});
```

=== Middleware métier `requireSimpleFollow`

// TODO : extrait de backend/src/middlewares/conv.middleware.ts:78-115
// Ce middleware impose qu'un membre suive un autre membre avant de pouvoir
// initier une conversation avec lui. Règle métier critique du produit.

```ts
// backend/src/middlewares/conv.middleware.ts:78-115
export const requireSimpleFollow = async (req, _res, next) => {
  try {
    const receiverId = Number(req.body.receiverId) || Number(req.paramsId);
    const senderId = req.userId;

    if (!Number.isInteger(receiverId) || receiverId <= 0) {
      return next(new BadRequestError('receiverId is required ...'));
    }
    if (receiverId === senderId) {
      return next(new BadRequestError('You cannot start a conversation with yourself.'));
    }

    const follow = await prisma.follow.findFirst({
      where: { followerId: senderId, followedId: receiverId },
      select: { followerId: true, followedId: true },
    });
    if (!follow) {
      return next(new ForbiddenError('You can only message users you follow.'));
    }
    next();
  } catch (e) { next(e); }
};
```

=== Bilan technique

// TODO : récap métriques de la fonctionnalité messagerie
// - 1 schéma Prisma : 3 modèles (Conversation, UserHasConversation, Message)
// - 8 routes REST (conv.router.ts)
// - 5 events Socket.IO bidirectionnels
// - 4 schémas Zod (conversation.validation.ts)
// - 1 middleware métier dédié (conv.middleware.ts, 3 helpers)
// - 11 composants React (ConversationPage/)
// - 8 hooks (useMessaging.ts + messaging/*)
// - 1 client Socket.IO singleton (socket-client.ts)
// - 3 fichiers de tests (conv.spec.test.ts, message.spec.test.ts,
//   socket.spec.test.ts)
