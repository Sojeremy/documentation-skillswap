# ADR-003 : Prisma ORM

## Statut

Accepté (2024-12)

## Contexte

SkillSwap backend nécessite une couche d'accès aux données pour interagir avec PostgreSQL de manière type-safe, gérer les migrations et simplifier les requêtes complexes (relations N:N).

## Décision

**Prisma ORM** plutôt que TypeORM, Knex.js ou SQL raw.

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

## Schéma actuel

14 modèles, 4 enums

```bash
npx prisma generate     # Générer le client
npx prisma migrate dev  # Créer une migration
npx prisma studio       # Visualiser les données
```

---

[← Retour à l'index](./index.md)
