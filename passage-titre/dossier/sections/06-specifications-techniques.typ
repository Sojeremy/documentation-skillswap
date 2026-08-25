// =============================================================================
// Section 06 — Spécifications techniques (REAC §6)
// Volume cible : 3 pages MAX
// Périmètre : stack technique, choix architecturaux (ADRs), patterns transversaux,
// sécurité transversale (la sécurité fonctionnelle messagerie est en #ref(<sec-securite>, supplement: [section])).
// =============================================================================

= Spécifications techniques <sec-specs-tech>

La présente section couvre les choix techniques transversaux du projet —
stack, architecture, patterns et sécurité de niveau infrastructure. Les
déclinaisons fonctionnelles spécifiques à la messagerie (auth Socket,
gating métier, cloisonnement par rooms) sont traitées en #ref(<sec-realisations>, supplement: [section]).

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
  [Tests frontend], [Aucun outil de test dans le livrable (Vitest et Playwright planifiés — cf. ADR-010)], [—],
)

// Versions reconfirmées en audit S8 contre package.json (front + back) et
// docker-compose.prod.yml.

== Choix architecturaux — synthèse des ADRs <sub-adrs>

Dix décisions d'architecture ont été formalisées en ADRs (Architecture
Decision Records) pendant le projet. La décision d'adopter Socket.IO pour le
temps réel a été formalisée a posteriori dans un onzième ADR rédigé pour ce
dossier#footnote[Les dix ADRs du projet — #raw("001-nextjs.md", lang: "txt") à #raw("010-testing-strategy.md", lang: "txt") — se trouvent dans #raw("docs/documentation-implementation/arc42/09-decisions/", lang: "txt") du dépôt d'équipe (branche #raw("Documentation", lang: "txt")). Le onzième, #raw("011-socket-io.md", lang: "txt"), a été rédigé le 8 mai 2026 pour ce dossier : il formalise après coup un choix technique réellement en production depuis janvier 2026. Chaque ADR documente le contexte, les options envisagées, la décision retenue et ses conséquences.]. Synthèse :

#table(
  columns: (3em, 11em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (center, left, left),
  [*N°*], [*Sujet*], [*Décision retenue*],
  [001], [Framework frontend], [Next.js (App Router) — SSR pour le SEO des profils publics, écosystème React maîtrisé, configuration de production simple.],
  [002], [Styling frontend], [Tailwind CSS + shadcn/ui — utility-first, cohérence visuelle, composants accessibles par défaut.],
  [003], [Accès aux données], [Prisma — ORM type-safe, migrations versionnées, génération automatique du client TypeScript.],
  [004], [Gestion d'état serveur], [TanStack Query avait été envisagé (ADR-004) mais n'a finalement pas été intégré ; la gestion des données côté client s'appuie sur une composition de hooks React natifs.],
  [005], [Validation des entrées], [Zod — schémas type-safe côté serveur et côté client, volontairement dupliqués faute de package partagé ; messages d'erreur explicites via un middleware Express maison de six lignes.],
  [006], [Architecture des composants UI], [Atomic Design — atoms / molécules / organismes / pages, lisibilité accrue.],
  [007], [Authentification], [JWT + cookies httpOnly + refresh token rotatif — pas d'exposition côté client, rotation automatique à chaque refresh.],
  [008], [Recherche full-text], [Meilisearch — performance et simplicité d'API supérieures à la recherche full-text native de PostgreSQL, ressources opérationnelles maîtrisées.],
  [009], [Stratégie de bascule], [Mock → API — développement front sur mocks réalistes en début d'apothéose, puis migration progressive vers l'API réelle jusqu'au retrait complet des mocks.],
  [010], [Stratégie de tests], [Pyramide diversifiée décidée, chaque outil sur son étage : TypeScript (types), Storybook (composants UI), Vitest (hooks et utilitaires), Playwright (E2E), TypeDoc pour la documentation d'API. Hors l'étage TypeScript, acquis de fait, *aucun de ces quatre outils n'a été intégré au livrable* ; les tests effectivement écrits sont côté backend — sept specs d'intégration au Node Test Runner natif.],
  [011], [Communications temps réel], [Socket.IO — auth par cookie partagé, modèle de rooms (`user:X` + `conversation:Y`), serveur unique avec l'API REST.],
)

// Effectif corrigé en audit S10 contre le DÉPÔT D'ÉQUIPE (l'audit S8 avait
// contrôlé contre ce fork, d'où l'erreur) :
//   git ls-tree -r origin/Documentation | grep 09-decisions
//   → 001-nextjs.md … 010-testing-strategy.md + index.md = DIX ADRs.
//   011-socket-io.md est absent du dépôt d'équipe ; créé ici le 2026-05-08
//   (commit 4293b3c), donc post-soutenance.
// ADR-004 : version équipe = « TanStack Query » / statut « Accepté (2024-12) »
//   (50 lignes) ; la version « Rejeté (2026-01-22) » (128 lignes) de ce fork
//   est une réécriture post-projet. Le fait reste vrai (aucun @tanstack dans
//   frontend/package.json) mais n'était pas une décision documentée à l'époque.
// ADR-008 : statut équipe « Proposé (2025-01) », promu « Accepté » dans ce fork.
// ADR-010 : la pyramide réelle de l'ADR est TypeScript / Storybook (~25 stories)
//   / Vitest (~14 tests) / Playwright (4 tests) + TypeDoc. Le Node Test Runner
//   n'y est PAS un étage — il n'apparaît que dans l'encart « Statut
//   d'implémentation ». 7 fichiers *.spec.test.ts confirmés côté backend.

== Patterns transversaux <sub-patterns>

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

Le sens des dépendances a été vérifié mécaniquement avec
#raw("dependency-cruiser", lang: "txt") — 72 modules et 169 dépendances
analysés : aucun #emph[controller] ni
#emph[router] n'importe Prisma, et aucun service ne dépend de la couche
présentation — zéro violation. Cinq modules font néanmoins exception en
accédant au client Prisma hors de la couche service. Le nombre d'appels
#raw("prisma.<modèle>.<opération>", lang: "ts") que chacun émet mesure l'ampleur
réelle de l'écart : #raw("realtime/socket.ts", lang: "txt") — *8 requêtes*,
persistance des messages temps réel sans repasser par les services REST ;
#raw("middlewares/conv.middleware.ts", lang: "txt") — *3 requêtes*, la
vérification du lien de suivi précède le controller ;
#raw("mappers/member.mapper.ts", lang: "txt") — *1 requête*, projection vers
Meilisearch ; #raw("lib/auth.ts", lang: "txt") — *1 requête*, écriture du refresh
token à l'émission. Le cinquième,
#raw("middlewares/error.middleware.ts", lang: "txt"), en émet *zéro* : il importe
le namespace #raw("Prisma", lang: "ts") — majuscule initiale, les types générés —
et non l'instance #raw("prisma", lang: "ts") du client. La règle de dépendance le
signale au même titre que les autres, mais aucune requête ne part de ce fichier.
Ces cinq points sont la dette d'architecture identifiée du backend ; leur
cartographie est en #ref(<fig-c3-backend-donnees>).

*Atomic Design côté frontend.* Les composants sont rangés en quatre
niveaux — atoms (boutons, inputs, badges issus de shadcn/ui), molécules
(items composés réutilisables), organismes (sections de page), et pages
(routes Next.js). Le périmètre messagerie illustre cette discipline :
neuf organismes dans `ConversationPage/` composent les molécules
`MessageBubble`, `ConversationItem` et les atoms `Button` / `Input`.

Le compte mérite d'être posé, car #raw("components/", lang: "txt") contient
*cinq répertoires* alors que l'énumération ci-dessus n'annonce que quatre
niveaux — et les deux nombres sont justes.

Trois des quatre niveaux sont bien des répertoires de
#raw("components/", lang: "txt") : #raw("atoms/", lang: "txt"),
#raw("molecules/", lang: "txt") et #raw("organisms/", lang: "txt"). Le
quatrième, les *pages*, n'est pas dans
#raw("components/", lang: "txt") : il est tenu par les routes de l'App Router,
dans #raw("app/", lang: "txt"). Les deux répertoires restants,
#raw("layouts/", lang: "txt") et #raw("providers/", lang: "txt") — un fichier
chacun, #raw("MainLayout.tsx", lang: "ts") et
#raw("AuthProvider.tsx", lang: "ts") — *ne sont pas des niveaux Atomic Design* ;
ce sont des utilitaires de composition rangés au même endroit. Enfin, le niveau
#emph[templates] de la nomenclature d'origine *est absent* du projet : aucun
répertoire, aucun fichier.

Soit : 3 niveaux dans #raw("components/", lang: "txt") + 1 hors de
#raw("components/", lang: "txt") = les 4 niveaux ; et 3 niveaux + 2 répertoires
hors nomenclature = les 5 répertoires. Ces deux derniers sont portés en gris sur
la figure ci-après, précisément pour qu'on ne les compte pas comme des niveaux.

#figure(
  image("../../../docs/uml/c4/c3c-frontend-atomic.svg", height: 228mm),
  caption: [*C4 niveau 3, frontend vue 1/2 — composition de l'interface.* Chaque niveau porte son nombre de composants, barils #raw("index.ts", lang: "txt") exclus, selon la même convention de comptage que le #ref(<sec-lexique>, supplement: [lexique]). En gris, les deux répertoires de #raw("components/", lang: "txt") qui ne sont pas des niveaux Atomic Design. Couture : l'App Router et les organismes sont repris en #ref(<fig-c3-front-donnees>).],
) <fig-c3-front-atomic>

#figure(
  image("../../../docs/uml/c4/c3d-frontend-donnees.svg", height: 234mm),
  caption: [*C4 niveau 3, frontend vue 2/2 — garde de routes et chemins de données.* Les deux chemins d'accès à l'API établis au niveau conteneurs : le code client passe par Nginx en HTTPS, le conteneur frontend appelle le backend directement sur le réseau Docker interne pour le rendu serveur ISR.],
) <fig-c3-front-donnees>

*Type-safety end-to-end.* Les types TypeScript se propagent de la base
de données (générés par Prisma) jusqu'à l'UI (consommés par les hooks
React). La validation des entrées s'appuie sur Zod des deux côtés, mais
les schémas ne sont *pas* mutualisés : cinq schémas serveur
(#raw("backend/src/validation/", lang: "txt")) et quatre schémas client
(#raw("frontend/src/lib/validation/", lang: "txt")) coexistent en
duplication assumée. Extraire un package partagé imposait un build
TypeScript commun et une publication interne, effort écarté avant la
soutenance ; la cohérence contractuelle repose donc sur une discipline de
relecture, et constitue la dette technique la plus visible du projet.

== Sécurité transversale <sub-secu-transverse>

Cinq mécanismes de sécurité couvrent les routes et les échanges, à des
degrés que le tableau ci-dessous précise, complétés par les contrôles
spécifiques à la messagerie détaillés en #ref(<sec-realisations>, supplement: [section]).

#table(
  columns: (12em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Domaine*], [*Mesure et implémentation*],
  [Hashing mots de passe], [#raw("argon2", lang: "ts") (paramètres par défaut de la lib `argon2` Node) appliqué dans #raw("auth.service.ts:21", lang: "ts") avant insertion en base. Pas de hashage côté client.],
  [Sessions], [JWT signés (#raw("jsonwebtoken", lang: "ts")) en cookies #raw("httpOnly + secure + sameSite='strict'", lang: "ts") en production (#raw("auth.controller.ts:63-94", lang: "ts")). Refresh token rotatif renouvelé à chaque appel #raw("/api/v1/auth/refresh", lang: "txt") (#raw("auth.service.ts:103-108", lang: "ts")), invalidation de l'ancien.],
  [Validation des entrées], [Schémas Zod appliqués par middleware déclaratif sur 18 des 37 routes applicatives (#raw("body", lang: "txt"), #raw("query", lang: "txt"), #raw("params", lang: "txt")) — register, login, profil, conversations, recherche, catégories. Les routeurs #raw("follow", lang: "txt"), #raw("skill", lang: "txt") et #raw("availability", lang: "txt") n'ont pas de schéma : #raw("follow", lang: "txt") ne valide que des identifiants numériques, convertis par #raw("parseNumericParams", lang: "ts") (#raw("auth.middleware.ts:38-45", lang: "ts")), tandis que #raw("skill", lang: "txt") et #raw("availability", lang: "txt") n'exposent qu'une lecture sans paramètre — écart assumé. En cas d'échec, #raw("parseAsync", lang: "ts") lève et le gestionnaire d'erreurs répond #raw("422 Unprocessable Entity", lang: "txt") avec la liste des messages de validation (#raw("error.middleware.ts:32-33", lang: "ts")).],
  [Transport], [HTTPS forcé en production via Nginx + certificats Let's Encrypt renouvelés automatiquement. Redirection HTTP → HTTPS systématique.],
  [CORS], [Une origine autorisée, configurée par variable d'environnement, appliquée à Express (#raw("app.ts:12-17", lang: "ts")) comme au handshake Socket.IO (#raw("socket.ts:81-82", lang: "ts")) ; rejet des requêtes hors-domaine. En production, le serveur refuse de démarrer si #raw("ALLOWED_ORIGIN", lang: "txt") est absente (#raw("config.ts:29-38", lang: "ts")).],
)

// Lignes de référence reconfirmées en audit S10 (dépôt d'équipe) :
// - argon2 : auth.service.ts:21 (hashage avant insertion). Second point de
//   hachage non cité : profile.service.ts:464 (changement de mot de passe).
// - cookies : auth.controller.ts:63-94 (helpers setTokenInCookie 63-81 +
//   setRefreshTokenInCookie 83-94) ; secure/sameSite conditionnés à isProduction.
// - rotation : auth.service.ts:103-108 (deleteMany + new generateRefreshToken)
// - CORS : app.ts:12-17 (origin: config.allowedOrigin, credentials: true) +
//   socket.ts:81-82 (même origine sur le handshake). config.ts:5 lit
//   ALLOWED_ORIGIN ; config.ts:29-38 (getEnv) throw si absente hors dev.
// - HTTPS : devops/nginx/prod.conf:16-29 (redirection 80→443, exception
//   /.well-known/acme-challenge/) ; HSTS ligne 49 ; X-Frame-Options l46,
//   X-Content-Type-Options l47, X-XSS-Protection l48 ; certbot renew en boucle
//   12 h dans devops/docker-compose.prod.yml:104-110.
// - Dettes confirmées : 0 occurrence helmet dans backend/src ; 0 limit_req dans
//   devops/nginx ; 0 Content-Security-Policy (Express ET Nginx) ; 0 axe-core.

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
