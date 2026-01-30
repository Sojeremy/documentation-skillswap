# Modèle Available

Le modèle `Available` représente un créneau de disponibilité.

## Schéma Prisma

```prisma
model Available {
  id        Int              @id @default(autoincrement())
  day       dayInAWeek
  timeSlot  Time             @map("time_slot")
  users     UserHasAvailable[]

  createdAt DateTime         @default(now()) @map("created_at")
  updatedAt DateTime         @default(now()) @updatedAt @map("updated_at")

  @@map("available")
}

enum dayInAWeek {
  Lundi
  Mardi
  Mercredi
  Jeudi
  Vendredi
  Samedi
  Dimanche
}

enum Time {
  Morning
  Afternoon
}
```

## Champs

| Champ | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | Int | Non | Identifiant unique |
| `day` | dayInAWeek | Non | Jour de la semaine |
| `timeSlot` | Time | Non | Créneau (matin/après-midi) |
| `createdAt` | DateTime | Non | Date de création |
| `updatedAt` | DateTime | Non | Date de modification |

## Relations

| Relation | Type | Modèle cible | Description |
|----------|------|--------------|-------------|
| `users` | N:N | [User](./user.md) via UserHasAvailable | Utilisateurs disponibles sur ce créneau |

## Créneaux possibles

Il existe 14 créneaux possibles (7 jours × 2 périodes) :

| ID | Jour | Créneau |
|----|------|---------|
| 1 | Lundi | Morning |
| 2 | Lundi | Afternoon |
| 3 | Mardi | Morning |
| 4 | Mardi | Afternoon |
| ... | ... | ... |
| 13 | Dimanche | Morning |
| 14 | Dimanche | Afternoon |

## Table SQL

```sql
CREATE TABLE "available" (
  id SERIAL PRIMARY KEY,
  day VARCHAR NOT NULL,
  time_slot VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE "dayInAWeek" AS ENUM ('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche');
CREATE TYPE "Time" AS ENUM ('Morning', 'Afternoon');
```

## Exemples

### Ajouter une disponibilité à un utilisateur

```typescript
// Via la table de jonction
await prisma.userHasAvailable.create({
  data: {
    userId: currentUserId,
    availableId: 3  // Mardi matin
  }
});
```

### Récupérer les disponibilités d'un utilisateur

```typescript
const availabilities = await prisma.userHasAvailable.findMany({
  where: { userId },
  include: { available: true }
});
// [{ available: { day: 'Lundi', timeSlot: 'Morning' } }, ...]
```

### Trouver des utilisateurs disponibles

```typescript
const availableUsers = await prisma.user.findMany({
  where: {
    availabilities: {
      some: {
        available: {
          day: 'Mercredi',
          timeSlot: 'Afternoon'
        }
      }
    }
  }
});
```

## Validation

```typescript
const addProfileAvailabilitiesSchema = z.object({
  day: z.enum(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']),
  timeSlot: z.enum(['Morning', 'Afternoon'])
});
```

## Voir aussi

- [User](./user.md)
- [Enums](../enums.md)
