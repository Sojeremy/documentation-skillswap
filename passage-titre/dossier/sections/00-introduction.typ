// =============================================================================
// Section 00 — Introduction
// Volume cible : 1 page
//
// VÉRIFIÉ S15 : skill-swap.fr répond HTTP 200 et /api/v1/health renvoie
// {"status":"ok"} au 22 août 2026 → le présent (« est aujourd'hui en
// production ») est justifié. À revérifier avant impression.
//
// Tous les renvois de plan passent par #ref sur label — jamais de numéro.
// =============================================================================

= Introduction <sec-intro>

Ce dossier de projet présente SkillSwap, plateforme web d'échange de
compétences entre particuliers, développée dans le cadre de l'apothéose finale
du Titre Professionnel Concepteur Développeur d'Applications. Le projet a été
porté pendant quatre semaines par une équipe de cinq apprenants de la promotion
Dublin.

J'y ai tenu le rôle de Lead Front : architecture et développement des
interfaces, conception des maquettes, chaîne de déploiement de production, et
documentation technique du projet.

Le dossier suit la structure du plan-type : recensement des onze compétences
professionnelles mobilisées (#ref(<sec-competences>, supplement: [section])),
cadrage du besoin (#ref(<sec-cahier>, supplement: [section])), présentation du
commanditaire pédagogique et de l'équipe
(#ref(<sec-cadre>, supplement: [section])), méthodologie de gestion de projet
(#ref(<sec-gestion>, supplement: [section])), spécifications fonctionnelles et
techniques (#ref(<sec-specs-fonc>, supplement: [section]) et
#ref(<sec-specs-tech>, supplement: [section])), description détaillée de la
fonctionnalité représentative — la messagerie temps réel — sous l'angle des
réalisations (#ref(<sec-realisations>, supplement: [section])) et de la
sécurité (#ref(<sec-securite>, supplement: [section])), plan de tests
(#ref(<sec-plan-tests>, supplement: [section])), jeu d'essai
(#ref(<sec-jeu-essai>, supplement: [section])), démarche de veille
(#ref(<sec-veille>, supplement: [section])), retour d'expérience sur les
difficultés rencontrées (#ref(<sec-difficultes>, supplement: [section])),
conclusion ouvrant sur les évolutions V2
(#ref(<sec-conclusion>, supplement: [section])), lexique
(#ref(<sec-lexique>, supplement: [section])), et annexes regroupant les
extraits de code et artefacts visuels.

Un parti pris a guidé sa rédaction : chaque affirmation factuelle y est adossée
à une source vérifiable dans le code livré. Les artefacts de modélisation ont
été reconstruits de façon déterministe depuis la base réelle, les éléments
produits après la période de projet sont explicitement datés, et les dettes
techniques identifiées sont documentées plutôt que masquées.

Le projet est aujourd'hui en production sur
#link("https://skill-swap.fr")[skill-swap.fr].

== Présentation du candidat

Mon parcours vers le développement est celui d'une reconversion. Après un BTS
Management Commercial Opérationnel et un Bachelor Responsable Manager, j'ai
exercé six ans en commerce et en management : conseiller client, puis
responsable du développement de la livraison à domicile pour une enseigne de
grande distribution, enfin commercial dans l'assurance. Ces années m'ont donné
une lecture métier des problèmes techniques, l'habitude de chercher le besoin
réel avant la solution, et le sens des priorités d'une activité.

C'est cette même exigence de compréhension du besoin qui m'a conduit vers
l'ingénierie logicielle. J'ai intégré la formation Concepteur Développeur
d'Applications d'O'clock pour acquérir des fondations solides : architecture,
conception de bases de données, développement full-stack et mise en production.
L'apothéose SkillSwap constitue l'aboutissement de ce cursus — un projet
d'équipe mené de bout en bout, du cadrage au déploiement.
