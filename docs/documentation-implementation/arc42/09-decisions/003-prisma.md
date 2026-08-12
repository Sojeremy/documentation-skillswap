# ADR-003 : Prisma ORM

## Statut

Accepté (2024-12)

## Contexte

SkillSwap backend doit interagir avec PostgreSQL de manière type-safe, gérer les migrations et simplifier les requêtes sur les relations N:N (4 tables de jonction).

## Décision

**Prisma ORM** plutôt que TypeORM, Knex.js ou SQL raw.

!!! warning "Portée exacte de cette décision"
    Prisma est utilisé **directement depuis les services**. SkillSwap n'implémente
    **ni pattern Repository, ni DAO, ni entités de domaine, ni couche DTO** : les
    7 services appellent `prisma.<modèle>.<verbe>()` sans abstraction intermédiaire.
    Le dossier `backend/src/models/` ne contient pas de modèles métier — il contient
    l'instanciation du client (`index.ts`, 8 lignes) et deux scripts de seeding.
    C'est un choix assumé de simplicité, pas une couche d'abstraction omise dans la
    documentation.

## Alternatives considérées

| Critère        | Prisma       | TypeORM     | Knex.js    | SQL raw    |
| -------------- | ------------ | ----------- | ---------- | ---------- |
| Type safety    | Excellent    | Bon         | Aucun      | Aucun      |
| Migrations     | Auto         | Manuel      | Manuel     | Manuel     |
| DX             | Excellent    | Moyen       | Moyen      | Faible     |
| Performance    | Bon          | Bon         | Excellent  | Excellent  |
| Prisma Studio  | Oui          | Non         | Non        | Non        |

## Conséquences

### Positives

- Client 100% type-safe auto-généré
- Migrations versionnées et reproductibles
- Prisma Studio pour visualiser les données
- Relations N:N gérées simplement

### Négatives

- Génération de client à chaque changement de schéma
- Dépendance forte (difficile à remplacer)
- L'ORM ne couvre pas tout : une agrégation a dû être écrite en SQL brut (cf. ci-dessous)

---

## Composants d'accès aux données réellement implémentés

Cette section décrit ce qui existe dans le dépôt, fichier par fichier.

### 1. Point d'instanciation unique — `backend/src/models/index.ts`

```typescript
// backend/src/models/index.ts:1-8 (copie verbatim)
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/client.ts';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

export * from '../../prisma/generated/prisma/client.ts';
```

Un **seul** `new PrismaClient()` dans tout le backend : le pool de connexions est
partagé par l'ensemble des services. Le client est instancié avec le **driver
adapter** `PrismaPg` (`@prisma/adapter-pg`), le mode introduit par Prisma 7 dans
lequel les requêtes passent par le driver `pg` natif de Node plutôt que par le
moteur binaire Rust historique.

### 2. Accès nominal — l'API typée du client, appelée depuis les services

Les 7 services consomment directement le client généré. Exemple de lecture avec
relations imbriquées (`backend/src/mappers/member.mapper.ts:14-28`) :

```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    skills: { include: { skill: { include: { category: true } } } },
    evaluationsReceived: true,
  },
});
```

### 3. Requête SQL brute **paramétrée** — `backend/src/services/category.service.ts:34-56`

Le classement des catégories par nombre d'utilisateurs distincts exige une
agrégation sur deux jointures que l'API typée n'exprime pas efficacement. Elle est
donc écrite en SQL, mais **via le constructeur `Prisma.sql`**, qui produit une
requête préparée à paramètres liés — et non par concaténation de chaînes :

```typescript
// backend/src/services/category.service.ts:34-56 (extrait verbatim)
let query = Prisma.sql`
    SELECT
      c.id,
      c.name,
      c.slug,
      COUNT(DISTINCT uhs.user_id) as user_count,
      COUNT(DISTINCT s.id) as skill_count,
      c.created_at,
      c.updated_at
    FROM category c
    LEFT JOIN skill s ON s.category_id = c.id
    LEFT JOIN user_has_skill uhs ON uhs.skill_id = s.id
    GROUP BY c.id, c.name, c.slug, c.created_at, c.updated_at
    ORDER BY user_count DESC
  `;

// Add limit clause if it's defined by options
if (limit) {
  query = Prisma.sql`${query} LIMIT ${limit}`;
}

// Execute query
const result = await prisma.$queryRaw<CategoryWithUserCountDB[]>(query);
```

C'est la **seule** requête brute du projet. Le `limit` interpolé dans un template
`Prisma.sql` devient un paramètre lié (`$1`), pas un fragment de SQL : l'injection
est structurellement impossible sur ce chemin.

### 4. Transaction — `backend/src/services/conv.service.ts:188`

L'ouverture d'une conversation doit vérifier la relation de suivi puis créer la
conversation et ses participants de façon atomique :

```typescript
return prisma.$transaction(async (tx) => {
  // 1) Viewer must follow receiver
  const isFollowing = await tx.follow.findUnique({ /* ... */ });
  // ...
});
```

C'est la **seule** transaction explicite du projet ; ailleurs, l'atomicité repose
sur les écritures imbriquées de Prisma (`create` avec relations) et sur les
contraintes du schéma.

### 5. Mapper de projection — `backend/src/mappers/member.mapper.ts` (55 LOC)

`userToDocument(userId)` lit un utilisateur et ses relations puis les projette
vers le document plat indexé par Meilisearch (`MemberDocument`), en calculant au
passage la note moyenne. C'est le seul composant du backend qui joue un rôle de
transformation entre modèle persisté et modèle consommé.

### Ce qui n'existe pas

Ni repository, ni DAO, ni entité de domaine, ni couche DTO générale, ni cache
applicatif, ni requête stockée côté base.

---

## Schéma actuel

14 modèles, 4 enums

```bash
npx prisma generate     # Générer le client
npx prisma migrate dev  # Créer une migration
npx prisma studio       # Visualiser les données
```

---

[← Retour à l'index](./index.md)
