// =============================================================================
// Section 03 — Présentation du commanditaire et de l'équipe
// Volume cible : 1 page
//
// Label <sec-cadre> conservé : il est la cible des renvois de l'introduction.
// Renvois sortants par #ref (gestion de projet, cahier des charges) —
// jamais de numéro de section en dur.
//
// OUTILS DE COLLABORATION — liste alignée en S15 avec 04-gestion-projet.typ.
// Les DEUX sections doivent citer exactement les mêmes quatre outils :
//   Discord (sessions synchrones) · Slack · Trello (backlog) · Drive partagé.
// Confirmés par le candidat ; le dépôt d'équipe n'en atteste aucun. Les seules
// occurrences de « Slack » y sont des cases NON COCHÉES du plan documentaire
// (docs/documentation-strategy/13-deploiement.md, 14-planning.md, README.md) ;
// Trello et Google Drive : zéro occurrence. Source = le candidat, pas le dépôt.
// Toute modification de cette liste doit être répercutée dans les deux fichiers.
// =============================================================================

= Présentation du commanditaire et de l'équipe <sec-cadre>

== O'clock — école de développement à distance synchrone

Le projet a été réalisé dans le cadre de l'apothéose finale du Titre
Professionnel Concepteur Développeur d'Applications (niveau 6, inscrit au
RNCP), formation dispensée par O'clock — école de développement web et logiciel
structurée autour d'un modèle pédagogique de téléprésentiel : les cours sont
assurés en visio en temps réel par des formateurs. Notre promotion a été nommée
Dublin.

== L'apothéose — dispositif simulant l'entreprise

L'apothéose constitue la mise en situation professionnelle finale du cursus.
Elle réunit un groupe d'apprenants pendant quatre semaines pour livrer un
projet d'envergure depuis le cadrage jusqu'à la mise en production, en
appliquant la méthodologie agile et l'ensemble des compétences techniques
acquises. O'clock joue ici le rôle de commanditaire pédagogique : l'école
définit le périmètre général — un projet web complet dont la fonctionnalité
principale doit être d'envergure —, valide les choix techniques, et accompagne
l'équipe via des points hebdomadaires avec un formateur référent.

== L'équipe SkillSwap

Cinq développeurs apprenants, sur des rôles formalisés en sprint 0 et conservés
tout au long du projet :

#table(
  columns: (10em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Membre*], [*Rôle*],
  [Sébastien], [Product Owner],
  [Loïc], [Scrum Master],
  [Yorgan], [Lead Back],
  [Jérémy Soriano], [Lead Front],
  [Antoine], [Frontend],
)

La répartition détaillée des contributions, les rituels tenus et les outils de
collaboration — Discord pour les sessions synchrones, Slack, Trello et un Drive
partagé — sont décrits en #ref(<sec-gestion>, supplement: [section]).

== Le projet

L'équipe a porté SkillSwap, plateforme web d'échange de compétences entre
particuliers. Le périmètre fonctionnel cible et les contraintes techniques
structurantes sont détaillés au #ref(<sec-cahier>, supplement: [section]). Le
projet est aujourd'hui en production sous le nom de domaine
#link("https://skill-swap.fr")[skill-swap.fr].
