# SkillSwap - Documentation Technique

Bienvenue dans la documentation technique de **SkillSwap**, une plateforme d'échange de compétences entre particuliers.

---

## Navigation rapide

| Section | Description |
| ------- | ----------- |
| [Architecture (Arc42)](arc42/01-introduction/index.md) | Documentation architecture complète |
| [API Reference](api-reference/index.md) | Endpoints REST documentés |
| [Base de données](database/index.md) | Schéma et modèles Prisma |
| [Infrastructure](infrastructure/index.md) | Docker et déploiement |

---

## Stack technique

### Frontend

- **Next.js 16.1.1** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utilitaire
- **shadcn/ui** - Composants UI (Radix + Tailwind)
- **socket.io-client** - Messagerie temps réel
- **Hooks React natifs** - State serveur via composition (cf. [ADR-004](arc42/09-decisions/004-tanstack-query.md) — TanStack Query rejeté ; et [05-building-blocks/frontend.md](arc42/05-building-blocks/frontend.md))

### Backend

- **Express.js** - Framework HTTP minimaliste
- **TypeScript** - Typage statique
- **Prisma** - ORM type-safe
- **PostgreSQL 16** - Base de données relationnelle
- **Zod** - Validation des données

### Infrastructure

- **Docker Compose** - Orchestration des services
- **Nginx** - Reverse proxy
- **Meilisearch** - Moteur de recherche full-text

---

## Liens utiles

- [Repository GitHub](https://github.com/Sojeremy/documentation-skillswap)
- [Guide Utilisateur](https://guide.skillswap.vercel.app) *(à venir)*
- [Storybook](https://storybook.skillswap.vercel.app) *(à venir)*

---

## Équipe

Projet réalisé dans le cadre de la formation O'clock - Promotion Dublin.
