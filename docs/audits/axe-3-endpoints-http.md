# Audit endpoints HTTP API (axe 3 / S2)

**Date** : 2026-05-07
**Commits correctifs** : `7a924f1` · `8709e7b` · `07c3726` · `7163277` · `dc50034` · `ce53b0b` · `2df4713`

## Objectif

Confronter la documentation des endpoints HTTP de l'API SkillSwap (matrice RBAC, liste de référence des routes, exemples d'appels, sequenceDiagrams Mermaid Arc42, pages d'authentification, fichiers de stratégie) à la table de vérité PROD : routers Express + controllers + middlewares + schémas Zod. Règle appliquée : doc = miroir fidèle de la prod actuelle, pas d'inventions, pas de projections.

## Sources de vérité (repo PROD)

- `backend/src/app.ts` — point d'assemblage, préfixe `/api/v1` + endpoint `/health` direct
- `backend/src/routers/index.router.ts` — orchestrateur des 8 sub-routers
- `backend/src/routers/{auth,profile,conv,follow,category,skill,availability,search}.router.ts` — 8 fichiers, 315 lignes
- `backend/src/middlewares/{auth,conv}.middleware.ts` — `checkAuth`, `isOwner`, `parseNumericParams`, `validate`, `requireFollow`, `requireSimpleFollow`, `requireMutualFollow`
- `backend/src/validation/{auth,profile,conversation,search,category}.validation.ts` — 5 schémas Zod (~220 lignes)
- `backend/src/controllers/{auth,profile,search}.controller.ts` — vérification post-commit (`dc50034`) pour confirmer comportements

**Table de vérité établie** : **38 endpoints** exposés sous `/api/v1/`.

## Périmètre

**24 fichiers de doc** confrontés à la table de vérité, modifiés en 7 commits :

| Famille | Fichiers |
|---|---|
| **Référence endpoints** (refonte intégrale) | `endpoints/endpoints-api.md`, `endpoints/rbac.md` |
| **Fiches modèles** (ajustements) | `database/models/{category,follow}.md` |
| **API Reference** | `api-reference/{index,authentication,testing-tools}.md`, `api-reference/examples/{auth-flow,search-flow}.md` |
| **Arc42** | `arc42/03-context/index.md`, `arc42/06-runtime/{authentication,messaging,search}.md`, `arc42/08-crosscutting/authentication.md`, `arc42/09-decisions/007-jwt.md` |
| **Infrastructure** | `infrastructure/networks.md` |
| **Documentation strategy** | `documentation-strategy/{README,00-plan-action-global,02-arc42-mkdocs,04-api-openapi,12-soutenance,14-planning}.md` |
| **Racine** | `README.md`, `docs/README.md` |

**Hors-périmètre (préservé intentionnellement)** : `docs/audits/doc-reality-check.md` — audit historique daté qui documente l'écart "31 endpoints doc vs 37 réels" et "15 min / 7 j" comme la trace de l'audit fait à un moment donné. Modifier ce fichier effacerait la traçabilité d'audit (la situation historique reste juste comme témoignage).

## Résultats

**24 fichiers modifiés / 0 régression / ~336 corrections logiques** sur 7 commits.

## Décomposition par commit

### `7a924f1` — Préfixe `/api/v1/` Mermaid (commit 1) — 13 corrections sur 6 fichiers

Sequence diagrams Mermaid utilisaient `/api/...` (sans `/v1/`) ; ajout du préfixe + correction `/profile` → `/profiles/:id` (singulier vs pluriel selon `index.router.ts:14 router.use('/profiles', profileRouteur)`).

### `8709e7b` — URLs/totaux/durées tokens (commit 2) — 8 corrections sur 5 fichiers

URL prod fictive `api.skillswap.fr` → `skill-swap.fr` (réelle, confirmée via `curl https://skill-swap.fr/api/v1/health`). README ligne 57 path `/api/health` → `/api/v1/health` + port 8888. Durées tokens `accessToken` 15 min → 1 h, `refreshToken` 7 j → 30 j (valeurs effectives confirmées par `arc42/08-crosscutting/authentication.md` qui était déjà à jour). Refonte du tableau "Endpoints par catégorie" `api-reference/index.md` (Profiles 5→14, Skills 4→1, Availabilities 3→1, ajout Search/Health, total 31→38).

### `07c3726` — Fix résiduel filet de sécurité (commit 2 fix) — 21 corrections sur 9 fichiers

Filet de sécurité grep post-commit `8709e7b` a remonté 10 occurrences supplémentaires de "31 endpoints" (sur 6 fichiers de stratégie) + 4 fichiers contenant encore "15 min / 7 j" hors-brief mais détectables. CC a élargi de lui-même la portée à toutes les durées 15 min / 7 j détectées dans `auth-flow.md` et `007-jwt.md` (Mermaid + tables + prose), justifiant l'extension par la cohérence interne. Note méthodologique précieuse pour la suite.

### `7163277` — Refonte intégrale `endpoints-api.md` (commit 3) — 114 lignes refondues

Le fichier de référence des endpoints contenait ~15 erreurs majeures :
- Préfixe `/profile` (singulier) → `/profiles`
- `PUT` → `PATCH` (5+ occurrences)
- Endpoints inexistants : `DELETE /:user_id/unfollow`, `PUT /availabilities/:id`, `GET /messages/:id`, `GET /api/v1/categories` (liste plate)
- `Authorization: Bearer <token>` → cookies HTTP-only
- Body params snake_case (`receiver_id`, `start_time`, `end_time`) → camelCase (`receiverId`, `day`, `timeSlot`)
- Invention "Maximum 10 compétences" non implémentée
- Filtre `?skill=` inexistant dans `SearchParamsSchema`

Refonte complète en 10 sections (Health, Auth, Profiles, Follows, Conversations, Messages, Search, Categories, Skills, Availabilities), middlewares cités explicitement, validation Zod référencée par schéma, asymétrie `messages`/`message/:messageId` documentée comme dette V2.

### `dc50034` — Fix post-vérification controllers (commit 3 fix) — 5 corrections sur 2 fichiers

**Vérification de cap demandée par le pilote** : "la doc reflète-t-elle strictement le réel implémenté ?". Lecture des controllers + middlewares + services a confirmé 4/6 affirmations de la refonte précédente, mais a révélé :

1. `POST /auth/logout` : clearCookie sur **3 cookies** (`accessToken`, `accessTokenExpires`, `refreshToken`), pas 2. Cookie `accessTokenExpires` initialement omis.
2. `GET /skills/` : précision manquante — chaque skill arrive avec sa catégorie incluse (`include category: { id, name, slug }` côté service).
3. `GET /availabilities/` : précision manquante — throw 404 `NotFoundError` si la table est vide.
4. **Erreur d'audit A2 corrigée** : `models/follow.md` affirmait à tort "suivi mutuel requis pour créer une conversation". Le code utilise `requireSimpleFollow` (vérification unidirectionnelle sender → receiver). Refondu.
5. **Dead code détecté** : `requireMutualFollow` est défini dans `conv.middleware.ts` mais **n'est appliqué sur aucun endpoint** des routers. Mentionné en admonition transparente dans `follow.md`.

### `ce53b0b` — Refonte intégrale `rbac.md` (commit 4) — 119 lignes refondues

Mêmes erreurs systémiques que `endpoints-api.md` + spécificités RBAC :
- `POST /:id/rating` rangé à tort sous "Conversations" → déplacé sous "Profiles" (vit dans `profile.router.ts`)
- Section "Evaluations" sous `/api/v1/categories` (confusion totale) → retirée
- Manque les endpoints messages PATCH/DELETE individuels, /health, /skills, /availabilities, /profiles/{avatar,password,public/:id}, DELETE /profiles/

Refonte avec légende des 5 codes (`yes`, `no`, `self`, `self*`, `follower`), 10 sections, 3 admonitions explicatives (règle `requireFollow` sur rating, `requireSimpleFollow` unidirectionnel sur conversation, distinction participant/auteur sur messages), récapitulatif par niveau d'accès (8 publics + 10 auth simples + 11 auth+self + 2 auth+follower + 7 auth+self* = 38).

### `2df4713` — Ajustements ponctuels (commit 5) — 6 corrections sur 4 fichiers

Dernière passe sur les fichiers déjà partiellement corrigés en A2 ou intacts :
- `database/models/category.md` : `GET /api/v1/categories` (inexistant) → `/categories/top-rated` + admonition explicite
- `api-reference/examples/search-flow.md` : refonte du curl + payload pour pointer sur `/categories/top-rated` ; échantillon JSON marqué illustratif (l'ordre dépend du tri par nombre d'utilisateurs)
- `arc42/06-runtime/messaging.md` : payload Mermaid `{ participantId, message }` (faux) → `{ title, receiverId }` ; étape "INSERT message (premier message)" retirée (la création de conversation n'inclut pas de message en prod) ; ajout du chemin alt `requireSimpleFollow`
- `arc42/06-runtime/search.md` : graph Mermaid + tableau "Filtres disponibles" alignés sur `SearchParamsSchema` (5 paramètres réels : `q, category, page, limit, sort`) ; admonition source de vérité Zod avec mention négative explicite que `city`/`available` ne sont pas implémentés en prod

## Patterns d'écarts récurrents

L'audit a révélé 12 catégories d'écarts systémiques :

1. **Préfixe `/api/v1/` manquant** dans Mermaid arc42 (11+ occurrences) — itérations antérieures de la doc utilisaient `/api/...` directement
2. **Singulier `/profile` au lieu de `/profiles`** (4+ occurrences) — les routers prod utilisent le pluriel
3. **Verbes HTTP faux** : `PUT` au lieu de `PATCH` (5+ occurrences)
4. **Endpoints inexistants documentés** : `DELETE /:user_id/unfollow`, `PUT /availabilities/:id`, `GET /messages/:id`, `GET /api/v1/categories` (liste plate)
5. **Body params en snake_case** au lieu du camelCase réel (`receiver_id` → `receiverId`, `start_time/end_time/day` ISO 8601 → enum `dayInAWeek` + enum `Time`)
6. **Filtres/params inventés** : `?skill=`, `?city=`, `?available=`, `?categoryId=` non présents dans `SearchParamsSchema`
7. **Authentification documentée incorrectement** : `Authorization: Bearer <token>` (faux) → cookies HTTP-only `accessToken`/`refreshToken`/`accessTokenExpires` (réel)
8. **Durées tokens fictives** : 15 min / 7 jours (anciennes itérations) → 1 heure / 30 jours (réel, `TOKEN_EXPIRE` env + 30 j en dur)
9. **URL prod fictive** : `api.skillswap.fr` (sous-domaine inexistant) → `skill-swap.fr` (réel, mêmes domaine que le frontend, API sous `/api/v1/`)
10. **Total endpoints faux** : "31 endpoints" (11 occurrences cumulées sur 7 fichiers) → 38 endpoints (1 health + 5 auth + 14 profiles + 4 follows + 9 conv/messages + 2 search + 1 categories + 1 skills + 1 availabilities)
11. **Règles métier fausses** : `models/follow.md` affirmait "mutual follow requis pour créer une conversation" alors que le code utilise `requireSimpleFollow` (unidirectionnel)
12. **Inventions techniques non implémentées** : "Maximum 10 compétences", "Premier message obligatoire à la création de conversation", "Évite les doublons de conversation", `requireMutualFollow` (défini mais dead code)

## Notes méthodologiques

### Valeur du filet de sécurité grep transversal

Le pattern (établi en A2, reproduit en A3) consiste à lancer un grep large sur toute l'arborescence `docs/` après chaque commit "refonte d'un concept" (préfixe API, durée token, total endpoints, slug catégorie...). En A3 :
- Post-`8709e7b` : a détecté 10 occurrences supplémentaires de "31 endpoints" + 4 occurrences de durées tokens fictives non identifiées au brief initial. Sans ce filet, ces reliquats auraient subsisté.
- Post-`7163277` : a précédé la vérification de cap qui a révélé 5 imprécisions + 1 erreur d'audit A2.

### Vérification de cap demandée par le pilote

À mi-chantier, le pilote a demandé une vérification rigoureuse : "la doc se base-t-elle strictement sur le réel implémenté ?". Cette demande a déclenché la lecture explicite des controllers/middlewares/services (qui n'avaient pas été lus en phase 3a, où on s'était contenté des routers + validators). Résultat : 6 améliorations + détection du dead code `requireMutualFollow`. Pratique à reproduire systématiquement sur les chantiers profonds.

### Extension de scope autonome par CC

À deux reprises (`07c3726` et la vérification post-`7163277`), CC a élargi de lui-même le périmètre du brief en justifiant l'extension par la cohérence interne ("sinon une table à 15 min coexisterait avec une table à 1 h dans le même fichier"). Bon réflexe à reconnaître : la rigueur de cohérence ne s'arrête pas au strict périmètre du brief si le filet de sécurité ou la lecture de contexte révèle un problème adjacent.

## Observations annexes (dette V2 reconnue, hors-périmètre A3)

1. **`requireMutualFollow` dead code** — middleware défini dans `conv.middleware.ts` mais utilisé sur aucun endpoint. Soit retirer en V2, soit appliquer là où l'intention métier était bien le mutual follow.
2. **Asymétrie pluriel/singulier `messages`/`message/:messageId`** — convention de routes incohérente côté code prod, conservée telle quelle dans la doc V1, à harmoniser en V2 si refactor.
3. **Interface frontend `SearchFilters`** — le hook `useSearch` côté frontend (`api-reference/examples/search-flow.md`) utilise `categoryId: number, city: string` qui ne correspondent pas aux paramètres API (`category` slug, pas de `city`). Le frontend mappe peut-être en interne, mais le typage prête à confusion. Hors-périmètre A3, à clarifier en V2 (alignement TypeScript front/back).
4. **Tests backend 5/7 KO** — `roleId: NaN` non corrigé, tests de conversation et message échouent. Documenté ailleurs, dette V2 reconnue.
5. **Repo prod a avancé pendant la S2** — `de73323 Merge pull request #142 from O-clock-Dublin/dev` mergé pendant le chantier doc. À ré-auditer si nécessaire avant la soutenance pour s'assurer que les modifs apportées par cette PR ne contredisent pas la doc finale.

## Conclusion

L'audit a confronté **24 fichiers de doc** aux 38 endpoints réels de l'API, à leurs middlewares, leurs validateurs Zod et leurs controllers. **7 commits** ont été nécessaires pour aligner intégralement la documentation, dont **2 refontes intégrales** (`endpoints-api.md` 114 lignes refondues, `rbac.md` 119 lignes refondues) et **3 commits de fix résiduels** déclenchés par filets de sécurité grep transversaux ou par la vérification de cap pilote.

12 patterns d'écarts systémiques ont été identifiés et corrigés. La doc API reflète désormais fidèlement la prod : 38 endpoints exacts, 8 publics + 30 authentifiés, validation Zod référencée par schéma, distinction simple-follow/mutual-follow rétablie (le code n'utilise QUE du simple follow malgré l'existence d'un middleware `requireMutualFollow` jamais appelé), durées tokens 1 h / 30 j confirmées, URLs prod et baseUrls cohérentes.

3 dettes V2 reconnues ont été documentées en transparence (dead code mutual follow, asymétrie pluriel/singulier messages, typage frontend useSearch désaligné). La doc est prête pour démonstration en soutenance, avec arguments solides à l'oral sur la rigueur de la démarche d'audit (vérification de cap mid-chantier, filets de sécurité grep, lecture explicite des sources).