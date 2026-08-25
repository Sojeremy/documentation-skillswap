// =============================================================================
// Section 12 — Difficultés rencontrées (ajout O'clock, hors REAC strict)
// Volume cible : 1-2 pages
//
// SOURCES : journal de bord d'équipe (tableur partagé, hors dépôt Git, cf.
// 04-gestion-projet.typ) + historique git du dépôt d'équipe (HEAD de73323).
//
// CHIFFRES VÉRIFIÉS EN SESSION S13 :
//   Docker 13-15/01 ... 21 commits touchant devops//Dockerfile/docker-compose/
//                       nginx, dont 15 de moi. La valeur « treize » du texte
//                       validé était SOUS-ESTIMÉE → retenu QUINZE (ma part).
//   502 bad gateway ... 19/01 : « fix(devops): correct nginx backend proxy
//                       port » (moi) + « debug bad gateway error » (Seb).
//   Meilisearch ....... 22/01 Yorgan « innstallation image meilisearch, modif
//                       du docker compose ». Avatars : 29/01 Seb « fix avatar
//                       folder in dockerfile ».
//   Contrat d'API ..... api-client.ts 37 + api-types.ts 26 = 63 retouches.
//   Nommage ........... 4 commits les 17, 18 et 19/01 (le texte validé disait
//                       « 17 et 19 » → corrigé en « du 17 au 19 »).
//                       Migration 20260117012249_fix_snake_case : DROP COLUMN
//                       avatarUrl / ADD COLUMN avatar_url — exact.
//   Revue 20/01 ....... « Phase 1 complete (28/30 fixes) » → 30 points
//                       identifiés, exact. « Phases 1-4 » exact. PascalCase
//                       exact. « refactor(icons): factory pattern (-143 lines) »
//                       exact. « fix: logic bugs - array mutation, async
//                       timing, incomplete mapping » exact au mot près.
//   AuthProvider ...... 24 retouches, exact.
//   Cookies 29/01 ..... 4 commits, exact — TOUS de Sebastien. Le texte ne
//                       revendique pas ces commits : ne pas l'y faire glisser.
//   Tests ............. 5/7 suites en échec, cause fixture (ordre rôle puis
//                       utilisateurs), cf. arc42 10-quality/testing.md:48.
// =============================================================================

= Difficultés rencontrées et solutions <sec-difficultes>

Les difficultés relatées ici sont documentées par deux sources : le journal de
bord tenu par l'équipe pendant le projet#footnote[Tableur partagé, hors dépôt Git — cf. #ref(<sec-gestion>, supplement: [section]).] et
l'historique du dépôt d'équipe.

== La mise au point de l'environnement conteneurisé

La stabilisation de l'environnement Docker a occupé les premiers jours du
sprint 1 et a demandé plusieurs itérations. Le journal de bord d'équipe
enregistre le 14 janvier un « debug docker seeding + frontend qui restart en
boucle » ; le même jour et le suivant, j'ai traité la configuration de
production, les healthchecks, le support du rechargement à chaud (HMR) dans le
conteneur, le passage des images de développement à Node 24, la correction du
script d'attente de PostgreSQL — chemin absolu, ordonnancement du démarrage
base/API — puis les volumes nommés et le montage sélectif de la configuration
Nginx. Quatorze commits sur trois jours ont été nécessaires pour obtenir un
environnement stable.

Une régression est survenue une semaine plus tard : le 19 janvier, une erreur
502 bad gateway a été constatée en environnement conteneurisé ; elle provenait
d'un port de proxy Nginx désaccordé avec le backend, que j'ai corrigé.
L'infrastructure s'est révélée sensible à chaque ajout de service —
Meilisearch le 22 janvier, la gestion des avatars le 29.

== Le contrat d'interface entre le frontend et le backend

Le projet ne dispose pas de package de types partagé : les types sont déclarés
des deux côtés. Cette duplication, assumée au cadrage, a fait du contrat
d'interface la zone la plus instable du code — #raw("api-client.ts", lang: "ts")
et #raw("api-types.ts", lang: "ts") totalisent soixante-trois retouches sur les
quatre semaines. Chaque évolution du schéma Prisma se répercutait en plusieurs
points du frontend, comme en témoignent les messages de commits
(« align api-types with Prisma schema »).

Une difficulté connexe a été le rattrapage d'une convention de nommage non
tranchée au cadrage : la coexistence du camelCase côté TypeScript et du
snake_case côté base a nécessité, du 17 au 19 janvier, quatre commits
correctifs et une migration dédiée (#raw("fix_snake_case", lang: "txt")),
renommant notamment #raw("avatarUrl", lang: "sql") en
#raw("avatar_url", lang: "sql"). Corriger une convention en cours de projet
suppose d'intervenir simultanément en base, dans le backend et dans le
frontend.

== Une revue de code à mi-parcours

Le 20 janvier, j'ai conduit une revue systématique du frontend, organisée en
quatre phases et documentée au fil de son avancement. Elle a identifié trente
points de correction, dont des bugs de logique : mutation de tableau, problème
de synchronisation asynchrone, mapping de données incomplet. Elle a également
porté sur la cohérence des conventions — renommage des fichiers de composants
en PascalCase — et sur la factorisation, avec la mise en place d'un
#emph[factory pattern] pour les icônes. Cette journée entière consacrée à la
qualité plutôt qu'à de nouvelles fonctionnalités a été un arbitrage assumé.

== Le cycle de vie de la session

La gestion de session a été ajustée par retouches successives sur l'ensemble
du projet : correction de la déconnexion et de l'inscription le 15 janvier, de
l'expiration côté frontend le 20, enrichissement des réponses
d'authentification et traitement des erreurs 401. Le fournisseur de contexte
d'authentification compte vingt-quatre retouches.

La difficulté la plus tenace est apparue le dernier jour : la pose des cookies
lors des redirections a nécessité quatre passes successives. La navigation
côté client de Next.js ne déclenchant pas la prise en compte des cookies posés
par le serveur, il a fallu forcer un rechargement complet via
#raw("window.location.href", lang: "ts") pour la connexion, la déconnexion et
la suppression de compte.

== Les tests d'intégration backend

Cinq des sept suites de tests d'intégration échouaient à l'issue du projet. La
cause a été identifiée et documentée dans la documentation qualité : les
données de rôle ne sont pas créées avant les utilisateurs de test dans la
fixture. Le diagnostic est établi — il s'agit d'un ordonnancement
d'initialisation, non d'un défaut du code applicatif — mais le correctif n'a
pas été appliqué avant la fin du projet.

== Ce que ces difficultés ont en commun

Trois d'entre elles — le contrat d'interface, la convention de nommage, la
gestion de session — ne relèvent pas d'un obstacle technique isolé mais d'une
décision de cadrage insuffisamment tranchée au départ, dont le coût s'est étalé
sur tout le projet. À l'inverse, la journée de revue de code du 20 janvier a
montré qu'un temps consacré à la qualité en cours de route se rentabilise. J'en
retiens qu'il vaut mieux fixer tôt les conventions transverses — nommage, types
partagés, gestion de session — quitte à y consacrer une demi-journée de cadrage
supplémentaire.
