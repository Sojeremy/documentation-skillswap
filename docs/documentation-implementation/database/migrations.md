# Historique des migrations

Ce document retrace l'évolution du schéma de base de données SkillSwap.

## Vue d'ensemble

| # | Migration | Date | Description |
|---|-----------|------|-------------|
| 1 | `20260112133206_init_db` | 2026-01-12 | Création initiale (14 tables, 3 enums, FK, index) |
| 2 | `20260114134738_add_category_slug` | 2026-01-14 | Ajout colonne `slug` (NOT NULL) sur `category` + index unique |
| 3 | `20260116161218_create_relation_table_user_available` | 2026-01-16 | Refonte `Available` : jonction `user_has_available`, ajout enum `Time`, colonne `time_slot` |
| 4 | `20260117012249_fix_snake_case` | 2026-01-17 | Correction `user.avatarUrl` → `user.avatar_url` |
| 5 | `20260118042859_add_unique_constrain` | 2026-01-18 | Index uniques composites sur `evaluation` et `follow` |
| 6 | `20260120123059_make_the_comment_field_in_the_rating_table_optional` | 2026-01-20 | `evaluation.comments` passe NULLABLE |

## Commandes Prisma

### Développement

```bash
# Créer une nouvelle migration
npx prisma migrate dev --name add_user_age

# Appliquer les migrations en attente
npx prisma migrate dev

# Réinitialiser la base (ATTENTION: supprime les données)
npx prisma migrate reset

# Voir le statut des migrations
npx prisma migrate status
```

### Production

```bash
# Appliquer les migrations sans interaction
npx prisma migrate deploy

# Vérifier les migrations en attente
npx prisma migrate status
```

### Génération du client

```bash
# Régénérer le client Prisma après modification du schéma
npx prisma generate
```

---

## Migration initiale

**Nom** : `20260112133206_init_db`
**Date** : 12 janvier 2026

### Tables créées

| Table | Description |
|-------|-------------|
| `user` | Utilisateurs |
| `role` | Rôles utilisateur |
| `skill` | Compétences |
| `category` | Catégories de compétences |
| `user_has_skill` | Jonction User-Skill (compétences) |
| `user_has_interest` | Jonction User-Skill (intérêts) |
| `available` | Créneaux de disponibilité |
| `user_has_available` | Jonction User-Available |
| `conversation` | Conversations |
| `user_has_conversation` | Jonction User-Conversation |
| `message` | Messages |
| `evaluation` | Notes/évaluations |
| `follow` | Abonnements |
| `refresh_token` | Tokens de refresh |

### Enums créés à l'init

- `RoleOfUser` (1 valeur : `Membre`)
- `StatusOfConversation` (`Open`, `Close`)
- `dayInAWeek` (`Lundi` à `Dimanche`)

L'enum `Time` (`Morning`, `Afternoon`) a été ajouté ultérieurement par la migration 3 lors de la refonte de la table `Available`.

### SQL généré (extrait)

```sql
-- CreateEnum
CREATE TYPE "RoleOfUser" AS ENUM ('Membre');
CREATE TYPE "StatusOfConversation" AS ENUM ('Open', 'Close');
CREATE TYPE "dayInAWeek" AS ENUM ('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche');
CREATE TYPE "Time" AS ENUM ('Morning', 'Afternoon');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "postal_code" INTEGER,
    "city" TEXT,
    "age" INTEGER,
    "avatar_url" TEXT,
    "description" TEXT,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey"
    FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## Migrations suivantes

### 2 — `20260114134738_add_category_slug`

**Date** : 14 janvier 2026

Ajoute une colonne `slug TEXT NOT NULL` sur `category` avec un index unique. Permet l'utilisation de slugs URL-friendly pour les pages catégories.

```sql
ALTER TABLE "category" ADD COLUMN "slug" TEXT NOT NULL;
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");
```

### 3 — `20260116161218_create_relation_table_user_available`

**Date** : 16 janvier 2026

Refonte du modèle de disponibilités :

- Suppression des colonnes `start`, `end`, `user_id` de `available`
- Ajout de l'enum `Time` (`Morning`, `Afternoon`)
- Ajout de la colonne `time_slot` sur `available`
- Création de la table de jonction `user_has_available` (PK composite `(user_id, available_id)`)

Cette migration normalise le modèle : un créneau (`available`) devient indépendant de l'utilisateur, plusieurs utilisateurs peuvent partager le même créneau.

### 4 — `20260117012249_fix_snake_case`

**Date** : 17 janvier 2026

Renomme `user.avatarUrl` en `user.avatar_url`. Corrige l'oubli de `@map()` lors de la migration initiale (les autres colonnes camelCase étaient déjà correctement mappées).

```sql
ALTER TABLE "user" DROP COLUMN "avatarUrl",
ADD COLUMN "avatar_url" TEXT;
```

### 5 — `20260118042859_add_unique_constrain`

**Date** : 18 janvier 2026

Ajoute deux contraintes d'unicité métier :

- `(evaluator_id, evaluated_id)` sur `evaluation` : un utilisateur ne peut évaluer un autre qu'une seule fois.
- `(followed_id, follower_id)` sur `follow` : un utilisateur ne peut suivre un autre qu'une seule fois.

```sql
CREATE UNIQUE INDEX "evaluation_evaluator_id_evaluated_id_key"
  ON "evaluation"("evaluator_id", "evaluated_id");
CREATE UNIQUE INDEX "follow_followed_id_follower_id_key"
  ON "follow"("followed_id", "follower_id");
```

### 6 — `20260120123059_make_the_comment_field_in_the_rating_table_optional`

**Date** : 20 janvier 2026

Rend le champ `comments` de la table `evaluation` optionnel (NULL autorisé). Permet de laisser une note sans commentaire textuel.

```sql
ALTER TABLE "evaluation" ALTER COLUMN "comments" DROP NOT NULL;
```

---

## Bonnes pratiques

### Nommage des migrations

```bash
# Format recommandé
npx prisma migrate dev --name add_<feature>
npx prisma migrate dev --name update_<table>_<change>
npx prisma migrate dev --name remove_<feature>

# Exemples
npx prisma migrate dev --name add_user_bio
npx prisma migrate dev --name update_message_add_read_at
npx prisma migrate dev --name remove_legacy_tokens
```

### Avant de migrer

1. **Backup** la base de données en production
2. **Tester** la migration en local/staging
3. **Vérifier** avec `prisma migrate status`
4. **Planifier** une fenêtre de maintenance si nécessaire

### Migrations en équipe

```bash
# Récupérer les dernières migrations
git pull

# Appliquer les migrations des collègues
npx prisma migrate dev

# Régénérer le client
npx prisma generate
```

---

## Résolution de conflits

### Migration divergente

Si plusieurs développeurs créent des migrations en parallèle :

```bash
# Voir le statut
npx prisma migrate status

# Résoudre en réinitialisant (dev uniquement)
npx prisma migrate reset

# Ou merger manuellement les migrations
```

### Migration échouée

```bash
# Voir les détails de l'erreur
npx prisma migrate status

# Marquer comme résolue manuellement
npx prisma migrate resolve --applied "migration_name"
```

---

## Seed

### Exécuter le seed

```bash
npx prisma db seed
```

### Configuration dans package.json

```json
{
  "prisma": {
    "seed": "ts-node backend/src/models/seeding.ts"
  }
}
```

### Données de seed

- 1 rôle : `Membre`
- 8 catégories : Développement Web, Design, Marketing, Langues, Cuisine, Sport, Musique, Bricolage
- 28 compétences au total (3 à 5 par catégorie)
- 14 créneaux de disponibilité (7 jours × 2 périodes)

---

## Évolutions futures

Aucune migration formellement planifiée à ce jour. Les évolutions du schéma seront ajoutées au fur et à mesure des besoins, en suivant les bonnes pratiques décrites ci-dessus.

## Voir aussi

- [Modèles](./models/user.md)
- [Relations](./relations.md)
- [ADR-003 : Prisma ORM](../arc42/09-decisions/003-prisma.md)
- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
