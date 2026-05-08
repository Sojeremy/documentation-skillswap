// =============================================================================
// Section 14 — Lexique (ajout O'clock, optionnel)
// Volume cible : 1 page
// Réf : docs/documentation-implementation/arc42/12-glossary/
// =============================================================================

= Lexique

// TODO : compléter — termes techniques utilisés dans le dossier qui méritent
// une définition pour le jury non-technique.
// Référence canonique : docs/documentation-implementation/arc42/12-glossary/

#table(
  columns: (auto, 1fr),
  inset: 6pt,
  align: left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Terme*], [*Définition*],

  [argon2id],
  [Algorithme de hashing de mots de passe gagnant du Password Hashing
   Competition 2015. Variante recommandée par l'OWASP.],

  [Atomic Design],
  [Méthodologie de design de composants UI proposée par Brad Frost,
   organisant les composants en atomes / molécules / organismes / templates /
   pages. Adoptée pour la structure du front SkillSwap.],

  [Cookie httpOnly],
  [Cookie HTTP non lisible par le JavaScript côté client. Protège contre
   le vol de session par XSS.],

  [JWT (JSON Web Token)],
  [Token d'authentification signé contenant les claims utilisateur. Utilisé
   comme accessToken dans SkillSwap.],

  [Meilisearch],
  [Moteur de recherche full-text open-source écrit en Rust. Utilisé pour
   l'indexation des membres SkillSwap.],

  [Optimistic UI],
  [Pattern UX consistant à afficher immédiatement le résultat d'une action
   côté client avant la confirmation serveur, pour fluidifier la perception.],

  [Prisma],
  [ORM TypeScript-first pour Node.js, génère un client typé depuis un schéma
   déclaratif. Utilisé pour PostgreSQL dans SkillSwap.],

  [Refresh token rotation],
  [Pattern d'authentification où chaque utilisation du refresh token le
   remplace par un nouveau, invalidant l'ancien. Limite la fenêtre de rejeu.],

  [Room (Socket.IO)],
  [Mécanisme de groupement de sockets côté serveur, permettant de cibler
   l'émission d'événements à un sous-ensemble de clients.],

  [Server Component (Next.js)],
  [Composant React rendu côté serveur dans Next.js App Router, sans envoi
   de JavaScript au client.],

  [Socket.IO],
  [Bibliothèque JavaScript pour la communication temps réel bidirectionnelle
   entre client et serveur, basée sur WebSocket avec fallback HTTP long-poll.],

  [Zod],
  [Bibliothèque TypeScript de validation et inférence de schémas. Utilisée
   pour valider toutes les entrées REST côté backend SkillSwap.],

  // TODO : ajouter d'autres termes au besoin (Argon2 cost, RFC 6749, CSP...)
)
