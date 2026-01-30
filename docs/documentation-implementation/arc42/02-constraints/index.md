# 2. Contraintes d'Architecture

## 2.1 Contraintes techniques

| Contrainte | Description | Justification |
| ---------- | ----------- | ------------- |
| **TypeScript obligatoire** | Frontend et backend en TypeScript | Type safety, maintenabilité |
| **PostgreSQL** | Base de données relationnelle | Modèle de données complexe avec relations |
| **Docker** | Conteneurisation de tous les services | Reproductibilité, déploiement simplifié |
| **Node.js 20+** | Version LTS | Support long terme, performances |

---

## 2.2 Contraintes organisationnelles

| Contrainte | Impact | Mitigation |
| ---------- | ------ | ---------- |
| **Durée : 4 semaines** | Périmètre limité | MVP bien défini, features priorisées |
| **Équipe : 4 développeurs** | Parallélisation limitée | Séparation claire frontend/backend |
| **Formation O'clock** | Stack imposée (React, Express) | Utilisation des compétences acquises |
| **Projet pédagogique** | Documentation requise | Documentation as Code |

---

## 2.3 Contraintes légales

| Contrainte | Exigence | Solution |
| ---------- | -------- | -------- |
| **RGPD** | Protection des données personnelles | Consentement explicite, droit à l'oubli |
| **CGU** | Conditions d'utilisation claires | Page dédiée |
| **Mentions légales** | Identification de l'éditeur | Footer |

---

## 2.4 Conventions et standards

### Nommage

| Élément | Convention | Exemple |
| ------- | ---------- | ------- |
| Fichiers React | PascalCase | `ProfileCard.tsx` |
| Hooks | camelCase avec `use` | `useSearch.ts` |
| API endpoints | kebab-case | `/api/user-profile` |
| Tables BDD | snake_case | `user_has_skill` |

### Structure des dossiers

```plaintext
frontend/src/
├── app/              # Routes Next.js (App Router)
├── components/       # Atomic Design (atoms, molecules, organisms)
├── hooks/            # Custom hooks React
├── lib/              # Utilitaires et configuration
└── providers/        # Context providers

backend/src/
├── controllers/      # Logique HTTP
├── services/         # Logique métier
├── routers/          # Définition des routes
├── middlewares/      # Middlewares Express
└── validation/       # Schémas Zod
```

---

## 2.5 Décisions architecturales clés

!!! info "ADRs"
    Les décisions architecturales majeures sont documentées dans la [section 9 - Décisions](../09-decisions/index.md).

| Décision | Choix | Alternative rejetée |
| -------- | ----- | ------------------- |
| Framework frontend | Next.js 14 (App Router) | Create React App |
| Styling | Tailwind CSS + shadcn/ui | CSS Modules, Styled Components |
| State management | TanStack Query | Redux, Zustand |
| ORM | Prisma | Sequelize, TypeORM |
| Validation | Zod | Yup, Joi |

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [← 1. Introduction](../01-introduction/index.md) | [3. Contexte →](../03-context/index.md) |
