// =============================================================================
// Section 01 — Compétences du référentiel CDA (REAC §1)
// Volume cible : 1-2 pages
// Sous-sections : AT1 / AT2 / AT3 — pour chaque CP, 2-4 lignes de couverture
// CP obligatoires (eBook O'clock) : CP2 → CP9
// SkillSwap couvre aussi : CP1, CP10, CP11 (Docker, déploiement, DevOps)
// Réf. REAC : page 8 du référentiel CDA RNCP Niveau 6
// =============================================================================

= Compétences du référentiel CDA couvertes

== AT1 — Développer une application sécurisée

=== CP1 — Installer et configurer son environnement de travail
// TODO : Docker Compose dev (5 services), nvm Node 24, scripts npm,
// VS Code + extensions, ESLint/Prettier configurés.

=== CP2 — Développer des interfaces utilisateur
// TODO : Next.js 16.1.1 App Router, Atomic Design (atoms/molecules/organisms),
// Storybook, Tailwind v4, accessibilité (aria-label sur MessageInput).

=== CP3 — Développer des composants métier
// TODO : useMessaging.ts orchestrateur (139 LOC), 7 sous-hooks messaging/*,
// optimistic UI (addOptimisticMessage), gestion du graphe social (Follow).

=== CP4 — Contribuer à la gestion d'un projet informatique
// TODO : voir section 04 — Scrum, GitHub Projects, code review,
// definition of done.

== AT2 — Concevoir et développer une application sécurisée organisée en couches

=== CP5 — Analyser les besoins et maquetter une application
// TODO : interviews persona, MVP vs hors-scope, maquettes Figma (à intégrer),
// user stories.

=== CP6 — Définir l'architecture logicielle d'une application
// TODO : Arc42 (12 sections publiées sur Vercel), 11 ADRs, choix monolithique
// modulaire (cf. docs/documentation-implementation/arc42/05-building-blocks/).

=== CP7 — Concevoir et mettre en place une base de données relationnelle
// TODO : 14 modèles Prisma, ERD généré (docs/documentation-implementation/arc42/diagrams/erd.svg),
// migrations versionnées (backend/prisma/migrations/), seeding dev.

=== CP8 — Développer des composants d'accès aux données SQL et NoSQL
// TODO : Prisma ORM (PostgreSQL 16), Meilisearch (NoSQL pour la recherche),
// pattern repository implicite via services.

== AT3 — Préparer le déploiement d'une application sécurisée

=== CP9 — Préparer et exécuter les plans de tests d'une application
// TODO : voir section 09 — Vitest backend (7 spec files), Playwright E2E
// (auth + search), coverage natif Node --experimental-test-coverage.

=== CP10 — Préparer et documenter le déploiement d'une application
// TODO : Docker prod (6 services), nginx + Let's Encrypt, GitHub Actions,
// deux domaines : skill-swap.fr (prod) + skillswap-docs.vercel.app (doc).

=== CP11 — Contribuer à la mise en production dans une démarche DevOps
// TODO : CI/CD GitHub Actions, monitoring (à compléter), gestion des secrets,
// rollback strategy, ADR-008 stockage.
