// =============================================================================
// Section 05 — Spécifications fonctionnelles (REAC §5)
// Volume cible : 5-7 pages — LE PLUS GROS BLOC du dossier après les réalisations
// Sous-sections obligatoires : 5.1 à 5.7
// =============================================================================

= Spécifications fonctionnelles

== Contraintes du projet et livrables attendus

// TODO :
// - Contraintes temps : 5 semaines de développement
// - Contraintes équipe : équipe d'apprenants, montée en compétence parallèle
// - Livrables : application en production accessible publiquement, code sur
//   GitHub public, documentation Arc42 publiée, dossier de projet CDA, slides
//   soutenance.
// - Contraintes techniques imposées par O'clock : aucune (libre choix de stack)
// - Contraintes auto-imposées : monolithique modulaire, TypeScript strict,
//   Atomic Design.

== Architecture logicielle

// Diagramme : docs/uml/architecture/architecture.png (à intégrer en image)
// TODO : description macro — front Next.js (SSR + CSR), back Express +
// Socket.IO, BDD PostgreSQL via Prisma, recherche Meilisearch, déploiement
// Docker derrière nginx + Let's Encrypt.
// Référence Arc42 : docs/documentation-implementation/arc42/05-building-blocks/

#figure(
  // image("../assets/diagrammes/architecture.png", width: 100%),
  rect(width: 100%, height: 6cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      // TODO : insérer docs/uml/architecture/architecture.png
    ]]
  ],
  caption: [Diagramme d'architecture (à intégrer)],
)

== Maquettes et enchaînement des maquettes

// TODO : intégrer les maquettes Figma (export PNG dans assets/diagrammes/).
// Décrire le parcours user à travers les maquettes : home → inscription →
// onboarding profil → recherche → fiche membre → conversation.
// Lien Figma (à compléter).

== Modèle entités-associations + MPD

// Diagrammes : docs/uml/erd.png + docs/documentation-implementation/arc42/diagrams/erd.svg
// TODO : insérer le diagramme + commenter les 14 modèles regroupés par
// domaine : utilisateur (User, Role, RefreshToken), social (Follow, Rating),
// compétences (Skill, Category, UserHasSkill, UserHasInterest), disponibilités
// (Available, UserHasAvailable), messagerie (Conversation, UserHasConversation,
// Message).

#figure(
  rect(width: 100%, height: 7cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      // TODO : insérer docs/uml/erd.png
    ]]
  ],
  caption: [Modèle entités-associations (14 modèles)],
)

== Script de création / modification de la base de données

// TODO : extraire 1-2 migrations Prisma significatives depuis
// backend/prisma/migrations/ (la migration initiale + une migration
// d'évolution, par ex. ajout colonne ou index).
// Bloc raw avec lang: "sql"

```sql
// TODO : copier extrait migration
```

== Diagramme de cas d'utilisation

// Diagramme : docs/uml/user/use-cases.png
// TODO : insérer + commenter — acteurs (Visiteur, Membre), cas (s'inscrire,
// rechercher, suivre, discuter, évaluer, gérer son profil).

#figure(
  rect(width: 100%, height: 6cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      // TODO : insérer docs/uml/user/use-cases.png
    ]]
  ],
  caption: [Diagramme de cas d'utilisation],
)

== Diagramme de séquence du cas le plus significatif — Messagerie temps réel

// Diagramme : docs/uml/sequence/conversation.png
// TODO : insérer le diagramme + commenter étape par étape.
// La messagerie est notre fonctionnalité représentative
// (cf. docs/audits/feature-inventory-cda.md).
// Le diagramme couvre : authentification socket, join room, envoi message,
// persistance, diffusion aux 2 rooms (conversation + user), notification
// premier message.

#figure(
  rect(width: 100%, height: 8cm, fill: rgb("#f6f8fa"), stroke: 0.5pt + rgb("#d0d7de"))[
    #align(center + horizon)[#text(fill: rgb("#57606a"), size: 9pt)[
      // TODO : insérer docs/uml/sequence/conversation.png
    ]]
  ],
  caption: [Séquence — Envoi d'un message en temps réel via Socket.IO],
)
