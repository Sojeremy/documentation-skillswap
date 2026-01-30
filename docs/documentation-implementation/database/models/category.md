# Modèle Category

Le modèle `Category` représente une catégorie de compétences.

## Schéma Prisma

```prisma
model Category {
  id        Int      @id @default(autoincrement())
  name      String
  slug      String   @unique
  skills    Skill[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")

  @@map("category")
}
```

## Champs

| Champ | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | Int | Non | Identifiant unique |
| `name` | String | Non | Nom affiché |
| `slug` | String | Non | Slug URL unique |
| `createdAt` | DateTime | Non | Date de création |
| `updatedAt` | DateTime | Non | Date de modification |

## Relations

| Relation | Type | Modèle cible | Description |
|----------|------|--------------|-------------|
| `skills` | 1:N | [Skill](./skill.md) | Compétences de cette catégorie |

## Contraintes

- `slug` : Unique

## Table SQL

```sql
CREATE TABLE "category" (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Catégories actuelles

| ID | Nom | Slug |
|----|-----|------|
| 1 | Langues | langues |
| 2 | Développement Web | developpement-web |
| 3 | Design | design |
| 4 | Musique | musique |
| 5 | Sport | sport |
| 6 | Cuisine | cuisine |
| 7 | Photo/Vidéo | photo-video |
| 8 | Autre | autre |

## Exemples

### Lister toutes les catégories avec leurs skills

```typescript
const categories = await prisma.category.findMany({
  include: {
    skills: true,
    _count: { select: { skills: true } }
  }
});
```

### Trouver par slug

```typescript
const category = await prisma.category.findUnique({
  where: { slug: 'developpement-web' },
  include: { skills: true }
});
```

## Endpoint API

```
GET /api/v1/categories
```

Endpoint public (pas d'authentification requise).

## Voir aussi

- [Skill](./skill.md)
