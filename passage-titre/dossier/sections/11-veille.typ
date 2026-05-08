// =============================================================================
// Section 11 — Veille technologique (REAC §11)
// Volume cible : 1-2 pages
// Format eBook O'clock : problématique + termes en EN + critère pertinence
// + solution mise en place
// =============================================================================

= Veille technologique

== Veille 1 — argon2 vs bcrypt pour le hashing des mots de passe

=== Problématique
// Quel algorithme de hashing choisir pour stocker les mots de passe en 2026 ?
// bcrypt est encore courant, argon2 est le standard moderne (gagnant du Password
// Hashing Competition 2015). Lequel adopter pour SkillSwap ?

=== Termes de recherche (anglais)
// - "argon2 vs bcrypt 2025"
// - "OWASP password storage cheat sheet"
// - "argon2id memory cost recommendation"
// - "bcrypt deprecation"

=== Critère d'évaluation de la pertinence
// - Source : OWASP Password Storage Cheat Sheet (autorité de référence)
// - Date : publication ≥ 2024 (algos cryptographiques évoluent vite)
// - Consensus communauté : Stack Overflow, articles techniques (Auth0, Cloudflare)
// - Compatibilité Node.js : maintenance active de la lib npm

=== Solution mise en place
// argon2id retenu (variante recommandée OWASP — résistant side-channel +
// résistant GPU). Lib `argon2` Node, paramètres par défaut (memory cost
// 65536 KiB, iterations 3, parallelism 4).
// Documenté ADR-007.
// Réf code : backend/src/services/auth.service.ts:21

== Veille 2 — Refresh token rotation

=== Problématique
// Comment gérer la durée de session sans compromettre la sécurité ? Un JWT
// long-lived est risqué (impossible à invalider), un JWT court oblige à se
// reconnecter constamment. La rotation refresh token est le compromis.

=== Termes de recherche (anglais)
// - "refresh token rotation OAuth 2.0"
// - "refresh token reuse detection"
// - "JWT best practices 2025"
// - "Auth0 refresh token rotation"

=== Critère d'évaluation
// - Source : RFC 6749 (OAuth 2.0) + Auth0 best practices
// - IETF drafts récents
// - Implémentation similaire chez les acteurs majeurs (GitHub, Slack, Discord)

=== Solution mise en place
// Pattern : accessToken JWT 15 min + refreshToken 30 jours en cookie httpOnly,
// rotation à chaque /refresh (ancien token invalidé, nouveau émis).
// La table RefreshToken Prisma trace les tokens valides → un token invalidé
// est physiquement supprimé.
// Réf code : backend/src/services/auth.service.ts:103-108

== Veille 3 — CVE Next.js (audit versions)

=== Problématique
// Next.js a connu plusieurs CVE en 2024-2025 (notamment CVE-2025-29927 sur
// le middleware). Comment maintenir SkillSwap à jour sans casser la build ?

=== Termes de recherche (anglais)
// - "Next.js CVE 2025"
// - "Next.js middleware bypass vulnerability"
// - "npm audit Next.js"
// - "Next.js 16 security advisory"

=== Critère d'évaluation
// - Source primaire : GitHub Security Advisories du repo vercel/next.js
// - CVSS score (priorité aux high/critical)
// - npm audit local
// - Date du commit de fix vs version installée

=== Solution mise en place
// Version Next.js 16.1.1 retenue (audit effectué — pas de CVE high/critical
// active). Process : npm audit hebdomadaire pendant le développement, mise
// à jour des deps via Dependabot (à activer sur le repo prod).

== Outils de veille utilisés

// TODO :
// - GitHub Notifications (advisories sur les repos starred)
// - Newsletters : This Week in Node, JavaScript Weekly, Bytes
// - Twitter/X : @vercel, @anthropic, comptes mainteneurs
// - Aggregateurs : Hacker News, Lobste.rs
// - Podcasts : Syntax.fm, ShopTalk Show
