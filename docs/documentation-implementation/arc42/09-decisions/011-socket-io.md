# ADR-011 : Socket.IO pour la messagerie temps réel

## Statut

Accepté (2026-01-22 — date d'intégration en production, cf. carnet de bord)

## Décideurs

- **Loïc** — Scrum Master, intégration backend WebSocket
- **Yorgan** — Lead Back

## Contexte

La fonctionnalité de messagerie SkillSwap doit offrir :

- l'envoi **instantané** de messages entre deux utilisateurs en conversation ;
- la **notification push** d'une nouvelle conversation reçue (sans rechargement
  de page) ;
- la diffusion d'une fermeture de conversation à tous les participants
  actifs ;
- une **expérience fluide** comparable aux messageries modernes (latence
  sub-seconde, reconnexion transparente).

Une approche purement REST + polling présente trois limites :

1. **Surcharge serveur** : requêtes répétées même quand rien ne change.
2. **Latence perceptible** : pas vraiment « temps réel » côté UX.
3. **Notifications globales coûteuses** : `conversation:new` et
   `conversation:closed` doivent atteindre l'utilisateur même quand il n'est
   pas dans la conversation concernée — la mécanique de polling devient
   coûteuse pour ce besoin pousseur.

## Décision

Utiliser **Socket.IO 4.8.3** côté serveur ET côté client, avec :

- **Authentification par cookie HTTP-only `accessToken`** (le même que pour
  les routes REST) — middleware `io.use()` dans
  [`backend/src/realtime/socket.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/backend/src/realtime/socket.ts) (l.88-122).
- **Pattern « rooms »** :
  - `user:${userId}` rejointe automatiquement à la connexion → notifications
    globales (`conversation:updated/closed/new`) ;
  - `conversation:${id}` rejointe à la demande via `conversation:join` →
    diffusion des nouveaux messages aux participants actifs.
- **4 events client → server** : `conversation:join`, `conversation:leave`,
  `message:send`, `conversation:close`.
- **6 events server → client** : `conversation:joined`, `message:new`,
  `conversation:updated`, `conversation:closed`, `conversation:new`, `error`.
- **Persistance Prisma intégrée** dans le handler `message:send` (même
  transaction qui crée le message et met à jour `conversation.updatedAt`).
- **Singleton client** dans
  [`frontend/src/lib/socket-client.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/frontend/src/lib/socket-client.ts)
  (`autoConnect: false`, `withCredentials: true`).

Détail des payloads et du diagramme de séquence dans
[`06-runtime/messaging.md`](../06-runtime/messaging.md).

## Alternatives considérées

| Alternative                        | Pour                                                            | Contre                                                                              | Verdict     |
|------------------------------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------------|-------------|
| **REST + polling**                 | Simple, déjà en place pour le CRUD                              | Latence, surcharge serveur, pas de mécanique push native                            | Rejeté      |
| **Server-Sent Events (SSE)**       | Standard navigateur, simple, unidirectionnel server→client      | Besoin client→server pour `message:send` ; reconnexion à coder à la main           | Rejeté      |
| **WebSocket bare (`ws`)**          | Léger, sans surcouche                                           | Reconnexion auto à coder, pas de rooms natives, fallback HTTP à coder               | Rejeté      |
| **Pusher / Ably (SaaS)**           | Hébergé, scalable                                               | Coût mensuel récurrent, dépendance externe, données traversent un tiers             | Rejeté      |
| **Socket.IO 4.x**                  | Reconnexion auto, rooms natives, fallback HTTP long-polling, écosystème mature, types TypeScript bidirectionnels | Légère couche au-dessus de WebSocket (overhead négligeable en prod)                | **Retenu**  |

## Conséquences

### Positives

- Latence sub-seconde en conditions normales (mesuré localement et en
  staging).
- Reconnexion automatique gérée par la lib, utile sur mobile en réseau
  instable.
- Pattern « rooms » immédiat à mettre en œuvre (cf. helper
  `room(conversationId)` à `socket.ts:444`).
- **Auth unifiée avec REST** : même cookie HTTP-only, même logique JWT
  côté serveur — pas de second mécanisme à maintenir.
- Types TypeScript bidirectionnels (`ClientToServerEvents` /
  `ServerToClientEvents`) qui rendent les events strongly-typed des deux côtés
  (`socket.ts:12-60`, `socket-client.ts:3-81`).

### Négatives

- **Doublons REST/Socket.IO** : `POST /api/v1/conversations/:id/messages`
  et `PATCH /:id/close` existent en REST mais le frontend prod utilise les
  events Socket.IO `message:send` et `conversation:close`. Conservés pour la
  parité d'API (clients tiers, scripts admin) → **dette technique
  reconnue**, à arbitrer.
- Couche de transport supplémentaire à monitorer en prod : `nginx/prod.conf`
  proxy `/socket.io/` vers le backend (cf. `devops/nginx/prod.conf` —
  `location /socket.io/`).
- Tests automatisés plus complexes : `backend/src/realtime/socket.spec.test.ts`
  doit instancier un serveur HTTP + un client Socket.IO de test, ce qui
  alourdit la suite de tests.

### Sécurité

- **Authentification au handshake** via `io.use()`
  ([`socket.ts:88-122`](https://github.com/Sojeremy/documentation-skillswap/blob/main/backend/src/realtime/socket.ts)).
  Refus de connexion si JWT absent/invalide/expiré ou si l'identifiant
  déchiffré n'est pas un entier positif.
- **Vérification participant à chaque event sensible** :
  `conversation:join` (`socket.ts:135-152`),
  `message:send` (`socket.ts:222-230`),
  `conversation:close` (`socket.ts:361-390`).
- **Validation des payloads** : `conversationId` entier > 0 ; contenu trim ∈
  [1..2000] caractères (`socket.ts:180-186`).
- **Refus d'envoi sur conversation fermée** (`socket.ts:214-220`).
- **Codes d'erreur réseau réduits** : seuls `FORBIDDEN` et `VALIDATION` sont
  émis (cf. union `ServerToClientEvents.error` à `socket.ts:56-59`).

## Références

- Module serveur : [`backend/src/realtime/socket.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/backend/src/realtime/socket.ts) (446 LOC)
- Module client : [`frontend/src/lib/socket-client.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/frontend/src/lib/socket-client.ts) (104 LOC)
- Hooks frontend : [`useSocket.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/frontend/src/hooks/useSocket.ts) (136 LOC), [`useGlobalSocket.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/frontend/src/hooks/messaging/useGlobalSocket.ts) (95 LOC)
- Doc runtime : [`06-runtime/messaging.md`](../06-runtime/messaging.md)
- Reverse proxy : `devops/nginx/prod.conf` (bloc `location /socket.io/`)
- Carnet de bord : intégration backend les 22-23/01/2026 (Loïc), branchement frontend les 26-27/01/2026 (Jérémy)

---

[← Retour à l'index ADR](./index.md)
