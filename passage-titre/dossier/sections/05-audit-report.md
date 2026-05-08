# Audit ancrage code — Section 5 (Spécifications fonctionnelles)

**Date** : 2026-05-08
**Auditeur** : Claude Code (Opus 4.7)
**Périmètre** : `passage-titre/dossier/sections/05-specifications-fonctionnelles.typ`
**Repo audité** : code prod miroir (read-only) — `backend/prisma/`, `docs/uml/`,
`docs/documentation-implementation/arc42/09-decisions/`, `*/package.json`,
`devops/docker-compose.prod.yml`

## Synthèse

**8 écarts identifiés**, dont **3 majeurs** (extraits SQL inventés / inversés),
**3 moyens** (descriptions imprécises de migrations), **2 mineurs** (cardinalité
inversée, slug de migration raccourci). **8 ajustements appliqués** dans
`05-specifications-fonctionnelles.typ`. Aucun point d'arbitrage à laisser à
Jérémy — tous les écarts détectés étaient des erreurs factuelles unilatéralement
corrigeables.

État général : la narration tient, les diagrammes UML existent tous, les
versions de stack et les ADRs cités sont conformes. Les principaux écarts
concentrés sur la sous-section 5.5 (extraits SQL).

---

## Écarts trouvés et traitement

### Extraits SQL

#### S1 — Migration `init_db` (table `user`) — section 5.5
- **Initial Typst** : extrait avec `VARCHAR(50)`, `VARCHAR(255)`, colonne
  `bio`, `avatar_url`, `role_id NOT NULL DEFAULT 1`, FK inline avec
  `ON DELETE RESTRICT`, `CREATE INDEX` (non unique) sur `email`.
- **Réel prod** (`backend/prisma/migrations/20260112133206_init_db/migration.sql:11-27`)
  : tous les champs en `TEXT` (Prisma ne génère pas de `VARCHAR`),
  colonne réelle `description` (pas `bio`), `avatarUrl` en camelCase
  (renommé plus tard via `fix_snake_case`), `role_id NOT NULL` sans
  default, FK déclarée séparément en fin de fichier via `ALTER TABLE`,
  `ON DELETE CASCADE`, `CREATE UNIQUE INDEX` sur email. Champs
  supplémentaires : `address`, `postal_code`, `age`.
- **Décision** : extrait substitué intégralement par le vrai code de la
  migration.
- **Justification** : 7 erreurs factuelles cumulées dans un seul extrait —
  un jury qui ouvre `migrations/20260112133206_init_db/migration.sql`
  identifierait toutes les divergences.

#### S2 — Migration `add_unique_constrain` — section 5.5
- **Initial Typst** : `ALTER TABLE "follow" ADD CONSTRAINT ... UNIQUE("follower_id", "followed_id")` ;
  `ALTER TABLE "rating" ...`.
- **Réel prod** (`backend/prisma/migrations/20260118042859_add_unique_constrain/migration.sql`) :
  `CREATE UNIQUE INDEX "evaluation_evaluator_id_evaluated_id_key" ON "evaluation"(...)` ;
  pour `follow`, ordre des colonnes inversé : `("followed_id", "follower_id")`.
  La table s'appelle `evaluation` (mappée depuis le modèle Prisma `Rating`
  via `@@map`).
- **Décision** : extrait substitué + paragraphe explicatif ajouté pour
  contextualiser `Rating` ↔ `evaluation` et la sémantique
  équivalente entre `CREATE UNIQUE INDEX` et `ADD CONSTRAINT UNIQUE`.
- **Justification** : 3 erreurs cumulées (pattern SQL, nom de table,
  ordre des colonnes).

#### S3 — Description de la migration `fix_snake_case` — section 5.5
- **Initial Typst** : *"Harmonisation de la casse des colonnes vers snake_case
  pour cohérence avec les conventions PostgreSQL (mappings `@map(\"...\")` côté Prisma)"* — généralisation laissant penser qu'il s'agit d'une refonte.
- **Réel prod** : la migration **ne fait que** `DROP COLUMN avatarUrl` +
  `ADD COLUMN avatar_url` sur la table `user`. Une seule colonne
  affectée. Et la migration **perd la donnée** dans le cas général (drop
  + add ≠ rename), à signaler.
- **Décision** : description corrigée en *"Renommage de la colonne avatarUrl
  → avatar_url sur la table user (réalignement camelCase → snake_case
  oublié à la migration initiale)"*.
- **Justification** : transparence — la description initiale aurait pu
  passer pour une opération transverse.

#### S4 — Description de la migration `create_relation_table_user_available` — section 5.5
- **Initial Typst** : *"Création de la table de jonction UserHasAvailable
  (séparation des disponibilités du modèle User)"*.
- **Réel prod** : la migration drop aussi les colonnes `start`, `end`,
  `user_id` de la table `available` et introduit l'enum `Time` (`Morning`
  / `Afternoon`). Le modèle de disponibilité passe d'un créneau ouvert
  (start/end) à un créneau standardisé.
- **Décision** : description enrichie pour mentionner la refonte du modèle
  et l'introduction de l'enum `Time`.

#### S5 — Slug du dossier de migration `make_comment_optional` — section 5.5
- **Initial Typst** : `make_comment_optional`.
- **Réel** : `make_the_comment_field_in_the_rating_table_optional`.
- **Décision** : slug exact rétabli (le nom long est moins élégant mais c'est
  le vrai nom de dossier — vérifiable par le jury).

### Schéma et cardinalités (5.4)

#### S6 — Cardinalité Follow inversée
- **Initial Typst** : *"contrainte d'unicité sur le couple (followerId, followedId)"*
- **Réel** (`backend/prisma/schema.prisma:145`) : `@@unique([followedId, followerId])`
  → ordre `(followedId, followerId)`.
- **Décision** : ordre inversé corrigé.

#### S7 — Précision sur `Rating` ↔ `evaluation`
- **Initial Typst** : référence au modèle `Rating` sans mention de la table
  BDD `evaluation`.
- **Réel** : `Rating` est mappé en BDD vers `evaluation` (`@@map("evaluation")`).
  Cohérence avec les extraits SQL où la table s'appelle `evaluation`.
- **Décision** : mention `(mappée evaluation en BDD)` ajoutée à la première
  référence pour éviter la confusion entre nom Prisma et nom BDD.

### Diagrammes UML (5.2 / 5.3 / 5.4 / 5.6 / 5.7)

| PNG référencé | Présence | Décision |
|---|---|---|
| `docs/uml/architecture/architecture.png` | ✓ existe | conservé |
| `docs/uml/user/arborescence.png` | ✓ existe | conservé |
| `docs/uml/user/user-flow.png` | ✓ existe | conservé |
| `docs/uml/erd.png` | ✓ existe (2363×720, indexé) | conservé |
| `docs/uml/user/use-cases.png` | ✓ existe | conservé |
| `docs/uml/sequence/conversation.png` | ✓ existe | conservé |

Tous les `#image()` activés dans la section 5 résolvent correctement.

### Versions de stack (5.2)

| Élément | Cité Typst | Réel | Décision |
|---|---|---|---|
| Next.js | 16.1.1 | 16.1.1 (`frontend/package.json`) | ✓ |
| PostgreSQL | 16 | postgres:16-alpine (`docker-compose.prod.yml`) | ✓ |
| Express | "Express" (sans version) | 5.2.1 | conservé (sans version explicite) |
| Prisma | "Prisma ORM" (sans version) | @prisma/client 7.2.0 | conservé |
| Socket.IO | "Socket.IO" (sans version) | socket.io 4.8.3 | conservé |
| Meilisearch | "Meilisearch" (sans version) | server v1.6 / client 0.55.0 | conservé |

### ADRs (5.2)

| ADR cité | Présence | Décision |
|---|---|---|
| ADR-008 Meilisearch | ✓ `008-meilisearch.md` | conservé |
| ADR-011 Socket.IO | ✓ `011-socket-io.md` | conservé |

### Domaines fonctionnels (5.4)

Les **14 modèles** annoncés ont tous été vérifiés dans `schema.prisma` :

- Identité (3) : User, Role, RefreshToken ✓
- Compétences (4) : Skill, Category, UserHasSkill, UserHasInterest ✓
- Disponibilités (2) : Available, UserHasAvailable ✓
- Échange (3) : Conversation, Message, UserHasConversation ✓
- Social (2) : Follow, Rating ✓

Total : 3+4+2+3+2 = 14 ✓ — décompte exact.

---

## Recommandations pour Jérémy

1. **Volume section 5 = 19 pages** (cible 5-7). Le découpage en 7 sous-sections
   REAC + 6 diagrammes UML pleine largeur + 2 extraits SQL gonfle naturellement
   la pagination. Trois pistes à arbitrer avec claude.ai : (a) accepter (la
   section 5 est *centrale* pour la conformité REAC et la valider sur 19 p.
   est cohérent), (b) condenser les blocs explicatifs après chaque diagramme
   (qui sont parfois redondants avec la légende `caption:`), (c) déporter les
   extraits SQL longs en annexe et ne garder qu'un *snippet* en 5.5. Recommandé : **(a)**, parce que les diagrammes UML constituent l'essentiel
   du REAC §5 et leur taille est non compressible sans perdre la lisibilité.

2. **Migration `fix_snake_case` documentée comme dette** : le fait que cette
   migration `DROP COLUMN avatarUrl` + `ADD COLUMN avatar_url` (au lieu d'un
   `RENAME`) **perd les données** des avatars en cas d'application sur une
   base avec données. Si le seed dev est lancé après cette migration, pas de
   souci ; mais pour la prod avec utilisateurs réels, c'est une dette
   d'irréversibilité qui mériterait peut-être une mention en section 12 ou
   13. À arbitrer avec claude.ai (item BACKLOG potentiel).

3. **PDF total = 61 pages** (section 5 = 19 + section 7 = 18 + autres
   squelettes). On va probablement dépasser largement les "30-40 pages" du
   plan REAC mentionné dans CONTEXT.md une fois toutes les sections rédigées.
   Item à arbitrer en fin de rédaction : (a) accepter le dépassement (le
   REAC ne plafonne pas strictement), ou (b) compresser certaines sections
   moins critiques.

4. **Extraits SQL `add_unique_constrain` minoritaires** : le rapport ne montre
   que 2 des 6 migrations en SQL. Si claude.ai veut illustrer plus largement
   l'évolution du schéma, on pourrait ajouter un extrait de
   `create_relation_table_user_available` qui illustre une refonte (DROP +
   ADD COLUMN + nouveau enum + nouvelle table de jonction) plus pédagogique
   qu'une simple contrainte d'unicité. À voir avec claude.ai.

5. **Cohérence terminologique `Rating` vs `evaluation`** : le dossier emploie
   `Rating` (modèle Prisma) ET `evaluation` (table BDD) en parallèle. Une
   note explicative a été ajoutée en 5.4 ; vérifier que les sections 7 et 8
   restent cohérentes sur ce point quand elles seront auditées.

---

## Volume final compilé

- **Section 5 dans le PDF** : pages **10 → 28** = **19 pages** (cible 5-7,
  largement dépassée — non réduite par instruction explicite)
- **PDF total** : **61 pages** (vs 44 pré-rédaction section 5 — soit
  +17 pages de contenu net pour la section 5)
- **Compilation** : OK, 0 erreur, warnings polices Inter / JetBrains Mono →
  fallback DejaVu actif comme prévu
- **Tous les `#image()` UML** : ✓ rendus correctement

---

## Mise à jour CONTEXT.md

Ligne ajoutée à l'historique des sessions :

```markdown
| 2026-05-08 | S5 | Audit ancrage code section 5 + ajustements | <hash> |
```
