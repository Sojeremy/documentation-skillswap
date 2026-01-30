# Enums de la base de données

SkillSwap utilise 4 enums PostgreSQL pour garantir l'intégrité des données.

## Vue d'ensemble

| Enum | Valeurs | Utilisé par |
|------|---------|-------------|
| `RoleOfUser` | Membre | Role.name |
| `StatusOfConversation` | Open, Close | Conversation.status |
| `dayInAWeek` | Lundi...Dimanche | Available.day |
| `Time` | Morning, Afternoon | Available.timeSlot |

---

## RoleOfUser

Définit les rôles possibles pour un utilisateur.

### Définition Prisma

```prisma
enum RoleOfUser {
  Membre
}
```

### Valeurs

| Valeur | Description |
|--------|-------------|
| `Membre` | Utilisateur standard (défaut) |

### SQL

```sql
CREATE TYPE "RoleOfUser" AS ENUM ('Membre');
```

### Utilisation

```typescript
const role = await prisma.role.create({
  data: { name: 'Membre' }
});
```

!!! note "Évolution future"
    Des rôles supplémentaires pourront être ajoutés : `Admin`, `Moderateur`, `Premium`.

---

## StatusOfConversation

Définit l'état d'une conversation.

### Définition Prisma

```prisma
enum StatusOfConversation {
  Open
  Close
}
```

### Valeurs

| Valeur | Description |
|--------|-------------|
| `Open` | Conversation active (défaut) |
| `Close` | Conversation fermée/archivée |

### SQL

```sql
CREATE TYPE "StatusOfConversation" AS ENUM ('Open', 'Close');
```

### Utilisation

```typescript
// Créer une conversation ouverte
const conversation = await prisma.conversation.create({
  data: {
    title: 'Discussion',
    status: 'Open'
  }
});

// Archiver une conversation
await prisma.conversation.update({
  where: { id: conversationId },
  data: { status: 'Close' }
});

// Filtrer les conversations actives
const activeConversations = await prisma.conversation.findMany({
  where: { status: 'Open' }
});
```

---

## dayInAWeek

Définit les jours de la semaine pour les disponibilités.

### Définition Prisma

```prisma
enum dayInAWeek {
  Lundi
  Mardi
  Mercredi
  Jeudi
  Vendredi
  Samedi
  Dimanche
}
```

### Valeurs

| Valeur | Jour |
|--------|------|
| `Lundi` | Monday |
| `Mardi` | Tuesday |
| `Mercredi` | Wednesday |
| `Jeudi` | Thursday |
| `Vendredi` | Friday |
| `Samedi` | Saturday |
| `Dimanche` | Sunday |

### SQL

```sql
CREATE TYPE "dayInAWeek" AS ENUM (
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi',
  'Vendredi', 'Samedi', 'Dimanche'
);
```

### Utilisation

```typescript
// Créer un créneau
const available = await prisma.available.create({
  data: {
    day: 'Mercredi',
    timeSlot: 'Afternoon'
  }
});

// Filtrer par jour
const wednesdaySlots = await prisma.available.findMany({
  where: { day: 'Mercredi' }
});
```

---

## Time

Définit les créneaux horaires (matin/après-midi).

### Définition Prisma

```prisma
enum Time {
  Morning
  Afternoon
}
```

### Valeurs

| Valeur | Description | Horaires typiques |
|--------|-------------|-------------------|
| `Morning` | Matin | 8h - 12h |
| `Afternoon` | Après-midi | 14h - 18h |

### SQL

```sql
CREATE TYPE "Time" AS ENUM ('Morning', 'Afternoon');
```

### Utilisation

```typescript
// Tous les créneaux du matin
const morningSlots = await prisma.available.findMany({
  where: { timeSlot: 'Morning' }
});
```

---

## Validation Zod

Les enums sont validés côté API avec Zod :

```typescript
// validation/profile.validation.ts
import { z } from 'zod';

export const addProfileAvailabilitiesSchema = z.object({
  day: z.enum([
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi',
    'Vendredi', 'Samedi', 'Dimanche'
  ]),
  timeSlot: z.enum(['Morning', 'Afternoon'])
});
```

---

## Migration d'enum

Pour ajouter une valeur à un enum existant :

```sql
-- Ajouter un nouveau rôle
ALTER TYPE "RoleOfUser" ADD VALUE 'Admin';

-- Ajouter un nouveau statut
ALTER TYPE "StatusOfConversation" ADD VALUE 'Archived';
```

!!! warning "Attention"
    PostgreSQL ne permet pas de supprimer des valeurs d'un enum. Planifiez soigneusement les valeurs initiales.

---

## Types TypeScript générés

Prisma génère automatiquement les types correspondants :

```typescript
// generated/prisma/index.ts
export const RoleOfUser: {
  Membre: 'Membre'
};

export const StatusOfConversation: {
  Open: 'Open',
  Close: 'Close'
};

export const dayInAWeek: {
  Lundi: 'Lundi',
  Mardi: 'Mardi',
  // ...
};

export const Time: {
  Morning: 'Morning',
  Afternoon: 'Afternoon'
};
```

## Voir aussi

- [Modèles](./models/user.md)
- [Relations](./relations.md)
- [ADR-003 : Prisma ORM](../arc42/09-decisions/003-prisma.md)
