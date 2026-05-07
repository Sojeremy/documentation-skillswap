# Modèle Role

Le modèle `Role` représente un rôle utilisateur dans l'application.

## Schéma Prisma

```prisma
model Role {
  id        Int        @id @default(autoincrement())
  name      RoleOfUser @default(Membre)
  users     User[]

  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @default(now()) @updatedAt @map("updated_at")

  @@map("role")
}

enum RoleOfUser {
  Membre
}
```

## Champs

| Champ | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | Int | Non | Identifiant unique |
| `name` | RoleOfUser | Non | Nom du rôle (enum) |
| `createdAt` | DateTime | Non | Date de création |
| `updatedAt` | DateTime | Non | Date de modification |

## Relations

| Relation | Type | Modèle cible | Description |
|----------|------|--------------|-------------|
| `users` | 1:N | [User](./user.md) | Utilisateurs ayant ce rôle |

## Rôles disponibles

| ID | Nom | Description |
|----|-----|-------------|
| 1 | Membre | Rôle par défaut |

!!! note "Évolution future"
    L'enum `RoleOfUser` est extensible : la table est prête à accueillir d'autres valeurs si le besoin métier émerge.

## Table SQL

```sql
CREATE TYPE "RoleOfUser" AS ENUM ('Membre');

CREATE TABLE "role" (
  id SERIAL PRIMARY KEY,
  name "RoleOfUser" NOT NULL DEFAULT 'Membre',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Voir aussi

- [User](./user.md)
- [Enums](../enums.md)
