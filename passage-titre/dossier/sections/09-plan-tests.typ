// =============================================================================
// Section 09 — Plan de tests (REAC §9)
// Volume cible : 2-3 pages
// Réf : ADR-010 (stratégie de tests),
//       docs/documentation-implementation/arc42/10-quality/
// =============================================================================

= Plan de tests <sec-plan-tests>

== Stratégie de tests

// TODO : référer ADR-010 (docs/documentation-implementation/arc42/09-decisions/010-*.md)
// Pyramide CIBLE de l'ADR-010 : unitaires (Vitest) → intégration → E2E
// (Playwright). RÉALISÉ : seul l'étage intégration existe (7 specs backend,
// Node Test Runner natif). Les étages Vitest et Playwright ne sont pas
// implémentés dans le livrable — ne pas les présenter comme faits.
// Couverture NON mesurée (aucun outil branché) ; l'option native Node 24
// décision documentée dans memoire (cf. memoire utilisateur "tenter outils
// natifs avant non mesurable").

== Tests backend (Node Test Runner natif)

Sept suites d'intégration ont été écrites pour le Node Test Runner natif, sans
framework tiers, couvrant les contrôleurs (authentification, profil, suivi,
recherche, conversations, messages) et les events Socket.IO.

*Cinq de ces sept suites échouent.* La cause est identifiée et unique : un bug
dans la fixture globale, qui ne garantit pas la création de la donnée de rôle
avant les utilisateurs de test — les utilisateurs sont alors insérés avec une
clé étrangère invalide et toute la suite tombe. Le défaut est dans le code de
test, pas dans le code applicatif, et il est commun aux cinq suites concernées.

Cette dette est assumée : elle n'a pas été corrigée avant la soutenance, la
priorité ayant été donnée à la finition fonctionnelle. Elle est documentée comme
premier chantier de reprise, et sa correction est de faible ampleur — réordonner
le #raw("beforeAll", lang: "ts") global. Conséquence honnête à en tirer : le
projet dispose d'une *intention* de couverture backend, pas d'un filet de
sécurité opérationnel, et aucune couverture n'a jamais été mesurée.

// TODO : lister les 7 fichiers de tests backend
// - backend/src/controllers/auth.controller.spec.test.ts
// - backend/src/controllers/conv.spec.test.ts
// - backend/src/controllers/message.spec.test.ts
// - backend/src/controllers/profile.controller.spec.test.ts
// - backend/src/controllers/follow.controller.spec.test.ts
// - backend/src/controllers/search.controller.spec.test.ts
// - backend/src/realtime/socket.spec.test.ts

== Absence de tests automatisés côté frontend

// ATTENTION — ne pas réintroduire de fichiers de tests front ici.
// Le livrable certifié ne contient AUCUN test frontend : ni Vitest, ni
// Playwright, ni Storybook. Vérifiable sur le dépôt de production :
//   grep -iE 'vitest|playwright|storybook' frontend/package.json  -> 0 resultat
// Les fichiers frontend/e2e/*.spec.ts et frontend/src/**/*.test.ts existent
// uniquement dans le depot de documentation, ajoutes APRES la periode projet.
// TODO : expliquer l'arbitrage (temps projet) et renvoyer au jeu d'essai
// manuel de la #ref(<sec-jeu-essai>, supplement: [section]), qui tient lieu de validation des parcours.

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
// → identifié comme dette V2 (cf. #ref(<sec-difficultes>, supplement: [section]))
