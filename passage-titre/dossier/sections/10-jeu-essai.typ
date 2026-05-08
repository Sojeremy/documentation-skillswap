// =============================================================================
// Section 10 — Jeu d'essai (REAC §10)
// Volume cible : 2-3 pages
// Format REAC : tableau Données entrée / Données attendues / Données obtenues / Analyse
// Scénario : "Alice envoie un premier message à Bob qu'elle suit"
// =============================================================================

= Jeu d'essai

== Scénario testé

// Scénario : Alice (utilisatrice authentifiée) envoie un premier message à Bob.
// Pré-requis : Alice et Bob sont inscrits, Alice a déjà suivi Bob.
// Couvre : règle métier `requireSimpleFollow`, création de conversation,
// envoi Socket.IO, double diffusion (room conversation + room user receveur),
// notification "première conversation".

== Étape 1 — Alice suit Bob (POST /follows/:bobId/follow)

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    `POST /api/v1/follows/42/follow` \
    Cookie : accessToken (Alice) \
    Body : aucun
  ],
  [
    HTTP 201 Created \
    `{ success: true, data: { ... } }` \
    Ligne créée dans table `follow`
  ],
  [
    // TODO : remplir après exécution du scénario \
    // (capture Postman / curl)
  ],
  [
    // TODO : OK / KO + analyse
  ],
)

== Étape 2 — Alice crée la conversation (POST /api/v1/conversations)

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    `POST /api/v1/conversations` \
    Cookie : accessToken (Alice) \
    Body : `{ "title": "Cours guitare", "receiverId": 42 }`
  ],
  [
    HTTP 201 Created \
    `{ success: true, data: { id, title, status: 'Open', users: [...] } }` \
    Middleware `requireSimpleFollow` passe (follow existe à l'étape 1) \
    2 lignes créées dans `user_has_conversation`
  ],
  [
    // TODO : remplir après exécution
  ],
  [
    // TODO : OK / KO + analyse
  ],
)

== Étape 3 — Alice envoie le premier message via Socket.IO

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    Event : `message:send` \
    Payload : `{ conversationId: 17, message: "Salut Bob !" }` \
    Socket connecté avec cookie accessToken (Alice)
  ],
  [
    Côté DB : 1 ligne créée dans `message`, conversation `updatedAt` modifié \
    Côté Socket : 3 events émis
    - `message:new` sur room `conversation:17`
    - `conversation:updated` sur `user:1` et `user:42`
    - `conversation:new` sur `user:42` (premier message)
  ],
  [
    // TODO : capture des événements reçus
  ],
  [
    // TODO : OK / KO + analyse
  ],
)

== Étape 4 — Bob reçoit la notification temps réel

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    Bob a la page /conversation ouverte, mais sur une AUTRE conversation \
    Socket connecté avec cookie accessToken (Bob)
  ],
  [
    Apparition du toast "Alice a démarré un nouvel échange" \
    Nouvelle conversation visible en haut de la liste \
    `useGlobalSocket.onConversationNew` déclenché
  ],
  [
    // TODO : capture UI + console DevTools
  ],
  [
    // TODO : OK / KO + analyse
  ],
)

== Étape 5 — Optimistic UI résolu côté Alice

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    Alice a vu son message s'afficher immédiatement (optimistic) \
    Réception de l'event `message:new` avec id réel
  ],
  [
    Le message optimistic (id temporaire) est remplacé par le message persisté \
    (id base réel, timestamp serveur authoritatif)
  ],
  [
    // TODO : capture des deux états successifs
  ],
  [
    // TODO : OK / KO + analyse
  ],
)

== Captures d'écran annexées

// TODO : insérer dans assets/captures-ui/ :
// - jeu-essai-1-follow.png
// - jeu-essai-2-create-conv.png
// - jeu-essai-3-send-message.png
// - jeu-essai-4-receive-notification.png
// - jeu-essai-5-optimistic-resolved.png

== Limites du jeu d'essai

// TODO : honnêteté
// - Pas de test automatisé Playwright sur ce scénario (à ajouter en V2)
// - Pas de test de charge Socket.IO (montée en concurrent connections)
// - Tests effectués en local avec PostgreSQL Docker, pas sur l'environnement
//   prod (mais identique en config)
