# 9. Décisions d'Architecture (ADRs)

Ce chapitre documente les **Architecture Decision Records (ADRs)** du projet SkillSwap. Chaque ADR capture le contexte, la décision prise, les alternatives considérées et les conséquences.

**Format utilisé** : [MADR (Markdown Any Decision Records)](https://adr.github.io/madr/)

---

## Index des ADRs

| # | Titre | Statut | Date | Lien |
|---|-------|--------|------|------|
| 001 | Next.js App Router | Accepté | 2024-12 | [→](./001-nextjs.md) |
| 002 | Tailwind CSS + shadcn/ui | Accepté | 2024-12 | [→](./002-tailwind.md) |
| 003 | Prisma ORM | Accepté | 2024-12 | [→](./003-prisma.md) |
| 004 | TanStack Query | Accepté | 2024-12 | [→](./004-tanstack-query.md) |
| 005 | Zod Validation | Accepté | 2024-12 | [→](./005-zod.md) |
| 006 | Atomic Design | Accepté | 2024-12 | [→](./006-atomic-design.md) |
| 007 | JWT Authentication | Accepté | 2024-12 | [→](./007-jwt.md) |
| 008 | Meilisearch | Proposé | 2025-01 | [→](./008-meilisearch.md) |
| 009 | Mock-to-API Pattern | Accepté | 2024-12 | [→](./009-mock-to-api.md) |
| 010 | Stratégie de Tests Diversifiée | Accepté | 2025-01 | [→](./010-testing-strategy.md) |

**Statuts possibles** : Proposé | Accepté | Déprécié | Rejeté

---

## Catégories de décisions

### Frontend

| ADR | Décision | Impact |
|-----|----------|--------|
| [001](./001-nextjs.md) | Next.js App Router | Framework et routing |
| [002](./002-tailwind.md) | Tailwind + shadcn/ui | Styling et composants UI |
| [004](./004-tanstack-query.md) | TanStack Query | State management serveur |
| [005](./005-zod.md) | Zod | Validation côté client |
| [006](./006-atomic-design.md) | Atomic Design | Organisation des composants |

### Backend

| ADR | Décision | Impact |
|-----|----------|--------|
| [003](./003-prisma.md) | Prisma ORM | Accès base de données |
| [005](./005-zod.md) | Zod | Validation côté serveur |
| [007](./007-jwt.md) | JWT Authentication | Sécurité et sessions |
| [008](./008-meilisearch.md) | Meilisearch | Recherche full-text |

### Méthodologie

| ADR | Décision | Impact |
|-----|----------|--------|
| [009](./009-mock-to-api.md) | Mock-to-API Pattern | Développement parallèle |
| [010](./010-testing-strategy.md) | Stratégie de Tests Diversifiée | Qualité et documentation |

---

## Template MADR

Chaque ADR suit ce format :

```markdown
# ADR-XXX : Titre

## Statut
Proposé | Accepté | Déprécié | Rejeté (date)

## Contexte
Quel est le problème ou la situation qui nécessite une décision ?

## Décision
Quelle est la décision prise ?

## Alternatives considérées
Quelles autres options ont été évaluées ?

## Conséquences
Quels sont les impacts positifs et négatifs de cette décision ?
```

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [8. Crosscutting](../08-crosscutting/index.md) | [10. Qualité](../10-quality/index.md) |
