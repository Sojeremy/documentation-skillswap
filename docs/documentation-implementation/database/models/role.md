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
    D'autres rôles pourront être ajoutés (Admin, Moderateur, etc.).

## Table SQL

```sql
CREATE TABLE "role" (
  id SERIAL PRIMARY KEY,
  name VARCHAR DEFAULT 'Membre',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE "RoleOfUser" AS ENUM ('Membre');
```

## Voir aussi

- [User](./user.md)
- [Enums](../enums.md)
