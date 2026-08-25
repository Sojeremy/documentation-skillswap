// =============================================================================
// Section 08 — Éléments de sécurité (REAC §8)
// Volume cible : 3 pages MAX
// Périmètre : sécurité FONCTIONNELLE de la messagerie (la sécurité transversale
// est en #ref(<sub-secu-transverse>, supplement: [sous-section]) : argon2, JWT, CORS, HTTPS).
// =============================================================================

#import "../template.typ": code-wrap

= Éléments de sécurité <sec-securite>

Les choix de sécurité transversale (hashing argon2, JWT en cookies #raw("httpOnly", lang: "ts"),
CORS, HTTPS) ont été présentés en #ref(<sub-secu-transverse>, supplement: [sous-section]). La présente section porte sur
les contrôles *spécifiques à la messagerie* — la fonctionnalité retenue
comme la plus représentative — qui combinent authentification du canal
WebSocket, autorisation contextuelle à chaque event, validation des
entrées et cloisonnement par rooms. Ces contrôles forment une chaîne où
chaque maillon est nécessaire pour qu'un message émis par un membre
parvienne effectivement, et seulement, à son destinataire légitime.

== Authentification du canal Socket.IO

Le serveur Socket.IO réutilise le cookie #raw("accessToken", lang: "ts")
posé par l'authentification REST plutôt qu'un mécanisme distinct (token
en query string ou auth manuelle). Au handshake, un middleware de
session (#raw("io.use", lang: "ts")) extrait le cookie, vérifie la
signature JWT et stocke l'identifiant utilisateur dans #raw("socket.data.userId", lang: "ts").
En cas d'échec — cookie absent, signature invalide, identifiant non
entier positif — la connexion est rejetée avec #raw("next(new Error('Unauthorized'))", lang: "ts")
avant qu'aucun event applicatif ne puisse être émis ou reçu.

Ce choix élimine deux surfaces d'attaque par rapport à un token en URL :
le token n'est jamais exposé dans une chaîne de connexion ni loggué par
un proxy intermédiaire, et la session reste cohérente entre les flux
REST et WebSocket (un seul flux de rafraîchissement à gérer côté
frontend). Le code complet de ce handshake est reproduit en *annexe B*.

== Contrôles d'accès appliqués à chaque event

#table(
  columns: (12em, 1fr, 6em),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, left),
  [*Contrôle*], [*Effet*], [*Réf. code*],
  [Auth handshake], [Refus de connexion si JWT manquant ou invalide.], [#code-wrap("socket.ts:88-122")],
  [Vérif participant `conversation:join`], [Refus de rejoindre une room conversation si l'utilisateur n'est pas dans `UserHasConversation` pour cette conversation.], [#code-wrap("socket.ts:136-152")],
  [Validation bornes message], [Refus si #raw("content", lang: "ts") absent, vide après #raw("trim()", lang: "ts"), ou supérieur à 2000 caractères.], [#code-wrap("socket.ts:167-186")],
  [Refus si conversation `Close`], [Aucun message accepté sur une conversation clôturée — le statut est lu en base avant persistance.], [#code-wrap("socket.ts:214-220")],
  [Vérif participant `message:send`], [Refus si l'émetteur n'est pas participant de la conversation cible (recheck explicite, indépendant de `conversation:join`).], [#code-wrap("socket.ts:222-230")],
  [Cloisonnement par rooms], [Diffusion ciblée — un message émis dans `conversation:42` n'atteint que les sockets ayant rejoint cette room précise. Inscription à la room personnelle à la connexion ; inscription à la room conversation seulement après vérification participant.], [#code-wrap("socket.ts:128, 155")],
)

// B-008-1 résolu en audit S9 (2026-05-08) : 8 références vérifiées contre
// le code prod, 7/8 exactes ; ligne corrigée pour le contrôle "Cloisonnement
// par rooms" (socket.ts:131-134 → socket.ts:128, 155 — les vraies
// instructions socket.join, pas le début du handler).

À ces six contrôles côté Socket s'ajoute *en amont* le gating métier
appliqué au moment de la création de la conversation par REST : le
middleware #raw("requireSimpleFollow", lang: "ts") (#raw("conv.middleware.ts:78-115", lang: "ts"))
exige que l'émetteur suive le destinataire avant que la conversation
puisse exister. Sans relation de suivi, aucune conversation n'est créée,
donc aucun message ne peut transiter — le contrôle Socket de
l'étape 5 ne sera jamais sollicité car il n'y aura pas de couple
conversation/participant à vérifier. Cette antériorité du gating REST
sur le pipeline Socket constitue le verrou métier le plus important du
produit.

== Défense en profondeur — front, back, base

Trois barrières indépendantes appliquent les mêmes règles à des niveaux
distincts du système, ce qui garantit que la compromission d'une couche
ne suffit pas à contourner les contrôles.

#table(
  columns: (8em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Niveau*], [*Mesures*],
  [Frontend], [Le dialogue de création de conversation#footnote[#raw("frontend/src/components/organisms/ConversationPage/NewConversationDialog.tsx", lang: "txt")] ne propose que les utilisateurs suivis (filtrage par #raw("useFollowedUsers", lang: "ts")). #raw("MessageInput.tsx", lang: "ts") désactive le champ de saisie quand #raw("conversationStatus === 'Close'", lang: "ts"). Ces mesures relèvent de l'UX — elles guident le membre légitime mais ne sont pas des contrôles de sécurité réels (un client compromis peut les contourner).],
  [Backend], [Les six contrôles Socket listés ci-dessus + le gating REST #raw("requireSimpleFollow", lang: "ts") forment la *vraie barrière de sécurité*. Toute requête mal formée, tout payload hors-bornes, tout participant non légitime est refusé avec une erreur explicite avant tout effet de bord.],
  [Base de données], [Trois contraintes d'unicité matérialisent au niveau base les règles non contournables : #raw("@@unique([followedId, followerId])", lang: "ts") sur #raw("Follow", lang: "sql"), #raw("@@unique([evaluatorId, evaluatedId])", lang: "ts") sur la table #raw("evaluation", lang: "sql"), clé primaire composite #raw("@@id([userId, conversationId])", lang: "ts") sur #raw("UserHasConversation", lang: "sql"). Ces contraintes prennent le relais en cas de bug applicatif (idempotence garantie sur les insertions concurrentes).],
)

== Dettes de sécurité assumées

Quatre zones de fragilité ont été identifiées en audit interne et sont
documentées plutôt que masquées. Aucune ne remet en cause la stabilité
fonctionnelle observée en production, mais toutes constituent des
chantiers de durcissement à programmer en V2.

#table(
  columns: (12em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Dette*], [*Impact et plan V2*],
  [Helmet installé non monté], [La dépendance #raw("helmet@8.1.0", lang: "txt") est listée dans #raw("backend/package.json", lang: "txt") mais jamais appliquée dans #raw("backend/src/app.ts", lang: "ts"). Mitigation actuelle : Nginx pose en façade #raw("X-Frame-Options", lang: "txt"), #raw("X-Content-Type-Options", lang: "txt"), #raw("X-XSS-Protection", lang: "txt") et HSTS. *V2* : ajouter #raw("app.use(helmet())", lang: "ts") dans Express (correction d'une ligne).],
  [Rate-limiting absent], [Aucune protection applicative contre l'abus en volume — ni #raw("express-rate-limit", lang: "txt"), ni #raw("limit_req", lang: "txt") Nginx. Risque : brute-force sur l'authentification, abus d'envoi de messages. *V2* : #raw("express-rate-limit", lang: "txt") sur les routes #raw("/api/v1/auth/{login,register,refresh}", lang: "txt") (5 tentatives / 15 min par IP).],
  [Content Security Policy absente], [Aucune directive #raw("Content-Security-Policy", lang: "txt") posée, ni côté Express ni côté Nginx. Le frontend Next.js n'est donc pas protégé contre l'injection de scripts tiers. *V2* : CSP stricte côté Nginx en mode #raw("Report-Only", lang: "txt") d'abord, puis enforcement après recensement des inline-scripts légitimes.],
  [Validation Socket sans Zod], [Les events Socket utilisent une validation manuelle (#raw("Number.isInteger", lang: "ts"), bornes de longueur) plutôt que les schémas Zod employés sur les routes REST. Trade-off latence assumé pour le handler #raw("message:send", lang: "ts"). *V2* : harmonisation Zod si la latence mesurée le permet.],
)

// CC-VERIFY : reformulations alignées sur l'audit S8 du `06-audit-report.md`.
// Vérifier au moment de l'audit que ces 4 dettes restent exactes (notamment
// si Helmet a été branché entretemps, ou si rate-limit a été ajouté).
