// =============================================================================
// Section 05 — Spécifications fonctionnelles (REAC §5)
// Volume cible : 6-8 pages
// 7 sous-sections obligatoires REAC :
//   5.1 Contraintes et livrables
//   5.2 Architecture logicielle
//   5.3 Maquettes et enchaînement
//   5.4 Modèle entités-associations et MPD
//   5.5 Script de création/modification BDD
//   5.6 Diagramme cas d'utilisation
//   5.7 Diagramme de séquence du cas le plus significatif
// =============================================================================

= Spécifications fonctionnelles

La présente section décline les choix fonctionnels du projet et leur
traduction concrète : les contraintes ayant cadré la conception, l'architecture
retenue, les maquettes d'interfaces, le modèle de données relationnel, le
script SQL associé, et enfin la formalisation des cas d'utilisation —
notamment celui qui sera approfondi techniquement en section 7.

Ces sept sous-sections forment un fil continu qui part de l'expression du
besoin (5.1) jusqu'au comportement détaillé d'une fonctionnalité représentative
(5.7), en passant par les différentes vues structurelles du système.

== Contraintes du projet et livrables attendus

=== Contraintes

Le projet a été réalisé dans le cadre de l'apothéose finale de la formation
O'clock — Promotion Dublin. Cette modalité simule un environnement
professionnel et impose un ensemble de contraintes proches de celles d'une
mission en entreprise.

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Type de contrainte*], [*Description*],
  [Temporelle], [Apothéose conduite sur quatre semaines réparties en sprints courts (méthode Scrum), avec une livraison incrémentale et une démonstration en fin d'apothéose.],
  [Humaine], [Équipe de quatre personnes #footnote[Composition équipe Dublin : `[À COMPLÉTER]` — Lead Front (Jérémy), Lead Back, etc.] avec rôles distribués (Lead Front, Lead Back, contributeurs full-stack), travaillant en distanciel synchrone via Discord (salons vocaux dédiés au pair-programming).],
  [Technique — stack], [Choix d'une stack moderne TypeScript de bout en bout : Next.js (App Router) côté front, Express côté back, PostgreSQL pour les données relationnelles, Meilisearch pour la recherche full-text, Socket.IO pour le temps réel. Choix documentés dans onze ADRs (cf. section 6).],
  [Technique — qualité], [Performance perçue inférieure à 500 ms (mesure Lighthouse), couverture OWASP Top 10 sur la sécurité, conformité visée RGAA 4.1 / WCAG 2.1 AA #footnote[L'audit accessibilité formel via `axe-core` et Lighthouse est planifié mais non réalisé à la date de rédaction. Cette dette qualité est documentée en section 12.], conventions de code partagées (Prettier, ESLint).],
  [Réglementaire], [Conformité RGPD : minimisation des données collectées, consentement explicite, droits d'accès et de suppression. Mentions légales et politique de confidentialité requises avant mise en production.],
  [Fonctionnelle], [Périmètre MVP imposé : authentification, profil et compétences, recherche de membres, messagerie temps réel, système de notation et suivi entre membres. Hors-scope : paiement, application mobile native, vidéoconférence, géolocalisation avancée.],
)

=== Livrables attendus

L'apothéose impose une chaîne complète de livrables, depuis la conception
jusqu'à la mise en production effective :

#table(
  columns: (auto, 1fr, auto),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, center),
  [*Livrable*], [*Description*], [*État*],
  [Application en production], [Plateforme accessible publiquement à #link("https://skill-swap.fr")[skill-swap.fr], intégrant l'ensemble des fonctionnalités MVP.], [✓ Livré],
  [Base de données], [Schéma PostgreSQL en six migrations Prisma successives, avec seed de données de démonstration (41 utilisateurs).], [✓ Livré],
  [Documentation technique], [Documentation Arc42 publiée, référence API OpenAPI, Storybook des composants atomiques, guide utilisateur Diátaxis. Quatre sites Vercel actifs.], [✓ Livré],
  [Tests automatisés], [Tests d'intégration backend (Node Test Runner natif), tests E2E front (Playwright sur authentification et recherche), tests unitaires sur la validation Zod.], [✓ Livré (couverture partielle — cf. section 9)],
  [Conteneurisation], [Stack Docker Compose multi-services (frontend, backend, postgres, meilisearch, nginx) avec configurations dev et prod distinctes.], [✓ Livré],
  [Pipeline CI/CD], [Intégration et déploiement automatisés vers le VPS de production sur push `main`.], [✓ Livré],
)

== Architecture logicielle du projet

L'architecture retenue est celle d'un *monolithe modulaire conteneurisé* :
les responsabilités sont strictement séparées entre frontend et backend
(deux applications distinctes, deux conteneurs Docker, deux processus de
build), mais le backend reste un seul processus Node.js qui sert à la fois
les routes REST et le serveur Socket.IO. Cette approche évite la complexité
opérationnelle des microservices tout en autorisant un découpage clair des
concerns.

#figure(
  image("../../../docs/uml/architecture/architecture.png", width: 95%),
  caption: [Architecture logicielle macro de SkillSwap. Le proxy Nginx assure la terminaison TLS et le routage des requêtes vers le frontend Next.js et l'API Express. Le serveur Express héberge à la fois les routes REST (`/api/v1/*`) et le serveur Socket.IO (sur le même port). PostgreSQL persiste les données relationnelles ; Meilisearch sert l'index de recherche full-text, alimenté par un script de réindexation au démarrage.],
)

=== Composants principaux

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Composant*], [*Rôle*],
  [Frontend Next.js 16.1.1], [Application React rendue côté serveur (App Router), responsable de l'UI utilisateur, du SSR pour le SEO des profils publics, et de la consommation de l'API REST + Socket.IO. Stack : TypeScript, Tailwind CSS, shadcn/ui, hooks React natifs.],
  [Backend Express], [API REST type-safe (validation Zod) et serveur Socket.IO. Architecture en couches : routers → middlewares → controllers → services → Prisma.],
  [PostgreSQL 16], [Base de données relationnelle, accédée exclusivement via Prisma ORM. 14 modèles, 6 migrations, contraintes d'unicité et cascades de suppression définies au schéma.],
  [Meilisearch], [Moteur de recherche full-text dédié, indexant les utilisateurs et leurs compétences. Choix justifié par les performances et la simplicité d'API par rapport à `pg_trgm` natif (cf. ADR-008).],
  [Nginx], [Reverse proxy en façade : terminaison TLS (certificats Let's Encrypt), routage `/api/*` vers Express, routage `/` vers Next.js, support WebSocket pour Socket.IO.],
  [Docker Compose], [Orchestration multi-services en environnements `dev` et `prod` distincts, avec volumes persistants pour PostgreSQL et Meilisearch.],
)

=== Communications inter-composants

Le frontend communique avec le backend via deux canaux complémentaires :

- *REST* (`/api/v1/*`) pour les requêtes synchrones : authentification, CRUD de profils, recherche, listing initial des conversations et messages.
- *WebSocket* (Socket.IO sur le même serveur HTTP) pour les flux temps réel : envoi de messages, notifications de nouvelles conversations, mises à jour de statuts.

Ce choix d'architecture hybride est documenté dans l'ADR-011 (Socket.IO) et
détaillé techniquement en section 7.4. Il permet d'optimiser chaque canal
selon sa nature : la latence interactive sur le WebSocket, la cacheabilité
et le SEO sur le REST.

== Maquettes et enchaînement des maquettes

Les maquettes ont été produites en amont du développement à l'aide de
*Figma*, sur la base d'un atelier de cadrage produit avec l'équipe
au début de l'apothéose. Elles définissent la charte graphique, la
hiérarchie des écrans et les principaux états interactifs.

=== Arborescence de l'application

#figure(
  image("../../../docs/uml/user/arborescence.png", width: 90%),
  caption: [Arborescence des écrans publics et privés de SkillSwap. La racine `/` présente la page d'accueil (catégories, membres mieux notés). Les écrans en zone publique (consultation profil, page CGU, mentions légales) sont accessibles sans authentification ; les écrans en zone privée (édition profil, recherche, conversations) nécessitent une session valide.],
)

L'arborescence reflète le principe de progressive disclosure : un visiteur
non authentifié peut explorer l'application (consultation des profils
publics, parcours des catégories) sans friction, et n'est redirigé vers
l'authentification qu'au moment d'une action nécessitant un compte
(envoi d'un message, ajout d'une compétence à son profil, suivi d'un membre).

=== Parcours utilisateur principal

#figure(
  image("../../../docs/uml/user/user-flow.png", width: 95%),
  caption: [Parcours utilisateur d'un nouveau membre — de l'inscription au premier échange. Les états indiqués en gras correspondent à des transitions où l'application sollicite une action de l'utilisateur ; les autres sont des écrans de transit.],
)

Le parcours type d'un nouveau membre couvre cinq étapes : inscription
(formulaire validé Zod, hashage argon2, session JWT en cookie httpOnly),
création du profil (compétences offertes, compétences recherchées,
disponibilités), recherche d'un membre dont les compétences correspondent
au besoin, suivi du membre (prérequis fonctionnel à toute messagerie),
puis ouverture de la première conversation. Cette séquence est exactement
celle simulée par le jeu d'essai détaillé en section 10.

=== Captures de maquettes Figma

#figure(
  rect(width: 100%, height: 7cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      Capture à insérer : ../assets/captures-ui/05-figma-overview.png
    ]]
  ],
  caption: [Vue d'ensemble du board Figma — atomes, composants et maquettes assemblées des principaux écrans (accueil, profil, recherche, messagerie).],
)

== Modèle entités-associations et modèle physique de la base de données

La modélisation a été conduite à l'aide de Prisma : le fichier `schema.prisma`
sert à la fois de modèle conceptuel (proche d'un MCD Merise étendu) et de
source de vérité pour la génération automatique du MPD via les migrations.
Cette approche unifie la conception et l'implémentation, et garantit la
cohérence stricte entre le schéma logique documenté et le schéma physique
appliqué en production.

#figure(
  image("../../../docs/uml/erd.png", width: 100%),
  caption: [Diagramme entité-relation complet de SkillSwap — quatorze modèles, regroupés en cinq domaines fonctionnels : identité, compétences, disponibilités, échange, social.],
)

=== Domaines fonctionnels du modèle

Les quatorze modèles se regroupent en cinq domaines cohérents :

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Domaine*], [*Modèles*],
  [Identité], [#raw("User", lang: "sql"), #raw("Role", lang: "sql"), #raw("RefreshToken", lang: "sql") — gestion des comptes, des rôles et des sessions par rotation de tokens.],
  [Compétences], [#raw("Skill", lang: "sql"), #raw("Category", lang: "sql"), #raw("UserHasSkill", lang: "sql"), #raw("UserHasInterest", lang: "sql") — référentiel des compétences disponibles sur la plateforme et expression des compétences offertes / recherchées par chaque membre.],
  [Disponibilités], [#raw("Available", lang: "sql"), #raw("UserHasAvailable", lang: "sql") — créneaux horaires standardisés associés à chaque membre.],
  [Échange], [#raw("Conversation", lang: "sql"), #raw("Message", lang: "sql"), #raw("UserHasConversation", lang: "sql") — coeur de l'échange, traité en détail en section 7.],
  [Social], [#raw("Follow", lang: "sql"), #raw("Rating", lang: "sql") — graphe de suivi entre membres et système de notation.],
)

=== Cardinalités structurantes

Trois cardinalités N-N portent une part importante de la logique métier :

- #raw("User", lang: "sql") ↔ #raw("Skill", lang: "sql") via #raw("UserHasSkill", lang: "sql") (offre) et #raw("UserHasInterest", lang: "sql") (demande) — un même utilisateur peut offrir et rechercher plusieurs compétences ; une même compétence peut être pourvue ou recherchée par plusieurs utilisateurs.
- #raw("User", lang: "sql") ↔ #raw("Conversation", lang: "sql") via #raw("UserHasConversation", lang: "sql") — table de jonction qui autorise nativement les conversations à deux participants aujourd'hui, et l'évolution vers les conversations de groupe en V2 sans modification du schéma.
- #raw("User", lang: "sql") ↔ #raw("Available", lang: "sql") via #raw("UserHasAvailable", lang: "sql") — une compétence n'est utile qu'avec un créneau pour la transmettre ; cette table porte la disponibilité contextualisée.

La table #raw("Follow", lang: "sql") modélise un graphe orienté (suivi
unidirectionnel) avec contrainte d'unicité sur le couple
#raw("(followedId, followerId)", lang: "ts") et règle métier de non-auto-suivi
appliquée au niveau du middleware backend. La table #raw("Rating", lang: "sql")
(mappée #raw("evaluation", lang: "sql") en BDD) matérialise une évaluation N-N
avec contrainte d'unicité forte #raw("(evaluatorId, evaluatedId)", lang: "ts")
qui empêche tout doublon de notation.

== Script de création et de modification de la base de données

L'évolution du schéma est gérée par six migrations Prisma successives,
chacune représentant une étape datée de la conception. La traçabilité
SQL de cette évolution est intégrale et auditable.

#table(
  columns: (auto, auto, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, left),
  [*Date*], [*Migration*], [*Objet*],
  [2026-01-12], [#raw("init_db", lang: "txt")], [Création initiale du schéma : 14 tables, contraintes de clés étrangères, index primaires, enum #raw("StatusOfConversation", lang: "sql").],
  [2026-01-14], [#raw("add_category_slug", lang: "txt")], [Ajout du champ #raw("slug", lang: "sql") sur #raw("Category", lang: "sql") pour les URLs SEO-friendly des pages catégorie.],
  [2026-01-16], [#raw("create_relation_table_user_available", lang: "txt")], [Refonte du modèle de disponibilités : suppression des colonnes #raw("start", lang: "sql") / #raw("end", lang: "sql") / #raw("user_id", lang: "sql") de #raw("available", lang: "sql"), introduction de l'enum #raw("Time", lang: "sql") (#raw("Morning", lang: "sql") / #raw("Afternoon", lang: "sql")) et création de la table de jonction N-N #raw("user_has_available", lang: "sql").],
  [2026-01-17], [#raw("fix_snake_case", lang: "txt")], [Renommage de la colonne #raw("avatarUrl", lang: "sql") → #raw("avatar_url", lang: "sql") sur la table #raw("user", lang: "sql") (réalignement camelCase → snake_case oublié à la migration initiale).],
  [2026-01-18], [#raw("add_unique_constrain", lang: "txt")], [Ajout de contraintes d'unicité manquantes (#raw("follow", lang: "sql") sur #raw("(followed_id, follower_id)", lang: "ts"), #raw("evaluation", lang: "sql") sur #raw("(evaluator_id, evaluated_id)", lang: "ts")).],
  [2026-01-20], [#raw("make_the_comment_field_in_the_rating_table_optional", lang: "txt")], [Passage du champ #raw("comments", lang: "sql") de #raw("evaluation", lang: "sql") en facultatif (UX : l'évaluateur peut donner une note sans être obligé de commenter).],
)

=== Extrait — migration `init_db` (création de la table `User`)

```sql
-- backend/prisma/migrations/20260112133206_init_db/migration.sql (extrait — table user)
CREATE TABLE "user" (
    "id"            SERIAL NOT NULL,
    "firstname"     TEXT NOT NULL,
    "lastname"      TEXT NOT NULL,
    "email"         TEXT NOT NULL,
    "password"      TEXT NOT NULL,
    "address"       TEXT,
    "postal_code"   INTEGER,
    "city"          TEXT,
    "age"           INTEGER,
    "avatarUrl"     TEXT,
    "description"   TEXT,
    "role_id"       INTEGER NOT NULL,
    "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- Unicité de l'email (UNIQUE INDEX séparé, généré par Prisma)
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- Clé étrangère vers role (déclarée à la fin du fichier de migration)
ALTER TABLE "user"
    ADD CONSTRAINT "user_role_id_fkey"
    FOREIGN KEY ("role_id") REFERENCES "role"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
```

La table #raw("user", lang: "sql") concentre l'identité du membre. Prisma
génère le SQL au format conventionnel : type #raw("TEXT", lang: "sql")
sans contrainte de longueur côté base (les bornes sont appliquées en
amont par les schémas Zod côté serveur), index unique sur
#raw("email", lang: "sql") nommé selon la convention #raw("{table}_{col}_key", lang: "txt"),
et FK déclarées en fin de migration via #raw("ALTER TABLE", lang: "sql"). La
colonne #raw("avatarUrl", lang: "sql") sera renommée en #raw("avatar_url", lang: "sql")
par une migration ultérieure (#raw("fix_snake_case", lang: "txt"), 2026-01-17).

=== Extrait — migration `add_unique_constrain`

```sql
-- backend/prisma/migrations/20260118042859_add_unique_constrain/migration.sql
CREATE UNIQUE INDEX "evaluation_evaluator_id_evaluated_id_key"
    ON "evaluation"("evaluator_id", "evaluated_id");

CREATE UNIQUE INDEX "follow_followed_id_follower_id_key"
    ON "follow"("followed_id", "follower_id");
```

Cette migration tardive matérialise une règle métier identifiée a posteriori :
empêcher tout doublon de suivi ou d'évaluation entre une même paire de
membres. Prisma matérialise ces contraintes via #raw("CREATE UNIQUE INDEX", lang: "sql")
plutôt que #raw("ALTER TABLE ... ADD CONSTRAINT UNIQUE", lang: "sql") — les
deux formes sont sémantiquement équivalentes côté PostgreSQL. La table
ciblée pour l'évaluation est #raw("evaluation", lang: "sql") (mappée depuis
le modèle Prisma #raw("Rating", lang: "sql") via #raw("@@map(\"evaluation\")", lang: "ts")).
La contrainte est appliquée au niveau base, garantissant l'intégrité même
en cas de bug applicatif (défense en profondeur).

== Diagramme du comportement des fonctionnalités — cas d'utilisation

#figure(
  image("../../../docs/uml/user/use-cases.png", width: 95%),
  caption: [Diagramme de cas d'utilisation de SkillSwap. Trois acteurs : le visiteur non-authentifié, le membre authentifié, et l'administrateur (rôle dérivé du modèle #raw("Role", lang: "sql") en BDD). Les cas d'utilisation grisés sont hors-scope MVP et reportés à la V2.],
)

=== Acteurs et cas d'utilisation principaux

*Visiteur non-authentifié* — peut consulter les profils publics, parcourir
les catégories, lire les mentions légales et la politique de confidentialité,
et bien sûr s'inscrire ou se connecter. Aucune action transactionnelle
(message, suivi, évaluation) ne lui est accessible.

*Membre authentifié* — accède à l'ensemble des fonctionnalités MVP :
édition complète de son profil (compétences, intérêts, disponibilités,
avatar), recherche d'autres membres avec filtre par catégorie, suivi /
désuivi de membres, ouverture de conversations avec les membres suivis,
envoi et clôture de conversations, évaluation post-conversation des
membres avec qui il a échangé.

*Administrateur* — bénéficie d'un rôle distinct (modèle #raw("Role", lang: "sql"))
avec des privilèges de modération non exposés dans l'interface MVP mais
prévus dans le modèle (V2).

Le périmètre MVP couvre l'essentiel des cas d'utilisation visiteur et
membre. Les cas d'utilisation administrateur (modération, statistiques,
gestion globale) sont modélisés en BDD mais reportés à la V2 pour
concentrer l'effort de la promotion sur le coeur produit.

== Diagramme du détail du cas d'utilisation le plus significatif

Le cas d'utilisation le plus significatif retenu est *l'envoi d'un message
à un membre suivi* : il combine l'ensemble des prérequis fonctionnels de
la plateforme (authentification, suivi, conversation), mobilise les
deux canaux de communication (REST pour la création de conversation,
Socket.IO pour l'envoi et la réception), et illustre les patterns techniques
les plus défendables du projet (optimistic UI, cloisonnement par rooms,
gating métier). Ce choix résulte d'un audit comparatif documenté
qui l'identifie comme la seule fonctionnalité couvrant exhaustivement les
axes du référentiel#footnote[Audit interne : `docs/audits/feature-inventory-cda.md`. Ce cas d'utilisation est repris en section 7 (Réalisations) sous l'angle technique fin et en section 10 (Jeu d'essai) sous l'angle comportemental observable.].

#figure(
  image("../../../docs/uml/sequence/conversation.png", width: 100%),
  caption: [Diagramme de séquence — envoi d'un message d'Alice vers Bob. Six lignes de vie : Alice et son frontend, le serveur Socket.IO, la base PostgreSQL accédée via Prisma, le frontend de Bob et Bob. Les flèches en pointillés représentent les retours synchrones ; les flèches pleines, les events asynchrones poussés par le serveur.],
)

=== Lecture du diagramme

Le diagramme illustre le pipeline complet en huit étapes :

1. *Connexion préalable* : à l'authentification, le client Socket.IO se connecte avec le cookie `accessToken` ; le serveur vérifie le JWT et inscrit la socket dans la room personnelle `user:Alice`.
2. *Sélection d'une conversation* : Alice sélectionne la conversation #42 dans sa liste. Le frontend émet `conversation:join` ; le serveur valide qu'Alice est bien participante de cette conversation et l'inscrit dans la room `conversation:42`.
3. *Saisie et envoi optimistic* : Alice rédige un message et clique "Envoyer". Le frontend ajoute immédiatement le message dans la liste locale avec un identifiant temporaire négatif, puis émet `message:send` au serveur sans attendre.
4. *Validation serveur* : le serveur vérifie la longueur du message (1 à 2000 caractères), le statut de la conversation (refusé si `Close`), et la qualité de participant de l'émetteur.
5. *Persistance* : un `Promise.all` Prisma crée le message en table #raw("message", lang: "sql") et met à jour le `updated_at` de la #raw("conversation", lang: "sql") parent.
6. *Diffusion ciblée* : le serveur émet `message:new` à la room `conversation:42` (Alice et Bob s'ils sont tous deux dans la room), et `conversation:updated` aux rooms `user:Alice` et `user:Bob`.
7. *Cas particulier — premier message* : si c'est le premier message de la conversation, le serveur émet en plus `conversation:new` à la room `user:Bob`, déclenchant un toast d'apparition côté Bob.
8. *Réconciliation côté Alice* : Alice reçoit `message:new` ; le filtre côté hook ignore le retour serveur lorsque #raw("sender.id === user.id", lang: "ts") (l'optimistic local reste en place comme affichage final).

Le détail technique de chaque étape — code des handlers, structure des
events, gestion d'erreurs — est traité en section 7.4 ; le présent
diagramme se contente d'en donner la vue comportementale macro.
