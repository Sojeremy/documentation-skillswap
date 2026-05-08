// =============================================================================
// Section 06 — Spécifications techniques (REAC §6)
// Volume cible : 3-4 pages
// Sous-sections : stack, patterns, ADRs, sécurité transversale
// =============================================================================

= Spécifications techniques

== Stack technique

// TODO : tableau ou liste structurée

=== Front-end
// - Next.js 16.1.1 (App Router, Server Components + Client Components)
// - React 19
// - TypeScript strict
// - Tailwind CSS v4
// - shadcn/ui (atoms primitifs)
// - Socket.IO Client
// - Vitest + Playwright
// - Storybook 8
// - Atomic Design (atoms / molecules / organisms / layouts / providers)

=== Back-end
// - Node.js 24
// - Express
// - Socket.IO 4
// - Prisma ORM (client TS)
// - PostgreSQL 16
// - Meilisearch
// - argon2 (hashing mots de passe)
// - jsonwebtoken
// - Zod (validation entrée)
// - multer (upload avatar)

=== Infrastructure
// - Docker Compose (dev + prod)
// - nginx (reverse proxy + WS upgrade Socket.IO)
// - Let's Encrypt + certbot
// - GitHub Actions (CI/CD)
// - Vercel (déploiement de la documentation MkDocs)

== Patterns architecturaux

=== Atomic Design (front)
// TODO : justifier — atoms réutilisables (Button, Input, Avatar), molecules
// (ConversationItem, MessageBubble), organisms (MessageThread, SearchPage),
// layouts (MainLayout), providers (AuthProvider). Permet une montée
// progressive de complexité et facilite Storybook.

=== Architecture en couches (back)
// TODO : routes → middlewares (auth + validation Zod) → controllers
// (orchestration HTTP) → services (logique métier) → Prisma (data).
// Module realtime/ séparé pour Socket.IO.

== Choix transversaux — ADRs

// TODO : référencer les 11 ADRs documentées dans
// docs/documentation-implementation/arc42/09-decisions/
// Tableau récap :
// - ADR-001 : choix Next.js
// - ADR-002 : Prisma ORM
// - ADR-003 : PostgreSQL
// - ADR-004 : hooks React natifs (TanStack Query rejeté)
// - ADR-005 : Atomic Design
// - ADR-006 : Tailwind v4
// - ADR-007 : argon2 vs bcrypt
// - ADR-008 : stockage avatars (disque local + nginx)
// - ADR-009 : Meilisearch
// - ADR-010 : stratégie de tests (Vitest + Playwright + Node coverage natif)
// - ADR-011 : Socket.IO (vs WebSocket natif vs SSE)

== Sécurité transversale

// TODO : récap les contrôles transverses (le détail est en section 8) :
// - HTTPS obligatoire en prod (Let's Encrypt)
// - CORS configuré sur allowedOrigin (config.ts)
// - Cookies httpOnly + secure + sameSite='strict' en prod
// - argon2 pour le hashing
// - JWT court (accessToken) + refresh token rotatif (30 j)
// - Validation Zod sur tous les endpoints REST
// - Rate limiting : ⚠️ à compléter (manque actuellement, à mentionner en
//   dette technique section 12)
// - Helmet : ⚠️ absent actuellement (dette assumée)
