# Audit modèles Prisma ↔ ERD ↔ Database doc (axe 2 / S2)

**Date** : 2026-05-07
**Commits correctifs** : `a39a797` · `9daacdb` · `e99474c` · `ed27a99` · `71f74ad`

## Objectif

Confronter la documentation base de données (chapitre Arc42 building-blocks, fichiers de synthèse `database/*`, fiches modèles individuelles, exemples API/TypeDoc référençant le schéma) à la table de vérité Prisma + migrations + seed. Règle appliquée : doc = miroir fidèle de la prod actuelle, sans projection ni reliquat hallucinatoire.

## Sources de vérité (repo PROD)

- `backend/prisma/schema.prisma` — 14 modèles, 4 enums, 240 lignes
- `backend/prisma/migrations/2026*/migration.sql` — 6 migrations (12 janvier au 20 janvier 2026), 295 lignes total
- `backend/src/models/seeding.ts` — 1 rôle, 8 catégories, 28 compétences, 14 créneaux
- `backend/prisma/generated/prisma/enums.ts` — 45 lignes, signatures `as const` du generator `prisma-client-ts`

## Périmètre

**19 fichiers de doc confrontés** :

- 1 chapitre Arc42 : `arc42/05-building-blocks/database.md`
- 5 fichiers de synthèse : `database/{index,enums,migrations,relations}.md`
- 11 fiches modèles : `database/models/{user,role,skill,category,conversation,message,follow,rating,available,refresh-token,junction-tables}.md`
- 2 exemples étendus (détectés via filet de sécurité grep) : `typedoc/APIClient.md`, `api-reference/examples/search-flow.md`

## Résultats

**16 fichiers modifiés / 3 fichiers déjà conformes**.

| Statut | Fichiers |
|---|---|
| ✅ Aucun écart détecté (alignement initial correct) | `relations.md`, `junction-tables.md`, `follow.md` |
| ⚠️ Corrections appliquées | 16 fichiers (cf. décomposition par commit) |

**36 corrections logiques** appliquées en **5 commits**, **0 reliquat fictif** après filet de sécurité grep final.

## Décomposition par commit

### `a39a797` — Fichiers de synthèse (phase 2a + 2b enums) — 7 corrections sur 3 fichiers

- `arc42/05-building-blocks/database.md` : `firstName` → `firstname` (cohérence schema Prisma)
- `database/index.md` : ajout `receiverId` au diagramme Mermaid Message ; qualification "validation applicative" sur Rating.score ; qualification "argon2 (variante argon2id par défaut de la lib)" sur User.password
- `database/enums.md` : retrait des rôles fictifs `Admin`/`Moderateur`/`Premium` dans l'évolution future RoleOfUser ; ajout admonition naming sur `dayInAWeek` (dette de cohérence PascalCase) ; refonte de la section "Types TypeScript générés" alignée sur le fichier réel `enums.ts` (signature `as const` + type littéral, chemin corrigé)

### `9daacdb` — Refonte migrations.md (phase 2b migrations) — 6 modifs sectionnelles

Le fichier listait 1 seule migration `init` datée 2024-12 alors que la prod a 6 migrations entre 2026-01-12 et 2026-01-20. Refonte :

- Vue d'ensemble : table des 6 migrations avec dates et descriptions
- Migration initiale : nom complet `20260112133206_init_db`, date corrigée (12 janvier 2026), précision sur les 3 enums créés à l'init (`Time` ajouté ultérieurement en migration 3)
- Nouvelle section "Migrations suivantes" : sous-bloc dédié à chaque migration 2 à 6 avec date, description et extrait SQL clé
- Évolutions futures : retrait de la table fictive (`add_user_premium`, `add_message_read_at`, `add_notification`, `add_skill_level`), remplacée par "aucune migration formellement planifiée"
- Données de seed : correction "~30 compétences par catégorie" → "28 compétences au total (3 à 5 par catégorie)" — vérifié contre `seeding.ts`

### `e99474c` — Fiches modèles priorisées (phase 2c-1) — 8 corrections sur 4 fiches

- `rating.md` : qualification "(1-5, validation applicative)" sur le tableau Champs ; **suppression du `CHECK (score >= 1 AND score <= 5)` fictif** dans la Table SQL (aucun CHECK constraint dans la prod, vérifié migration init_db)
- `user.md` : harmonisation argon2 ; Table SQL `VARCHAR` → `TEXT` pour toutes les chaînes (cohérence init_db)
- `available.md` : Table SQL inversée (`CREATE TYPE` avant `CREATE TABLE` pour cohérence DDL) ; types `day "dayInAWeek"` et `time_slot "Time"` au lieu de `VARCHAR` (alignement sur les types enum réels)
- `refresh-token.md` : Table SQL `VARCHAR` → `TEXT` pour `token` ; nom d'index corrigé en convention Prisma `refresh_token_user_id_idx` (au lieu de `idx_refresh_token_user_id`)

### `ed27a99` — Fiches modèles restantes (phase 2c-2) — 12 corrections sur 5 fiches

- `category.md` : refonte complète de la section "Catégories actuelles" (la liste précédente — `Photo/Vidéo`, `Autre`, `developpement-web` — était entièrement fictive) avec les 8 catégories réelles du seed prod et leurs slugs corrects ; Table SQL `VARCHAR` → `TEXT`
- `conversation.md` : Table SQL refondue (ordre DDL `CREATE TYPE` avant `CREATE TABLE`, `status "StatusOfConversation" NOT NULL DEFAULT 'Open'` au lieu de `VARCHAR`, `title TEXT`)
- `message.md` : cohérence quotes `REFERENCES "conversation"(id)`
- `role.md` : note Évolution future généralisée (retrait `Admin`/`Moderateur`, cohérent avec `enums.md` déjà aligné) ; Table SQL refondue (ordre DDL, `name "RoleOfUser" NOT NULL DEFAULT 'Membre'` au lieu de `VARCHAR`)
- `skill.md` : Table SQL `VARCHAR` → `TEXT` + cohérence quotes `REFERENCES "category"(id)` ; section "Données de seed" refondue (Vue.js absent du seed prod retiré, extrait illustratif basé sur `seeding.ts` réel + délégation à `migrations.md` pour la liste complète des 28 compétences)

### `71f74ad` — Fix résiduel cohérence catégories — 3 corrections sur 3 fichiers

Détecté par filet de sécurité grep post-`ed27a99` (recherche large `developpement-web`, `photo-video`, `Photo/Vidéo`, `Autre`) :

- `category.md` (exemple TypeScript "Trouver par slug") : `'developpement-web'` → `'dev-web'`
- `typedoc/APIClient.md` (exemple `searchMembers`) : `category: 'developpement-web'` → `'dev-web'`
- `api-reference/examples/search-flow.md` (payload JSON `GET /api/v1/categories`) : refonte complète des 8 catégories pour aligner ordre + noms + slugs sur le seed réel (Développement Web/dev-web en id=1 → Bricolage/bricolage en id=8, retrait des fictives Photo/Vidéo et Autre)

## Patterns d'écarts récurrents

L'audit a révélé 6 catégories d'écarts systémiques, attribuables à une génération initiale partiellement hallucinatoire de la doc :

1. **Listes/exemples fictifs jamais alignés sur la prod** : 8 catégories fictives (4 fichiers), Vue.js dans seed skill.md, migrations futures fictives, rôles `Admin`/`Moderateur`/`Premium`
2. **`VARCHAR` au lieu de `TEXT`** dans les Tables SQL (8+ occurrences sur 6 fichiers) — la migration init_db utilise systématiquement `TEXT` pour les chaînes
3. **DDL non exécutable** : `CREATE TABLE` avant `CREATE TYPE` (3 fichiers : conversation, role, available)
4. **Types enum manqués** : `status VARCHAR` au lieu de `status "StatusOfConversation"` (2 fichiers)
5. **Conventions Prisma non respectées** : nom d'index `idx_<table>_<col>` au lieu de `<table>_<col>_idx`, quotes manquantes sur `REFERENCES`, signature TypeScript legacy au lieu du generator `prisma-client-ts`
6. **Imprécisions sémantiques** : contrainte applicative présentée comme contrainte BDD (Rating score 0-5, CHECK fictif), variante argon2 implicite (par défaut de la lib)

## Note méthodologique : valeur du filet de sécurité grep

Le commit `71f74ad` n'aurait jamais été identifié sans le filet de sécurité large lancé après `ed27a99`. Les vérifications ciblées de chaque prompt CC se concentrent sur les zones modifiées ; un grep transversal (sur toute l'arborescence `docs/` + `user-docs/`) après une refonte de concept (ici les catégories) permet de détecter les reliquats dans des fichiers hors-scope initial (ici `typedoc/APIClient.md` et `api-reference/examples/search-flow.md`, qui n'étaient pas dans le périmètre des 11 fiches modèles).

Pratique à reproduire : après chaque chantier touchant une donnée structurelle (versions, slugs, identifiants enum), lancer un grep large des termes obsolètes pour confirmer 0 reliquat global avant clôture.

## Observations annexes (dette V2 reconnue, hors-périmètre A2)

1. **`Tailwind CSS` absent du glossaire `12-glossary/index.md`** — Le tableau de versions n'inclut pas Tailwind alors que le projet est en `^4.1.18`. Ajout suggéré V2 : ligne `| Tailwind CSS | ^4.1.18 | frontend/package.json |`.
2. **`engines` `package.json` vides** — Ni `frontend/package.json` ni `backend/package.json` ne pinnent la version Node dans le bloc `engines`. La cohérence repose uniquement sur les Dockerfiles (`FROM node:24`). Dette mineure : ajouter `"engines": { "node": ">=24" }` aux deux `package.json` en V2.
3. **Generator Prisma `prisma-client-ts` non documenté** — Le `schema.prisma` utilise `provider = "prisma-client-ts"` (generator récent de Prisma 7), avec output `./generated/prisma`. La doc publiée ne mentionne nulle part ce generator (0 hit `prisma-client-js` / `prisma-client-ts` dans toute la doc, vérifié). Enrichissement V2 : section dédiée dans `building-blocks/database.md` ou ligne dans le glossaire 12.4.

## Conclusion

L'audit a confronté 19 fichiers de doc base de données à 4 sources de vérité du repo prod. **3 fichiers étaient déjà conformes** (`relations.md`, `junction-tables.md`, `follow.md`), témoignant d'un noyau doc rigoureux. **16 fichiers ont nécessité 36 corrections** réparties sur 5 commits, dont une refonte sectionnelle de `migrations.md` (1 migration fictive → 6 migrations réelles) et un fix résiduel critique sur la cohérence des 8 catégories à travers 3 fichiers détectés tardivement par filet de sécurité grep.

Le piège central `Rating ↔ evaluation` était déjà documenté en phase 1 et a été préservé/renforcé. Aucun reliquat fictif après vérification transversale finale (`developpement-web`, `photo-video`, `Photo/Vidéo`, `Autre` éradiqués). La doc base de données reflète désormais fidèlement la prod, prête pour démonstration en soutenance.