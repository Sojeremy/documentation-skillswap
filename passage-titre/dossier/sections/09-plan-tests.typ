// =============================================================================
// Section 09 — Plan de tests (REAC §9)
// Volume cible : 2 pages
//
// VÉRIFIÉ S17 contre le dépôt d'équipe (HEAD de73323) :
//   7 fichiers *.spec.test.ts, 60 tests au total :
//     auth.controller     238 l.  8 tests  register / login / refresh
//     conv                609 l. 13 tests  POST, GET, DELETE, PATCH close
//     follow.controller   219 l.  8 tests  followers / following / follow / unfollow
//     message             657 l. 13 tests  POST, GET paginé, PATCH, DELETE
//     profile.controller  532 l. 11 tests  skills, availabilities, DELETE compte,
//                                          + « Security & Data visibility »
//     search.controller   244 l.  3 tests  /search et /search/top-rated
//     socket              206 l.  4 tests  handshake JWT + conversation:join
//   0 fichier *.unit.test.ts — le script npm test:unit existe mais ne matche rien.
//   Scripts : test:spec = node --test --env-file --import global-setup
//             --experimental-test-isolation=none
//   5/7 en échec (arc42 10-quality/testing.md) : erreur roleId: NaN /
//     « Argument 'role' is missing ». Passent : auth.controller et socket.
//     Cause : beforeAll ne crée pas le rôle parent avant d'insérer les users.
//
// INTERDIT ICI : présenter Vitest, Playwright, Storybook ou TypeDoc comme
// implémentés. Aucun n'est dans le livrable. Ne pas réintroduire non plus
// « npm audit hebdomadaire » ni de couverture chiffrée : jamais mesurée.
// =============================================================================

= Plan de tests <sec-plan-tests>

== Stratégie décidée et stratégie réalisée

L'ADR-010 formalise une pyramide de tests à plusieurs étages : le typage
TypeScript comme premier filet, Storybook pour les composants d'interface,
Vitest pour les hooks et utilitaires, Playwright pour les parcours de bout en
bout, et TypeDoc pour la documentation d'API. L'intention était de faire porter
chaque vérification par l'outil le plus adapté plutôt que de tout couvrir avec
un seul.

*L'écart avec la réalisation est important et doit être énoncé sans détour.*
Hors le typage TypeScript, acquis de fait par la stack, *aucun de ces quatre
outils n'a été intégré au livrable*. Les tests effectivement écrits sont d'une
autre nature : des tests d'intégration backend, non prévus comme tels par
l'ADR-010, qui exercent l'API par requêtes HTTP réelles contre une base
dédiée.

#table(
  columns: (12em, 1fr, 7em),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, center),
  [*Étage décidé (ADR-010)*], [*Outil prévu*], [*État réel*],
  [Typage], [TypeScript], [Acquis],
  [Composants UI], [Storybook], [Non intégré],
  [Hooks et utilitaires], [Vitest], [Non intégré],
  [Parcours de bout en bout], [Playwright], [Non intégré],
  [Documentation d'API], [TypeDoc], [Non intégré],
  [_(non prévu par l'ADR)_], [Node Test Runner — intégration backend], [*Implémenté*],
)

== Les tests d'intégration backend

Sept suites ont été écrites, totalisant *soixante tests*. Elles ne testent pas
des fonctions isolées mais des *parcours de requête complets* : chaque test
émet une requête HTTP sur l'application Express réellement instanciée, et
vérifie le code de statut comme le contenu de la réponse.

#table(
  columns: (13em, 1fr, 4em),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, center),
  [*Suite*], [*Périmètre couvert*], [*Tests*],
  [#raw("auth.controller", lang: "txt")], [Inscription, connexion, rafraîchissement de jeton], [8],
  [#raw("conv", lang: "txt")], [Création de conversation (dont refus si pas de suivi, et incrément de titre), consultation, retrait d'un participant, clôture], [13],
  [#raw("message", lang: "txt")], [Envoi, lecture paginée, modification et suppression de message, avec les cas 404 et 422], [13],
  [#raw("profile.controller", lang: "txt")], [Compétences, disponibilités, suppression de compte, et un bloc dédié à la visibilité des données], [11],
  [#raw("follow.controller", lang: "txt")], [Abonnés, abonnements, suivi et désabonnement], [8],
  [#raw("realtime/socket", lang: "txt")], [Handshake JWT (accepté et refusé), #raw("conversation:join", lang: "ts") participant et non-participant], [4],
  [#raw("search.controller", lang: "txt")], [Recherche de membres et classement par note], [3],
)

Un point mérite d'être relevé : la suite #raw("profile.controller", lang: "txt")
comporte un bloc explicitement nommé « Security & Data visibility », et la suite
#raw("conv", lang: "txt") vérifie le refus de création lorsque l'émetteur ne suit
pas le destinataire. Les tests ne couvrent donc pas seulement le chemin nominal :
ils vérifient aussi que les règles d'accès refusent ce qu'elles doivent refuser.

*Le choix de ne pas ajouter de framework tiers.* L'exécution repose sur le
lanceur natif de Node — #raw("node --test", lang: "txt") — sans Jest, Mocha ni
Vitest côté backend :

```txt
node --test --env-file=./src/test/config/.env.test \
     --import ./src/test/config/global-setup.ts \
     --experimental-test-isolation=none ./src/**/*.spec.test.ts
```

Trois raisons justifient ce choix. D'abord *une dépendance en moins* à installer,
configurer et maintenir, sur un projet de quatre semaines. Ensuite *l'absence
d'étape de transpilation dédiée* : le lanceur natif consomme directement les
sources TypeScript. Enfin *la stabilité de l'interface* : le lanceur suit le
cycle de vie de Node lui-même, sans risque de rupture liée à une montée de
version d'un outil tiers. Le prix à payer est réel — pas d'écosystème de
_matchers_ riches, pas de rapport de couverture intégré — mais il était
acceptable au regard du périmètre.

== État d'exécution réel

*Cinq des sept suites échouent.* Seules #raw("auth.controller", lang: "txt") et
#raw("socket", lang: "txt") passent, et uniquement sur les parcours qui ne
dépendent pas de la donnée en cause.

L'échec est identique partout et se produit au démarrage de la suite, pas dans
le code applicatif : #raw("roleId: NaN", lang: "ts"), suivi de
#raw("Argument 'role' is missing", lang: "ts"). La cause est un
*ordre d'initialisation dans la fixture globale* : le #raw("beforeAll", lang: "ts")
ne garantit pas la création du rôle parent avant l'insertion des utilisateurs de
test, qui partent alors avec une clé étrangère invalide et font tomber toute la
suite.

Le diagnostic est donc établi, et il est important d'en tirer la bonne
conclusion : *le défaut est dans le code de test, pas dans le code applicatif*.
Le correctif consiste à réordonner l'initialisation de la fixture. Il n'a pas
été appliqué avant la fin du projet, la priorité ayant été donnée à la finition
fonctionnelle. C'est une dette assumée, et le premier chantier de reprise.

*La couverture n'a jamais été mesurée.* Aucun outil de couverture n'est branché,
ni en local ni en intégration continue. Le dossier ne peut donc avancer aucun
pourcentage — et n'en avancera pas.

Il faut enfin noter qu'un script #raw("test:unit", lang: "txt") existe dans le
#raw("package.json", lang: "txt") du backend, mais qu'*aucun fichier
#raw("*.unit.test.ts", lang: "txt") n'a jamais été écrit* : le script ne
sélectionne rien.

== Absence de tests automatisés côté frontend

Le livrable ne contient *aucun* test frontend : ni test unitaire, ni test de
composant, ni test de bout en bout, ni catalogue de composants. Le constat est
vérifiable en une commande sur le dépôt de production :

```txt
grep -iE "vitest|playwright|jest|testing-library|storybook" frontend/package.json
→ aucun résultat
```

== La validation manuelle, méthode réellement employée

Pendant le projet, les fonctionnalités ont été validées *à la main*, en
parcourant l'application dans l'environnement de développement conteneurisé.
Cette validation s'appuyait notamment sur une collection de requêtes HTTP
annotées (#raw("request.http", lang: "txt")) permettant de rejouer les appels
d'API hors interface.

Cette démarche n'est pas sans valeur : elle a permis de livrer une application
fonctionnelle en production. Mais elle a deux limites structurelles — elle
n'est pas *reproductible* à l'identique d'une fois sur l'autre, et elle ne
laisse *aucune trace* exploitable après coup.

Le jeu d'essai présenté en #ref(<sec-jeu-essai>, supplement: [section]) est la
formalisation de cette démarche : mêmes gestes, mais scénario écrit à l'avance,
résultats attendus définis, données obtenues consignées et vérifiées en base.

== Ce qui manque et ce que je mettrais en place

*Corriger la fixture d'abord.* Cinq suites déjà écrites ne demandent qu'un
réordonnancement pour redevenir utiles. C'est le meilleur rapport entre effort
et bénéfice de toute cette liste : soixante tests existent, il s'agit de les
remettre en état de tourner, pas d'en écrire de nouveaux.

*Tests unitaires sur la validation et les utilitaires.* Les schémas Zod et les
fonctions pures — formatage de dates, calcul de moyenne des évaluations,
troncature de description — sont testables sans base ni serveur. Ce sont les
tests les moins coûteux à écrire et les plus rapides à exécuter.

*Tests de composants.* Les composants d'interface porteurs de logique — la
liste de conversations, le fil de messages, les formulaires validés — méritent
des tests de rendu et d'interaction, indépendamment du choix d'outil.

*Tests de bout en bout sur les parcours critiques.* Trois parcours justifient
l'investissement : inscription et connexion, recherche puis mise en relation,
et l'échange de messages en temps réel entre deux sessions simultanées.

*Mesure de couverture.* Non comme un objectif chiffré à atteindre — un
pourcentage élevé ne garantit rien — mais comme un révélateur des zones jamais
exercées.

*Exécution en intégration continue.* Le pipeline actuel ne fait que déployer
(cf. #ref(<sec-specs-fonc>, supplement: [section])). Y ajouter une étape qui
lance les tests et bloque le déploiement en cas d'échec est ce qui transforme
une suite de tests en filet de sécurité réel. Une suite qu'on n'exécute pas
automatiquement finit par ne plus être exécutée du tout — les cinq suites en
échec en sont l'illustration.

=== Ce que cette dette a concrètement coûté

L'argument le plus solide en faveur de tests frontend ne vient pas d'un
principe général, mais de ce dossier lui-même. Le jeu d'essai de la
#ref(<sec-jeu-essai>, supplement: [section]) a mis au jour un *défaut réel et
reproductible* : à la réception de l'event #raw("conversation:new", lang: "ts"),
la nouvelle conversation s'affiche *deux fois* dans la liste du destinataire,
alors que la base n'en contient qu'une. La cause est une insertion en tête de
liste sans garde sur l'identifiant
(#raw("useConversationList.ts:43-45", lang: "ts")).

Ce défaut est passé inaperçu pendant les quatre semaines du projet. Il aurait
été détecté par un test d'intégration frontend de quelques lignes — émettre deux
fois l'event et vérifier que la liste ne contient qu'une entrée. C'est la
mesure concrète du coût de cette dette : non pas un risque théorique, mais un
bug présent dans le livrable, trouvé le jour où un scénario a enfin été rejoué
de bout en bout de façon méthodique.
