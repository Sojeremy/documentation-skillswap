// =============================================================================
// Section 01 — Compétences du référentiel CDA (REAC §1)
// Volume cible : 1-2 pages
// Sous-sections : AT1 / AT2 / AT3 — pour chaque CP, 2-4 lignes de couverture
// CP obligatoires (eBook O'clock) : CP2 → CP9
// SkillSwap couvre aussi : CP1, CP10, CP11 (Docker, déploiement, DevOps)
// Réf. REAC : page 8 du référentiel CDA RNCP Niveau 6
//
// Contenu validé à partir de l'audit d'attribution (git blame sur le dépôt
// d'équipe O-clock-Dublin/projet-skillswap). Chaque part est vérifiable.
// Ne pas revendiquer : CI/CD (pipeline CD), api-client.ts, useMessaging,
// paternité des tests, intégration Meilisearch.
//
// CHIFFRES RECALCULÉS EN AUDIT S10 sur le dépôt d'équipe (HEAD de73323), via
// git blame --line-porcelain sur les deux identités
// (jeremy.soriano@oclock.school + sorianojeremyba@gmail.com) :
//   PR intégrées .......... 13 (majorité des commits) / 14 (>=1 commit)
//                           sur 130 PR mergées — l'ancien « 31 » était faux
//   branches portées ...... 6 : SEO(4 PR), profile-page(3), SearchPage(2),
//                           fix-setup-docker(2), code-review(1), Profile-Page2(1)
//   rang contributeur ..... 2e — 115 commits hors merge (Sebastien 124,
//                           Yorgan 74, Loïc 53)
//   devops/ global ........ 76 % (728/956)
//   devops/README.md ...... 92 % (298/323)   [ancien « 97 % » faux]
//   nginx/prod.conf ....... 99 % (110/111)
//   docker-compose.prod ... 82 % (97/117)
//   Dockerfile.prod front . 100 % (53/53)
//   Dockerfile.prod back .. 86 % (32/37)     [ancien « 89 % » faux]
//   .env.prod.example ..... 100 % (35/35)
//   HomePage/ ............. 90 % (305/339) — on conserve « 89 % », valeur
//                           basse, pour ne jamais surévaluer
//   SearchPage/ ........... 80 % (232/290)
//   ProfileFull/Teaser .... 100 % / 100 %
//   DesktopNav / MobileNav  100 % / 92 %
//   useFormState .......... 100 % ; useSearch 88 % ; useFollowedUsers 86 %
//   profile.service.ts:20-88  100 % (le fichier entier n'est qu'à 13 % :
//                           toujours citer la TRANCHE, pas le fichier)
//   profil-teaser-strategy.md  601 lignes, 100 %
//   specs backend ......... 7 fichiers, TROIS auteurs (Yorgan-Agb 4, Loïc 3,
//                           Sebastien 1 en co-auteur) — ancien « deux » faux
// =============================================================================

= Compétences du référentiel CDA couvertes <sec-competences>

== AT1 — Développer une application sécurisée

=== CP1 — Installer et configurer son environnement de travail

L'équipe s'est dotée d'un outillage qualité (ESLint, Prettier, Husky avec hook
de pre-commit), mis en place par un coéquipier. J'ai contribué à la
configuration Docker de développement (#raw("backend/Dockerfile.dev", lang: "txt"),
#raw("docker-compose.dev.yml", lang: "txt")) et porté les correctifs de setup
(PR #raw("fix-setup-docker", lang: "txt")). → §#ref(<sub-equipe>, supplement: none).

=== CP2 — Développer des interfaces utilisateur

J'ai développé les interfaces de la page d'accueil (89 %), de la recherche
(#raw("SearchPage", lang: "txt"), 80 %), de la consultation de profil public
(#raw("ProfileFull", lang: "txt"), #raw("ProfileTeaser", lang: "txt"), 100 %) et
de la navigation (#raw("DesktopNav", lang: "txt") 100 %,
#raw("MobileNav", lang: "txt") 92 %), dans une architecture Atomic Design. Les
dialogues d'édition de profil et le formulaire d'authentification ont été portés
par des coéquipiers. → §#ref(<sub-maquettes>, supplement: none), annexes.

=== CP3 — Développer des composants métier

J'ai développé plusieurs hooks métier React : la gestion d'état de formulaire
(#raw("useFormState", lang: "txt"), 100 %), la consommation de l'API de recherche
avec debounce, pagination et annulation par #raw("AbortController", lang: "txt")
(#raw("useSearch", lang: "txt"), 88 %), et la récupération des membres suivis
(#raw("useFollowedUsers", lang: "txt"), 86 %). L'orchestration de la messagerie
temps réel (#raw("useMessaging", lang: "txt") et les hooks socket) a été portée
par un coéquipier. → §#ref(<sec-specs-fonc>, supplement: none), annexes.

=== CP4 — Contribuer à la gestion d'un projet informatique

J'ai travaillé en flux de Pull Requests sur branches de feature — six branches
portées (SEO, page profil, recherche, setup Docker), treize Pull Requests
intégrées, deuxième contributeur en volume de commits — au sein d'une
organisation Scrum d'équipe (quatre sprints, rituels agiles, backlog Trello). → §#ref(<sec-gestion>, supplement: none).

== AT2 — Concevoir et développer une application sécurisée organisée en couches

=== CP5 — Analyser les besoins et maquetter une application

J'ai formalisé les cas d'utilisation et le parcours utilisateur de la plateforme
en sprint 0 (#raw("docs/uml/user/use-cases.puml", lang: "txt"),
#raw("user-flow.puml", lang: "txt")), et j'ai conduit une démarche d'analyse de
besoin écrite pour la fonctionnalité de profil public : contexte, problématique,
stratégie et spécification fonctionnelle formalisés avant l'implémentation
(#raw("frontend/src/.code-review/profil-teaser-strategy.md", lang: "txt"),
601 lignes). Cette analyse débouche directement sur le composant d'accès aux
données décrit en CP8, ce qui matérialise une chaîne complète besoin →
spécification → implémentation. → détail §#ref(<sub-maquettes>, supplement: none), §#ref(<sub-cas-usage>, supplement: none).

=== CP6 — Définir l'architecture logicielle d'une application

J'ai conçu la chaîne de déploiement de production (reverse proxy Nginx,
#raw("docker-compose.prod", lang: "txt"), #raw("Dockerfile.prod", lang: "txt")
multi-étapes) — #raw("devops/", lang: "txt") à 76 %, dont
#raw("nginx/prod.conf", lang: "txt") et #raw("Dockerfile.prod", lang: "txt")
quasi intégralement. Côté applicatif, j'ai contribué à l'implémentation de
l'architecture frontend en Atomic Design. Concernant l'architecture backend en
couches (router → controller → service → ORM), je ne l'ai pas implémentée, mais
je l'ai analysée et outillée : j'ai vérifié mécaniquement le respect du sens de
dépendance (#raw("dependency-cruiser", lang: "txt"), 4 règles, 0 violation) et
documenté les cinq accès Prisma hors couche service — dont le principal,
#raw("realtime/socket.ts", lang: "txt"), qui persiste les messages directement
via #raw("prisma.message.create", lang: "ts") (#raw("socket.ts:245", lang: "txt"))
au lieu de passer par #raw("message.service.ts", lang: "txt"), dupliquant la
logique du chemin REST ; j'ai aussi relevé que cette persistance est un
#raw("Promise.all", lang: "ts") (#raw("socket.ts:244", lang: "txt")) et non une
transaction. → détail §#ref(<sub-archi>, supplement: none), §#ref(<sec-specs-tech>, supplement: none).

=== CP7 — Concevoir et mettre en place une base de données relationnelle
// Attribution vérifiée : docs/uml/erd.puml à 99 % (168/169 lignes), commit
// 02234e5 du 2026-01-08, soit 4 jours AVANT la migration init_db
// (20260112133206) — modélisation antérieure à l'implémentation.
// backend/prisma/schema.prisma : 1 % ; migrations : 4 %, dont add_category_slug.
// NE PAS citer arc42/diagrams/erd.svg : généré par prisma-erd-generator,
// présent uniquement dans le dépôt de documentation, absent du livrable.

J'ai produit le modèle entité-relation initial de la plateforme en sprint 0
(#raw("docs/uml/erd.puml", lang: "txt")), antérieur à l'implémentation du schéma,
et j'ai contribué directement au schéma en ajoutant le champ
#raw("slug", lang: "txt") à l'entité #raw("Category", lang: "txt") (migration
#raw("add_category_slug", lang: "txt")). Au-delà de cette contribution
d'écriture, je maîtrise l'intégralité de la modélisation, que j'ai reconstruite
et vérifiée de façon déterministe depuis la base de production : MCD Merise
(notation Mocodo), MLD (14 tables, DBML), MPD (SQL des six migrations) et ERD.
Cette modélisation couvre la normalisation jusqu'en 3NF — avec une
dénormalisation assumée de #raw("message.receiver_id", lang: "txt") pour la
diffusion temps réel —, les clés composites des tables de jonction, les
contraintes d'unicité par paire (#raw("follow", lang: "txt"),
#raw("evaluation", lang: "txt")), et la distinction entre contraintes
d'intégrité (FK NOT NULL) et contraintes applicatives (la règle des deux
participants d'une conversation, désormais (0,2)). → détail §#ref(<sub-mea>, supplement: none) et §#ref(<sub-script-sql>, supplement: none).

=== CP8 — Développer des composants d'accès aux données SQL et NoSQL

J'ai développé le composant d'accès aux données du profil public
(#raw("getPublicProfileService", lang: "txt"),
#raw("profile.service.ts:20-88", lang: "txt"), ainsi que la tranche verticale
route → service → rendu SSR → composant, 100 %). Ce composant met en œuvre une
projection explicite via _select_ plutôt
qu'_include_ (chaque colonne remontée est choisie,
#raw(":31,:33", lang: "txt")), un chargement ciblé de relations (compétences avec
leur catégorie #raw(":40", lang: "txt"), évaluations restreintes au seul score
#raw(":45", lang: "txt")), une agrégation applicative (moyenne des avis arrondie,
#raw(":58-59", lang: "txt")), et une minimisation des données exposées
(description tronquée #raw(":69-70", lang: "txt"), nom réduit à l'initiale
#raw(":78", lang: "txt")). J'ai également développé le composant frontend de
consommation de l'API de recherche (#raw("hooks/useSearch.ts", lang: "txt"),
88 % : debounce, pagination, annulation par #raw("AbortController", lang: "txt")).
L'accès aux données NoSQL (Meilisearch) a été porté par le Lead Back.
→ détail §#ref(<sub-acces-donnees>, supplement: none).

== AT3 — Préparer le déploiement d'une application sécurisée

=== CP9 — Préparer et exécuter les plans de tests d'une application

L'équipe a mis en place sept suites de tests d'intégration backend exécutées par
le Node Test Runner natif, écrites par trois coéquipiers. Le frontend, dont
j'étais le principal contributeur, n'a pas été couvert par des tests automatisés
— c'est la première dette que j'identifie, et la stratégie de test frontend
(Vitest, Playwright) reste à l'état de décision documentée. → §#ref(<sec-plan-tests>, supplement: none).

=== CP10 — Préparer et documenter le déploiement d'une application

J'ai conçu la chaîne de déploiement de production : images Docker multi-étapes
(#raw("Dockerfile.prod", lang: "txt") front 100 %, back 86 %), orchestration
#raw("docker-compose.prod", lang: "txt") (82 %), variables d'environnement
(#raw(".env.prod.example", lang: "txt"), 100 %), le tout documenté dans
#raw("devops/README.md", lang: "txt") (92 %, 323 lignes). → §#ref(<sec-specs-tech>, supplement: none), dépôt
#raw("devops/", lang: "txt").

=== CP11 — Contribuer à la mise en production dans une démarche DevOps

J'ai conçu la chaîne de mise en production : reverse proxy Nginx avec TLS, HSTS
et en-têtes de sécurité (#raw("nginx/prod.conf", lang: "txt"), 99 %),
orchestration Docker Compose et images multi-étapes. L'automatisation du
déploiement continu (pipeline CD) et l'exécution de la mise en production réelle
ont été portées par deux coéquipiers. → §#ref(<sec-specs-tech>, supplement: none).
