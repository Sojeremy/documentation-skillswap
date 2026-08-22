// =============================================================================
// Section 04 — Gestion de projet (REAC §4)
// Volume cible : 2-3 pages
//
// CHIFFRES VÉRIFIÉS EN SESSION S11 contre le dépôt d'équipe (HEAD de73323) :
//   Bornes projet ....... 1er commit hors merge 2026-01-06 10:36,
//                         dernier 2026-01-29 18:40 → 4 semaines ISO W02→W05.
//   Commits hors merge .. W02 35 / W03 148 / W04 129 / W05 54  (total 366)
//   PR mergées .......... W02 10 / W03 49 / W04 41 / W05 30    (total 130)
//   ATTENTION : les commits du week-end sont réels (sam. 17 et dim. 18 janvier
//   = 19 commits ; sam. 24 et dim. 25 = 8). Les libellés de dates du tableau
//   couvrent donc la SEMAINE ISO COMPLÈTE, sinon les totaux ne tombent pas.
//   Classement de Jérémy par semaine (commits hors merge) :
//     W02 4e/4 (3)   W03 2e (41)   W04 1er (54)   W05 2e (17)
//   Le sprint 0 est bien conception seule : les 35 commits W02 sont des
//   diagrammes, endpoints, RBAC, merise ; le premier setup applicatif
//   apparaît les 9-10 janvier (init front/back, atomic-design).
// =============================================================================

= Gestion de projet <sec-gestion>

== Cadre et organisation de l'équipe <sub-equipe>

Le projet a été conduit par une équipe de cinq personnes en distanciel
synchrone, avec des rôles distribués dès le sprint de cadrage : Sébastien
(Product Owner), Loïc (Scrum Master), Yorgan (Lead Back), moi-même (Lead
Front) et Antoine (Frontend). La coordination quotidienne s'est faite par
salons vocaux Discord, avec des sessions de pair-programming ponctuelles.

== Méthodologie : Scrum adapté à quatre semaines

Le projet s'est déroulé du 6 au 29 janvier 2026, soit quatre semaines
découpées en quatre sprints d'une semaine. Le sprint 0 a été entièrement
consacré au cadrage et à la conception ; les trois suivants au développement
incrémental. Les rituels ont été adaptés au format distanciel : un point
d'équipe chaque matin pour débriefer l'avancement et répartir la journée,
puis une disponibilité continue en salon vocal permettant l'entraide et les
décisions au fil de l'eau.

== Le sprint 0 : cadrage et conception

La première semaine a produit l'ensemble des artefacts de conception avant
toute ligne de code applicatif : présentation et clarification du cahier des
charges, planification et attribution des rôles (lundi) ; user stories, ERD,
MCD, dictionnaire de données et charte graphique (mardi) ; MPD, cas
d'utilisation, diagramme de séquence, diagramme d'architecture et contrat
d'endpoints (mercredi). La réalisation des maquettes m'a été attribuée ;
Sébastien et Yorgan ont pris les endpoints et la matrice RBAC, Loïc
l'initialisation Docker. La semaine s'est close par un débrief et la
planification du sprint 1.

== Déroulé des sprints

#table(
  columns: (4em, 6em, 5em, 4em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (center, left, center, center, left),
  [*Sprint*], [*Semaine*], [*Commits*], [*PR*], [*Contenu principal*],
  [0], [6–10 jan.], [35], [10], [Cadrage, conception, initialisation],
  [1], [12–18 jan.], [148], [49], [Authentification, landing page, Docker, pages profil et conversation],
  [2], [19–25 jan.], [129], [41], [Follow/unfollow, édition de profil, recherche Meilisearch, Socket.IO],
  [3], [26–29 jan.], [54], [30], [Messagerie temps réel, mise en production, documentation],
)

#text(size: 9pt, fill: rgb("#57606a"))[
  Commits hors _merge_ et Pull Requests mergées, comptés par semaine ISO sur le
  dépôt d'équipe. Le travail s'est poursuivi certains week-ends : les bornes de
  la colonne « Semaine » couvrent la semaine complète, week-end inclus.
]

== Ma contribution et sa progression

J'ai porté six branches de feature et treize Pull Requests intégrées, en
deuxième position sur le volume de commits de l'équipe. Ma contribution suit
une montée en charge nette : quatrième contributeur au sprint 0 (3 commits, la
semaine étant consacrée à la conception), je deviens deuxième au sprint 1 (41)
puis premier contributeur au sprint 2 (54 commits). Le journal de bord tenu par
l'équipe pendant le projet#footnote[Tableur partagé, hors dépôt Git — comme les autres documents de cadrage (cahier des charges, user stories, dictionnaire de données). Le fichier #raw("docs/carnet-de-bord.md", lang: "txt") du dépôt est resté à l'état de gabarit.] retrace ce parcours : mise en place de l'architecture UI et des
composants atomiques, landing page complète, configuration Docker de
développement et de production, page profil, feature follow/unfollow, revue et
refactorisation du frontend, puis conception et implémentation de la page de
recherche en cohérence avec le backend Meilisearch.

== Outils et flux de travail

Quatre outils ont structuré la collaboration : *Discord* pour les sessions
synchrones et le pair-programming, *Slack* pour les échanges écrits, *Trello*
pour le backlog#footnote[#link("https://trello.com/b/536OvoxI/skillswap")[trello.com/b/536OvoxI/skillswap]] et un *Drive partagé* pour les documents de cadrage — brief
projet, tableur des user stories, journal de bord.

Le flux Git reposait sur une stratégie #raw("main", lang: "txt") /
#raw("dev", lang: "txt") / branches de feature, avec intégration par Pull
Request et branches courtes. La qualité de code était outillée par ESLint,
Prettier et un hook de _pre-commit_ Husky.

== Anticipation des risques

Une analyse de risques a été conduite, identifiant douze risques répartis en
cinq familles — techniques, développement, organisationnels, UX/sécurité et
déploiement — chacun assorti d'une mitigation. J'ai par ailleurs formalisé une
matrice de risques dans la documentation Arc42 du projet (délais, périmètre,
performance de la recherche, sécurité des jetons), avec probabilité, impact,
mitigation et plan de contingence.
