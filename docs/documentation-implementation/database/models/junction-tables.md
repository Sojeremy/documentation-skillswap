# Tables de jonction

Les tables de jonction implémentent les relations N:N entre les modèles.

## Vue d'ensemble

| Table | Modèle A | Modèle B | Description |
|-------|----------|----------|-------------|
| `user_has_skill` | User | Skill | Compétences possédées |
| `user_has_interest` | User | Skill | Compétences recherchées |
| `user_has_available` | User | Available | Disponibilités |
| `user_has_conversation` | User | Conversation | Participants aux conversations |

---

## UserHasSkill

Associe un utilisateur à ses compétences offertes.

### Schéma Prisma

```prisma
model UserHasSkill {
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int      @map("user_id")
  skill     Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)
  skillId   Int      @map("skill_id")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")

  @@id([userId, skillId])
  @@map("user_has_skill")
}
```

### Clé primaire composite

```sql
PRIMARY KEY (user_id, skill_id)
```

### Exemple d'utilisation

```typescript
// Ajouter une compétence à un utilisateur
await prisma.userHasSkill.create({
  data: { userId: 1, skillId: 5 }
});

// Récupérer les skills d'un utilisateur
const skills = await prisma.userHasSkill.findMany({
  where: { userId: 1 },
  include: { skill: { include: { category: true } } }
});
```

---

## UserHasInterest

Associe un utilisateur aux compétences qu'il souhaite apprendre.

### Schéma Prisma

```prisma
model UserHasInterest {
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int      @map("user_id")
  skill     Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)
  skillId   Int      @map("skill_id")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")

  @@id([userId, skillId])
  @@map("user_has_interest")
}
```

### Exemple d'utilisation

```typescript
// Ajouter un intérêt
await prisma.userHasInterest.create({
  data: { userId: 1, skillId: 10 }
});

// Trouver des matchs : utilisateurs qui offrent ce que je cherche
const matches = await prisma.user.findMany({
  where: {
    skills: {
      some: {
        skillId: { in: myInterestSkillIds }
      }
    }
  }
});
```

---

## UserHasAvailable

Associe un utilisateur à ses créneaux de disponibilité.

### Schéma Prisma

```prisma
model UserHasAvailable {
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      Int       @map("user_id")
  available   Available @relation(fields: [availableId], references: [id], onDelete: Cascade)
  availableId Int       @map("available_id")

  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @default(now()) @updatedAt @map("updated_at")

  @@id([userId, availableId])
  @@map("user_has_available")
}
```

### Exemple d'utilisation

```typescript
// Ajouter une disponibilité
await prisma.userHasAvailable.create({
  data: { userId: 1, availableId: 3 } // Mardi matin
});

// Trouver des utilisateurs disponibles en même temps que moi
const commonAvailability = await prisma.user.findMany({
  where: {
    availabilities: {
      some: {
        availableId: { in: myAvailabilityIds }
      }
    }
  }
});
```

---

## UserHasConversation

Associe les participants à une conversation.

### Schéma Prisma

```prisma
model UserHasConversation {
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId         Int          @map("user_id")
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  conversationId Int          @map("conversation_id")

  createdAt      DateTime     @default(now()) @map("created_at")
  updatedAt      DateTime     @default(now()) @updatedAt @map("updated_at")

  @@id([userId, conversationId])
  @@map("user_has_conversation")
}
```

### Exemple d'utilisation

```typescript
// Créer une conversation avec participants
const conversation = await prisma.conversation.create({
  data: {
    title: 'Discussion',
    users: {
      create: [
        { userId: 1 },
        { userId: 42 }
      ]
    }
  }
});

// Vérifier si un utilisateur participe à une conversation
const isParticipant = await prisma.userHasConversation.findUnique({
  where: {
    userId_conversationId: {
      userId: currentUserId,
      conversationId: conversationId
    }
  }
});
```

---

## Patterns communs

### Ajouter plusieurs relations en une fois

```typescript
await prisma.userHasSkill.createMany({
  data: skillIds.map(skillId => ({
    userId: currentUserId,
    skillId
  })),
  skipDuplicates: true
});
```

### Supprimer une relation

```typescript
await prisma.userHasSkill.delete({
  where: {
    userId_skillId: {
      userId: currentUserId,
      skillId: skillToRemove
    }
  }
});
```

### Remplacer toutes les relations

```typescript
await prisma.$transaction([
  prisma.userHasSkill.deleteMany({
    where: { userId: currentUserId }
  }),
  prisma.userHasSkill.createMany({
    data: newSkillIds.map(skillId => ({
      userId: currentUserId,
      skillId
    }))
  })
]);
```

## Voir aussi

- [User](./user.md)
- [Skill](./skill.md)
- [Available](./available.md)
- [Conversation](./conversation.md)
- [Relations](../relations.md)
