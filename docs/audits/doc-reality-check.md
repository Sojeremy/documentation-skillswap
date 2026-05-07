# Audit Doc vs Code — SkillSwap

> Date : 2026-05-06
> Branche : main
> Commit : f7ea97cc6d315e3133b6cd6db03d7ee783eb3225

## Résumé exécutif

- **Écarts critiques** : 4
- **Écarts importants** : 9
- **Écarts mineurs** : 6
- **Sections OK** : 1 / 11

### Top 3 actions prioritaires

1. **Réécrire `arc42/08-crosscutting/security.md`** : Helmet et `express-rate-limit` sont annoncés mais absents du runtime (`backend/src/app.ts` n'importe ni l'un ni l'autre, et `express-rate-limit` n'est pas dans les dépendances). Tant que la doc affirme ces protections, l'oral CDA est exposé à une question fatale sur OWASP. Soit installer + monter ces middlewares, soit rectifier la doc en disant ce qui est réellement en place.
2. **Mettre à jour les versions et stats dans la doc Arc42** : Next.js doc 14 vs code 16.1.1, Node doc 20 vs Dockerfiles `node:24`, hash bcrypt doc vs argon2 code, 31 endpoints doc vs 37 réels, 57 composants doc vs 68 réels, enums Prisma doc (`Role`, `SkillLevel`, `ConversationStatus`, `ParticipantRole`) inexistants en base (le code a `RoleOfUser`, `StatusOfConversation`, `Time`, `dayInAWeek`).
3. **Ajouter le RGAA explicitement dans `arc42/10-quality/accessibility.md` et préciser l'outillage réel** : aucune mention de « RGAA » dans le repo entier (grep négatif sur `docs/ frontend/ backend/ devops/`), alors que c'est exigé par le REAC CDA. Préciser que l'a11y repose sur Radix UI + règles `jsx-a11y` héritées de `eslint-config-next` + `@storybook/addon-a11y`, et reconnaître l'absence d'audit Lighthouse / axe-core / jest-axe.

### Verdict global sur la fiabilité de la doc

La doc Arc42 décrit l'**intention initiale** du projet plus que son **état actuel** : versions périmées, mesures de sécurité annoncées non implémentées, schéma Prisma désaligné sur les noms d'enums et les modèles `Available` / `UserHasAvailable`. Plusieurs sections à fort impact CDA (sécurité, tests, RGAA) sont en écart important ou critique avec le code de production. La doc reste utilisable comme **point de départ structurel**, mais doit être resynchronisée avant la rédaction du dossier — sous peine de questions piégeuses au jury.

---

## Détail par section

### 1. Stratégie de tests

- **Doc dit** :
  - `docs/documentation-implementation/arc42/10-quality/testing.md:5-19` annonce une pyramide Vitest unitaire (~70 %) / Supertest intégration (~20 %) / Playwright E2E (~10 %).
  - Mêmes lignes 25-30 cibles : services backend > 80 %, hooks frontend > 70 %, composants UI > 60 %, E2E « 100 % des flows ».
  - Exemple de test ligne 39-50 utilise `bcrypt`.
  - `docs/documentation-implementation/arc42/09-decisions/010-testing-strategy.md:23-50` redéfinit la pyramide : Playwright (« 4 tests »), Vitest hooks/lib (« ~14 tests »), Storybook (« ~25 stories »), aucun test composant Vitest. ADR daté 2025-01.
- **Code montre** :
  - Frontend Vitest : 5 fichiers `*.test.ts` au total → `frontend/src/lib/dateTime.utils.test.ts`, `frontend/src/lib/utils.test.ts`, `frontend/src/lib/validation/auth.validation.test.ts`, `frontend/src/lib/validation/updatePassword.validation.test.ts`, `frontend/src/lib/validation/updateProfile.validation.test.ts`. Aucun test sur les hooks (`frontend/src/hooks/`). Aucun test sur les composants (cohérent avec ADR 010).
  - Frontend Playwright : 2 spec → `frontend/e2e/auth.spec.ts`, `frontend/e2e/search.spec.ts` (la doc en annonce 4).
  - Backend : 7 fichiers `*.spec.test.ts` (`backend/src/controllers/*.spec.test.ts` × 6 + `backend/src/realtime/socket.spec.test.ts`), 0 fichier `*.unit.test.ts` alors que `backend/package.json:scripts.test:unit` cible ce pattern → script vide.
  - Backend utilise `node --test` natif (`backend/package.json:scripts.test:unit`, `test:spec`), pas Vitest. Pas de Supertest dans `backend/package.json` (la doc l'annonce ligne 53).
  - Tests backend importent `argon2` (`backend/src/controllers/auth.controller.spec.test.ts`), pas `bcrypt`.
  - **Coverage non mesurée** : `node_modules/` absent côté frontend ET backend (`ls frontend/node_modules → No such file or directory`). `vitest run --coverage` échoue avec `sh: 1: vitest: not found`. Tentative `node --test --experimental-test-coverage ./src/controllers/auth.controller.spec.test.ts` (Node v24.11.0) → échec `ERR_MODULE_NOT_FOUND: Cannot find package 'argon2'` (logique : sans `npm install`, ni Vitest ni les deps backend ne sont disponibles).
- **Écart** : Important
- **Impact CDA** : CP « Préparer et exécuter les plans de tests d'une application » (CP10 RNCP CDA). Le jury attend des chiffres de couverture précis ; sans `npm install` impossible à mesurer aujourd'hui. La doc cite Supertest et bcrypt qui n'existent pas dans le code → questions piégeuses garanties.
- **Recommandation** : Fixer la doc + Discuter avec Carl du périmètre. (a) Remplacer Supertest par « `node --test` natif » dans `arc42/10-quality/testing.md`. (b) Remplacer `bcrypt` par `argon2` dans l'exemple. (c) Aligner ADR 010 (« 4 tests Playwright ») avec la réalité (2 tests). (d) Avant la soutenance, exécuter `npm install` puis `npm run test:coverage` côté frontend et `node --test --experimental-test-coverage ./src/**/*.spec.test.ts` côté backend pour avoir des chiffres de couverture à citer au jury (zones critiques sans test : tous les `services/`, hooks frontend, services métier non-controllers).

### 2. Mesures de sécurité

- **Doc dit** : `docs/documentation-implementation/arc42/08-crosscutting/security.md:5-13` liste comme implémentés : Helmet (config détaillée lignes 18-34), CORS avec methods + allowedHeaders (lignes 41-48), express-rate-limit 100 req/15min (lignes 54-63), bcrypt 10 rounds (ligne 7), JWT httpOnly (ligne 8), Validation Zod (ligne 9). `arc42/08-crosscutting/authentication.md:46-52` : accessToken 15 min, refreshToken 7 jours, payload `{ sub, email, role, iat, exp }`, middleware nommé `authMiddleware`.
- **Code montre** :
  - **Helmet absent du runtime** : `grep -rn "helmet" backend/src` → 0 résultat. Le paquet `helmet ^8.1.0` est déclaré dans `backend/package.json` mais jamais importé. `backend/src/app.ts:10-34` ne contient aucun `app.use(helmet(...))`.
  - **express-rate-limit absent** : ni dans `backend/package.json` ni dans le code (`grep -rn "rateLimit\|express-rate-limit"` → 0 résultat).
  - **CORS minimal** : `backend/src/app.ts:12-17` configure uniquement `origin` + `credentials: true`. Pas de `methods`, pas de `allowedHeaders`.
  - **Hash : argon2, pas bcrypt** : `backend/src/services/auth.service.ts:1` importe `argon2`, ligne 21 `argon2.hash(data.password)` (paramètres par défaut, pas de tuning explicite memoryCost/timeCost).
  - **JWT httpOnly + sameSite + secure** : `backend/src/controllers/auth.controller.ts:69-73,89-93` ✅. Refresh token rotation effective : `backend/src/services/auth.service.ts:103-108` supprime tous les refresh tokens de l'utilisateur avant d'en générer un nouveau.
  - **Durées** : refresh token = 30 jours (`backend/src/lib/auth.ts:27`), pas 7 jours. Access token = `config.token_expire` (lecture env, valeur par défaut indéfinie sans inspection runtime).
  - **Payload JWT** : `{ userId, userRole }` (`backend/src/lib/auth.ts:11-14`), pas `{ sub, email, role, iat, exp }`.
  - **Middleware** : nommé `checkAuth` (`backend/src/middlewares/auth.middleware.ts:15-26`), pas `authMiddleware`.
  - **Validation Zod** : 5 schémas dans `backend/src/validation/`, 21 appels `validate(...)` dans les routers. Routers SANS validation Zod : `skill.router.ts`, `availability.router.ts`, `follow.router.ts` (0 appel chacun).
  - **Ownership check** : middleware `isOwner` (`backend/src/middlewares/auth.middleware.ts:28-36`) utilisé seulement sur 2 routes (`backend/src/routers/profile.router.ts:20,83`). Pour les autres ressources owned (skills, follows, availabilities, conversations…), la vérification est faite ad hoc dans les services ou non faite.
- **Écart** : **Critique**
- **Impact CDA** : CP « Mettre en œuvre la sécurité d'une application » (CP12) + bloc OWASP Top 10. Helmet absent = pas de CSP, pas de HSTS, pas de X-Frame-Options ; rate limit absent = pas de protection brute force / DDoS. Deux questions OWASP suffiraient à mettre en défaut le candidat si la doc affirme ces mesures.
- **Recommandation** : **Fixer le code en priorité** (ajouter `app.use(helmet())` et `app.use('/api/v1', rateLimit({windowMs: 15*60*1000, max: 100}))` dans `backend/src/app.ts`, installer `express-rate-limit`). Ensuite **fixer la doc** : remplacer bcrypt par argon2, mettre à jour les durées de tokens, renommer le middleware, signaler clairement les routes sans Zod (skill / availability / follow). À discuter avec Carl pour décider de l'effort « ajouter Helmet + rate-limit » vs « rectifier la doc » avant la soutenance.

### 3. CI/CD complet

- **Doc dit** : `docs/documentation-implementation/arc42/07-deployment/index.md:132-149` mentionne `npm run dev`, `docker-compose up -d`, `npm run build`. `DEPLOYMENT.md:65-66` à la racine : « Le workflow se déclenche automatiquement sur push vers `main` ». La sidebar Arc42 et `docs/documentation-strategy/` impliquent un pipeline CI/CD complet avec déploiement.
- **Code montre** :
  - Un seul fichier dans `.github/workflows/` : `deploy-docs.yml`. Trois jobs : `deploy-mkdocs`, `deploy-docusaurus`, `deploy-storybook` (`.github/workflows/deploy-docs.yml:13-117`).
  - Trigger : `workflow_dispatch` uniquement (`.github/workflows/deploy-docs.yml:3-4`). **Aucun déclencheur push/PR**, contredisant `DEPLOYMENT.md:65-66`.
  - **Aucun workflow CI** sur PR pour lint/test/build de l'application (frontend ou backend). Aucun workflow Prisma migrate validate. Aucun workflow de déploiement de l'application en production (seules les docs sont déployées automatiquement).
  - Husky : un seul hook `pre-commit` (`.husky/pre-commit:1-22`) qui exécute `npm run lint` à la racine + `frontend/` + `backend/` + `npm run format` racine. Aucun test joué en pre-commit, aucune vérification TypeScript (`tsc --noEmit`).
- **Écart** : Important
- **Impact CDA** : CP « Préparer et documenter le déploiement d'une application » (CP11) et notion de « pipeline d'intégration continue ». Le jury va demander « comment vous validez les PR ? Comment vous garantissez qu'une régression ne passe pas ? » → sans CI sur PR, la réponse est qu'on ne garantit rien à part le lint en pre-commit. À assumer et expliquer comme un choix d'équipe ou un manque à corriger.
- **Recommandation** : Fixer la doc (`DEPLOYMENT.md` ligne 65-66 : retirer la mention « automatique sur push », c'est faux) + **À discuter avec Carl** pour décider si on ajoute un workflow CI minimal `ci.yml` (`on: pull_request → npm ci → npm run lint → npm run test:run`) avant la soutenance, ce qui transforme une faiblesse en CP démontrée.

### 4. Stats projet (vérification numérique + versions)

- **Doc dit** :
  - Composants React : « 57 » (sidebar), « 53 composants React » dans `arc42/09-decisions/010-testing-strategy.md:9`.
  - Hooks personnalisés : « 10 » (sidebar), idem ADR 010 ligne 49.
  - Endpoints Express : « 31 » (sidebar).
  - Modèles Prisma : « 14 » (`arc42/05-building-blocks/database.md:3`).
  - Enums Prisma : « 4 » (sidebar).
  - Versions : Next.js 14 (`arc42/09-decisions/001-nextjs.md:13`, `arc42/05-building-blocks/index.md:16,37`, `arc42/02-constraints/index.md:73`, `arc42/04-solution-strategy/index.md:9`, `arc42/12-glossary/index.md:24`, `documentation-implementation/index.md:22`). Node.js 20 (`arc42/02-constraints/index.md:10`, `arc42/05-building-blocks/index.md:38`). React 19 (`arc42/05-building-blocks/index.md:37`).
  - Doc infrastructure mentionne `node:24` (`docs/documentation-implementation/infrastructure/index.md:49,68,77`) — contradiction interne avec Node 20.
- **Code montre** (commande / résultat) :
  - Composants React : `find frontend/src/components -name "*.tsx" | grep -v ".stories.\|.test." | wc -l` → **68** (atoms 18, molecules 9, organisms 39, layouts 1, providers 1).
  - Hooks : `find frontend/src/hooks -name "use*.ts" | wc -l` → **21** (8 root + 7 dans `messaging/` + 6 dans `profile/`).
  - Endpoints Express : décompte manuel par routeur → **37** (auth 5, profile 14, conv 9, follow 4, category 1, skill 1, availability 1, search 2). Plus le `/api/v1/health` dans `backend/src/app.ts:28-30` non monté via routeur.
  - Modèles Prisma : `grep -c "^model " backend/prisma/schema.prisma` → **14** ✅.
  - Enums Prisma : `grep -c "^enum " backend/prisma/schema.prisma` → **4** ✅.
  - Versions (lecture `frontend/package.json`, `backend/package.json`, `node --version`) :
    - Next.js : `next: 16.1.1` (code) vs **14** (doc). Écart majeur de 2 majeures.
    - React : `19.2.3` (code) vs **19** (doc) ✅.
    - Express : `^5.2.1` (code), pas de version explicite côté doc.
    - Prisma : `^7.2.0` + `@prisma/client ^7.2.0` (code), pas de version dans `arc42/09-decisions/003-prisma.md`.
    - Node : runtime exécutant `v24.11.0` (`node --version`) ; Dockerfiles `devops/{frontend,backend}/Dockerfile.{dev,prod}` tous en `FROM node:24` ; doc Arc42 contraintes ligne 10 et building-blocks ligne 38 disent **Node 20**.
    - Tailwind : `^4.1.18` (code), `arc42/09-decisions/002-tailwind.md` ne précise pas la version.
    - Zod : `^4.3.5` front + back, `arc42/09-decisions/005-zod.md` ne précise pas.
    - argon2 : `^0.44.0` (code), bcrypt cité dans la doc (cf section 2).
- **Écart** : Important
- **Impact CDA** : Toutes les CP de conception (CP1 à CP4) — le candidat doit savoir compter sa BDD, ses endpoints et ses composants à la virgule près. Le décalage Next.js 14 → 16 et Node 20 → 24 sont des questions de filtrage très probables.
- **Recommandation** : Fixer la doc — synchroniser les chiffres et versions sur la sidebar Arc42, dans `index.md` racine `documentation-implementation`, dans les ADR 001 / building-blocks. Trois points de vérité (sidebar / index.md / ADR / constraints) à aligner. Pour les endpoints, mettre à jour `arc42/05-building-blocks/backend.md` et le compteur en sidebar (37 ou 38 avec `/health`).

### 5. ADR 009 Mock-to-API

- **Doc dit** : `docs/documentation-implementation/arc42/09-decisions/009-mock-to-api.md:51-53` : « État actuel : tous les mocks ont été remplacés par l'API réelle. » Structure prévue ligne 39-49 mentionnait `frontend/src/lib/mock-data/{mockUser,mockProfile,mockCategories,mockMembers,mockConversation}.ts`.
- **Code montre** :
  - `find frontend -type d \( -name "mocks" -o -name "msw" -o -name "fixtures" -o -name "__mocks__" \)` → 0 résultat dans le code applicatif.
  - `frontend/src/lib/mock-data/` n'existe pas.
  - `msw` absent de `frontend/package.json`.
  - Une référence stale : `frontend/src/components/organisms/HomePage/CategoriesSection.tsx:54` contient un commentaire « Fallback sur les données mockées si l'API n'est pas disponible » mais le code (`setCategories([])`) ne charge plus aucune donnée mockée → commentaire à nettoyer mais aucun mock effectif.
  - `vitest.config.ts:16` exclut explicitement `'src/lib/mock-data/**'` du coverage — directive devenue inutile, le dossier n'existe plus.
- **Écart** : Mineur (commentaire et règle de coverage périmés, pas de mocks réels)
- **Impact CDA** : CP « Réaliser une migration / refonte » — l'ADR est cohérent avec la réalité, c'est un point fort à mettre en avant à l'oral.
- **Recommandation** : OK as-is sur le fond. Nettoyage cosmétique : supprimer le commentaire de `CategoriesSection.tsx:54` et l'exclusion `src/lib/mock-data/**` de `vitest.config.ts:16`.

### 6. RGAA / Accessibilité

- **Doc dit** : `docs/documentation-implementation/arc42/10-quality/accessibility.md:1-89` parle uniquement de « WCAG 2.1 AA ». Outils annoncés ligne 67-72 : Lighthouse, axe-core, eslint-plugin-jsx-a11y, NVDA / VoiceOver. Aucune mention de RGAA dans le fichier.
- **Code montre** :
  - `grep -ri "rgaa" docs/ frontend/ backend/ devops/ --include="*.md" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.mjs"` → **0 résultat** dans tout le repo.
  - Dépendances a11y dans `frontend/package.json` : seul `@storybook/addon-a11y ^10.2.0` est présent.
  - **Absent de `frontend/package.json`** : `eslint-plugin-jsx-a11y` (en direct), `axe-core`, `@axe-core/react`, `@axe-core/playwright`, `jest-axe`, `@lhci/cli`, `lighthouse`.
  - `eslint-plugin-jsx-a11y` est tiré transitive­ment via `eslint-config-next/core-web-vitals` (`frontend/eslint.config.mjs:4`) qui active un sous-ensemble de règles a11y au lint.
  - Aucun test d'accessibilité automatisé (pas de spec Playwright + axe, pas de spec Vitest + jest-axe). Aucun script Lighthouse dans `frontend/package.json`.
  - Composants reposent sur Radix UI (`@radix-ui/react-dialog`, `react-dropdown-menu`, `react-label`, `react-select`, `react-slot`) qui apportent de l'a11y native.
- **Écart** : **Critique**
- **Impact CDA** : Le RGAA est explicitement attendu par le REAC CDA (compétence accessibilité). Doc qui parle uniquement de WCAG 2.1 AA + zéro mention RGAA = échec direct sur la CP correspondante si le jury creuse.
- **Recommandation** : Fixer la doc — réécrire `accessibility.md` pour (a) introduire RGAA explicitement, (b) reconnaître l'outillage réel (Radix UI + jsx-a11y via Next + addon-a11y Storybook), (c) retirer Lighthouse / axe-core / NVDA des « outils » s'ils ne sont pas utilisés (ou les ajouter pour de vrai en lançant `npx @axe-core/cli` une fois pour avoir un rapport à montrer). À discuter avec Carl si on doit installer un outil avant la soutenance ou si la justification « Radix + jsx-a11y suffit pour le MVP » tient.

### 7. Internationalisation (i18n)

- **Doc dit** : `docs/documentation-implementation/arc42/08-crosscutting/i18n.md:4-8` : « Français uniquement (MVP) ». Évolution V2 prévue avec i18next (lignes 24-39).
- **Code montre** :
  - `frontend/package.json` : aucune occurrence de `next-intl`, `react-i18next`, `i18next`, `next-i18next`, `@formatjs`, `formatjs`.
  - `grep -rn "useTranslation\|<Trans" frontend/src` → 0 résultat.
  - Aucun dossier `messages/`, `locales/`, `i18n/`, `translations/` dans `frontend/`.
  - Messages d'erreur en français en dur (cf. `backend/src/validation/auth.validation.ts`).
- **Écart** : None
- **Impact CDA** : Aucun risque, la cohérence doc/code est totale et l'absence d'i18n est documentée et justifiée comme choix MVP.
- **Recommandation** : OK as-is.

### 8. Endpoints API documentés vs implémentés

- **Doc dit** :
  - `docs/documentation-implementation/api-reference/openapi.yaml` : 1803 lignes, 28 paths, **37 opérations** au total (`grep -c "^    (get|post|put|patch|delete):"` → 37).
  - `docs/endpoints/endpoints-api.md` également présent (non comparé en détail, hors scope).
- **Code montre** : 37 routes Express (cf. section 4 pour le détail).
- **Comparaison ligne à ligne** :
  - **Présents en code, absents de l'OpenAPI** :
    - `GET /skills/` (`backend/src/routers/skill.router.ts:7`) — racine `/skills` totalement absente de `openapi.yaml`. Seules `/profiles/skills*` y figurent.
    - `GET /availabilities/` (`backend/src/routers/availability.router.ts:7`) — racine `/availabilities` absente.
    - `GET /api/v1/health` (`backend/src/app.ts:28-30`) — pas dans l'OpenAPI (mineur, c'est un health-check).
  - **Présents en doc, à vérifier en code** : pas de mismatch flagrant trouvé sur les 37 opérations restantes (counts identiques).
- **Écart** : Important (2 endpoints applicatifs non documentés)
- **Impact CDA** : CP « Concevoir une base de données » et « Développer la partie back-end » (CP6/CP7). Avoir une OpenAPI complète est un atout majeur ; les manques sur `/skills` et `/availabilities` pourraient être pointés par le jury.
- **Recommandation** : Fixer la doc — ajouter les paths `/skills` et `/availabilities` dans `openapi.yaml` (et `/health` en bonus). Vérifier ensuite via Swagger UI que le total monte à 39 ou 40 opérations.

### 9. Cohérence schéma Prisma vs doc Database

- **Doc dit** : `arc42/05-building-blocks/database.md:3-114` énumère 14 modèles + 4 enums : `Role` (USER/ADMIN), `SkillLevel` (DEBUTANT/INTERMEDIAIRE/CONFIRME/EXPERT), `ConversationStatus` (ACTIVE/ARCHIVED/DELETED), `ParticipantRole` (INITIATOR/RECEIVER). Tables de jonction : `UserHasSkill`, `UserHasInterest`, `UserHasConversation` (3 jonctions documentées ligne 80-85). ERD mermaid ne mentionne ni `Available`, ni `UserHasAvailable`, ni `RefreshToken`.
- **Code montre** (`backend/prisma/schema.prisma`) :
  - 14 modèles : `User`, `Role`, `Skill`, `UserHasSkill`, `UserHasInterest`, `Category`, `Rating`, `Follow`, `Conversation`, `UserHasConversation`, `Message`, `Available`, `UserHasAvailable`, `RefreshToken`.
  - 4 enums : `RoleOfUser`, `StatusOfConversation`, `Time`, `dayInAWeek`.
  - **Renommages non répercutés en doc** : `Role` (doc) → `RoleOfUser` (code), `ConversationStatus` (doc) → `StatusOfConversation` (code).
  - **Enums doc inexistants en code** : `SkillLevel` (DEBUTANT/INTERMEDIAIRE/CONFIRME/EXPERT) absent ; `ParticipantRole` (INITIATOR/RECEIVER) absent.
  - **Enums code non documentés** : `Time`, `dayInAWeek`.
  - **Modèles code non documentés** : `Available`, `UserHasAvailable` (4ᵉ table de jonction non listée doc).
  - **Modèle `RefreshToken`** mentionné nulle part dans `arc42/05-building-blocks/database.md` mais évoqué implicitement dans la section sécurité (rotation).
- **Écart** : **Critique**
- **Impact CDA** : CP « Concevoir une base de données » (CP3). Avoir un MCD/MLD documenté qui ne correspond pas au schéma réel = note basse garantie. C'est probablement la première chose que le jury vérifiera.
- **Recommandation** : Fixer la doc — réécrire `arc42/05-building-blocks/database.md` à partir de `backend/prisma/schema.prisma` : (a) ajouter `Available`, `UserHasAvailable`, `RefreshToken` à l'ERD ; (b) corriger les noms d'enums (`RoleOfUser`, `StatusOfConversation`, `Time`, `dayInAWeek`) et leurs valeurs réelles ; (c) cohérencer avec `docs/documentation-implementation/database/models/*.md` (vérifier que les 11 fichiers .md du dossier reflètent les 14 modèles). Le dossier merise (`docs/merise/`) doit aussi être audité contre la réalité (hors scope ici).

### 10. Configuration Docker production

- **Doc dit** : `arc42/07-deployment/index.md:6-36` mermaid liste 5 services (frontend, backend, postgres:16, meilisearch, nginx). YAML simplifié lignes 44-89 : 4 services seulement (frontend, backend, postgres, meilisearch — pas de nginx ni certbot dans l'exemple). Tableau volumes lignes 155-161 mentionne `postgres_data`, `meilisearch_data`, `avatars_data`, `certbot_www`, `certbot_conf`. `MEILI_MASTER_KEY=masterKey` en clair dans l'exemple ligne 84.
- **Code montre** (`devops/docker-compose.prod.yml`) :
  - **6 services** : `backend` (port interne 3000), `frontend` (port interne 3000), `postgres:16-alpine`, `getmeili/meilisearch:v1.6`, `nginx:alpine` (ports 80:80, 443:443), `certbot/certbot` (renouvellement SSL Let's Encrypt).
  - Volumes définis : `postgres_data`, `meilisearch_data`, `avatars_data`, `certbot_www`, `certbot_conf` ✅ alignés avec la doc.
  - Frontend prod : `expose: ['3000']` (`devops/docker-compose.prod.yml:35-36`), pas `ports`. La doc YAML annonce `ports: - "3000:3000"` (ligne 51-52) → en réalité seul nginx mappe vers l'extérieur.
  - Health checks définis sur backend, frontend, postgres, nginx (non mentionnés dans la doc).
  - Secrets via `env_file: .env.docker` (sécurisé), pas de `MEILI_MASTER_KEY` en clair.
  - Dockerfiles : `devops/{frontend,backend}/Dockerfile.{dev,prod}` tous en `FROM node:24` (cf. section 4 sur l'écart Node 20 vs 24).
- **Écart** : Mineur
- **Impact CDA** : CP « Préparer et documenter le déploiement » (CP11). Globalement aligné, mais certbot et health checks à mentionner pour valoriser l'effort réel.
- **Recommandation** : Fixer la doc — (a) ajouter le service `certbot` dans le mermaid et le YAML doc, (b) remplacer `ports: 3000:3000` par `expose: 3000` dans l'exemple YAML, (c) mentionner les health checks comme atout, (d) retirer `MEILI_MASTER_KEY=masterKey` en clair (mauvais signal pour la sécurité).

### 11. Storybook

- **Doc dit** :
  - `arc42/09-decisions/010-testing-strategy.md:33-40` : « ~25 stories ». Tableau ligne 47 : « Composants UI (53) → Storybook ». Storybook valide « Props, variants, interactions, accessibilité, visuels ».
  - Implication : tous les composants ont une story (sinon Storybook ne « remplace » pas les tests Vitest comme le prétend l'ADR).
  - `DEPLOYMENT.md:11` annonce un Storybook public déployé sur Vercel.
- **Code montre** :
  - **28 stories** au total : `find frontend -name "*.stories.tsx" | wc -l` → 28.
    - atoms : 15 stories pour 18 composants (3 atoms sans story → ~83 % couverture).
    - molecules : 9 stories pour 9 composants → **100 %** ✅.
    - organisms : 4 stories pour 39 composants → **~10 %** (AuthForm, Footer, Header, SearchBar uniquement).
    - layouts : 0 story pour 1 composant.
    - providers : 0 story pour 1 composant (acceptable, ce sont des contextes).
  - Configuration `frontend/.storybook/main.ts:5-11` : addons activés = `@chromatic-com/storybook`, `@storybook/addon-vitest`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-onboarding`. Framework `@storybook/nextjs-vite`.
  - Preview `frontend/.storybook/preview.ts:1-15` : minimaliste, pas de configuration explicite de l'addon-a11y (rules par défaut).
  - **`@storybook/addon-vitest` installé mais non intégré** : `frontend/vitest.config.ts:1-27` n'a pas de section `projects` ou de plugin Storybook → les stories ne sont pas exécutées comme tests Vitest. Les tests d'interaction Storybook ne sont donc pas joués automatiquement.
  - Storybook déployé via job `deploy-storybook` (`.github/workflows/deploy-docs.yml:85-117`) — workflow présent, déclenchement manuel uniquement.
- **Écart** : Important (organisms à 10 % de couverture story, claim ADR 010 invalidé)
- **Impact CDA** : CP « Développer une interface utilisateur » + cohérence stratégie de tests. L'ADR 010 affirme que Storybook se substitue aux tests Vitest pour les composants ; or 35 organisms sur 39 n'ont aucune story. La proposition « Storybook documente ET teste tous les composants UI » est factuellement fausse aujourd'hui.
- **Recommandation** : Fixer le code (créer des stories pour les organisms manquants prioritaires, au moins ceux des pages publiques) **ou** fixer la doc (ADR 010 : reconnaître que Storybook couvre les atoms et molecules, pas encore les organisms). Activer aussi le projet Storybook dans `vitest.config.ts` pour bénéficier d'`addon-vitest`. À discuter avec Carl pour arbitrer effort vs honnêteté documentaire.

---

## Annexe — données brutes citables au jury

| Indicateur | Valeur réelle | Commande |
| --- | --- | --- |
| Composants React | 68 | `find frontend/src/components -name "*.tsx" \| grep -v "\.stories\.\|\.test\." \| wc -l` |
| Hooks personnalisés | 21 | `find frontend/src/hooks -name "use*.ts" \| wc -l` |
| Endpoints Express | 37 (+1 health) | grep manuel sur `backend/src/routers/*.router.ts` |
| Modèles Prisma | 14 | `grep -c "^model " backend/prisma/schema.prisma` |
| Enums Prisma | 4 | `grep -c "^enum " backend/prisma/schema.prisma` |
| Stories Storybook | 28 | `find frontend -name "*.stories.tsx" \| wc -l` |
| Tests Vitest frontend | 5 | `find frontend/src -name "*.test.ts"` |
| Tests Playwright | 2 | `ls frontend/e2e/*.spec.ts` |
| Tests backend (`*.spec.test.ts`) | 7 | `find backend/src -name "*.spec.test.ts"` |
| Workflows GitHub Actions | 1 (`deploy-docs.yml`) | `ls .github/workflows/` |
| Services Docker prod | 6 | `devops/docker-compose.prod.yml` |
| Versions runtime | Next 16.1.1 / React 19.2.3 / Express 5.2.1 / Prisma 7.2.0 / Node 24 / Tailwind 4.1.18 / Zod 4.3.5 | `package.json` + `node --version` + Dockerfiles |

> Coverage frontend et backend non mesurés à ce jour : `node_modules/` absent. À exécuter avant la soutenance via `npm install` puis `npm run test:coverage` (front) et `node --test --experimental-test-coverage` (back).
