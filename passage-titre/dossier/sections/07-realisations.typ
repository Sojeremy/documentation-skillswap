// =============================================================================
// Section 07 — Réalisations (REAC §7) — SECTION CENTRALE DU DOSSIER
// Volume cible : 8-12 pages
// Fonctionnalité représentative : Messagerie temps réel
// Réf. choix : docs/audits/feature-inventory-cda.md (score 25/25)
// Sous-sections obligatoires : 7.1 à 7.4
// =============================================================================

= Réalisations — Messagerie temps réel <sec-realisations>

La présente section porte sur la *fonctionnalité la plus représentative* du
projet, au sens du référentiel : la messagerie temps réel entre membres.
Ce choix n'est pas anodin — il résulte d'un audit fonctionnel comparatif que
j'ai conduit pour la préparation de ce dossier#footnote[Analyse rédigée après la période projet, dans le dépôt de documentation ; elle ne fait pas partie du livrable d'équipe.], et qui a évalué
neuf fonctionnalités principales du projet selon cinq critères (cœur métier,
couverture technique, visibilité du travail Lead Front, enjeux de sécurité,
richesse pour la démonstration). La messagerie obtient un score de
25 sur 25, seule à couvrir l'ensemble des axes en un périmètre unique.

Plus fondamentalement, la messagerie est le moment où SkillSwap cesse d'être
un annuaire de profils et devient une plateforme d'échange. Sans elle, deux
membres aux compétences complémentaires ne peuvent jamais entrer en relation.
Le code traduit cette centralité métier : la création d'une conversation est
le seul cas du projet gardé par une règle métier non triviale (le middleware
#raw("requireSimpleFollow", lang: "ts") impose qu'un membre suive l'autre avant
toute prise de contact), tandis que la table #raw("Conversation", lang: "sql") est l'un des
hubs du modèle relationnel, reliée à #raw("User", lang: "sql"), #raw("Message", lang: "sql"),
et #raw("Rating", lang: "sql") via la règle de clôture.

Cette section présente les réalisations techniques selon la décomposition
imposée par le référentiel : captures d'écran d'interfaces utilisateur,
composants métier, composants d'accès aux données, et autres composants
significatifs (handlers Socket.IO, middleware applicatif).

Le périmètre couvert dans la suite représente, en chiffres :

#table(
  columns: (auto, auto),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, right),
  [*Élément*], [*Volume*],
  [Schémas Prisma], [3 modèles],
  [Routes REST conv./messages], [9 routes],
  [Events Socket.IO bidirectionnels], [10 events (4 entrants, 6 sortants)],
  [Schémas de validation Zod], [7 schémas (#raw("conversation.validation.ts", lang: "ts"))],
  [Middlewares métier dédiés], [1 fichier, 3 helpers],
  [Composants React (#raw("ConversationPage/", lang: "ts"))], [9 composants UI + 2 hooks locaux],
  [Hooks React composés], [8 hooks (1 façade #raw("useMessaging", lang: "ts") + 7 spécialisés)],
  [Fichiers de tests dédiés], [3 spec files (Node Test Runner)],
)

Tous les extraits de code présentés ci-dessous proviennent du dépôt de
production#footnote[Repo : #link("https://github.com/O-clock-Dublin/projet-skillswap")[github.com/O-clock-Dublin/projet-skillswap]. Ce dépôt est figé pour la soutenance ; les éventuelles dettes techniques mentionnées sont assumées comme telles et reportées en V2.]
et sont rendus dans un thème clair pour faciliter leur lecture par le jury.

== Captures d'écran d'interfaces utilisateur

// -----------------------------------------------------------------------------
// 7.1 — Captures UI
// Périmètre : DEV local seedé (équivalent fonctionnel prod).
// Captures à générer via Playwright (cf. CONTEXT.md, section "Captures d'écran")
// Chemin : ../assets/captures-ui/
// Naming : 07-{description}-{viewport}.png
// -----------------------------------------------------------------------------

Les captures qui suivent ont été réalisées en environnement de développement
local, dont le seed reproduit fidèlement les états observables en
production#footnote[Le seed dev (#raw("backend/src/models/seeding.dev.ts", lang: "txt")) initialise 41 utilisateurs, des relations de suivi, des conversations et des messages représentatifs. Compte de démonstration : #raw("alice.dupont@example.com", lang: "txt") / #raw("password123", lang: "txt"). Les avatars et données affichés sont fictifs.]. Elles couvrent les principales vues
du parcours messagerie côté utilisateur connecté.

=== Liste des conversations — vue desktop

#figure(
  rect(width: 100%, height: 8cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      Capture à insérer : ../assets/captures-ui/07-conversation-list-desktop.png
    ]]
  ],
  caption: [Liste des conversations de l'utilisateur connecté. Composant racine : #raw("ConversationSection.tsx", lang: "ts"). Chaque entrée est rendue par #raw("ConversationItem.tsx", lang: "ts") (molécule), avec avatar, nom du correspondant, dernier message et horodatage relatif.],
)

L'interface présente les conversations triées par date du dernier message
descendant. La sélection d'une entrée déclenche l'émission d'un event
Socket.IO #raw("conversation:join", lang: "ts") qui inscrit le client dans la
room dédiée à la conversation. L'état "vu / non vu" et le badge de message
non lu sont gérés côté client via le hook #raw("useConversationList", lang: "ts").

=== Thread de message ouvert — vue desktop

#figure(
  rect(width: 100%, height: 9cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      Capture à insérer : ../assets/captures-ui/07-message-thread-desktop.png
    ]]
  ],
  caption: [Thread d'une conversation ouverte. Composants imbriqués : #raw("MessageThread/index.tsx", lang: "ts") encapsule #raw("ThreadHeader", lang: "ts"), #raw("MessageList", lang: "ts") (avec composant atomique #raw("MessageBubble", lang: "ts") pour chaque message) et #raw("MessageInput", lang: "ts"). La pagination cursor-based charge les messages plus anciens au scroll vers le haut.],
)

La liste de messages est virtualisée en pagination ascendante (cursor-based)
afin de supporter des conversations longues sans charger l'intégralité de
l'historique. La saisie utilisateur transite par #raw("MessageInput.tsx", lang: "ts"),
qui émet l'event Socket.IO #raw("message:send", lang: "ts") plutôt qu'une
requête REST — choix architectural justifié dans la #ref(<sub-socket-server>, supplement: [sous-section]).

=== Dialogue d'évaluation après clôture

#figure(
  rect(width: 100%, height: 7cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      Capture à insérer : ../assets/captures-ui/07-rating-dialog.png
    ]]
  ],
  caption: [Dialogue d'évaluation déclenché à la clôture d'une conversation par l'autre participant (#raw("RatingDialog.tsx", lang: "ts")). Note de 1 à 5 et commentaire facultatif. Bloqué côté serveur si l'utilisateur a déjà évalué le membre cible (contrainte d'unicité Prisma #raw("@@unique([evaluatorId, evaluatedId])", lang: "ts")).],
)

L'évaluation est fonctionnellement couplée à la clôture : l'event
#raw("conversation:closed", lang: "ts") déclenche l'apparition du dialogue,
ce qui garantit qu'un membre ne peut évaluer qu'après une interaction
effective. L'adaptation mobile (responsive Tailwind, navigation stack-based
au lieu de split-view sur écran étroit) et le dialogue de création
(#raw("NewConversationDialog.tsx", lang: "ts"), avec gating front+back
#raw("requireSimpleFollow", lang: "ts")) sont visibles directement sur
#link("https://skill-swap.fr")[skill-swap.fr] et présentés en démo orale.

== Composants métier — orchestrateur `useMessaging` et optimistic UI

// -----------------------------------------------------------------------------
// 7.2 — Composants métier (frontend orchestration)
// Le code prod est figé. Les extraits ci-dessous sont représentatifs.
// Pour le rendu final, Claude Code peut substituer par les vrais extraits
// du repo prod (chemin : frontend/src/hooks/...) si plus précis.
// -----------------------------------------------------------------------------

L'orchestration de la messagerie côté frontend repose sur la *composition
de hooks React natifs* plutôt que sur une bibliothèque tierce de gestion
d'état serveur. TanStack Query avait été envisagé (ADR-004#footnote[#raw("docs/documentation-implementation/arc42/09-decisions/004-tanstack-query.md", lang: "txt") — dépôt d'équipe, branche #raw("Documentation", lang: "txt").]) mais n'a
finalement pas été intégré : la composition de hooks natifs a été retenue à
l'usage, pour trois raisons — la maîtrise fine
du cycle de vie des sockets et des effets, la réduction de la surface
de dépendances externes, et l'apprentissage approfondi des hooks React
natifs (#raw("useState", lang: "ts"), #raw("useEffect", lang: "ts"),
#raw("useCallback", lang: "ts"), #raw("useRef", lang: "ts"), #raw("AbortController", lang: "ts")).

=== Architecture des hooks — le pattern de composition

Le hook racine #raw("useMessaging.ts", lang: "ts") (139 LOC) compose sept hooks
spécialisés, chacun responsable d'une dimension fonctionnelle isolée :

#table(
  columns: (auto, 1fr, auto),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, right),
  [*Hook*], [*Responsabilité*], [*LOC approx.*],
  [#raw("useConversationList", lang: "ts")], [Charge la liste, expose les mutateurs (#raw("addConversation", lang: "ts"), #raw("updateConversationLastMessage", lang: "ts"), etc.)], [95],
  [#raw("useSelectedConversation", lang: "ts")], [Mémorise l'identifiant sélectionné, dérive l'objet conversation depuis la liste], [64],
  [#raw("useConversationMessages", lang: "ts")], [Pagination cursor-based, optimistic UI (ajout temporaire avant DTO serveur)], [163],
  [#raw("useFollowedUsers", lang: "ts")], [Liste des utilisateurs suivis (pour la création de nouvelle conversation)], [30],
  [#raw("useGlobalSocket", lang: "ts")], [Listeners globaux : #raw("conversation:updated", lang: "ts"), #raw("conversation:closed", lang: "ts"), #raw("conversation:new", lang: "ts")], [94],
  [#raw("useConversationActions", lang: "ts")], [Handlers UI ; instancie #raw("useSocket(selectedConvId)", lang: "ts") pour #raw("message:send", lang: "ts") et #raw("conversation:close", lang: "ts")], [184],
  [#raw("useMessagingScroll", lang: "ts")], [Synchronisation du scroll auto sur réception de message + scroll inverse au load-more], [111],
)

Chaque hook est testable indépendamment et maintient un périmètre de
responsabilités strict. Cette discipline permet d'isoler les régressions
lors d'une évolution future et de raisonner localement sur chaque
mécanisme — typiquement, un bug d'optimistic UI se cherche dans
#raw("useConversationMessages", lang: "ts") sans devoir comprendre la pagination
ou la navigation.

=== Hook racine — composition

```ts
// frontend/src/hooks/useMessaging.ts (extrait simplifié — 139 LOC au total)
export function useMessaging() {
  const { user } = useAuth();

  const {
    conversations,
    addConversation,
    updateConversationLastMessage,
    updateConversationStatus,
    removeConversation,
  } = useConversationList();

  const {
    selectedConvId,
    setSelectedConvId,
    selectedConv,
    clearSelection,
  } = useSelectedConversation(conversations);

  const {
    messages,
    hasMore,
    loadMore,
    addOptimisticMessage,
  } = useConversationMessages({
    conversationId: selectedConvId,
    limit: 30,
  });

  const { followedUsers, fetchFollowedUsers } = useFollowedUsers();

  const {
    onConversationUpdate,
    onConversationClosed,
    onConversationNew,
  } = useGlobalSocket();

  // Réagit à un nouveau message reçu sur n'importe quelle conversation
  useEffect(() => {
    onConversationUpdate((conversationId, lastMessage) => {
      updateConversationLastMessage(conversationId, lastMessage);
    });
  }, [onConversationUpdate, updateConversationLastMessage]);

  // Réagit à la clôture d'une conversation par l'autre participant
  useEffect(() => {
    onConversationClosed((conversationId, closedBy) => {
      updateConversationStatus(conversationId, "Close");
      if (closedBy && closedBy.id !== user?.id) {
        toast.info(`${closedBy.firstname} à clôturer un échange`);
      }
      if (conversationId === selectedConvId) {
        clearSelection();
      }
    });
  }, [onConversationClosed, updateConversationStatus,
      selectedConvId, clearSelection, user]);

  // Réagit à une nouvelle conversation reçue (premier message d'un autre membre)
  useEffect(() => {
    onConversationNew((conversation) => {
      addConversation(conversation);
      toast.info(
        `${conversation.participant?.firstname} a démarré un nouvel échange`,
      );
    });
  }, [onConversationNew, addConversation]);

  // Composition complète des actions (signature réelle ; props omises ici)
  const actions = useConversationActions({
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
    conversations,
    selectedConv,
    messages,
    hasMore,
    loadMore,
    followedUsers,
    fetchFollowedUsers,
    ...actions,
  };
}
```

L'effet de bord crucial est l'enregistrement des trois listeners globaux
(#raw("onConversationUpdate", lang: "ts"), #raw("onConversationClosed", lang: "ts"),
#raw("onConversationNew", lang: "ts")) qui maintiennent la liste de conversations
synchronisée même quand l'utilisateur n'est pas en train de regarder la
conversation concernée. Cette logique exploite le modèle de rooms Socket.IO :
chaque utilisateur connecté rejoint automatiquement sa room personnelle
#raw("user:${userId}", lang: "ts") (cf. #ref(<sub-socket-server>, supplement: [sous-section])), ce qui permet au
serveur de pousser les notifications de mise à jour ciblées.

=== Optimistic UI — gestion du `tempId` négatif

```ts
// frontend/src/hooks/messaging/useConversationActions.ts (extrait, l.100-118)
const handleSendMessage = useCallback(
  async (content: string) => {
    if (!selectedConvId || !content.trim()) return;

    // tempId négatif : marqueur d'un message en attente de réponse serveur
    const tempId = -Date.now();
    const sender = user
      ? {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          avatarUrl: user.avatarUrl,
        }
      : undefined;

    addOptimisticMessage(tempId, content, sender);
    socketSendMessage(content); // wrapper de socket.emit("message:send", ...)
  },
  [selectedConvId, socketSendMessage, addOptimisticMessage, user],
);
```

Le pattern `optimistic UI` consiste à insérer immédiatement le message
dans la liste locale avec un identifiant négatif (#raw("-Date.now()", lang: "ts")),
puis à laisser l'event Socket.IO #raw("message:new", lang: "ts") émis par le
serveur ajouter le DTO définitif (avec identifiant entier positif assigné
par PostgreSQL). La déduplication exploite un filtre côté listener
#raw("onMessage", lang: "ts") du hook #raw("useConversationActions", lang: "ts") :
si #raw("newMessage.sender?.id === user?.id", lang: "ts"), le message est
*ignoré* lors du retour serveur — l'optimistic local reste en place et
sert d'affichage final.

```ts
// useConversationActions.ts:57-65 — déduplication des messages propres
useEffect(() => {
  onMessage((newMessage) => {
    if (newMessage.sender?.id === user?.id) {
      return; // déjà ajouté en optimistic, on ignore le retour serveur
    }
    addMessage(newMessage);
  });
}, [onMessage, addMessage, user?.id]);
```

L'avantage utilisateur est immédiat : la latence perçue de l'envoi est
quasi-nulle, ce qui correspond à l'expérience attendue d'une messagerie
moderne. Le compromis assumé : en cas d'échec réseau silencieux, le
message optimistic reste affiché avec son #raw("tempId", lang: "ts") négatif
(pas de réconciliation automatique vers un état d'erreur dans le code
actuel). Une amélioration V2 consiste à introduire un timeout de
réconciliation et un état visuel "en cours d'envoi / échec" — point
identifié dans la dette technique en fin de section.

== Composants d'accès aux données — services Prisma <sub-acces-donnees>

// -----------------------------------------------------------------------------
// 7.3 — Composants d'accès aux données
// Couche services backend, utilisation Prisma (ADR-003)
// -----------------------------------------------------------------------------

L'accès à la base de données passe par Prisma comme ORM type-safe (cf.
ADR-003#footnote[#raw("docs/documentation-implementation/arc42/09-decisions/003-prisma.md", lang: "txt") — dépôt d'équipe, branche #raw("Documentation", lang: "txt").]). Les services backend exposent les opérations métier en
masquant la mécanique des requêtes, ce qui permet aux contrôleurs et
handlers Socket.IO de se concentrer sur la logique de validation et la
diffusion des events.

=== Création atomique d'un message + mise à jour de la conversation

L'envoi d'un message implique deux écritures distinctes : insertion en
table #raw("Message", lang: "sql") et mise à jour du champ #raw("updatedAt", lang: "sql")
de la #raw("Conversation", lang: "sql") associée (pour la conserver en tête de
liste). Plutôt qu'une transaction, le code utilise un #raw("Promise.all", lang: "ts")
qui parallélise les deux requêtes — acceptable car elles ne sont pas
mutuellement dépendantes, et la durée de fenêtre d'incohérence est de
l'ordre de la milliseconde.

```ts
// backend/src/realtime/socket.ts (extrait du handler message:send)
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
```

Le #raw("select", lang: "ts") explicite est un pattern récurrent dans le code
prod : il limite les champs retournés au strict nécessaire pour le DTO
réseau, ce qui évite à la fois le sur-fetch (gain de performance) et la
fuite involontaire de champs sensibles (par exemple #raw("password", lang: "sql"),
#raw("email", lang: "sql"), ou les champs liés au système de tokens). Cette
discipline transversale relève autant de la performance que de la sécurité.

=== Pagination cursor-based des messages

```ts
// backend/src/services/message.service.ts (extrait — getConversationMessagesService)
const limit = Math.min(Math.max(params.limit ?? 50, 1), 100);

const messages = await prisma.message.findMany({
  where: {
    conversationId,
    // Cursor : récupère uniquement les messages plus anciens que le cursor
    ...(params.cursor ? { id: { lt: params.cursor } } : {}),
  },
  orderBy: { id: 'desc' },
  take: limit,
  select: {
    id: true,
    content: true,
    createdAt: true,
    sender: {
      select: { id: true, firstname: true, lastname: true, avatarUrl: true },
    },
  },
});

// Reverse pour ordre chronologique côté front (oldest → newest)
const data = messages.slice().reverse().map(/* ... mapping DTO ... */);

// nextCursor null = plus de messages à charger
const nextCursor =
  messages.length > 0 ? messages[messages.length - 1].id : null;
```

Le choix d'une pagination *cursor-based* (par identifiant de message,
clause Prisma #raw("id: { lt: cursor }", lang: "ts")) plutôt qu'*offset-based*
(par numéro de page) est motivé par deux considérations : la stabilité
face à l'insertion de nouveaux messages pendant la navigation (un offset
sauterait des messages, un cursor reste stable), et la performance sur
des tables longues (l'offset force PostgreSQL à scanner les lignes
ignorées, le cursor permet un index seek direct via la clé primaire).
Pour une messagerie où les messages s'accumulent en continu, le cursor
est l'approche correcte. La clause #raw("limit", lang: "ts") est bornée à
[1, 100] côté serveur (#raw("Math.min(Math.max(limit ?? 50, 1), 100)", lang: "ts"))
pour empêcher tout abus côté client.

=== Schéma Prisma — extrait des modèles principaux

Le schéma Prisma intégral des trois modèles directement liés à la messagerie
(#raw("Conversation", lang: "sql"), #raw("UserHasConversation", lang: "sql"),
#raw("Message", lang: "sql")) plus #raw("Follow", lang: "sql") (gating) est
reproduit en *annexe A*. Les choix de modélisation traduisent plusieurs
décisions architecturales :
la table de jonction #raw("UserHasConversation", lang: "sql") permet une relation
N-N entre utilisateurs et conversations (donc support natif de conversations
de groupe en V2 sans changement de schéma), la cascade #raw("onDelete: Cascade", lang: "ts")
garantit l'absence de messages orphelins en cas de suppression d'utilisateur,
le statut #raw("StatusOfConversation", lang: "sql") (#raw("Open", lang: "sql") /
#raw("Close", lang: "sql")) matérialise le cycle de vie de l'échange jusqu'à
sa clôture (qui déclenche le dialogue d'évaluation), et la pagination
cursor-based exploite la clé primaire #raw("id", lang: "sql") (autoincrement)
comme curseur naturel — sans nécessiter d'index composite supplémentaire.
La limite de longueur de message (2000 caractères) est appliquée côté
serveur dans le handler Socket.IO et dans le schéma Zod
#raw("CreateMessageSchema", lang: "ts"), sans contrainte SQL explicite —
trade-off de simplicité assumé.

== Autres composants — Socket.IO server et middleware métier <sub-socket-server>

// -----------------------------------------------------------------------------
// 7.4 — Autres composants : socket.ts + conv.middleware.ts
// Réf : ADR-011 Socket.IO
// -----------------------------------------------------------------------------

Cette dernière sous-section regroupe les composants qui ne relèvent ni
strictement de l'UI, ni des services d'accès aux données : le serveur
Socket.IO et les middlewares applicatifs. Ils incarnent l'épine dorsale
temps réel de la messagerie et la garde métier qui en conditionne l'accès.

=== Authentification Socket.IO par cookie JWT

L'authentification du client Socket.IO réutilise le même cookie HTTP-only
#raw("accessToken", lang: "ts") que les routes REST, plutôt qu'un mécanisme
distinct (token en query string par exemple). Ce choix élimine une surface
d'attaque (le token n'est jamais exposé dans une URL ou loggué par un
proxy) et simplifie la session côté frontend (un seul flux de
rafraîchissement à gérer).

```ts
// backend/src/realtime/socket.ts (extrait, l.88-122)
io.use((socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie ?? "";
    const cookies = cookie.parse(cookieHeader);
    const token = cookies.accessToken;
    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
    const userId = Number(decoded.id ?? decoded.userId ?? decoded.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return next(new Error("Unauthorized"));
    }

    socket.data.userId = userId;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  // Inscription automatique à la room personnelle
  socket.join(`user:${socket.data.userId}`);

  socket.on("conversation:join", async (payload) => {
    /* validation + inscription room conversation */
  });

  socket.on("message:send", async (payload) => {
    /* validation + persistance + diffusion */
  });

  socket.on("conversation:close", async (payload) => {
    /* validation + update status + diffusion */
  });

  socket.on("conversation:leave", (payload) => {
    /* leave room conversation (silencieux) */
  });
});
```

À la connexion, chaque socket rejoint automatiquement sa room personnelle
#raw("user:${userId}", lang: "ts"). Cette room est utilisée par le serveur pour
pousser des notifications (nouvelle conversation reçue, mise à jour de la
liste, fermeture par l'autre participant) qui doivent atteindre l'utilisateur
indépendamment de la conversation qu'il est en train de visualiser.

=== Middleware métier `requireSimpleFollow` — gating de la création de conversation

```ts
// backend/src/middlewares/conv.middleware.ts:78-115
export const requireSimpleFollow = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const receiverId = Number(req.body.receiverId) || Number(req.paramsId);
    const senderId = req.userId;

    if (!Number.isInteger(receiverId) || receiverId <= 0) {
      return next(
        new BadRequestError('receiverId is required and must be a valid id.'),
      );
    }

    if (receiverId === senderId) {
      return next(
        new BadRequestError('You cannot start a conversation with yourself.'),
      );
    }

    const follow = await prisma.follow.findFirst({
      where: { followerId: senderId, followedId: receiverId },
      select: { followerId: true, followedId: true },
    });

    if (!follow) {
      return next(new ForbiddenError('You can only message users you follow.'));
    }

    next();
  } catch (e) {
    next(e);
  }
};
```

Ce middleware applique trois contrôles successifs : la validité du
#raw("receiverId", lang: "ts") (entier positif), l'absence d'auto-conversation
(impossible de se contacter soi-même), et la présence d'une relation de
suivi #raw("Follow", lang: "ts") du #raw("sender", lang: "ts") vers le #raw("receiver", lang: "ts").
Cette dernière règle est *la plus importante du produit* : elle garantit
qu'aucun spam direct n'est possible entre membres qui ne se sont pas
mutuellement signalé un intérêt par le suivi. Le contournement d'un
front compromis est donc bloqué au niveau backend.

=== Modèle de rooms Socket.IO

Le serveur exploite deux types de rooms simultanément, chacune avec un
rôle bien défini :

#table(
  columns: (auto, auto, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, left),
  [*Room*], [*Membres*], [*Usage*],
  [#raw("user:${userId}", lang: "ts")], [Toutes les sockets du même utilisateur (multi-onglets)], [Notifications globales : #raw("conversation:updated", lang: "ts"), #raw("conversation:closed", lang: "ts"), #raw("conversation:new", lang: "ts")],
  [#raw("conversation:${id}", lang: "ts")], [Participants ayant émis #raw("conversation:join", lang: "ts")], [Diffusion ciblée : #raw("message:new", lang: "ts"), #raw("conversation:joined", lang: "ts"), #raw("conversation:closed", lang: "ts")],
)

Le cloisonnement par rooms réalise un contrôle d'accès au niveau du transport :
un message émis dans la room #raw("conversation:42", lang: "ts") n'est diffusé
qu'aux participants ayant explicitement rejoint cette room, à condition qu'ils
soient déjà passés par la validation participant du handler #raw("conversation:join", lang: "ts").
Un membre tiers ne peut pas écouter passivement les messages d'autrui.

=== Diagramme de séquence — envoi d'un message

Le flux complet d'un envoi de message, depuis la saisie utilisateur jusqu'à
la confirmation chez les deux participants, est décrit dans le diagramme
de séquence ci-après. Il a été produit avec PlantUML pendant le projet et fait
partie du livrable d'équipe mergé sur #raw("main", lang: "txt")#footnote[Source et rendu : #raw("docs/uml/sequence/conversation.puml", lang: "txt") et #raw("conversation.png", lang: "txt"), dépôt d'équipe.].

#figure(
  image("../../../docs/uml/sequence/conversation.png", width: 100%),
  caption: [Diagramme de séquence de l'envoi d'un message — flux complet : authentification socket, optimistic UI, validation serveur, persistance Prisma, diffusion multi-rooms.],
)

== Bilan technique de la section

Cette section a couvert en profondeur la fonctionnalité messagerie selon les
quatre axes imposés par le référentiel — interfaces utilisateur, composants
métier, accès aux données, autres composants. Les compétences professionnelles
mobilisées dans la réalisation se cartographient ainsi :

#table(
  columns: (12em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Compétence CDA*], [*Mise en œuvre*],
  [CP2 — Développer des interfaces utilisateur], [9 composants React (#raw("ConversationPage/", lang: "ts")) avec composition Atomic Design (atoms via shadcn/ui, molécules #raw("ConversationItem", lang: "ts") et #raw("MessageBubble", lang: "ts"), organisme #raw("MessageThread", lang: "ts") sous-composé en 5 fragments), responsive Tailwind, accessibilité ARIA.],
  [CP3 — Développer des composants métier], [Composition de 8 hooks React (orchestrateur + 7 spécialisés), pattern optimistic UI avec #raw("tempId", lang: "ts") négatif, gestion fine du cycle de vie des sockets via #raw("useSocket(conversationId)", lang: "ts").],
  [CP6 — Définir l'architecture logicielle], [Architecture hybride REST + WebSocket assumée et documentée (ADR-011, formalisé a posteriori pour ce dossier), séparation claire des responsabilités entre handlers Socket et services métier, modèle de rooms à deux niveaux (room utilisateur + room conversation).],
  [CP7 — appliqué à la messagerie], [3 modèles dédiés (#raw("Conversation", lang: "sql"), #raw("UserHasConversation", lang: "sql"), #raw("Message", lang: "sql")), cascade de suppression sécurisée, pagination cursor-based exploitant la PK #raw("id", lang: "sql"), longueur de message bornée côté serveur (2000 caractères) et côté Zod.],
  [CP8 — Développer des composants d'accès aux données], [Services Prisma type-safe avec #raw("select", lang: "ts") explicite anti-overfetch, pagination cursor-based, parallélisation #raw("Promise.all", lang: "ts") sur écritures indépendantes.],
)

=== Dette technique assumée

Les zones de fragilité connues sont assumées et reportées en V2 :

- *Handler `message:send` dense* (#raw("socket.ts:167-347", lang: "ts")) — fetch, vérifs, persistance et 3 émissions concentrés dans une seule fonction ; refactorisation vers #raw("services/message.service.ts", lang: "ts") prévue en V2.
- *Validation Socket non-Zod* — bornes manuelles (#raw("Number.isInteger", lang: "ts"), longueur) au lieu de schémas Zod ; trade-off latence assumé, harmonisation possible en V2.
- *Aucun test automatisé côté frontend* — le livrable ne contient ni test unitaire, ni test E2E : le scénario `alice→bob` à deux navigateurs n'est validé que manuellement (cf. #ref(<sec-jeu-essai>, supplement: [section])). L'outillage correspondant (Vitest, Playwright) est décidé dans l'ADR-010 mais n'a pas été intégré avant la soutenance.
- *Couverture non mesurée* — aucun outil de couverture n'est branché, ni en local ni en CI ; les sept fichiers de tests backend ne sont donc pas quantifiés.

Ces dettes n'ont pas affecté la stabilité observée en production sur
#link("https://skill-swap.fr")[skill-swap.fr] depuis la mise en service.
