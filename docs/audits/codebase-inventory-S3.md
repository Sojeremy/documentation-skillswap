# Inventaire codebase exhaustif SkillSwap (S3)

**Date** : 2026-05-07
**Périmètre** : repo doc (Sojeremy/documentation-skillswap, miroir local du repo prod)
**Objectif** : fonder l'audit Arc42 S3 sur une cartographie exhaustive lue fichier par fichier (pas de raccourci par nommage)
**Méthode** : lecture intégrale de tous les fichiers `.ts`/`.tsx`/`.md`/`.yml`/`.json`/`.conf` non-test, hors `node_modules`/`.next`/`dist`/`generated`. Confrontation à `docs/documentation-implementation/` via `grep` ciblé.

---

## 0. Synthèse executive

L'inventaire couvre **45 modules** répartis sur 6 racines (`backend/`, `frontend/`, `devops/`, `docs/`, `user-docs/`, `storybook/`). Code applicatif inspecté : **9 092 LOC backend** (45 fichiers non-test) + **12 386 LOC frontend** (110 fichiers non-test, hors stories). **24 écarts** détectés vs Arc42, dont **8 critiques** (modules entiers ou flows non documentés) et **9 importants** (divergences code/doc), 7 mineurs. Le module `realtime/` (Socket.IO, 446 LOC) n'apparaît dans aucune section runtime ni building-blocks ; le module `mappers/` est absent de toute la doc ; le runtime messaging.md décrit un flow REST + TanStack Query qui n'est plus la réalité (Socket.IO + state React natif depuis longtemps). La doc API (axe 3, S2) est désormais fidèle (38 endpoints), mais les couches techniques transverses (temps-réel, SEO/ISR, mappers, scripts) restent silencieuses.

---

## 1. Cartographie

### 1.1 Backend

```
backend/
├── config.ts               (env validator, 39 LOC)
├── index.ts                (entrypoint http+socket, 14 LOC)
├── prisma.config.ts
├── public/avatars/         (6 jpg/jpeg statiques)
├── prisma/
│   ├── schema.prisma       (14 modèles, 4 enums, 246 LOC)
│   ├── migrations/         (6 migrations SQL daté 20260112→20260120)
│   └── generated/prisma/   (Prisma Client TS — généré, hors audit)
└── src/
    ├── app.ts              (Express bootstrap, CORS, /health, /avatars statiques)
    ├── controllers/        (7 fichiers — 7 ts non-test)
    ├── services/           (7 fichiers)
    ├── routers/            (8 fichiers + index)
    ├── middlewares/        (5 fichiers)
    ├── lib/                (4 fichiers : auth, error, formatZodError, mailisearch)
    ├── mappers/            (1 fichier : member.mapper.ts) ← non documenté
    ├── realtime/           (1 fichier : socket.ts, 446 LOC) ← non documenté
    ├── scripts/            (1 fichier : reindex-search.ts) ← non documenté
    ├── models/             (index.ts, seeding.ts 154 LOC, seeding.dev.ts 2249 LOC)
    ├── @types/             (express.d.ts, search.types.ts)
    ├── validation/         (5 schémas Zod)
    └── test/               (config + setup)
```

**Stats backend** :
- 45 fichiers `.ts` non-test → 9 092 LOC
- Plus gros fichier non-généré : `seeding.dev.ts` (2 249 LOC, fixtures de dev) — n'est jamais cité dans la doc
- Tests présents (`*.spec.test.ts`) sur : auth, follow, profile, message, search, conv, socket → cohérent avec axe 10

### 1.2 Frontend

```
frontend/
├── next.config.ts          (rewrites /avatars/* → backend, ISR images)
├── playwright.config.ts
├── vitest.config.ts
├── typedoc.json
├── e2e/                    (auth.spec.ts, search.spec.ts)
├── docs/api/               (TypeDoc généré)
└── src/
    ├── middleware.ts                ← non documenté Arc42
    ├── app/
    │   ├── layout.tsx, page.tsx
    │   ├── robots.ts, sitemap.ts    ← partiellement documentés (8.5 SEO ?)
    │   ├── (app)/{conversation,mon-profil,profil/[id],recherche}/
    │   └── (auth)/{connexion,inscription}/
    ├── components/
    │   ├── atoms/          (16 .tsx + barrel — 18 atoms d'après doc, 16 réels)
    │   ├── molecules/      (9 .tsx + barrel)
    │   ├── organisms/      (44 .tsx hors stories ; ProfilePage, Header, ConversationPage, HomePage, SearchPage)
    │   ├── layouts/        (1 : MainLayout)
    │   └── providers/      (1 : AuthProvider)
    ├── hooks/              (21 hooks au total)
    │   ├── racine/         (8 : useAccount, useAutoScroll, useFormState, useIsMobile, useMessaging, useSearch, useSocket, useTopCategories)
    │   ├── messaging/      (7 + index : useConversationActions, useConversationList, useConversationMessages, useFollowedUsers, useGlobalSocket, useMessagingScroll, useSelectedConversation)
    │   └── profile/        (6 + index : useAvailabilities, useDialogs, useInterests, useProfile, useProfileUpdate, useSkills)
    └── lib/
        ├── api-client.ts    (HTTP client + refresh-token retry)
        ├── api-types.ts     (DTO front)
        ├── socket-client.ts (Socket.IO singleton client) ← non documenté
        ├── utils.ts, dateTime.utils.ts, form-styles.ts
        └── validation/      (4 schémas Zod : auth, conversation, updatePassword, updateProfile)
```

**Stats frontend** :
- 110 fichiers `.ts`/`.tsx` non-test/non-stories → 12 386 LOC
- 21 hooks confirmés (la doc Arc42 5.2 annonce 21, exact)
- 58 composants doc, mais inventaire par tree : 16 atoms + 9 molecules + ~44 fragments organisms (HomePage 4 + Header 6 + ConversationPage 11 + ProfilePage 13 + SearchPage 5 + AuthForm + Footer + 2 barrels)

### 1.3 DevOps

```
devops/
├── docker-compose.dev.yml         (5 services : backend, frontend, postgres, adminer, meilisearch, nginx)
├── docker-compose.prod.yml        (6 services : backend, frontend, postgres, meilisearch, nginx, certbot ; pas d'adminer)
├── backend/Dockerfile.{dev,prod}
├── frontend/Dockerfile.{dev,prod}
├── nginx/{dev,prod}.conf          (prod = HTTPS Let's Encrypt + headers sécurité + WS socket.io)
├── wait-for-postgres.sh
└── README.md                      (guide complet 320 lignes)
```

### 1.4 Docs (interne au repo)

```
docs/
├── README.md, mkdocs.yml, requirements.txt, vercel.json, DEPLOY.md
├── audits/                        (6 .md : axes 1, 2, 3, 6, 7, doc-reality-check)
├── carnet-de-bord.md
├── devops/                        (devops-quickref.md, sql-demos-vitrine.sql)
├── documentation-implementation/  (publié sur skillswap-docs.vercel.app)
│   ├── arc42/                     (12 sections + diagrams/erd.svg)
│   ├── api-reference/             (openapi.yaml 1803 lignes + 6 .md + 3 examples)
│   ├── database/                  (relations, enums, migrations + 11 modèles)
│   ├── infrastructure/            (services 558 LOC, ci-cd, networks, volumes, troubleshooting)
│   ├── typedoc/                   (10 .md dont validation/ — exclu de mkdocs)
│   └── index.md
├── documentation-strategy/        (15 chapitres 00-14)
├── endpoints/                     (endpoints-api.md, rbac.md — refondus axe 3)
├── merise/                        (instruction.md, schema.prisma)
├── soutenance/                    (fiches/, README.md)
└── uml/
    ├── architecture/              (.puml + .png)
    ├── deployement/               (.puml + .png)
    ├── erd.puml
    ├── sequence/                  (conversation, search-profile en .puml + .png)
    └── user/                      (use-cases.puml, user-flow.puml, arborescence.png)
```

### 1.5 User-docs (Docusaurus)

```
user-docs/
├── docusaurus.config.ts, sidebars.ts, vercel.json
├── src/css/custom.css
├── static/img/                    (favicon, logos, undraw_*)
└── docs/                          (16 pages, modèle Diataxis)
    ├── tutorials/                 (4 : getting-started, create-profile, add-skills, first-exchange)
    ├── how-to/                    (6 : edit-profile, follow-members, manage-availabilities, rate-user, search-members, send-message)
    ├── explanation/               (3 : categories, how-it-works, trust-system)
    ├── reference/                 (4 : categories-list, faq, settings, troubleshooting)
    └── index.md
```

### 1.6 Storybook (déploiement Vercel)

```
storybook/
├── package.json    (build délègue à frontend/)
└── vercel.json
```

---

## 2. Inventaire backend

### Module : `backend/` racine

| Fichier | Rôle | Lignes | Exports principaux | Dépendances notables | Doc Arc42 ? |
|---------|------|--------|-------------------|---------------------|-------------|
| `index.ts` | Bootstrap http.createServer + initSocket + listen | 14 | (entry) | http, socket | 7-deployment ✅ |
| `config.ts` | Validateur ENV (port, jwtSecret, meilisearch, allowedOrigin) | 39 | `config` | (none) | 8-crosscutting/security ✅ |
| `prisma.config.ts` | Config Prisma | (court) | (config) | @prisma | partiel |

### Module : `backend/src/app.ts`

Bootstrap Express : CORS avec `credentials: true`, JSON parser, `cookieParser`, `addResponseMethodsMiddleware`, sert `/avatars` statiques, monte `/api/v1` + `errorHandler`. **35 LOC**. ✅ documenté.

### Module : `backend/src/controllers/`

| Fichier | Rôle | LOC | Exports | Dépendances | Doc Arc42 ? |
|---|---|---|---|---|---|
| `auth.controller.ts` | login/register/logout/refresh/me + helpers cookies | 95 | `register, login, logout, refreshAccessToken, getMe, setTokenInCookie, setRefreshTokenInCookie` | jsonwebtoken, prisma | ✅ documenté (06-runtime/auth) |
| `category.controller.ts` | Top categories | 9 | `GetTopUserCategories` | (service only) | ✅ partiel |
| `conv.controller.ts` | CRUD conversations | 103 | `getAllUserConversationsController`, `createConversationController`, `getConversationByIdController`, `deleteConversationController`, `closeConversationController` | (services) | ✅ |
| `follow.controller.ts` | follow/unfollow/list | 33 | `followUser, unfollowUser, getAllFollowers, getAllFollowing` | | ✅ |
| `message.controller.ts` | CRUD messages REST (existe en parallèle de Socket.IO) | 99 | `createMessageController, getConversationMessagesController, updateMessageController, deleteMessageController` | | 🟠 ambigu (la doc messaging.md décrit ce flow REST, mais le frontend n'utilise plus que Socket.IO pour `message:send`) |
| `profile.controller.ts` | profil + skills/interests/availabilities/rating + avatar + getPublicProfile | 145 | `getProfile, getPublicProfile, changeOwnProfile, getAllSkills, addProfileSkills, deleteProfileSkills, addProfleInterests, deleteProfileInterests, getAllAvailabilities, addProfileAvailabilities, deleteOwnAvailabilities, addRateToUser, changePassword, deleteAccount, updateAvatar, deleteAvatar` | multer (req.file), BadRequestError | 🟠 `getPublicProfile` (endpoint SEO sans auth) absent de la stratégie SEO Arc42 |

**Notes** : `addProfleInterests` (typo `Profle`) export tel quel et utilisé dans le router → coquille en prod, pas de risque mais à signaler.

### Module : `backend/src/services/`

| Fichier | LOC | Exports | Notes |
|---|---|---|---|
| `auth.service.ts` | 132 | registerService, loginService, logoutService, refreshAccessTokenService, getMeService | argon2 hash. `getMeService` : ⚠ `prisma.user.findUnique` n'est **pas await** (line 117) → renvoie une `Promise<User>` au lieu d'un User. Bug latent. |
| `category.service.ts` | 67 | getTopUserCategoriesService | $queryRaw `Prisma.sql` (jointure `category` + `skill` + `user_has_skill`). Tri DESC par user_count. |
| `conv.service.ts` | 472 | getAllUserConversationsService, createConversationService, getConversationByIdService, leaveConversationService, closeConversationService | Vérifie follow simple A→B avant création. `closeConversation` ≠ `leaveConversation` (bug fonctionnel séparé). |
| `follow.service.ts` | 94 | followUserService, unfollowUserService, getAllFollowersService, getAllFollowingService | Conflit 409 si déjà follow. |
| `message.service.ts` | 264 | getConversationMessagesService (cursor pagination), createMessageService, updateMessageService, deleteMessageService | Pagination cursor (cf. `GetMessagesQuerySchema`). Filtre sender absent si plus participant. |
| `profile.service.ts` | 593 | getPublicProfileService (TEASER), getProfileService, changeOwnProfileService, getAllSkillsService, addProfileSkillService (limit 10), deleteProfileSkillService, addProfileInterestsService (limit 10), deleteProfileInterestService, getAllAvailabilitiesService, addProfileAvailabilitiesService, deleteOwnAvailabilitiesService, addRateToUserService, changePasswordService, deleteAccountService, updateAvatarService, deleteAvatarService | Réindex Meilisearch sur add/delete/update profil/skills/rating ; suppression avatar via `fs.unlink`. |
| `search.service.ts` | 123 | indexMember, indexAllMembers, removeMember, getUserSearchService (Meilisearch), getBestUsersService (fallback Prisma sans pagination) | `getBestUsersService` charge **tous** les users en mémoire et les trie côté Node — non scalable. |

### Module : `backend/src/routers/`

| Fichier | LOC | Routes | Doc ? |
|---|---|---|---|
| `index.router.ts` | 20 | Monte `/auth`, `/profiles`, `/conversations`, `/follows`, `/categories`, `/skills`, `/availabilities`, `/search` sous `/api/v1` | ✅ |
| `auth.router.ts` | 18 | POST register/login/logout/refresh, GET me | ✅ |
| `profile.router.ts` | 116 | 14 endpoints incluant PATCH/DELETE avatar (multer single), GET /:id, GET /public/:id (PUBLIC), POST /:id/rating (requireFollow), DELETE /, etc. | 🟠 `/public/:id` mentionné en openapi.yaml mais **pas** dans la doc Arc42 building-blocks/runtime. |
| `conv.router.ts` | 91 | 9 routes (incluant PATCH /:id/close, asymétrie `messages` vs `message/:messageId`) | ✅ axe 3 |
| `follow.router.ts` | 23 | 4 routes | ✅ |
| `category.router.ts` | 13 | GET /top-rated | ✅ |
| `skill.router.ts` | 7 | GET / (auth) | ✅ |
| `availability.router.ts` | 7 | GET / (auth) | ✅ |
| `search.router.ts` | 21 | GET / (auth, Meilisearch), GET /top-rated (sans auth) | ✅ |

### Module : `backend/src/middlewares/`

| Fichier | LOC | Exports | Doc ? |
|---|---|---|---|
| `auth.middleware.ts` | 45 | validate, checkAuth, isOwner, parseNumericParams | ✅ |
| `conv.middleware.ts` | 115 | requireFollow, requireMutualFollow (DEAD CODE — non monté), requireSimpleFollow | ✅ axe 3 documente le dead code |
| `error.middleware.ts` | 96 | errorHandler (HttpError, jwt errors, ZodError, Prisma errors P2025/P2002/P2003, Multer errors, FileValidationError) | 🔴 doc Arc42 06-runtime/error-handling.md décrit un format `{success, error: {code, message, details}}` qui **n'existe pas en prod** — réalité : `{error: "string"}` |
| `response.middleware.ts` | 21 | addResponseMethodsMiddleware (`res.success`, `res.created`, `res.deleted`) | 🔴 module non documenté + format succès `{success, data, count}` n'apparaît dans aucune section |
| `upload.middleware.ts` | 51 | uploadAvatar (multer disk + fileFilter MIME + 5MB limit) | 🟠 nginx prod cache 1d les avatars (cf. dev.conf). Multer non mentionné dans Arc42. |

### Module : `backend/src/lib/`

| Fichier | LOC | Exports | Doc ? |
|---|---|---|---|
| `auth.ts` | 65 | generateAccessToken, generateRefreshToken (crypto random 64), decodeAccesToken, extractAccessTokenFromReq, extractRefreshTokenFromReq, UserPayload | ✅ 08-crosscutting/auth |
| `error.ts` | 44 | HttpError, UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError, ConflictError, UnprocessableEntityError, FileValidationError | 🔴 doc parle de `AppError, ValidationError, AuthenticationError` (n'existent pas) |
| `formatZodError.ts` | 20 | prettifyZodError | partiel |
| `mailisearch.ts` | 34 | client, membersIndex, setupMembersIndex (searchableAttributes, filterableAttributes, sortableAttributes, typoTolerance), testMeiliConnexion | ✅ partiel (typo dans nom de fichier `mailisearch` au lieu de `meilisearch`) |

### Module : `backend/src/mappers/` 🔴 NON DOCUMENTÉ

| Fichier | LOC | Exports | Rôle |
|---|---|---|---|
| `member.mapper.ts` | 55 | userToDocument | Lit user + skills + evaluationsReceived depuis Prisma → document Meilisearch (`MemberDocument` avec rating moyen calculé, skills/categoryIds/categorySlugs aplatis, timestamp createdAt). Calcule average via `calculateAverageRating`. |

**Aucune mention dans Arc42 building-blocks ni runtime, malgré son rôle pivot dans le pipeline d'indexation Meilisearch.**

### Module : `backend/src/realtime/` 🔴 NON DOCUMENTÉ

| Fichier | LOC | Rôle |
|---|---|---|
| `socket.ts` | 446 | initSocket(httpServer) → Socket.IO server. Auth via cookie `accessToken` (jwt.verify), rooms `conversation:{id}` + `user:{userId}`. Events client→server : `conversation:join, conversation:leave, message:send, conversation:close`. Events server→client : `conversation:joined, message:new, conversation:updated, conversation:closed, conversation:new, error`. Persistance Prisma intégrée dans le socket pour `message:send` (création message + update conversation), `conversation:close` (update status). |

**Aucune section runtime dédiée. La doc 06-runtime/messaging.md décrit un flow REST POST `/conversations/:id/messages` avec TanStack Query, alors que le frontend prod utilise Socket.IO via `useSocket`/`useGlobalSocket`.**

### Module : `backend/src/scripts/` 🔴 NON DOCUMENTÉ

| Fichier | LOC | Rôle |
|---|---|---|
| `reindex-search.ts` | 25 | Script CLI : test connexion Meilisearch → setupMembersIndex → indexAllMembers → exit. Utilisé par `package.json` racine `npm run search:reindex` (déclenché par `docker:init`). |

### Module : `backend/src/models/`

| Fichier | LOC | Rôle | Doc ? |
|---|---|---|---|
| `index.ts` | 8 | Singleton PrismaClient + adapter @prisma/adapter-pg + re-export du client généré | ✅ partiel |
| `seeding.ts` | 154 | Seed minimal : 1 role, 8 catégories, 30 skills, 14 créneaux Available | ✅ |
| `seeding.dev.ts` | 2249 | Fixtures riches dev (gros volume utilisateurs/relations) | 🟠 jamais cité dans Arc42 ni infrastructure |

### Module : `backend/src/validation/`

| Fichier | LOC | Schémas | Doc ? |
|---|---|---|---|
| `auth.validation.ts` | 31 | registerSchema (email + password ≥8 + confirmation refine), loginSchema | ✅ |
| `category.validation.ts` | 14 | GetTopUserCategoriesQuerySchema | ✅ |
| `conversation.validation.ts` | 57 | CreateConversationSchema (title 1-256, receiverId), ConversationIdParamSchema, UpdateConversationStatusSchema, CreateMessageSchema (1-2000), GetMessagesQuerySchema (cursor pagination), UpdateMessageParamSchema, UpdateMessageSchema | ✅ axe 3 |
| `profile.validation.ts` | 102 | changeOwnProfileSchema (avec ⚠ bug `confirmation: z.string().optional` — manque parenthèses, `optional` est passé comme la fonction au lieu d'être appelée), addSkillsProfileSchema, addProfileAvailabilitiesSchema, addRatingToUserSchema (score 0-5), updatePasswordSchema | ✅ |
| `search.validation.ts` | 17 | SearchParamsSchema (q, category, page, limit, sort), TopRatedSchema | ✅ axe 3 |

### Module : `backend/src/@types/`

| Fichier | Rôle |
|---|---|
| `express.d.ts` | Étend Request avec `userId, userRole, paramsId, cookies` ; étend Response avec `success<T>(), created<T>(), deleted()` |
| `search.types.ts` | MemberDocument, SearchParams, SearchResponse |

🟠 Les augmentations Express ne sont mentionnées nulle part dans Arc42, alors qu'elles structurent toutes les méthodes des controllers.

### Écarts détectés (backend)

1. 🔴 `realtime/socket.ts` non documenté
2. 🔴 `mappers/member.mapper.ts` non documenté
3. 🔴 `scripts/reindex-search.ts` non documenté
4. 🔴 `middlewares/response.middleware.ts` non documenté
5. 🔴 Format de réponse erreur réel `{error: string}` ≠ doc Arc42 `{success, error: {code, message, details}}`
6. 🟠 Hiérarchie d'erreurs réelle (`HttpError + 7 sous-classes`) ≠ doc (`AppError, ValidationError, AuthenticationError`)
7. 🟠 Endpoint `GET /profiles/public/:id` (teaser SEO) non mentionné Arc42 (présent uniquement openapi)
8. 🟠 Coquille export `addProfleInterests` (typo Profle)
9. 🟠 Bug latent `getMeService` : Promise non awaitée
10. 🟠 Bug `changeOwnProfileSchema` : `optional` passé en référence
11. 🟢 `seeding.dev.ts` (2249 LOC) jamais cité

---

## 3. Inventaire frontend

### Module : `frontend/src/middleware.ts` 🔴 NON DOCUMENTÉ

55 LOC. Définit `protectedRoutes = ['/recherche', '/conversation', '/mon-profil']` et `authRoutes = ['/connexion', '/inscription']`. Lit `refreshToken` cookie pour redirection : protégé sans cookie → `/connexion?redirect=...` ; auth-route avec cookie → `/recherche` (ou `redirect` query). Matcher exclut `api`, `_next`, fichiers statiques. Pivot du flow d'auth côté Next.js.

### Module : `frontend/src/app/`

| Fichier | LOC approx | Type | Notes |
|---|---|---|---|
| `layout.tsx` | 33 | RootLayout | Inter font, AuthProvider, Toaster sonner |
| `page.tsx` | 121 | Server Component (Home) | ISR `revalidate=3600`, fetch `top-rated` membres + catégories en parallèle |
| `robots.ts` | 47 | metadata | Bloque dev/staging, autorise `/`, `/profil/` en prod |
| `sitemap.ts` | 65 | metadata | URLs statiques + profils dynamiques (limit 1000) |
| `(app)/conversation/page.tsx` | 92 | Client | Suspense, `useMessaging` facade, ConversationSection + MessageThread responsive |
| `(app)/mon-profil/page.tsx` | 230 | Client | useProfile + useProfileUpdate + useSkills + useInterests + useAvailabilities + useDialogs |
| `(app)/profil/[id]/page.tsx` | 166 | Server Component | ISR teaser via `/profiles/public/:id`, `generateMetadata` (OG profile, alternates canonical), `notFound()` si null |
| `(app)/recherche/{layout,page}.tsx` | ~30 | Client | SearchPage organism |
| `(auth)/connexion/page.tsx` | 67 | Client | useSearchParams redirect, AuthForm, gestion 401 inline |
| `(auth)/inscription/page.tsx` | 66 | Client | gestion 422/409 inline |

🟠 Stratégie ISR + teaser SEO + sitemap dynamique : pas de section dédiée Arc42 (mention partielle dans devops/README.md et 07-deployment, mais pas dans 05-building-blocks/frontend ni 08-crosscutting).

### Module : `frontend/src/lib/`

| Fichier | LOC | Exports | Doc ? |
|---|---|---|---|
| `api-client.ts` | 416 | ApiClient (38 méthodes) + ApiError + `api` singleton | ✅ TypeDoc |
| `api-types.ts` | 254 | UserInfo, CurrentUser, UserVisit, AuthFormData, SearchResults, SearchParams, Member, SkillItem, UserHasSkill, UserHasInterest, AvailableSlot, UserHasAvailable, Evaluator, Evaluation, Profile, ProfileTeaser, Category, Skill, Availability, Day, TimeSlot, Message, Conversation, ConversationWithMessages, AddRatingData | ✅ TypeDoc |
| `socket-client.ts` | 104 | getSocket (singleton), disconnectSocket, types Server↔Client events | 🔴 non documenté Arc42 |
| `utils.ts` | 230 | cn, getInitialsFromUser, getInitialsFromName, calculateRating, validate, getChangedFields, isEqual, displayError, logError | ✅ TypeDoc |
| `dateTime.utils.ts` | 85 | formatMessageDate, formatConversationDate (date-fns/fr) | ✅ TypeDoc |
| `form-styles.ts` | 49 | FORM_INPUT_BASE/FOCUS/ERROR/STYLES, FORM_ERROR_TEXT, FORM_HELPER_TEXT | partiel |
| `validation/auth.validation.ts` | 48 | LoginFormSchema, RegisterFormSchema | ✅ |
| `validation/conversation.validation.ts` | 28 | AddConversationSchema, AddConversationWithMessageSchema | ✅ |
| `validation/updatePassword.validation.ts` | 25 | UpdatePasswordSchema | ✅ |
| `validation/updateProfile.validation.ts` | 119 | UpdateUserProfileSchema, UpdateDescriptionSchema, UpdatePrivateSchema, AddUserSkillSchema, AddUserInterestSchema, AddUserAvailabilitySchema | ✅ |

### Module : `frontend/src/hooks/`

#### Racine (8 hooks)

| Hook | LOC | Rôle | Doc Arc42 ? |
|---|---|---|---|
| `useAccount.ts` | 86 | handlePasswordChange, handleDeleteAccount + redirection | TypeDoc ✅, Arc42 ❌ |
| `useAutoScroll.ts` | 79 | ResizeObserver auto-scroll selon dépendance (conv ID) | TypeDoc ✅ |
| `useFormState.ts` | 199 | Form state générique avec Zod, isSubmitting, setFieldValue/Error, resetForm | TypeDoc ✅ |
| `useIsMobile.ts` | 44 | breakpoint default 768, SSR-safe | TypeDoc ✅ |
| `useMessaging.ts` | 140 | Façade composée de 6 hooks (useConversationList + useSelectedConversation + useConversationMessages + useFollowedUsers + useGlobalSocket + useConversationActions) | 🟠 doc 06-runtime/messaging.md décrit ce hook avec `useQuery`/`useMutation` TanStack Query — réalité : composition de hooks natifs |
| `useSearch.ts` | 202 | Debounce 300ms, AbortController, page reset, fetch Meilisearch via api-client | 🟠 doc 06-runtime/search.md utilise `useQuery` (n'existe pas) |
| `useSocket.ts` | 136 | Connexion socket par conversationId : emit join/leave, listeners message:new/conversation:updated/conversation:closed/error, sendMessage, closeConversation | 🔴 non documenté Arc42 |
| `useTopCategories.ts` | 46 | fetch /categories/top-rated | partiel |

#### Sous-dossier `messaging/` (7 hooks)

| Hook | LOC | Rôle | Doc ? |
|---|---|---|---|
| `useConversationList.ts` | 96 | fetch + add/update/remove + updateLastMessage + updateStatus | partiel |
| `useSelectedConversation.ts` | 65 | sync avec query param `?id=` + nettoyage URL | ❌ |
| `useConversationMessages.ts` | 164 | cursor pagination, isLoadingRef pour éviter race, addMessage idempotent (check ID) + addOptimisticMessage | ❌ |
| `useFollowedUsers.ts` | 31 | fetch /follows/following | ❌ |
| `useGlobalSocket.ts` | 95 | listeners globaux conversation:updated/closed/new | 🔴 non documenté |
| `useMessagingScroll.ts` | 112 | scroll position préservée entre pages, near-bottom heuristic, infinite scroll | ❌ |
| `useConversationActions.ts` | 185 | handlers : back, viewProfile, newConversation, addConversation (REST), sendMessage (Socket.IO + optimiste), rateUser, encloseConversation (Socket close), deleteConversation (REST) | 🔴 illustre la divergence : la doc dit "REST sendMessage", la réalité est Socket.IO |

#### Sous-dossier `profile/` (6 hooks)

| Hook | LOC | Rôle |
|---|---|---|
| `useProfile.ts` | 59 | fetch /profiles/:id |
| `useProfileUpdate.ts` | 118 | updateProfile (diff via getChangedFields), updateAvatar (upload/delete + refresh AuthProvider) |
| `useSkills.ts` | 118 | hasSkill, addSkill (limit 10), deleteSkill (optimiste) |
| `useInterests.ts` | 120 | similaire à useSkills |
| `useAvailabilities.ts` | 111 | addAvailability (no duplicate check), deleteAvailability |
| `useDialogs.ts` | 66 | 4 dialogs state machine |

### Module : `frontend/src/components/`

#### atoms/ (16 composants + barrel)

Avatar, Badge, Button, Card, Dialog, DropdownMenu, Form, Icons, Input, Label, Link, Logo, PasswordInput, Rating, Select, Separator, Textarea, Toast.
✅ documentés en Storybook (`.stories.tsx` quasi-systématiques).
🟠 Doc Arc42 5.2 annonce 18 atoms (nombre divergent : 16 réels + Form/Select non comptés ?).

#### molecules/ (9 composants + barrel)

ConfirmDialog, ConversationItem, ConversationSkeleton, EmptyState, MessageBubble, Pagination, ProfileCard, StepHowItWorks, UserDropdown.
✅ alignés avec doc.

#### organisms/ (44 fichiers .tsx hors stories)

- Niveau racine : AuthForm, Footer
- `Header/` : 6 fichiers (AccountSettingsDialog, AuthButtons, DesktopNav, index, MobileNav, SettingsPanel)
- `HomePage/` : 4 sections + index
- `ProfilePage/` : 13 fichiers incluant ProfileClient (orchestrateur teaser/full), ProfileTeaser, ProfileFull, EditPage/ (5 dialogs), ReviewsSection, SkillsSection, InterestsSection, AvailabilitySection, ProfileHeader
- `ConversationPage/` : 11 fichiers (ConversationSection, useConversationState, NewConversationDialog, NewMessageDialog, RatingDialog, MessageThread/ avec 6 sous-composants dont useThreadState)
- `SearchPage/` : 5 fichiers (CategoryFilter, SearchBar, SearchResults, SearchResultSkeleton, index)

🟠 Doc Arc42 5.2 mentionne `MobileMenu`, `LoginForm`, `RegisterForm`, `ProfileInfo`, `EditProfileModal`, `ProfileRatings`, `MemberGrid`, `SkillSelector`, `CityAutocomplete`, `ErrorBoundary`, `LoadingState` — **aucun de ces noms n'existe dans le code**. La doc liste des composants imaginaires.

#### layouts/ (1)

`MainLayout.tsx` (33 LOC) : skip-link a11y, Header + main + Footer (option `isFullHeight` masque le footer pour la messagerie).

#### providers/ (1)

`AuthProvider.tsx` (167 LOC) : context user, login/register/logout/refresh, auto-fetch /auth/me au mount, redirection silencieuse si auth-route + connecté.

### Écarts détectés (frontend)

12. 🔴 `middleware.ts` (Next.js) non documenté
13. 🔴 `lib/socket-client.ts` non documenté
14. 🔴 Hooks Socket.IO (`useSocket`, `useGlobalSocket`) absents Arc42
15. 🟠 `useMessaging.ts` documenté avec TanStack Query alors que le code utilise composition + Socket.IO
16. 🟠 `useSearch.ts` documenté avec TanStack Query (pas la réalité)
17. 🟠 Section ISR/SEO/teaser strategy absente d'Arc42 (présente uniquement dans devops/README.md)
18. 🟠 Liste de composants Arc42 5.2 inclut 11 noms inexistants (`MobileMenu`, `LoginForm`, `RegisterForm`, `ProfileInfo`, `EditProfileModal`, `ProfileRatings`, `MemberGrid`, `SkillSelector`, `CityAutocomplete`, `ErrorBoundary`, `LoadingState`)
19. 🟢 Compte d'atoms (16 vs 18 doc)

---

## 4. Inventaire devops

| Fichier | Rôle | Lignes | Doc ? |
|---|---|---|---|
| `docker-compose.dev.yml` | 5 services (backend, frontend, postgres, adminer, meilisearch, nginx) | 100 | ✅ infrastructure/services |
| `docker-compose.prod.yml` | 6 services (idem sans adminer + certbot) | 117 | ✅ 07-deployment |
| `backend/Dockerfile.dev` | node:24, hot-reload | 26 | ✅ |
| `backend/Dockerfile.prod` | multi-stage : builder (prisma generate + npm run build) + runner (dist + wait-for-postgres.sh) | 36 | ✅ |
| `frontend/Dockerfile.dev` | node:24, npm install, npm run dev | 23 | ✅ |
| `frontend/Dockerfile.prod` | 3 stages (deps, builder, runner), output standalone, user nodejs:1001 | 53 | ✅ |
| `nginx/dev.conf` | proxy frontend `/`, backend `/api/`, **WS /socket.io/**, `/avatars/` cache 1d, HMR `/_next/webpack-hmr` | 67 | ✅ infrastructure/networks |
| `nginx/prod.conf` | HTTPS Let's Encrypt + redirects 80→443, headers sécurité (HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection), gzip, /socket.io/ WS, static caching 1y | 111 | ✅ |
| `wait-for-postgres.sh` | nc -z polling | 21 | ✅ |
| `README.md` | Guide complet 320 LOC | | ✅ |

Aucun écart majeur. La couverture devops est solide.

---

## 5. Inventaire docs internes

### docs/audits/ (6 fichiers)

| Fichier | Rôle |
|---|---|
| `axe-1-stack-versions.md` | Audit versions stack (S2) |
| `axe-2-prisma-erd-database.md` | Audit ERD/DB (S2) |
| `axe-3-endpoints-http.md` | Audit endpoints + RBAC (S2 → 38 endpoints établis) |
| `axe-6-attribution-personnelle.md` | Attribution code |
| `axe-7-pre-flight.md` | Audit pre-flight final S2 |
| `doc-reality-check.md` | Audit historique daté (S1) — préservé comme témoignage |

### docs/documentation-implementation/ (publié)

#### arc42/ (12 sections)

| Section | État |
|---|---|
| 01-introduction/index.md | ✅ |
| 02-constraints/index.md | ✅ |
| 03-context/index.md | ✅ axe 3 |
| 04-solution-strategy/index.md | ✅ |
| 05-building-blocks/{index,frontend,backend,database}.md | 🟠 frontend.md = liste de composants imaginaires + TanStack Query inventé ; backend.md = endpoints incomplets, validation/ → validators/ |
| 06-runtime/{index,authentication,search,messaging,error-handling}.md | 🔴 messaging.md ne documente pas Socket.IO ; error-handling.md utilise un format de réponse fictif ; search.md utilise TanStack Query |
| 07-deployment/index.md | ✅ excellent |
| 08-crosscutting/{index,authentication,validation,error-handling,logging,security,i18n}.md | ✅ + axe 3 |
| 09-decisions/ (10 ADRs) | ✅ |
| 10-quality/{index,scenarios,testing,accessibility,monitoring}.md | ✅ |
| 11-risks/index.md | ✅ |
| 12-glossary/index.md | ✅ source canonique métriques |
| diagrams/erd.svg | ✅ généré par prisma-erd-generator |

#### api-reference/

| Fichier | LOC | État |
|---|---|---|
| `index.md` | 76 | ✅ axe 3 |
| `openapi.yaml` | 1803 | ✅ 28 paths inventoriés (incluant `/profiles/public/{id}`) |
| `swagger.md` | 3 | iframe vers openapi |
| `authentication.md` | 232 | ✅ |
| `errors.md` | 171 | 🔴 documente le format `{success, error: {code,message,details}}` qui n'existe pas |
| `testing-tools.md` | 274 | ✅ |
| `examples/{auth-flow,messaging-flow,search-flow}.md` | | ✅ axe 3 |

#### database/ (relations + enums + migrations + 11 modèles)

✅ documenté axe 2.

#### infrastructure/ (6 fichiers)

✅ services.md (558 LOC), ci-cd.md (201), networks.md, volumes.md, troubleshooting.md (309).

#### typedoc/ (10 fichiers)

🟠 exclu de mkdocs.yml (ligne 47 `exclude_docs: typedoc/`) faute de parsing — donc non publié sur le site Vercel.

### docs/documentation-strategy/ (15 fichiers)

00-plan-action-global, 01-stack à 14-planning + README. Méta-stratégie de la doc, pas du code.

### docs/endpoints/ (2)

`endpoints-api.md`, `rbac.md` — refondus axe 3.

### docs/merise/ (2)

instruction.md + schema.prisma (ancienne copie).

### docs/uml/

architecture/, deployement/, sequence/, user/ avec .puml et .png + erd.puml standalone.

### docs/devops/

devops-quickref.md + sql-demos-vitrine.sql.

### docs/soutenance/

fiches/ (07-testing-strategy.md + _template.md) + README.md.

---

## 6. Inventaire user-docs (Docusaurus)

16 pages organisées Diataxis :

- **Tutorials** (4) : getting-started, create-profile, add-skills, first-exchange
- **How-to** (6) : edit-profile, follow-members, manage-availabilities, rate-user, search-members, send-message
- **Explanation** (3) : how-it-works, trust-system, categories
- **Reference** (4) : categories-list, faq, settings, troubleshooting
- index.md

✅ alignement avec sidebars.ts. Hors-périmètre Arc42 (cible utilisateur final).

---

## 7. Synthèse des écarts détectés

### 7.1 Écarts critiques (🔴)

| # | Module | Écart | Impact |
|---|---|---|---|
| 1 | `backend/src/realtime/socket.ts` | 446 LOC de logique temps-réel **jamais décrite** dans Arc42 (ni building-blocks, ni runtime) | Critique : cœur de la messagerie en prod |
| 2 | `backend/src/mappers/member.mapper.ts` | Pivot indexation Meilisearch absent de toute la doc | Important pour expliquer l'indexation |
| 3 | `backend/src/scripts/reindex-search.ts` | Script CLI bootstrap Meilisearch non documenté | Cité dans devops/README, absent Arc42 |
| 4 | `backend/src/middlewares/response.middleware.ts` | Format succès `{success, data, count}` inconnu de la doc | Toutes les API renvoient ce format ; non documenté |
| 5 | `frontend/src/middleware.ts` | Middleware Next.js (auth gate) non documenté Arc42 | Pivot du flow d'auth côté front |
| 6 | `frontend/src/lib/socket-client.ts` + hooks `useSocket`/`useGlobalSocket` | Couche client Socket.IO absente d'Arc42 building-blocks/runtime | Symétrique de l'écart #1 |
| 7 | `06-runtime/messaging.md` | Décrit un flow REST + TanStack Query absent du code (réalité = Socket.IO + composition de hooks natifs) | Document erroné pour le composant principal de la messagerie |
| 8 | `06-runtime/error-handling.md` + `api-reference/errors.md` | Documentent un format `{success, error: {code, message, details}}` qui n'existe pas (réalité : `{error: "string"}`) | Confusion pour quiconque lit la doc avant le code |

### 7.2 Écarts importants (🟠)

| # | Module | Écart |
|---|---|---|
| 9 | `05-building-blocks/frontend.md` | Liste `useDebounce`, `useLocalStorage`, `useMediaQuery`, `usePagination` qui n'existent pas + exemples TanStack Query factices |
| 10 | `05-building-blocks/frontend.md` | Liste 11 organismes imaginaires (`MobileMenu`, `LoginForm`, `RegisterForm`, `ProfileInfo`, `EditProfileModal`, `ProfileRatings`, `MemberGrid`, `SkillSelector`, `CityAutocomplete`, `ErrorBoundary`, `LoadingState`) |
| 11 | `05-building-blocks/backend.md` | Référence dossier `validators/` (réalité : `validation/`) ; routes `/profiles/:id/skills` GET inexistantes ; endpoints comptés "31 routes" puis dans le titre "31 routes" alors que c'est 37+ |
| 12 | `06-runtime/search.md` | Hook `useSearch` documenté avec `useQuery` TanStack (réalité : useEffect + AbortController + setState natif) |
| 13 | Stratégie ISR/SEO/teaser | Présente seulement dans `devops/README.md` ; pas de section Arc42 sur ProfileTeaser/ProfileFull, sitemap.ts, robots.ts, generateMetadata |
| 14 | Endpoint `/profiles/public/:id` | Inventorié openapi mais absent des sections Arc42 building-blocks et runtime |
| 15 | Augmentations TypeScript Express (`req.userId, req.paramsId, res.success, res.created, res.deleted`) | Structurent tous les controllers, jamais mentionnées |
| 16 | Hiérarchie d'erreurs | Doc parle de `AppError, ValidationError, AuthenticationError` ; code définit `HttpError + 7 sous-classes (UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError, ConflictError, UnprocessableEntityError, FileValidationError)` |
| 17 | Section sur `getBestUsersService` | Le fallback Prisma sans pagination est documenté comme "Top rated" ; mérite mention de sa limite scalabilité |

### 7.3 Écarts mineurs (🟢)

| # | Élément | Note |
|---|---|---|
| 18 | Compte d'atoms | Doc 5.2 : "18 atoms", réalité : 16 |
| 19 | Coquille `addProfleInterests` (typo Profle) | À mentionner ou corriger |
| 20 | Bug `getMeService` Promise non awaitée | Latent, mérite une mention |
| 21 | Bug `changeOwnProfileSchema.confirmation` (`optional` non appelé) | Latent |
| 22 | `seeding.dev.ts` 2249 LOC jamais cité | Curiosité mais pas critique |
| 23 | typedoc/ exclu du build mkdocs (faute de parsing) | Présent dans le repo, pas publié |
| 24 | Nom de fichier `lib/mailisearch.ts` (typo Meilisearch) | Cosmétique |

---

## 8. Modules complètement non documentés

Les modules suivants n'apparaissent **dans aucune section de Arc42** (`grep` exhaustif `docs/documentation-implementation/`) :

1. `backend/src/realtime/` (Socket.IO server)
2. `backend/src/mappers/member.mapper.ts`
3. `backend/src/scripts/reindex-search.ts` (mention indirecte uniquement dans `infrastructure/services.md` et `infrastructure/volumes.md`)
4. `backend/src/middlewares/response.middleware.ts`
5. `backend/src/@types/express.d.ts` (augmentations TypeScript globales)
6. `backend/src/models/seeding.dev.ts`
7. `frontend/src/middleware.ts`
8. `frontend/src/lib/socket-client.ts`
9. `frontend/src/hooks/useSocket.ts`
10. `frontend/src/hooks/messaging/useGlobalSocket.ts`
11. `frontend/src/components/organisms/ProfilePage/ProfileTeaser.tsx` + `ProfileFull.tsx` + `ProfileClient.tsx` (stratégie teaser SEO)
12. `frontend/src/app/robots.ts` et `sitemap.ts` (mentionnés indirectement dans `accessibility.md` et openapi, mais pas en Arc42 5/6/8)

---

## 9. Modules documentés mais possiblement obsolètes

Sections où la doc Arc42 décrit une architecture qui a divergé du code :

1. `05-building-blocks/frontend.md` — composants imaginaires + hooks TanStack Query inventés. Une note prudente est déjà présente ("intention initiale ; refonte prévue"), mais elle ne suffit pas : la liste fait fausse route.
2. `06-runtime/messaging.md` — décrit un flow REST + TanStack Query absent du code prod (réalité = Socket.IO + composition).
3. `06-runtime/search.md` — exemple `useSearch` avec `useQuery` ne correspond pas au hook réel.
4. `06-runtime/error-handling.md` — format de réponse fictif (`{success, error: {code, message, details}}`).
5. `api-reference/errors.md` — même format fictif.
6. `05-building-blocks/backend.md` — référence `validators/` au lieu de `validation/`, endpoints partiels.

---

## 10. Recommandations priorisées pour S3

### Priorité 1 — Combler les écarts critiques (🔴 #1-#8)

**Effort estimé : 3-4 jours**

1. **Créer `06-runtime/realtime-messaging.md`** : flow Socket.IO complet (handshake JWT cookie, rooms `conversation:{id}` + `user:{userId}`, events client/server, persistance Prisma intégrée au socket).
2. **Réécrire `06-runtime/messaging.md`** pour documenter la réalité (REST = create/list/close conversations, REST = update/delete messages, Socket.IO = send messages live + closing notifications).
3. **Créer `05-building-blocks/realtime.md` (ou enrichir backend.md)** : documenter `realtime/socket.ts` + `socket-client.ts` + `useSocket`/`useGlobalSocket` côté front.
4. **Réécrire `06-runtime/error-handling.md` et `api-reference/errors.md`** : aligner sur le format réel (`{error: "string"}` pour erreur, `{success: true, data, count}` pour succès via `response.middleware.ts`).
5. **Documenter `mappers/member.mapper.ts`** dans une section dédiée à l'indexation Meilisearch (ou sous-section de `06-runtime/search.md`).
6. **Documenter `frontend/src/middleware.ts`** dans `08-crosscutting/authentication.md` (côté client).

### Priorité 2 — Aligner les sections imprécises (🟠 #9-#17)

**Effort estimé : 2 jours**

1. **Refonte `05-building-blocks/frontend.md`** : remplacer la liste de composants imaginaires par l'inventaire réel (16 atoms + 9 molecules + ~44 organismes répartis en 5 sous-familles). Retirer toute mention TanStack Query (hooks utilitaires `useDebounce`, etc., sont fictifs).
2. **Refonte `05-building-blocks/backend.md`** : corriger `validators/` → `validation/`, ajouter sections Mappers + Realtime + Scripts, lister les 38 endpoints réels (ou pointer axe 3).
3. **Créer `08-crosscutting/seo.md` ou `05-building-blocks/seo.md`** : ISR, sitemap dynamique, robots, ProfileTeaser/ProfileFull stratégie, generateMetadata.
4. **Documenter les augmentations Express** (`req.userId, res.success`, etc.) dans `08-crosscutting/index.md`.

### Priorité 3 — Mineurs (🟢 #18-#24)

**Effort estimé : 0,5 jour**

- Recompter atomes (16, pas 18).
- Mentionner le bug latent `getMeService` dans `11-risks/index.md`.
- Mentionner le fixture `seeding.dev.ts` dans `infrastructure/services.md`.
- Activer (ou retirer) la publication TypeDoc dans mkdocs.yml.

### Priorité 4 — Vérification finale

- Rejouer un `grep` exhaustif post-corrections (`grep -r 'TanStack\|useQuery\|MobileMenu\|AppError\|validators/' docs/documentation-implementation/` doit ne plus rien renvoyer).
- Vérifier que `getPublicProfile` apparaît bien dans la nouvelle section SEO.
- S'assurer que le diagramme Mermaid C4 du chapitre 5.0 mentionne Socket.IO comme protocole entre frontend et backend.

---

## Annexe : volumétrie globale

| Périmètre | Fichiers non-test | LOC |
|---|---|---|
| Backend (`src/` + `index.ts` + `config.ts`) | 45 | ~9 092 |
| Backend Prisma (schema + migrations) | 7 | ~6 291 |
| Frontend (`src/` hors stories/test) | 110 | ~12 386 |
| Frontend tests Playwright | 2 | (hors compte) |
| Frontend tests Vitest | ~6 | (hors compte) |
| DevOps (configs) | 9 | ~454 |
| Docs (`docs/documentation-implementation/`) | ~80 .md + 1 yaml | ~30 000 |
| User-docs Docusaurus | 17 .md | ~3 000 |
| **Total code applicatif** | **~155** | **~21 500 LOC** |

Lecture : la doc publiée (~30 000 lignes) est plus volumineuse que le code applicatif (~21 500 LOC). Le ratio doc/code est sain ; les écarts détectés tiennent à des dérives ponctuelles (sections rédigées avant que la couche temps-réel n'arrive, exemples TanStack Query copiés d'une intention initiale jamais réalisée), pas à un manque global de couverture.
