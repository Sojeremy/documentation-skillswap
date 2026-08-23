// =============================================================================
// Section 14 — Lexique (ajout O'clock, optionnel)
// Volume cible : 1 page (dépassé : ~3 pages pour 49 entrées)
//
// RÈGLE : n'entrent ici que les termes RÉELLEMENT employés dans le dossier.
// Vérifié en S18 par grep sur sections/*.typ et annexes/ — chaque entrée
// apparaît au moins une fois dans le texte.
// « Singleton » a été DÉLIBÉRÉMENT ÉCARTÉ : 0 occurrence dans le dossier.
// Ne pas l'ajouter sans l'employer d'abord dans une section.
//
// Classement alphabétique (accents ignorés), pour l'usage en consultation.
// =============================================================================

= Lexique <sec-lexique>

Les termes ci-dessous sont ceux effectivement employés dans ce dossier. Les
définitions visent la compréhension par un lecteur non spécialiste du projet.

#table(
  columns: (11em, 1fr),
  inset: 6pt,
  align: (left, left),
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Terme*], [*Définition*],

  [ADR (Architecture Decision Record)],
  [Fiche courte qui consigne une décision d'architecture : le contexte, les
   options envisagées, le choix retenu et ses conséquences. Sert à retrouver
   plus tard pourquoi une option a été préférée à une autre.],

  [Architecture en couches],
  [Organisation du code en niveaux de responsabilité successifs — ici router,
   middleware, controller, service, accès aux données — où chaque couche ne
   s'adresse qu'à la suivante.],

  [argon2id],
  [Algorithme de hachage de mots de passe, lauréat du Password Hashing
   Competition 2015 et variante recommandée par l'OWASP. Son coût en mémoire
   le rend résistant aux attaques par matériel dédié.],

  [Atomic Design],
  [Méthode d'organisation des composants d'interface proposée par Brad Frost,
   des plus élémentaires aux plus composés : atomes, molécules, organismes,
   pages.],

  [Cardinalité],
  [Nombre minimal et maximal d'occurrences d'une entité pouvant participer à
   une association. Notée par un couple, par exemple (0,2) : de zéro à deux.],

  [CI/CD],
  [Intégration continue et déploiement continu. L'intégration vérifie
   automatiquement chaque modification (compilation, tests) ; le déploiement
   publie automatiquement la version validée.],

  [Clé composite],
  [Clé primaire formée de plusieurs colonnes plutôt que d'une seule. Employée
   ici pour identifier un participant à une conversation par le couple
   utilisateur–conversation.],

  [Contrainte d'intégrité / applicative],
  [Une contrainte d'*intégrité* est garantie par la base elle-même et ne peut
   être contournée. Une contrainte *applicative* n'est assurée que par le code :
   une écriture directe en base pourrait la violer. La distinction est
   essentielle pour savoir sur quoi l'on peut réellement compter.],

  [Cookie httpOnly],
  [Cookie que le JavaScript de la page ne peut pas lire. Il reste transmis
   automatiquement au serveur, ce qui protège le jeton de session contre le
   vol par injection de script.],

  [CORS],
  [Mécanisme par lequel un serveur déclare quelles origines web sont
   autorisées à l'appeler. Il empêche un site tiers d'interroger l'API au nom
   d'un utilisateur connecté.],

  [CSP (Content Security Policy)],
  [En-tête HTTP énumérant les sources de contenu qu'une page a le droit de
   charger. Il limite fortement la portée d'une injection de script.],

  [Dénormalisation],
  [Duplication volontaire d'une information déjà déductible ailleurs, pour
   simplifier ou accélérer les lectures — au prix d'un risque d'incohérence à
   surveiller.],

  [Docker],
  [Outil d'exécution d'applications en conteneurs : chaque service embarque son
   environnement complet, ce qui rend son comportement identique en
   développement et en production.],

  [DTO (Data Transfer Object)],
  [Objet dédié au transport de données entre deux couches, exposant uniquement
   les champs nécessaires plutôt que l'entité complète.],

  [ERD (Entity-Relationship Diagram)],
  [Diagramme représentant les tables, leurs colonnes et les liens qui les
   unissent. Vue la plus proche du schéma réellement implémenté.],

  [Event (Socket.IO)],
  [Message nommé échangé sur une connexion temps réel, par exemple
   #raw("message:send", lang: "ts"). L'émetteur le publie, les destinataires
   abonnés le reçoivent.],

  [Façade de hooks],
  [Hook React unique servant de point d'entrée à plusieurs hooks spécialisés.
   Le composant appelle la façade et ignore le détail de la composition.],

  [Fixture],
  [Jeu de données préparé avant l'exécution de tests, garantissant qu'ils
   partent tous du même état connu.],

  [Handshake],
  [Phase initiale d'une connexion, pendant laquelle client et serveur
   négocient et vérifient les conditions de l'échange — ici, la validité du
   jeton d'authentification avant d'accepter la connexion temps réel.],

  [HSTS],
  [En-tête HTTP par lequel un site impose aux navigateurs de ne plus
   l'atteindre qu'en HTTPS, y compris lors des visites suivantes.],

  [Injection SQL],
  [Attaque consistant à glisser du code SQL dans une donnée saisie pour
   détourner une requête. Les requêtes paramétrées, générées ici par l'ORM,
   la neutralisent.],

  [JWT (JSON Web Token)],
  [Jeton d'authentification signé, contenant les informations d'identité de
   l'utilisateur. Sa signature permet d'en vérifier la validité sans consulter
   la base.],

  [Mapper],
  [Fonction convertissant une donnée d'une représentation vers une autre, par
   exemple d'une entité de base vers le format attendu par le moteur de
   recherche.],

  [MCD (Modèle Conceptuel de Données)],
  [Premier niveau Merise : les concepts métier et leurs associations,
   indépendamment de toute technologie de base de données.],

  [Meilisearch],
  [Moteur de recherche plein texte open source, tolérant aux fautes de frappe.
   Utilisé ici pour l'indexation et la recherche de membres.],

  [Merise],
  [Méthode française de modélisation des données procédant en trois niveaux
   successifs — conceptuel, logique, physique.],

  [Middleware],
  [Fonction intercalée dans le traitement d'une requête, exécutée avant le
   traitement principal. Sert notamment à authentifier, valider ou refuser
   une requête.],

  [MLD (Modèle Logique de Données)],
  [Deuxième niveau Merise : traduction du modèle conceptuel en tables,
   colonnes et clés, sans encore dépendre d'un moteur précis.],

  [MPD (Modèle Physique de Données)],
  [Troisième niveau Merise : le schéma tel qu'il est réellement créé dans le
   moteur, avec ses types, index et contraintes.],

  [Normalisation / 3NF],
  [Démarche d'organisation des données visant à éliminer les redondances. La
   troisième forme normale (3NF) exige que chaque colonne dépende de la clé
   primaire, et d'elle seule.],

  [Optimistic UI],
  [Technique consistant à afficher immédiatement le résultat probable d'une
   action, sans attendre la réponse du serveur, pour supprimer la latence
   perçue.],

  [ORM (Object-Relational Mapping)],
  [Couche logicielle traduisant les tables d'une base relationnelle en objets
   du langage de programmation, et inversement.],

  [OWASP],
  [Organisation à but non lucratif de référence en sécurité applicative,
   connue notamment pour son Top 10 des risques les plus critiques.],

  [Prisma],
  [ORM pour Node.js qui génère un client typé à partir d'un schéma déclaratif,
   et gère les migrations de base de données.],

  [Rate limiting],
  [Limitation du nombre de requêtes acceptées d'une même source sur un
   intervalle donné. Protège notamment contre les tentatives de mot de passe
   en série.],

  [Refresh token rotation],
  [Mécanisme où chaque usage du jeton de renouvellement le remplace par un
   nouveau et invalide l'ancien, réduisant la fenêtre d'exploitation d'un
   jeton dérobé.],

  [Reverse proxy],
  [Serveur placé devant les applications, qui reçoit toutes les requêtes
   entrantes et les redirige vers le bon service. Assure ici le chiffrement
   TLS et le routage.],

  [Room (Socket.IO)],
  [Groupe nommé de connexions temps réel. Émettre vers une room n'atteint que
   les clients qui l'ont rejointe, ce qui cloisonne les échanges.],

  [sameSite],
  [Attribut de cookie déterminant s'il accompagne les requêtes venant d'un
   autre site. La valeur #raw("strict", lang: "ts") l'interdit, ce qui limite
   les attaques par requête falsifiée.],

  [Scrum],
  [Cadre de travail agile organisant le développement en cycles courts, avec
   des rôles et des rituels définis.],

  [Seed],
  [Script peuplant une base vierge de données initiales, afin de disposer d'un
   environnement exploitable pour le développement ou la démonstration.],

  [Server Component (Next.js)],
  [Composant React rendu sur le serveur, dont le code n'est pas envoyé au
   navigateur.],

  [Socket.IO],
  [Bibliothèque de communication temps réel bidirectionnelle entre client et
   serveur, reposant sur WebSocket avec repli automatique si celui-ci est
   indisponible.],

  [Sprint],
  [Cycle de travail de durée fixe en Scrum, au terme duquel un incrément
   utilisable est livré. Ici, une semaine.],

  [SSR (Server-Side Rendering)],
  [Génération des pages HTML côté serveur avant envoi au navigateur. Améliore
   l'affichage initial et permet l'indexation par les moteurs de recherche.],

  [User story],
  [Formulation courte d'un besoin du point de vue de l'utilisateur, du type
   « je souhaite pouvoir … afin de … ».],

  [WebSocket],
  [Protocole maintenant une connexion ouverte en permanence entre client et
   serveur, permettant au serveur d'envoyer des données sans que le client ait
   à les demander.],

  [XSS (Cross-Site Scripting)],
  [Attaque consistant à faire exécuter un script malveillant dans le
   navigateur d'un autre utilisateur, typiquement pour lui dérober sa session.],

  [Zod],
  [Bibliothèque TypeScript de validation de données par schémas, qui vérifie
   les entrées et en déduit automatiquement les types.],
)
