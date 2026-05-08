# Inventaire fonctionnel SkillSwap — Dossier de Projet CDA

**Date** : 2026-05-08 · **Périmètre** : repo prod (miroir local)
**Objectif** : identifier la « fonctionnalité la plus représentative » servant de fil rouge au DP CDA (annexes, oral 40 min, jeu d'essai section 10).
**Méthode** : lecture du code (`backend/src/`, `frontend/src/`, `prisma/schema.prisma`) — aucune supposition tirée du README ou de la doc Arc42.

> ⚠️ Lecture de l'historique git : ce repo de doc importe le code applicatif en un seul commit. La colonne « Part Lead Front » est donc estimée par mapping conceptuel (frontend Next.js = périmètre Lead Front), pas par `git blame` côté repo prod.

---

## 1. Vue d'ensemble produit

### Pitch (basé sur le code)

SkillSwap est une **plateforme communautaire d'échange de compétences entre membres** : chacun publie ses compétences (`Skill`), les compétences qu'il souhaite apprendre (`UserHasInterest`), ses créneaux de disponibilité (`UserHasAvailable`) et son profil (avatar, bio, ville). Les membres se trouvent par **recherche full-text indexée Meilisearch**, se suivent (`Follow`), échangent en messagerie temps réel (Socket.IO + persistance Postgres), puis s'évaluent (`Rating` 1→5 + commentaire) une fois l'échange clôturé.

### Persona principal & parcours core

Un membre adulte qui veut **apprendre/transmettre une compétence sans monétisation**. Parcours :

1. **S'inscrit** (`/inscription`) — argon2 + JWT en cookie httpOnly + refresh token rotatif.
2. **Complète son profil** (`/mon-profil`) — skills, interests, availabilities, avatar (multer, 5 Mo, JPEG/PNG).
3. **Cherche un membre** (`/recherche`) — debounce 300 ms, filtre catégorie, pagination Meilisearch.
4. **Suit le membre** (`POST /follows/:id/follow`) — pré-requis pour démarrer une conversation.
5. **Discute en temps réel** (`/conversation`) — Socket.IO, rooms par conversation + room personnelle, pagination cursor.
6. **Clôture & évalue** — règle métier : impossible d'évaluer sans suivre + sans avoir une conversation, clôture déclenche un dialog d'évaluation.

### Modèles BDD centraux (sur 14)

| Modèle | Rôle | Relations clés |
|---|---|---|
| `User` | Identité + données profil | hub central : `UserHasSkill`, `UserHasInterest`, `UserHasAvailable`, `Follow`, `Rating`, `Conversation`, `Message`, `RefreshToken` |
| `Conversation` (+ `UserHasConversation`, `Message`) | Échange écrit | participants N-N, status `Open`/`Close`, cascade messages |
| `Skill` (+ `Category`, `UserHasSkill`, `UserHasInterest`) | Référentiel compétences | catégorisé, distingué offre/demande |
| `Follow` | Graphe social | porte la règle métier (follow obligatoire pour DM + rating) |
| `Rating` | Évaluation 1-5 + commentaire | unique `(evaluatorId, evaluatedId)` |

---

## 2. Inventaire des fonctionnalités principales

### F1 — Authentification (register / login / refresh / logout / me)

Inscription + connexion par email/mot de passe, sessions JWT avec rotation du refresh token.

- **Front** : `app/(auth)/inscription/page.tsx`, `app/(auth)/connexion/page.tsx`, `components/organisms/AuthForm.tsx`, `components/providers/AuthProvider.tsx`, `hooks/useFormState.ts`, `lib/validation/auth.validation.ts`, `middleware.ts` (redirect protégées/auth).
- **Back** : `routers/auth.router.ts`, `controllers/auth.controller.ts`, `services/auth.service.ts`, `lib/auth.ts`, `middlewares/auth.middleware.ts`, `validation/auth.validation.ts`.
- **Modèles** : `User`, `Role`, `RefreshToken`.
- **Sécurité** : argon2 (`auth.service.ts:21`), Zod register/login (regex nom/prénom, password ≥ 8, confirmation), JWT `accessToken` + `refreshToken` en **cookies httpOnly + secure + sameSite='strict' en prod** (`auth.controller.ts:68-94`), rotation refresh token à chaque refresh (`auth.service.ts:103-108`), `checkAuth` middleware.
- **Couches CDA** : UI ✓ / métier ✓ / data ✓ / sécurité ✓✓ / tests ✓ (`auth.controller.spec.test.ts`, `auth.validation.test.ts`).
- **Complexité** : moyenne.
- **Part Lead Front** : partagée (UI + AuthProvider côté front, services côté back).

### F2 — Profil membre (consultation publique + édition propriétaire + skills/interests/availabilities + avatar)

CRUD complet du profil avec endpoint **public SEO** (sans auth) et endpoints owner-only.

- **Front** : `app/(app)/mon-profil/page.tsx`, `app/(app)/profil/[id]/page.tsx`, `components/organisms/ProfilePage/*` (`ProfileFull.tsx`, `ProfileHeader.tsx`, `SkillsSection.tsx`, `InterestsSection.tsx`, `AvailabilitySection.tsx`, `ReviewsSection.tsx`, `EditPage/*` dont `UpdateAvatarDialog.tsx`, `AddSkillDialog.tsx`, `AddAvailabilityDialog.tsx`), `hooks/profile/*` (6 hooks).
- **Back** : `routers/profile.router.ts` (15 routes), `controllers/profile.controller.ts`, `services/profile.service.ts`, `middlewares/upload.middleware.ts` (multer + filtre MIME).
- **Modèles** : `User`, `UserHasSkill`, `UserHasInterest`, `UserHasAvailable`, `Skill`, `Available`, `Rating`.
- **Sécurité** : Zod sur tous les payloads (`profile.validation.ts`), `checkAuth` + `isOwner` (`auth.middleware.ts:28-36`) sur `PATCH /:id`, multer `fileSize: 5MB` + whitelist MIME (`upload.middleware.ts:31-42`), endpoint public **explicitement non-authentifié** pour SEO (`profile.router.ts:75`).
- **Couches CDA** : UI ✓✓ / métier ✓ / data ✓ / sécurité ✓ / tests ✓ (`profile.controller.spec.test.ts`).
- **Complexité** : élevée (surface fonctionnelle large).
- **Part Lead Front** : majoritaire (13 organismes + 6 hooks dédiés).

### F3 — Recherche de membres (Meilisearch + debounce + filtre catégorie + pagination)

Recherche full-text typée par catégorie, alimentée par un index Meilisearch synchronisé sur les `User`.

- **Front** : `app/(app)/recherche/page.tsx`, `components/organisms/SearchPage/*` (`SearchBar.tsx`, `CategoryFilter.tsx`, `SearchResults.tsx`, `SearchResultSkeleton.tsx`), `hooks/useSearch.ts`, `hooks/useTopCategories.ts`.
- **Back** : `routers/search.router.ts`, `controllers/search.controller.ts`, `services/search.service.ts`, `lib/mailisearch.ts`, `mappers/member.mapper.ts`, `scripts/reindex-search.ts`, `@types/search.types.ts`.
- **Modèles** : `User`, `Skill`, `Category`, `UserHasSkill`, `Rating` (calcul moyenne).
- **Sécurité** : Zod query (`SearchParamsSchema`, `TopRatedSchema`), `checkAuth` sur `/search`, top-rated public, **AbortController** côté front (`useSearch.ts:110, 156`) pour annuler les requêtes obsolètes, clamp `limit` côté back (`search.service.ts:41`).
- **Couches CDA** : UI ✓ / métier ✓ / data ✓ (Meilisearch + Postgres) / sécurité ✓ / tests ✓ (`search.controller.spec.test.ts`, `e2e/search.spec.ts`).
- **Complexité** : élevée (debounce + abort + index externe + sync).
- **Part Lead Front** : majoritaire (debounce/abort/UX du front), partagée sur l'index.

### F4 — Messagerie temps réel (Socket.IO + persistance + pagination)

Conversations 1-1 avec messages persistés Postgres, livraison temps réel Socket.IO et pagination cursor-based côté historique.

- **Front** : `app/(app)/conversation/page.tsx`, `components/organisms/ConversationPage/*` (`ConversationSection.tsx`, `MessageThread/index.tsx`, `MessageThread/MessageInput.tsx`, `MessageThread/MessageList.tsx`, `MessageThread/ThreadHeader.tsx`, `MessageThread/ThreadDialogs.tsx`, `NewConversationDialog.tsx`, `RatingDialog.tsx`), `hooks/useMessaging.ts` orchestrateur, `hooks/messaging/*` (7 hooks dont `useGlobalSocket`, `useConversationMessages`, `useConversationActions`), `hooks/useSocket.ts`, `lib/socket-client.ts`.
- **Back** : `realtime/socket.ts` (446 LOC), `routers/conv.router.ts` (8 routes), `controllers/conv.controller.ts`, `controllers/message.controller.ts`, `services/conv.service.ts`, `services/message.service.ts`, `middlewares/conv.middleware.ts` (`requireSimpleFollow`, `requireMutualFollow`, `requireFollow`).
- **Modèles** : `Conversation`, `UserHasConversation`, `Message`, `Follow` (gating), `User`, `Rating` (lié à la clôture).
- **Sécurité** : authentification socket par lecture du cookie JWT (`socket.ts:88-122`), validation participant à chaque event (`socket.ts:136-152, 222-230`), Zod sur les routes REST (params + body + query messages), gating métier via `requireSimpleFollow` (création conv) et `requireFollow` (notation), bornes message (`max 2000 chars`), **room cloisonnée** par conversation + room personnelle `user:${id}`.
- **Couches CDA** : UI ✓✓ / métier ✓✓ / data ✓ / sécurité ✓✓ / tests ✓ (`conv.spec.test.ts`, `message.spec.test.ts`, `socket.spec.test.ts`).
- **Complexité** : élevée (la plus haute du projet).
- **Part Lead Front** : majoritaire (orchestrateur `useMessaging` + 7 sous-hooks + 11 organismes ConversationPage).

### F5 — Système de follow (graphe social + gating métier)

Suivi unidirectionnel entre membres, **prérequis fonctionnel** à la messagerie et à l'évaluation.

- **Front** : appels via `lib/api-client.ts`, intégration directe dans `ProfileHeader.tsx`, `ConversationSection.tsx`, `hooks/messaging/useFollowedUsers.ts`.
- **Back** : `routers/follow.router.ts`, `controllers/follow.controller.ts`, `services/follow.service.ts`, `middlewares/conv.middleware.ts` (les 3 helpers `requireSimpleFollow`, `requireFollow`, `requireMutualFollow`).
- **Modèles** : `Follow` (unique `(followedId, followerId)`).
- **Sécurité** : `checkAuth` partout, `parseNumericParams`, contrôle anti-self-follow dans `requireFollow` (`conv.middleware.ts:26-30`).
- **Couches CDA** : UI ✓ / métier ✓ / data ✓ / sécurité ✓ / tests ✓ (`follow.controller.spec.test.ts`).
- **Complexité** : faible.
- **Part Lead Front** : partagée.

### F6 — Évaluation (`Rating`)

Note 1-5 + commentaire facultatif laissée à un autre membre, **soumise au follow**.

- **Front** : `components/organisms/ConversationPage/RatingDialog.tsx`, `components/organisms/ProfilePage/ReviewsSection.tsx`, `components/atoms/Rating.tsx`, intégrée au flow de clôture (`MessageThread/index.tsx:62-95`).
- **Back** : route `POST /profiles/:id/rating` dans `profile.router.ts`, `addRateToUser` dans `profile.controller.ts`, `addRateToUserService` dans `profile.service.ts`.
- **Modèles** : `Rating`.
- **Sécurité** : Zod `addRatingToUserSchema`, gating `requireFollow({ allowSelf: false })` (`profile.router.ts:92`), unique `(evaluatorId, evaluatedId)` côté schéma → impossible de noter deux fois.
- **Couches CDA** : UI ✓ / métier ✓ / data ✓ / sécurité ✓ / tests partiel (couvert via `profile.controller.spec.test.ts`).
- **Complexité** : faible (le couplage avec messagerie/follow ajoute la complexité, pas la feature elle-même).
- **Part Lead Front** : partagée.

### F7 — Upload avatar (drag & drop + multer)

Upload image profil avec preview client + validation MIME + stockage disque servi en statique.

- **Front** : `components/organisms/ProfilePage/EditPage/UpdateAvatarDialog.tsx` (drag & drop, FileReader preview, validation 5 Mo + MIME image/*), `hooks/profile/useDialogs.ts`.
- **Back** : `middlewares/upload.middleware.ts` (multer diskStorage, filtre MIME `jpeg/jpg/png`, limite 5 Mo, naming `avatar-{userId}-{timestamp}.ext`), `app.ts:26` (statique `/avatars`), `updateAvatar`/`deleteAvatar` controllers.
- **Modèles** : `User.avatarUrl`.
- **Sécurité** : double validation MIME (front + back via whitelist), limite taille bilatérale, naming unique côté back (le client ne contrôle pas le filename → pas de path traversal).
- **Couches CDA** : UI ✓ / métier ✓ / data ✓ / sécurité ✓ / tests aucun spécifique.
- **Complexité** : faible.
- **Part Lead Front** : majoritaire.

### F8 — SEO / page profil publique (ISR + metadata + sitemap/robots)

Profil consultable **sans authentification** pour indexation Google + crawlers sociaux.

- **Front** : `app/(app)/profil/[id]/page.tsx` (Server Component), `app/sitemap.ts`, `app/robots.ts`, `next.config.ts` (rewrites `/avatars/*`).
- **Back** : `GET /profiles/public/:id` (`profile.router.ts:75`), `getPublicProfileService`.
- **Modèles** : `User` (champs publics), `Skill`, `Rating`.
- **Sécurité** : pas d'auth, surface limitée par `getPublicProfileService` (sélection explicite de champs côté back).
- **Couches CDA** : UI ✓ / métier ✓ / data ✓ / sécurité ✓ / tests aucun.
- **Complexité** : faible.
- **Part Lead Front** : majoritaire.

### F9 — Catégories & compétences (référentiel + top categories)

Référentiel `Category` + `Skill` consommé par recherche, profil et home.

- **Front** : `hooks/useTopCategories.ts`, `components/organisms/HomePage/CategoriesSection.tsx`, `components/organisms/SearchPage/CategoryFilter.tsx`.
- **Back** : `routers/category.router.ts`, `routers/skill.router.ts`, `controllers/category.controller.ts`, `services/category.service.ts`, `validation/category.validation.ts`.
- **Modèles** : `Category`, `Skill`.
- **Sécurité** : Zod sur params, lecture publique.
- **Couches CDA** : UI ✓ / métier ✓ / data ✓ / sécurité ✓ / tests aucun.
- **Complexité** : faible.
- **Part Lead Front** : partagée.

---

## 3. Top 5 candidates « fonctionnalité représentative »

Scoring 1-5 (5 = excellent) :

| Feature | Cœur métier | Multi-couches | Visibilité Lead Front | Sécurité | Démo orale | **Total /25** |
|---|---:|---:|---:|---:|---:|---:|
| **F4 — Messagerie temps réel** | 5 | 5 | 5 | 5 | 5 | **25** |
| F2 — Profil membre complet | 4 | 5 | 5 | 4 | 4 | **22** |
| F3 — Recherche Meilisearch | 4 | 5 | 4 | 3 | 4 | **20** |
| F1 — Authentification | 3 | 5 | 3 | 5 | 3 | **19** |
| F7 — Upload avatar | 2 | 4 | 4 | 4 | 3 | **17** |

---

## 4. Recommandation argumentée — **F4 Messagerie temps réel**

**5 raisons concrètes ancrées dans le code** :

1. **Cœur métier maximal** : la messagerie est le moment où l'échange de compétences se concrétise. Sans elle, SkillSwap est un annuaire. Le code le confirme : `Conversation` est le seul modèle dont la création est gardée par une **règle métier non triviale** (`requireSimpleFollow` — `conv.middleware.ts:78-115`), pas par une simple permission.
2. **Couverture multi-couches exhaustive** : 1 schéma Prisma (3 modèles), 8 routes REST (`conv.router.ts`), 5 events Socket.IO bidirectionnels (`socket.ts:12-60`), 4 schémas Zod (`conversation.validation.ts`), 1 middleware métier dédié (`conv.middleware.ts`), 11 composants React (`ConversationPage/`), 8 hooks (`useMessaging.ts` + `messaging/*`), 1 client Socket.IO singleton (`socket-client.ts`). Tous les axes du REAC sont couverts par ce seul périmètre.
3. **Visibilité Lead Front maximale** : l'orchestration `useMessaging.ts` (139 LOC) compose **7 hooks spécialisés** + écoute 3 events Socket.IO (`updated`, `closed`, `new` — `useGlobalSocket.ts:65-74`) + gère scroll, pagination, optimistic UI (`addOptimisticMessage`), notifications toast contextuelles. C'est l'endroit où le travail de structuration du front est le plus défendable face à un jury technique.
4. **Enjeux sécurité riches** : authentification socket par cookie JWT lue manuellement (`socket.ts:88-122`), double vérification participant à chaque event (`socket.ts:136-152, 222-230`), validation des bornes (`max 2000 chars`, `Number.isInteger`), gating métier (follow obligatoire), cloisonnement par room (`conversation:${id}`, `user:${id}`), gestion du status `Close` qui désactive l'input côté UI **et** rejette côté serveur (`socket.ts:214-220`, `MessageInput.tsx:41`).
5. **Richesse pour démo orale** : flux temps réel **visuellement convaincant** (envoyer un message dans un onglet, voir l'apparition immédiate dans un autre), couplage avec follow + rating + clôture pour raconter une histoire complète en 10 min, jeu d'essai section 10 facile (entrée = `message:send` payload, attendu = persistance + diffusion aux 2 rooms + `conversation:updated`).

---

## 5. Risques & points de vigilance — F4 Messagerie temps réel

### Dette technique / fragilités face au jury

- **Logique lourde dans le handler Socket** : `socket.ts:167-347` fait tout dans le handler `message:send` — fetch conv, vérif participant, comptage `_count`, création message + update conversation en `Promise.all`, calcul `followStatus`/`ratingStatus`, émission de 3 événements différents. Le jury peut demander pourquoi cette logique n'est pas dans `services/message.service.ts`. Réponse à préparer : couplage temps réel/persistance volontaire, mais **séparation incomplète**.
- **Validation manuelle des events Socket** : pas de Zod côté Socket (à la différence des routes REST), juste des `Number.isInteger` + `String().trim()` (`socket.ts:131-133, 167-186`). À assumer comme un trade-off documenté.
- **Code mort / incohérence** : `requireFollow` côté router est utilisée pour le rating (avec `allowSelf: false`), `requireSimpleFollow` pour la création conversation, et `requireMutualFollow` est définie mais **non utilisée** (`conv.middleware.ts:48`). À supprimer ou expliquer.
- **Commentaire en français + emoji « ✅ NOUVEAU »** dans `useGlobalSocket.ts:16, 31, 92` → ces marqueurs internes traînent dans le code prod. Petit nettoyage avant la soutenance.
- **Comparaison directe d'objets dans `useEffect`** (`useMessaging.ts:49-86`) : les handlers Socket sont enregistrés à chaque render via `onConversationUpdate(...)` — pas de bug visible mais le jury peut soulever la question de la stabilité des refs.

### Tests présents / manquants

- ✓ `socket.spec.test.ts` (Socket.IO), `conv.spec.test.ts`, `message.spec.test.ts` (REST).
- ✗ **Aucun test E2E Playwright** sur la messagerie (uniquement `auth.spec.ts` et `search.spec.ts` côté front E2E).
- ✗ **Aucun test unitaire des hooks `messaging/*`** côté front (les tests vitest sont uniquement sur `lib/validation/*` et `lib/utils.ts`).
- → À mentionner honnêtement dans la section 10.4 (limites du jeu d'essai).

### Bugs / points sensibles connus

- **Première inscription d'un message** : la branche `isFirstMessage` (`socket.ts:241, 295-338`) émet `conversation:new` au receveur en plus de `message:new` + `conversation:updated`. Si le receveur est dans plusieurs rooms simultanément, il reçoit 2 events distincts pour la même conv — vérifier en démo qu'aucun double affichage ne surgit.
- **Toast français cassé** : `useMessaging.ts:61` → `"${closedBy.firstname} à clôturer un échange"` (faute : `à clôturé`). Petite faute UX que le jury peut voir en démo.
- **Disabled input vs status** : `MessageInput.tsx:41` se base sur `conversationStatus` côté props ; vérifier que l'event `conversation:closed` met bien à jour `selectedConv.status` côté state (le hook `updateConversationStatus` est appelé dans `useMessaging.ts:58`) — golden path à tester avant l'oral.
- **Endpoint `PATCH /:id/close` REST** existe en parallèle de l'event Socket `conversation:close` (`conv.router.ts:86`). Le front utilise quoi ? À tracer pour ne pas se faire piéger.

---

## Pour aller plus loin (hors livrable)

- Le repo de doc importe le code en un seul commit → pour le DP CDA, l'attribution personnelle se justifie par la **structure du repo prod** (à présenter au jury), pas par ce miroir.
- Le `codebase-inventory-S3.md` (audit Arc42 du 2026-05-07) reste la référence pour les écarts code/doc — il n'est pas dupliqué ici.
