// =============================================================================
// Section 13 — Conclusion
// Volume cible : 1-2 pages
//
// VÉRIFICATIONS S15 (dépôt d'équipe HEAD de73323) :
//   Atomic Design ... 7 page.tsx · 18 atoms · 9 molecules · 39 fichiers
//     d'organismes répartis en 5 groupes (ConversationPage, Header, HomePage,
//     ProfilePage, SearchPage) + 2 organismes autonomes (AuthForm, Footer).
//     L'ancien « cinq organismes » comptait les GROUPES, pas les fichiers :
//     formulation corrigée pour lever l'ambiguïté.
//   skill-swap.fr .... HTTP 200 le 22/08/2026, /api/v1/health → {"status":"ok"}.
//   useMessaging.ts .. 76 % Sebastien (106/139), 23 % moi (33/139) → NE JAMAIS
//     revendiquer l'orchestration des huit hooks comme apprentissage personnel.
//
// TROIS AFFIRMATIONS INTERDITES ICI (démenties par les audits) :
//   - « couverture de tests d'intégration complète » → 5/7 suites en échec ;
//   - « prototypes Vitest/Playwright amorcés » → absents du livrable d'équipe ;
//   - « huit hooks orchestrés autour de useMessaging » comme apprentissage
//     personnel → paternité majoritairement d'un coéquipier.
// =============================================================================

= Conclusion <sec-conclusion>

== Bilan du projet

L'apothéose SkillSwap a livré, en quatre semaines, une plateforme web complète
et déployée en production, intégrant les sept fonctionnalités du périmètre MVP
cible : page d'accueil, authentification, profils avec compétences et
disponibilités, moteur de recherche, suivi de profils, messagerie temps réel,
système d'évaluation. Les deux fonctionnalités initialement classées comme
« évolutions possibles » — messagerie temps réel via WebSocket et recherche
avancée via Meilisearch — ont été promues au périmètre MVP en cours de projet
et livrées en production. La couverture fonctionnelle atteinte dépasse donc le
périmètre minimum acté en sprint 0.

L'équipe a appliqué la méthode Scrum sur quatre sprints d'une semaine, maintenu
une qualité de code outillée (ESLint, Prettier, Husky), écrit sept suites de
tests d'intégration backend, et conduit une mise en production sur VPS avec
Docker, Nginx et certificat TLS renouvelé automatiquement.

== Évolutions identifiées pour la V2

Quatre catégories de dettes techniques tracées au fil du projet :

*Sécurité* — monter Helmet (installé mais non monté), ajouter une limitation de
débit sur les routes d'authentification, définir une Content Security Policy
(en observation puis en application).

*Tests* — corriger le défaut de fixture qui met cinq des sept suites
d'intégration en échec, puis mettre en place la couverture frontend décidée à
l'ADR-010 (unitaire, E2E) et non implémentée.

*DevOps* — compléter le déploiement continu par une intégration continue
(build, lint, tests), mettre en place supervision et sauvegarde automatique de
la base.

*Fonctionnel* — blocage de profils, suggestion automatique de correspondances,
groupes thématiques.

== Apprentissage personnel

Ce projet a été l'occasion d'appliquer rigoureusement l'Atomic Design à un
frontend de production — sept pages, dix-huit atomes, neuf molécules et
trente-neuf fichiers d'organismes regroupés en cinq ensembles fonctionnels —,
de concevoir et déployer une chaîne de production complète (images
multi-étapes, reverse proxy, TLS), et d'amorcer une démarche de documentation
continue en rédigeant une documentation Arc42 partagée à l'équipe — démarche
que je poursuis dans mes projets suivants.

La reprise de ce dossier m'a par ailleurs conduit à vérifier systématiquement
chaque affirmation documentaire contre le code livré. L'exercice a révélé des
écarts, corrigés depuis. J'en retiens qu'une documentation n'a de valeur que si
elle est vérifiable, et qu'il vaut mieux assumer une dette identifiée que
présenter une couverture qu'on n'a pas.
