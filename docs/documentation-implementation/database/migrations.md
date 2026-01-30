# Historique des migrations

Ce document retrace l'évolution du schéma de base de données SkillSwap.

## Vue d'ensemble

| Migration | Date | Description |
|-----------|------|-------------|
| `init` | 2024-12 | Création initiale du schéma |

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

**Nom** : `init`
**Date** : Décembre 2024

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

### Enums créés

- `RoleOfUser`
- `StatusOfConversation`
- `dayInAWeek`
- `Time`

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
- 8 catégories : Langues, Développement Web, Design, etc.
- ~30 compétences par catégorie
- 14 créneaux de disponibilité (7 jours × 2 périodes)

---

## Évolutions futures

| Migration planifiée | Description |
|---------------------|-------------|
| `add_user_premium` | Ajouter statut premium |
| `add_message_read_at` | Ajouter indicateur de lecture |
| `add_notification` | Système de notifications |
| `add_skill_level` | Niveau de compétence (débutant, intermédiaire, expert) |

## Voir aussi

- [Modèles](./models/user.md)
- [Relations](./relations.md)
- [ADR-003 : Prisma ORM](../arc42/09-decisions/003-prisma.md)
- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
