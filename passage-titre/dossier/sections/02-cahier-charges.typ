// =============================================================================
// Section 02 — Cahier des charges (REAC §2)
// Volume cible : 2-3 pages
//
// SOURCE : brief projet d'équipe (Google Doc), tableur des user stories et
// journal des questions de conception — tous produits HORS dépôt Git, comme le
// journal de bord (cf. 04-gestion-projet.typ). Leur existence est attestée par
// la checklist de conception validée par l'équipe pédagogique
// (conception.md, branche presentation-seb du dépôt d'équipe : 21 items cochés,
// dont « user stories » et « dictionnaire de données »).
//
// VÉRIFIÉ EN SESSION S12 contre le dépôt d'équipe (HEAD de73323) :
//   - blocage de profil / suggestions automatiques / groupes : AUCUNE trace.
//     grep -riE "block|blocage|suggest|recommend|matching|group|communaut"
//     sur backend/src + schema.prisma → 0 résultat pertinent (seuls hits :
//     un GROUP BY SQL et deux descriptions de seed). Aucun modèle, aucune route.
//   - les 20 user stories listées correspondent toutes à une route réelle,
//     y compris « supprimer un message » :
//     DELETE /conversations/:id/message/:messageId (conv.router.ts:80-85).
//   - « consulter les disponibilités des autres membres » : exposées par
//     getProfileService (profile.service.ts:127) pour un membre authentifié ;
//     le teaser public les masque volontairement (profile.service.ts:28).
//   - PATCH /conversations/:id/message/:messageId (modifier un message,
//     conv.router.ts:72-79) est implémenté SANS figurer au cadrage initial.
//     Ajouté au tableau des US en S12, explicitement marqué comme livré
//     au-delà du périmètre prévu — ne pas le présenter comme une US d'origine.
// =============================================================================

= Cahier des charges <sec-cahier>

Le cadrage du projet a été formalisé dans un brief d'équipe, complété d'un
tableur de user stories et d'un journal des questions de
conception#footnote[Documents produits hors dépôt Git, comme le journal de bord mentionné en #ref(<sec-gestion>, supplement: [section]). Leur production est attestée par la checklist de conception validée par l'équipe pédagogique, qui coche notamment « user stories » et « dictionnaire de données ».].
La présente section en restitue le contenu.

== Présentation du projet

SkillSwap est une plateforme web d'échange de compétences entre particuliers.
Chaque utilisateur peut proposer ses savoir-faire et bénéficier de ceux des
autres, favorisant l'entraide et le partage de connaissances. La plateforme
permet de créer un profil proposant ses services grâce à ses compétences, de
rechercher d'autres profils ayant une compétence souhaitée, et une mise en
relation via une messagerie intégrée. Elle repose sur une architecture moderne
avec frontend et backend séparés, conteneurisée avec Docker pour garantir
portabilité, sécurité et scalabilité.

== Public cible

Des particuliers âgés de 18 à 60 ans, à l'aise avec les outils numériques,
intéressés par l'entraide et l'économie collaborative. Ils cherchent à acquérir
de nouvelles compétences ou à résoudre des besoins ponctuels (bricolage,
informatique, jardinage, cuisine) sans passer par des services professionnels
payants ; en échange, ils sont prêts à partager leurs propres compétences.
Exemples : un développeur ayant besoin d'une réparation automobile, un
jardinier souhaitant rénover sa salle de bain, un bricoleur désireux
d'apprendre à cuisiner.

== Besoins fonctionnels — le MVP <sub-mvp>

- Landing page avec la présentation de SkillSwap et quelques profils.
- Système d'inscription et de connexion.
- Gestion du profil utilisateur détaillé avec ses compétences, intérêts et
  disponibilités.
- Moteur de recherche par compétences afin de trouver de potentiels profils
  correspondants.
- Possibilité de suivre / ne plus suivre un profil.
- Possibilité de rentrer en contact avec un profil pour entamer un échange sur
  les compétences mutuelles.
- Possibilité d'évaluer un partenaire après échange de compétences.

== Évolutions envisagées et périmètre effectivement livré

Le cadrage identifiait plusieurs évolutions possibles au-delà du MVP : la
messagerie instantanée via WebSockets, la recherche avancée avec Meilisearch,
le blocage d'un profil, la suggestion automatique de profils compatibles et la
création de groupes ou communautés. Deux d'entre elles ont finalement été
livrées dans le périmètre du projet : la messagerie temps réel (Socket.IO) et
le moteur de recherche Meilisearch. Les autres — blocage de profil, suggestions
automatiques, groupes — n'ont pas été implémentées et restent des perspectives
d'évolution.

== Périmètre fonctionnel détaillé — user stories <sub-user-stories>

#table(
  columns: (6em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Acteur*], [*« Je souhaite pouvoir … afin de … »*],
  [Visiteur], [Accéder à la landing page, afin de prévisualiser le fonctionnement du site.],
  [Visiteur], [Accéder au formulaire de création de compte.],
  [Visiteur], [Accéder au formulaire de connexion.],
  [Membre], [Accéder à la page de recherche des profils.],
  [Membre], [Accéder à un profil particulier.],
  [Membre], [Contacter un autre membre via la page de profil, afin d'initier une conversation.],
  [Membre], [Changer mon avatar, gérer ma description, mes compétences, mes intérêts et mes disponibilités, afin de mettre à jour mon profil.],
  [Membre], [Consulter les disponibilités des autres membres.],
  [Membre], [Accéder à ma messagerie.],
  [Membre], [Envoyer un message.],
  [Membre], [Supprimer un message.],
  [Membre], [Modifier un message. #emph[Absent du cadrage initial — fonctionnalité livrée au-delà du périmètre prévu] (#raw("PATCH /conversations/:id/message/:messageId", lang: "txt"), #raw("conv.router.ts:72-79", lang: "ts")).],
  [Membre], [Clore une conversation.],
  [Membre], [Suivre / ne plus suivre un membre.],
  [Membre], [Évaluer un autre membre à la fermeture d'une conversation.],
  [Membre], [Effectuer une recherche et filtrer par catégorie.],
  [Membre], [Me déconnecter.],
  [Membre], [Supprimer mon compte.],
)

== Règles de gestion arbitrées en cadrage

Plusieurs règles ont été tranchées collectivement : la mise en relation n'est
ouverte qu'entre membres liés par un suivi ; l'évaluation ne devient disponible
qu'à la clôture d'une conversation, chaque conversation portant un statut ; les
disponibilités sont saisies par créneaux prédéfinis (jour × plage) plutôt que
par calendrier libre. La fonctionnalité « souhaite apprendre » envisagée
initialement a été retirée du périmètre.

== Contraintes techniques et de compatibilité

Le cadrage fixait la pile technique et sa justification : Docker (cohérence des
environnements), Node.js/Express (performances asynchrones, framework léger),
Next.js (SEO via SSR/SSG), shadcn/ui + Tailwind (composants accessibles),
PostgreSQL (base relationnelle robuste), Nginx (reverse proxy, SSL), Prisma
(ORM type-safe), Meilisearch (recherche tolérante aux fautes), Socket.IO (temps
réel). La compatibilité visée couvrait Chrome, Firefox, Edge et Safari, en
desktop et mobile, dans leurs versions récentes.

Les choix de cette pile et leur mise en œuvre effective sont détaillés en
#ref(<sec-specs-tech>, supplement: [section]).
