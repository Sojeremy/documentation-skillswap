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

#import "../template.typ": code-wrap

= Spécifications fonctionnelles <sec-specs-fonc>

La présente section décline les choix fonctionnels du projet et leur
traduction concrète : les contraintes ayant cadré la conception, l'architecture
retenue, les maquettes d'interfaces, le modèle de données relationnel, le
script SQL associé, et enfin la formalisation des cas d'utilisation —
notamment celui qui sera approfondi techniquement en #ref(<sec-realisations>, supplement: [section]).

Ces sept sous-sections forment un fil continu qui part de l'expression du
besoin (#ref(<sub-contraintes>, supplement: none)) jusqu'au comportement détaillé d'une fonctionnalité représentative
(#ref(<sub-cas-detail>, supplement: none)), en passant par les différentes vues structurelles du système.

== Contraintes du projet et livrables attendus <sub-contraintes>

=== Contraintes

Le projet a été réalisé dans le cadre de l'apothéose finale de la formation
O'clock — Promotion Dublin. Cette modalité simule un environnement
professionnel et impose un ensemble de contraintes proches de celles d'une
mission en entreprise.

#table(
  columns: (10em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Type de contrainte*], [*Description*],
  [Temporelle], [Apothéose conduite sur quatre semaines réparties en sprints courts (méthode Scrum), avec une livraison incrémentale et une démonstration en fin d'apothéose.],
  [Humaine], [Équipe de cinq personnes #footnote[Composition de l'équipe Dublin : Sébastien (Product Owner), Loïc (Scrum Master), Yorgan (Lead Back), Jérémy Soriano (Lead Front) et Antoine (Frontend).] avec rôles distribués (Lead Front, Lead Back, contributeurs full-stack), travaillant en distanciel synchrone via Discord (salons vocaux dédiés au pair-programming).],
  [Technique — stack], [Choix d'une stack moderne TypeScript de bout en bout : Next.js (App Router) côté front, Express côté back, PostgreSQL pour les données relationnelles, Meilisearch pour la recherche full-text, Socket.IO pour le temps réel. Choix documentés dans dix ADRs formalisés pendant le projet (cf. #ref(<sub-adrs>, supplement: [section])).],
  [Technique — qualité], [Performance perçue inférieure à 500 ms (mesure Lighthouse), couverture OWASP Top 10 sur la sécurité, conformité visée RGAA 4.1 / WCAG 2.1 AA #footnote[L'audit accessibilité formel via `axe-core` et Lighthouse est planifié mais non réalisé à la date de rédaction. Cette dette qualité est documentée en #ref(<sec-difficultes>, supplement: [section]).], conventions de code partagées (Prettier, ESLint).],
  [Réglementaire], [Conformité RGPD : minimisation des données collectées, consentement explicite, droits d'accès et de suppression. Mentions légales et politique de confidentialité requises avant mise en production.],
  [Fonctionnelle], [Périmètre MVP imposé : authentification, profil et compétences, recherche de membres, messagerie temps réel, système de notation et suivi entre membres. Hors-scope : paiement, application mobile native, vidéoconférence, géolocalisation avancée.],
)

=== Livrables attendus

L'apothéose impose une chaîne complète de livrables, depuis la conception
jusqu'à la mise en production effective :

#table(
  columns: (9em, 1fr, 5em),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, center),
  [*Livrable*], [*Description*], [*État*],
  [Application en production], [Plateforme accessible publiquement à #link("https://skill-swap.fr")[skill-swap.fr], intégrant l'ensemble des fonctionnalités MVP.], [✓ Livré],
  [Base de données], [Schéma PostgreSQL en six migrations Prisma successives, avec seed de développement peuplant 41 utilisateurs de démonstration ; le seed de production n'initialise que les référentiels (rôle, catégories, compétences, créneaux).], [✓ Livré],
  [Documentation technique], [Livrable d'équipe mergé sur #raw("main", lang: "txt") : stratégie de documentation (#raw("docs/documentation-strategy/", lang: "txt")), diagrammes UML (#raw("docs/uml/", lang: "txt")) et référence des endpoints (#raw("docs/endpoints/", lang: "txt")). S'y ajoutent, produits pendant le projet sur la branche #raw("Documentation", lang: "txt") mais jamais mergés sur #raw("main", lang: "txt"), les dix ADRs et une *spécification OpenAPI 3.0, initiée le 21 janvier 2026 avec trente endpoints et portée à trente-sept à la fin du projet*. Le guide utilisateur Diátaxis et la mise en ligne de l'ensemble sur Vercel sont, eux, une extension post-projet.], [✓ Livré#footnote[Le statut « Livré » porte sur la documentation d'équipe et sur les artefacts produits pendant le projet. La publication en ligne et le guide Diátaxis sont postérieurs à la soutenance.]],
  [Tests automatisés], [Tests d'intégration backend uniquement : sept fichiers #raw("*.spec.test.ts", lang: "txt") écrits pour le Node Test Runner natif, visant les contrôleurs et les events Socket.IO. *Cinq des sept suites échouent* sur un bug de fixture identifié et documenté — la donnée de rôle n'est pas créée avant les utilisateurs de test. Dette assumée, non corrigée avant la soutenance.], [✓ Partiel #footnote[Deux limites cumulées : cinq des sept suites backend en échec sur fixture, et aucun test automatisé côté frontend dans le livrable (ni unitaire, ni E2E, ni catalogue de composants). Couverture jamais mesurée. Cf. #ref(<sec-plan-tests>, supplement: [section]).]],
  [Conteneurisation], [Stack Docker Compose à six services en production (frontend, backend, postgres, meilisearch, nginx, certbot) avec configurations dev et prod distinctes.], [✓ Livré],
  [Pipeline de déploiement continu (CD)], [Déploiement automatisé vers le VPS de production sur push `main` (#raw(".github/workflows/deploy-prod.yml", lang: "txt")) : connexion SSH, mise à jour du dépôt, reconstruction et redémarrage des conteneurs. *Aucune étape d'intégration continue* — le workflow ne lance ni test, ni lint, ni build de vérification avant de déployer.], [✓ Livré],
)

== Architecture logicielle du projet <sub-archi>

L'architecture retenue est celle d'un *monolithe modulaire conteneurisé* :
les responsabilités sont strictement séparées entre frontend et backend
(deux applications distinctes, deux images Docker, deux processus de
build), mais le backend reste un seul processus Node.js qui sert à la fois
les routes REST et le serveur Socket.IO. Cette approche évite la complexité
opérationnelle des microservices tout en autorisant un découpage clair des
concerns. La pile de production en compte six au total
(#ref(<fig-c4-entree>) à #ref(<fig-c4-tls>)) ; les deux images applicatives
en sont le coeur.

L'index Meilisearch est alimenté par une réindexation lancée manuellement
(script #raw("search:reindex", lang: "txt")) : il n'y a pas de réindexation
automatique au démarrage du serveur.

#figure(
  image("../../../docs/uml/c4/c1-contexte.svg", height: 231mm),
  caption: [*C4 niveau 1 — diagramme de contexte.* Le système vu de l'extérieur : deux acteurs, distingués par la seule présence du cookie #raw("refreshToken", lang: "ts") (#raw("frontend/src/middleware.ts:15-16", lang: "txt")), et un unique système tiers, Let's Encrypt. Le détail interne est réparti sur les trois vues du niveau C2 qui suivent.],
) <fig-c4-contexte>

#figure(
  image("../../../docs/uml/c4/c2a-entree-routage.svg", height: 232mm),
  caption: [*C4 niveau 2, vue 1/3 — entrée et routage.* Le chemin d'une requête depuis le navigateur. Nginx est le seul conteneur à publier des ports ; le frontend et le backend ne sont joignables que depuis le réseau Compose. Coutures : le conteneur #emph[backend] est repris en #ref(<fig-c4-persistance>), le conteneur #emph[nginx] en #ref(<fig-c4-tls>).],
) <fig-c4-entree>

#page(flipped: true)[
  #figure(
    image("../../../docs/uml/c4/c2b-persistance.svg", height: 155mm),
    caption: [*C4 niveau 2, vue 2/3 — persistance du backend.* Couture avec #ref(<fig-c4-entree>) : le conteneur #emph[backend], qui y reçoit le trafic de Nginx. Chaque arête porte son protocole et son port réels.],
  ) <fig-c4-persistance>
]

#page(flipped: true)[
  #figure(
    image("../../../docs/uml/c4/c2c-chaine-tls.svg", height: 155mm),
    caption: [*C4 niveau 2, vue 3/3 — chaîne de renouvellement TLS.* Couture avec #ref(<fig-c4-entree>) : le conteneur #emph[nginx], qui assure la terminaison TLS. Les deux volumes #emph[certbot] sont montés deux fois — en écriture côté certbot, en lecture seule côté nginx.],
  ) <fig-c4-tls>
]

#figure(
  image("../../../docs/uml/c4/c3a-backend-chaine.svg", height: 233mm),
  caption: [*C4 niveau 3, backend vue 1/2 — chaîne de traitement d'une requête REST.* Regroupement par couche, non par fichier. Les nombres portés sur les arêtes sont des nombres d'imports, mesurés et non estimés. Couture : la couche #emph[Services] est reprise en #ref(<fig-c3-backend-donnees>).],
) <fig-c3-backend-chaine>

#page(flipped: true)[
  #figure(
    image("../../../docs/uml/c4/c3b-backend-acces-donnees.svg", width: 241mm),
    caption: [*C4 niveau 3, backend vue 2/2 — accès aux données.* En rouge, les cinq modules atteignant Prisma hors de la couche service, avec leur nombre de requêtes. Analyse #raw("dependency-cruiser", lang: "txt") sur *72 modules et 169 dépendances*, *zéro violation* des quatre règles de sens de dépendance. Détail en #ref(<sub-patterns>, supplement: [sous-section]).],
  ) <fig-c3-backend-donnees>
]

Les figures de conception de cette section ont été reconstruites en août 2026
à partir du code livré et de la base de données, selon une démarche
déterministe : chaque élément représenté est adossé à un fichier source, une
route ou une entrée du catalogue PostgreSQL. Les artefacts d'origine produits
en sprint 0 sont conservés dans le dépôt d'équipe
(#raw("docs/uml/", lang: "txt")).

=== Écarts relevés lors de la reconstruction <sub-ecarts-c4>

La reconstruction a été confrontée à la figure d'architecture d'origine, en
comparant non pas deux fichiers source mais la source PlantUML *embarquée dans
le PNG livré* — donc le texte qui a réellement produit l'image. Onze écarts de
fait en ressortent, dont quatre structurants, reproduits ci-dessous. Le relevé
complet, élément par élément et relation par relation, est dans
#raw("docs/uml/c4/TRACABILITE.md", lang: "txt").

#table(
  columns: (9em, 1fr, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, left),
  [*Écart*], [*Ce que montrait la figure*], [*Ce que montre le code*],

  [Canal temps réel],
  [Une liaison WebSocket directe entre le module de chat du frontend et le serveur Socket.IO, hors du proxy.],
  [Tout le WebSocket transite par Nginx : #code-wrap("nginx/prod.conf:85-94") route #raw("/socket.io/", lang: "txt") vers l'upstream #raw("backend:3000", lang: "txt"). Le backend ne publie aucun port — #code-wrap("docker-compose.prod.yml:9-10") déclare #raw("expose", lang: "txt") et non #raw("ports", lang: "txt") : il est injoignable depuis l'extérieur.],

  [Terminaison TLS],
  [Aucune. Ni HTTPS, ni port, ni certificat n'apparaissent sur la figure.],
  [#code-wrap("nginx/prod.conf:33") — #raw("listen 443 ssl http2", lang: "txt") ; certificats en #code-wrap("prod.conf:37-38") ; redirection 80 vers 443 en #code-wrap("prod.conf:26-28") ; ports publiés #raw("80:80", lang: "txt") et #raw("443:443", lang: "txt") en #code-wrap("docker-compose.prod.yml:85-87").],

  [Limitation de débit],
  [Le composant de passerelle porte la mention « Rate limiting » parmi ses responsabilités.],
  [Aucune directive de limitation dans la configuration : #raw("grep -nE \"limit_req|limit_conn|limit_rate\"", lang: "txt") sur #code-wrap("devops/nginx/prod.conf") ne retourne aucun résultat.],

  [Statut de #raw("/profil", lang: "txt")],
  [La page de profil est placée derrière un composant #raw("[Private]", lang: "txt"), donc réservée aux membres connectés.],
  [La route est publique, et délibérément : #code-wrap("frontend/src/middleware.ts:6") ne protège que #raw("/recherche", lang: "txt"), #raw("/conversation", lang: "txt") et #raw("/mon-profil", lang: "txt") ; la ligne 5 documente le choix — « #raw("/profil", lang: "txt") est PUBLIC pour le SEO ».],
)

=== Communications inter-composants

Deux chemins distincts atteignent l'API. Le code client exécuté dans le
navigateur appelle #raw("/api/v1/*", lang: "txt") et
#raw("/socket.io/", lang: "txt") en HTTPS à travers le reverse proxy Nginx,
seul composant de la pile à publier des ports. Le conteneur frontend, lui,
appelle directement #raw("http://backend:3000", lang: "txt") sur le réseau
Docker interne, hors proxy, pour le rendu serveur ISR de la page d'accueil,
des profils publics et du sitemap (#raw("page.tsx:60", lang: "txt") et
#raw(":82", lang: "txt"), #raw("profil/[id]/page.tsx:64", lang: "txt"),
#raw("sitemap.ts:34", lang: "txt")). Le backend ne publiant aucun port
(#raw("docker-compose.prod.yml:9-10", lang: "txt") déclare #raw("expose", lang: "txt")
et non #raw("ports", lang: "txt")), ce second chemin n'est joignable que depuis
l'intérieur du réseau Compose.

Sur l'un comme sur l'autre, deux canaux complémentaires coexistent :
*REST* (`/api/v1/*`) pour les requêtes synchrones (authentification, CRUD,
listing initial des messages) et *WebSocket* via Socket.IO sur le même
serveur HTTP pour les flux temps réel (envoi/réception de messages,
notifications de nouvelles conversations). Ce choix d'architecture hybride
est documenté dans l'ADR-011 — formalisé a posteriori pour ce dossier — et
détaillé techniquement en #ref(<sub-socket-server>, supplement: [sous-section]).

== Maquettes et enchaînement des maquettes <sub-maquettes>

Les maquettes ont été produites en amont du développement à l'aide de
*Figma*, sur la base d'un atelier de cadrage produit avec l'équipe
au début de l'apothéose. Elles définissent la charte graphique, la
hiérarchie des écrans et les principaux états interactifs.

=== Arborescence de l'application

#figure(
  image("../../../docs/uml/user/arborescence.png", width: 82%),
  caption: [Arborescence des écrans publics et privés de SkillSwap. La racine `/` présente la page d'accueil (catégories, membres mieux notés). Les écrans en zone publique (consultation profil, page CGU, mentions légales) sont accessibles sans authentification ; les écrans en zone privée (édition profil, recherche, conversations) nécessitent une session valide.],
)

L'arborescence reflète le principe de *progressive disclosure* : la zone
publique reste librement accessible, et l'authentification n'est requise
qu'au moment d'une action transactionnelle (envoi de message, ajout de
compétence, suivi de membre).

=== Parcours utilisateur principal

#figure(
  image("../../../docs/uml/user/user-flow.png", width: 95%),
  caption: [Parcours utilisateur d'un nouveau membre — inscription → création du profil → recherche → suivi → ouverture de la première conversation. Cette séquence est exactement celle simulée par le jeu d'essai en #ref(<sec-jeu-essai>, supplement: [section]).],
)

Les maquettes des quatre écrans principaux — accueil, profil, recherche et
messagerie — sont reproduites en annexe F : #ref(<fig-maquette-accueil>),
#ref(<fig-maquette-profil>), #ref(<fig-maquette-recherche>) et
#ref(<fig-maquette-messagerie>).

== Modèle entités-associations et modèle physique de la base de données <sub-mea>

La modélisation suit les trois niveaux Merise. Le *MCD* a été formalisé en
notation Mocodo à partir des règles de gestion ; le *MLD* et le *MPD* ont été
reconstruits de façon déterministe depuis une base PostgreSQL montée à partir
des six migrations réelles, en interrogeant le catalogue
#raw("information_schema", lang: "sql") — aucune inférence depuis le code
applicatif. Le fichier `schema.prisma` reste la source de vérité opérationnelle
qui génère les migrations, ce qui garantit la cohérence stricte entre le schéma
documenté et le schéma physique appliqué en production.

#figure(
  image("../../../docs/_generated/database/mcd.svg", width: 62%),
  caption: [Modèle conceptuel de données (Merise, notation Mocodo) — sept entités métier et onze associations, dont une association porteuse #raw("évalue", lang: "txt") (attributs #raw("score", lang: "sql") et #raw("comments", lang: "sql")). L'entité technique #raw("refresh_token", lang: "sql") est volontairement exclue du niveau conceptuel.],
)

#figure(
  image("../../../docs/uml/erd/erd-00-vue-ensemble.svg", width: 100%),
  caption: [Vue d'ensemble du modèle physique — quatorze tables et dix-huit clés étrangères, regroupées en cinq domaines fonctionnels. Chaque domaine est détaillé, colonnes complètes, en annexe G.],
) <fig-erd-vue-ensemble>

// Diagramme de classes du domaine (docs/_generated/uml/classes-domaine.svg)
// ÉCARTÉ : format 2793×781 (ratio 1:0,28). En pleine largeur A4, le texte
// tombe à ~1,8pt — illisible (seuil ~7-8pt). Même en annexe paysage il reste
// à ~3,3pt. À réintégrer seulement si le diagramme est redécoupé en deux ou
// trois blocs verticaux. Le nom de table physique en stéréotype (Rating →
// evaluation) est déjà couvert par la prose ci-dessous.

=== Domaines fonctionnels du modèle

Les quatorze modèles se regroupent en cinq domaines cohérents :

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Domaine*], [*Modèles*],
  [Identité], [#raw("User", lang: "sql"), #raw("Role", lang: "sql"), #raw("RefreshToken", lang: "sql") — gestion des comptes, des rôles et des sessions par rotation de tokens. Détail : #ref(<fig-erd-identite>).],
  [Compétences], [#raw("Skill", lang: "sql"), #raw("Category", lang: "sql"), #raw("UserHasSkill", lang: "sql"), #raw("UserHasInterest", lang: "sql") — référentiel des compétences disponibles sur la plateforme et expression des compétences offertes / recherchées par chaque membre. Détail : #ref(<fig-erd-competences>).],
  [Disponibilités], [#raw("Available", lang: "sql"), #raw("UserHasAvailable", lang: "sql") — créneaux horaires standardisés associés à chaque membre. Détail : #ref(<fig-erd-disponibilites>).],
  [Échange], [#raw("Conversation", lang: "sql"), #raw("Message", lang: "sql"), #raw("UserHasConversation", lang: "sql") — coeur de l'échange, traité en détail en #ref(<sec-realisations>, supplement: [section]). Détail : #ref(<fig-erd-echange>).],
  [Social], [#raw("Follow", lang: "sql"), #raw("Rating", lang: "sql") — graphe de suivi entre membres et système de notation. Détail : #ref(<fig-erd-social>).],
)

La différence de comptage entre les deux niveaux est normale et voulue : le MCD
recense *sept entités métier* (#raw("user", lang: "sql"),
#raw("role", lang: "sql"), #raw("category", lang: "sql"),
#raw("skill", lang: "sql"), #raw("available", lang: "sql"),
#raw("conversation", lang: "sql"), #raw("message", lang: "sql")), tandis que le
MLD en compte *quatorze* après transformation. Les sept tables supplémentaires
sont la matérialisation des associations : les quatre tables de jonction issues
des relations N-N, les deux associations réflexives
#raw("follow", lang: "sql") et #raw("evaluation", lang: "sql"), et l'entité
technique #raw("refresh_token", lang: "sql"), exclue du niveau conceptuel parce
qu'elle relève de l'authentification et non du métier.

Les contraintes d'unicité critiques sont matérialisées au niveau base :
#raw("@@unique([followedId, followerId])", lang: "ts") sur #raw("Follow", lang: "sql")
(graphe orienté, non-auto-suivi appliqué côté middleware) et
#raw("@@unique([evaluatorId, evaluatedId])", lang: "ts") sur #raw("Rating", lang: "sql")
(mappée #raw("evaluation", lang: "sql") en BDD), qui empêche tout doublon de
notation entre une même paire de membres.

== Script de création et de modification de la base de données <sub-script-sql>

L'évolution du schéma est gérée par six migrations Prisma successives,
chacune représentant une étape datée de la conception. La traçabilité
SQL de cette évolution est intégrale et auditable.

#table(
  columns: (auto, 7em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left, left),
  [*Date*], [*Migration*], [*Objet*],
  [2026-01-12], [#code-wrap("init_db")], [Création initiale du schéma : 13 tables, contraintes de clés étrangères, index primaires, enums #raw("RoleOfUser", lang: "sql"), #raw("StatusOfConversation", lang: "sql") et #raw("dayInAWeek", lang: "sql").],
  [2026-01-14], [#code-wrap("add_category_slug")], [Ajout du champ #raw("slug", lang: "sql") sur #raw("Category", lang: "sql") pour les URLs SEO-friendly des pages catégorie.],
  [2026-01-16], [#code-wrap("create_relation_table_user_available")], [Refonte du modèle de disponibilités : suppression des colonnes #raw("start", lang: "sql") / #raw("end", lang: "sql") / #raw("user_id", lang: "sql") de #raw("available", lang: "sql"), introduction de l'enum #raw("Time", lang: "sql") (#raw("Morning", lang: "sql") / #raw("Afternoon", lang: "sql")) et création de la table de jonction N-N #raw("user_has_available", lang: "sql").],
  [2026-01-17], [#code-wrap("fix_snake_case")], [Renommage de la colonne #raw("avatarUrl", lang: "sql") → #raw("avatar_url", lang: "sql") sur la table #raw("user", lang: "sql") (réalignement camelCase → snake_case oublié à la migration initiale).],
  [2026-01-18], [#code-wrap("add_unique_constrain")], [Ajout de contraintes d'unicité manquantes (#raw("follow", lang: "sql") sur #raw("(followed_id, follower_id)", lang: "ts"), #raw("evaluation", lang: "sql") sur #raw("(evaluator_id, evaluated_id)", lang: "ts")).],
  [2026-01-20], [#code-wrap("make_the_comment_field_in_the_rating_table_optional")], [Passage du champ #raw("comments", lang: "sql") de #raw("evaluation", lang: "sql") en facultatif (UX : l'évaluateur peut donner une note sans être obligé de commenter).],
)

L'extrait ci-dessous est issu du schéma physique réel, obtenu par
#raw("pg_dump --schema-only", lang: "txt") sur une base montée à partir des six
migrations — il reflète donc l'état effectivement appliqué, et non une
reconstitution :

```sql
CREATE TYPE public."RoleOfUser" AS ENUM (
    'Membre'
);

CREATE TABLE public."user" (
    id integer NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    address text,
    postal_code integer,
    city text,
    age integer,
    description text,
    role_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    avatar_url text
);
```

L'ordre des colonnes porte la trace des migrations successives :
#raw("avatar_url", lang: "sql") figure en dernière position parce qu'elle a été
recréée par la migration #raw("fix_snake_case", lang: "txt"), postérieure à la
création initiale de la table.

Les extraits SQL générés par Prisma — création de la table #raw("user", lang: "sql")
dans #raw("init_db", lang: "txt") et matérialisation des contraintes d'unicité
dans #raw("add_unique_constrain", lang: "txt") — sont reproduits intégralement
en *annexe A*. Prisma génère le SQL au format conventionnel : type
#raw("TEXT", lang: "sql") sans contrainte de longueur (les bornes sont
appliquées en amont par les schémas Zod côté serveur), unicités via
#raw("CREATE UNIQUE INDEX", lang: "sql") séparés, et FK déclarées en fin de
migration via #raw("ALTER TABLE", lang: "sql"). Les contraintes d'unicité de
#raw("Follow", lang: "sql") et #raw("evaluation", lang: "sql") sont appliquées
au niveau base — défense en profondeur garantissant l'intégrité même en cas
de bug applicatif.

== Diagramme du comportement des fonctionnalités — cas d'utilisation <sub-cas-usage>

#figure(
  image("../../../docs/uml/user/use-cases.png", width: 95%),
  caption: [Diagramme de cas d'utilisation de SkillSwap. Deux acteurs : le visiteur non-authentifié et le membre authentifié. Les cas d'utilisation grisés sont hors-scope MVP et reportés à la V2.],
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

*Aucun rôle d'administration n'est implémenté.* La table
#raw("role", lang: "sql") existe et chaque utilisateur y est rattaché par une
clé étrangère #raw("role_id", lang: "sql") non nulle, mais l'énumération
#raw("RoleOfUser", lang: "sql") ne contient qu'une seule valeur,
#raw("Membre", lang: "sql") — vérifiable en base par
#raw("SELECT enumlabel FROM pg_enum", lang: "sql"). Le `roleId` est bien
embarqué dans le JWT et exposé sur la requête par le middleware
#raw("checkAuth", lang: "ts"), mais il n'est lu par aucun middleware ni
contrôleur pour prendre une décision d'autorisation.

La table #raw("role", lang: "sql") constitue donc un *point d'extension du
modèle de données*, prêt à accueillir d'autres valeurs, et non un mécanisme
actif : la modération est une dette assumée, reportée en V2. L'autorisation
réellement en vigueur en V1 est binaire (visiteur / membre) et repose sur
trois mécanismes indépendants du rôle : l'authentification
(#raw("checkAuth", lang: "ts")), la propriété de la ressource
(#raw("isOwner", lang: "ts")) et la relation sociale
(#raw("requireFollow", lang: "ts")).

Le périmètre MVP couvre ainsi l'essentiel des cas d'utilisation visiteur et
membre, l'effort de la promotion ayant été concentré sur le coeur produit.

== Diagramme du détail du cas d'utilisation le plus significatif <sub-cas-detail>

Le cas d'utilisation le plus significatif retenu est *l'envoi d'un message
à un membre suivi* : il combine l'ensemble des prérequis fonctionnels de
la plateforme (authentification, suivi, conversation), mobilise les
deux canaux de communication (REST pour la création de conversation,
Socket.IO pour l'envoi et la réception), et illustre les patterns techniques
les plus défendables du projet (optimistic UI, cloisonnement par rooms,
gating métier). Ce choix résulte d'un audit comparatif documenté
qui l'identifie comme la seule fonctionnalité couvrant exhaustivement les
axes du référentiel#footnote[Audit interne : `docs/audits/feature-inventory-cda.md`. Ce cas d'utilisation est repris en #ref(<sec-realisations>, supplement: [section]) sous l'angle technique fin et en #ref(<sec-jeu-essai>, supplement: [section]) sous l'angle comportemental observable.].

#figure(
  image("../../../docs/uml/sequence/conversation.png", width: 100%),
  caption: [Diagramme de séquence — envoi d'un message d'Alice vers Bob. Six lignes de vie : Alice et son frontend, le serveur Socket.IO, la base PostgreSQL accédée via Prisma, le frontend de Bob et Bob. Les flèches en pointillés représentent les retours synchrones ; les flèches pleines, les events asynchrones poussés par le serveur.],
) <fig-sequence-envoi-6>

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
events, gestion d'erreurs — est traité en #ref(<sub-socket-server>, supplement: [sous-section]) ; le présent
diagramme se contente d'en donner la vue comportementale macro.
