// =============================================================================
// Section 06 — Spécifications techniques (REAC §6)
// Volume cible : 3 pages MAX
// Périmètre : stack technique, choix architecturaux (ADRs), patterns transversaux,
// sécurité transversale (la sécurité fonctionnelle messagerie est en section 8).
// =============================================================================

= Spécifications techniques

La présente section couvre les choix techniques transversaux du projet —
stack, architecture, patterns et sécurité de niveau infrastructure. Les
déclinaisons fonctionnelles spécifiques à la messagerie (auth Socket,
gating métier, cloisonnement par rooms) sont traitées en section 8.

== Stack technique

Le projet adopte une stack *TypeScript de bout en bout*, de la base de
données au navigateur, ce qui réduit la surface d'erreurs d'intégration
et autorise une seule boîte à outils mentale pour toute l'équipe.

#table(
  columns: (10em, 1fr, 6em),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, center),
  [*Composant*], [*Technologie*], [*Version*],
  [Frontend], [Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui], [16.1.1],
  [Backend API], [Express + TypeScript + Zod], [5.2.1],
  [ORM], [Prisma Client], [7.2.0],
  [Base de données], [PostgreSQL], [16],
  [Recherche full-text], [Meilisearch], [server 1.6 / client 0.55.0],
  [Temps réel], [Socket.IO (intégré au serveur HTTP Express)], [4.8.3],
  [Infrastructure], [Docker Compose + Nginx (reverse proxy + TLS)], [—],
  [Tests backend], [Node Test Runner natif (sans framework tiers)], [—],
  [Tests frontend], [Vitest (unitaire) + Playwright (E2E)], [—],
)

// Versions reconfirmées en audit S8 contre package.json (front + back) et
// docker-compose.prod.yml.

== Choix architecturaux — synthèse des ADRs

Onze décisions architecturales ont été formalisées en ADRs (Architecture
Decision Records) dans la documentation Arc42#footnote[#raw("docs/documentation-implementation/arc42/09-decisions/", lang: "txt") — onze fichiers numérotés `001-` à `011-`. Chaque ADR documente le contexte, les options envisagées, la décision retenue et ses conséquences.]. Synthèse :

#table(
  columns: (3em, 11em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (center, left, left),
  [*N°*], [*Sujet*], [*Décision retenue*],
  [001], [Framework frontend], [Next.js (App Router) — SSR pour le SEO des profils publics, écosystème React maîtrisé, configuration de production simple.],
  [002], [Styling frontend], [Tailwind CSS + shadcn/ui — utility-first, cohérence visuelle, composants accessibles par défaut.],
  [003], [Accès aux données], [Prisma — ORM type-safe, migrations versionnées, génération automatique du client TypeScript.],
  [004], [Gestion d'état serveur], [*TanStack Query rejeté* — composition de hooks React natifs préférée pour le contrôle fin du cycle de vie des sockets.],
  [005], [Validation des entrées], [Zod — schémas type-safe partagés front/back, messages d'erreur explicites, intégration native Express.],
  [006], [Architecture des composants UI], [Atomic Design — atoms / molécules / organismes / pages, lisibilité accrue, Storybook public.],
  [007], [Authentification], [JWT + cookies httpOnly + refresh token rotatif — pas d'exposition côté client, rotation automatique à chaque refresh.],
  [008], [Recherche full-text], [Meilisearch — performance et simplicité d'API supérieures à `pg_trgm` natif PostgreSQL, ressources opérationnelles maîtrisées.],
  [009], [Stratégie de bascule], [Mock → API — développement front sur mocks réalistes en début d'apothéose, migration progressive vers l'API réelle au sprint 2.],
  [010], [Stratégie de tests], [Pyramide condensée : unitaires (Vitest) sur la validation et les utilitaires, intégration (Node Test Runner) sur les routes REST et les events Socket.IO, E2E (Playwright) sur les parcours critiques.],
  [011], [Communications temps réel], [Socket.IO — auth par cookie partagé, modèle de rooms (`user:X` + `conversation:Y`), serveur unique avec l'API REST.],
)

// Effectif et titres des 11 ADRs reconfirmés en audit S8 contre les fichiers
// 001-nextjs.md → 011-socket-io.md. Aucun ADR manquant ni en surnombre.

== Patterns transversaux

Le code est structuré selon trois patterns récurrents qui assurent
homogénéité et testabilité.

*Backend en couches.* Chaque domaine fonctionnel est décliné dans la
même séquence : un *router* expose les endpoints, des *middlewares*
appliquent l'authentification (`checkAuth`) et les règles métier
(`requireSimpleFollow`, `isOwner`, `parseNumericParams`), un *controller*
traduit la requête HTTP en appel de service, le *service* contient la
logique métier et appelle Prisma. Cette régularité permet de localiser
n'importe quelle fonctionnalité backend par convention plutôt que par
documentation.

*Atomic Design côté frontend.* Les composants sont rangés en quatre
niveaux — atoms (boutons, inputs, badges issus de shadcn/ui), molécules
(items composés réutilisables), organismes (sections de page), et pages
(routes Next.js). Le périmètre messagerie illustre cette discipline :
neuf organismes dans `ConversationPage/` composent les molécules
`MessageBubble`, `ConversationItem` et les atoms `Button` / `Input`.

*Type-safety end-to-end.* Les types TypeScript se propagent de la base
de données (générés par Prisma) jusqu'à l'UI (consommés par les hooks
React). Les schémas Zod, partagés entre la validation serveur et la
validation des formulaires côté client (#raw("frontend/src/lib/validation/", lang: "txt")),
garantissent une cohérence contractuelle sans duplication de logique.

== Sécurité transversale

Cinq mécanismes de sécurité couvrent l'ensemble des routes et des
échanges, complétés par les contrôles spécifiques à la messagerie
détaillés en section 8.

#table(
  columns: (12em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Domaine*], [*Mesure et implémentation*],
  [Hashing mots de passe], [#raw("argon2", lang: "ts") (paramètres par défaut de la lib `argon2` Node) appliqué dans #raw("auth.service.ts:21", lang: "ts") avant insertion en base. Pas de hashage côté client.],
  [Sessions], [JWT signés (#raw("jsonwebtoken", lang: "ts")) en cookies #raw("httpOnly + secure + sameSite='strict'", lang: "ts") en production (#raw("auth.controller.ts:68-94", lang: "ts")). Refresh token rotatif renouvelé à chaque appel #raw("/api/v1/auth/refresh", lang: "txt") (#raw("auth.service.ts:103-108", lang: "ts")), invalidation de l'ancien.],
  [Validation des entrées], [Schémas Zod sur l'intégralité des payloads REST (body, query, params) — register, login, profil, conversations, recherche. Erreur 400 explicite avec champ et message en cas d'écart.],
  [Transport], [HTTPS forcé en production via Nginx + certificats Let's Encrypt renouvelés automatiquement. Redirection HTTP → HTTPS systématique.],
  [CORS], [Liste blanche d'origines configurée côté Express (#raw("app.ts", lang: "ts")), rejet des requêtes hors-domaine.],
)

// Lignes de référence reconfirmées en audit S8 :
// - argon2 : auth.service.ts:21 (hashage avant insertion)
// - cookies : auth.controller.ts:63-94 (helpers setTokenInCookie + setRefreshTokenInCookie)
// - rotation : auth.service.ts:103-108 (deleteMany + new generateRefreshToken)
// - CORS : app.ts:12-17 (origin: config.allowedOrigin, credentials: true)
// - HTTPS : devops/nginx/prod.conf:18-29 (redirection 80→443) + HSTS l51

Quatre zones de fragilité sont assumées et reportées en V2 : *Helmet
installé mais non monté côté Express* (la dépendance #raw("helmet@8.1.0", lang: "txt")
est présente dans #raw("backend/package.json", lang: "txt") mais n'est jamais
appliquée — les en-têtes de sécurité courants #raw("X-Frame-Options", lang: "txt"),
#raw("X-Content-Type-Options", lang: "txt"), #raw("X-XSS-Protection", lang: "txt") et
HSTS sont néanmoins posés par Nginx en façade en production, ce qui
couvre l'essentiel) ; *Content Security Policy stricte absente* (ni
côté Express, ni côté Nginx) ; *audit accessibilité formel non réalisé*
(RGAA 4.1 / WCAG 2.1 AA visés mais non mesurés via `axe-core` ou
Lighthouse) ; *rate-limiting absent* (aucune protection applicative
contre l'abus en volume — ni #raw("express-rate-limit", lang: "txt"), ni
limit côté Nginx). Ces dettes ne remettent pas en cause la stabilité
observée en production mais constituent les premiers chantiers de
durcissement à programmer.
