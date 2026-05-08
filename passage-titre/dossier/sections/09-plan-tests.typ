// =============================================================================
// Section 09 — Plan de tests (REAC §9)
// Volume cible : 2-3 pages
// Réf : ADR-010 (stratégie de tests),
//       docs/documentation-implementation/arc42/10-quality/
// =============================================================================

= Plan de tests

== Stratégie de tests

// TODO : référer ADR-010 (docs/documentation-implementation/arc42/09-decisions/010-*.md)
// Pyramide : tests unitaires (Vitest, schémas + utils) → tests intégration
// (Vitest backend sur controllers + Socket) → tests E2E (Playwright sur
// auth + recherche).
// Couverture mesurée nativement Node 24 (--experimental-test-coverage),
// décision documentée dans memoire (cf. memoire utilisateur "tenter outils
// natifs avant non mesurable").

== Tests backend (Vitest)

// TODO : lister les 7 fichiers de tests backend
// - backend/src/controllers/auth.controller.spec.test.ts
// - backend/src/controllers/conv.spec.test.ts
// - backend/src/controllers/message.spec.test.ts
// - backend/src/controllers/profile.controller.spec.test.ts
// - backend/src/controllers/follow.controller.spec.test.ts
// - backend/src/controllers/search.controller.spec.test.ts
// - backend/src/realtime/socket.spec.test.ts

== Tests E2E front (Playwright)

// TODO : lister les 2 fichiers E2E
// - frontend/e2e/auth.spec.ts
// - frontend/e2e/search.spec.ts
// - Playwright configuré dans playwright.config.ts

== Tests unitaires front (Vitest)

// TODO : lister les fichiers
// - frontend/src/lib/dateTime.utils.test.ts
// - frontend/src/lib/utils.test.ts
// - frontend/src/lib/validation/auth.validation.test.ts
// - frontend/src/lib/validation/updatePassword.validation.test.ts
// - frontend/src/lib/validation/updateProfile.validation.test.ts

== Plan de tests fonctionnels

// TODO : tableau format Troc & Graines / REAC
// Colonnes : Type | Utilisateur | Fonctionnalité | Page | Objectif | Version | Détails

#table(
  columns: (auto, auto, auto, auto, 1fr, auto, 1fr),
  inset: 6pt,
  align: left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Type*], [*Utilisateur*], [*Fonctionnalité*], [*Page*], [*Objectif*], [*Version*], [*Détails*],
  [Manuel], [Membre], [Inscription], [/inscription], [Créer un compte avec email valide], [v1.0], [Email + mot de passe ≥ 8 + confirmation],
  [Manuel], [Membre], [Connexion], [/connexion], [Se connecter avec identifiants valides], [v1.0], [Cookie httpOnly accessToken + refreshToken posés],
  [Manuel], [Membre], [Recherche], [/recherche], [Trouver un membre par compétence], [v1.0], [Debounce 300ms + filtre catégorie],
  [Manuel], [Membre], [Follow], [/profil/:id], [Suivre un autre membre], [v1.0], [Pré-requis pour messagerie],
  [Manuel], [Membre], [Conversation], [/conversation], [Démarrer une conversation], [v1.0], [Refus si pas de follow],
  [Manuel], [Membre], [Message temps réel], [/conversation], [Recevoir un message en live], [v1.0], [Socket.IO event message:new],
  [Manuel], [Membre], [Évaluation], [/conversation], [Noter un membre après échange], [v1.0], [Pré-requis follow + dialog au close],
  // TODO : compléter avec d'autres scénarios
)

== Manques honnêtes (à mentionner)

// TODO : transparence avec le jury
// - Pas de tests E2E sur la messagerie temps réel (le scénario manuel section
//   10 sert de jeu d'essai)
// - Pas de tests unitaires des hooks frontend (messaging/* et profile/*)
// - Pas de tests d'intégration Meilisearch (mocked dans les tests search)
// - Couverture front non mesurée (uniquement back via Node coverage natif)
// → identifié comme dette V2 (cf. section 12)
