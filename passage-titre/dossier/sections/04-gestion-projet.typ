// =============================================================================
// Section 04 — Gestion de projet (REAC §4)
// Volume cible : 2-3 pages
// Sous-sections : méthodologie, outils, équipe, rituels, communication, qualité
// =============================================================================

= Gestion de projet <sec-gestion>

== Méthodologie agile — Scrum

// TODO : Scrum adapté apothéose — sprints d'1 semaine (5 sprints sur 5
// semaines), rituels condensés. Rôles : Product Owner, Scrum Master, équipe
// dev. Backlog priorisé en début de projet, refining hebdo.

== Outils de gestion de projet

// TODO : préciser les outils utilisés
// - GitHub Projects (Kanban, milestones, issues)
// - GitHub Issues (US et tickets)
// - Discord (communication async + voix)
// - Drive (partage documents, maquettes)
// - [autre outil ?]

== Composition de l'équipe Dublin et rôles <sub-equipe>

// TODO : tableau des membres de l'équipe avec rôles attribués.
// Mon rôle : Lead Front — responsable architecture front, design system,
// intégration API, code review front, mentoring binôme front.
// Préciser les autres rôles (Lead Back, DevOps, Scrum Master, PO).

== Rituels Scrum

// TODO :
// - Daily stand-up : 15 min chaque matin, format "fait/aujourd'hui/blocage"
// - Sprint planning : début de semaine, estimation poker
// - Sprint review : fin de semaine, démo aux stakeholders (mentor O'clock)
// - Rétrospective : start/stop/continue, action items pour le sprint suivant

== Communication

// TODO :
// - Salons Discord par sujet (#general, #front, #back, #devops, #design)
// - Salons vocaux permanents pour pair-programming
// - Drive partagé pour les documents (maquettes Figma, slides)
// - Mentions ciblées GitHub pour les reviews

== Objectifs qualité

// TODO :
// - Conventions de code : ESLint + Prettier (cf. eslint.config.mjs)
// - Definition of Done : code mergé sur main, tests passent, review approuvée
//   par au moins 1 dev, doc à jour si impact API
// - Conventional Commits (feat/fix/docs/chore/refactor)
// - Branches : feature/* depuis main, PR obligatoire (pas de push direct)
// - Code review : 1 reviewer min, focus lisibilité + sécurité + tests
// - Pair-programming spontané sur les sujets sensibles (auth, Socket.IO)

== Métriques projet

// TODO : vélocité par sprint, dette technique identifiée (cf. #ref(<sec-difficultes>, supplement: [section])),
// taux de couverture (à mesurer si possible).
