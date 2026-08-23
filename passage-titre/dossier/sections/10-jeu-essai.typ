// =============================================================================
// Section 10 — Jeu d'essai (REAC §10)
// Volume cible : 2-3 pages
// Format REAC : Données entrée / Données attendues / Données obtenues / Analyse
//
// SCÉNARIO EXÉCUTÉ LE 2026-08-23 sur une COPIE du dépôt d'équipe placée hors
// dépôt ; l'original ~/Desktop/projet-skillswap n'a reçu AUCUNE écriture
// (invariant #1). Stack Docker de développement, base seedée (41 utilisateurs).
//
// DONNÉES RÉELLES OBTENUES :
//   Alice Dupont id=1 · Bob Martin id=27 · mot de passe du seed password123
//   Conversation « Jeu d'essai CDA » id=17, statut Open, 2 participants
//   Message id=108, sender 1 → receiver 27
//   created_at 16:27:11.755 / updated_at 16:27:20.972 → propagation vérifiée
//
// CAPTURES : assets/jeu-essai/ (9 PNG + 2 sorties SQL + README).
// Produites avec Playwright, QUI N'EST PAS UN LIVRABLE DU PROJET — ne jamais
// les présenter comme une couverture de test. Ce sont des illustrations.
//
// NON CAPTURABLE : la console DevTools des events Socket.IO. L'application ne
// journalise pas les events, l'écouteur console a capté 0 ligne. Une capture
// du panneau Réseau/WS resterait à faire manuellement.
// =============================================================================

= Jeu d'essai <sec-jeu-essai>

== Contexte d'exécution

Le scénario retenu est celui de la fonctionnalité représentative : *Alice
envoie un premier message à Bob qu'elle suit*. Il active la branche
#raw("isFirstMessage", lang: "ts") du handler #raw("message:send", lang: "ts"),
et exerce donc l'ensemble de la chaîne — gating métier, création de
conversation, persistance, diffusion multi-rooms et réconciliation de l'UI
optimiste.

L'exécution a eu lieu le *23 août 2026* en environnement de *développement
local conteneurisé* (Docker Compose : PostgreSQL 16, Meilisearch, Nginx,
backend et frontend), sur une *copie du dépôt d'équipe placée hors du dépôt* —
le livrable d'origine n'a reçu aucune écriture. Le jeu de données est celui du
seed de développement : 41 utilisateurs, dont les deux acteurs.

#table(
  columns: (11em, 1fr),
  stroke: 0.5pt + rgb("#d0d7de"),
  inset: 6pt,
  align: (left, left),
  [*Paramètre*], [*Valeur*],
  [Acteurs], [Alice Dupont (#raw("id = 1", lang: "sql")) et Bob Martin (#raw("id = 27", lang: "sql"))],
  [Authentification], [#raw("alice.dupont@example.com", lang: "txt") / #raw("bob.martin@example.com", lang: "txt"), mot de passe du seed],
  [Point d'entrée], [#raw("http://localhost:8888", lang: "txt") (Nginx → frontend + API)],
  [Conversation créée], [« Jeu d'essai CDA » (#raw("id = 17", lang: "sql"))],
  [Pré-requis], [Le lien de suivi Alice → Bob existe déjà dans le seed],
)

Les captures d'écran ont été produites en pilotant *deux contextes navigateur
simultanés*, afin d'observer les deux côtés de l'échange dans la même
seconde#footnote[Outil de pilotage hors périmètre du livrable d'équipe : il n'a servi qu'à produire ces illustrations pour le présent dossier, et ne constitue en aucun cas une couverture de test automatisé — cf. #ref(<sec-plan-tests>, supplement: [section]).].

== Étape 1 — Le lien de suivi, pré-requis du gating

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    Alice authentifiée \
    Consultation du profil de Bob (#raw("/profil/27", lang: "txt"))
  ],
  [
    Lien de suivi actif \
    Ligne présente en table #raw("follow", lang: "sql") \
    Action « Contacter » accessible
  ],
  [
    Profil affiché, état « suivi » actif \
    #raw("follow", lang: "sql") #raw("id = 1", lang: "sql"), Alice → Bob \
    Créé au seed le 22/08 à 18:37:48
  ],
  [
    *Conforme.* Le pré-requis métier est satisfait : sans ce lien, la création
    de conversation serait refusée par #raw("requireSimpleFollow", lang: "ts").
  ],
)

#figure(
  image("../assets/jeu-essai/etape-1-follow.png", width: 92%),
  caption: [Étape 1 — profil public de Bob consulté par Alice, lien de suivi actif.],
)

== Étape 2 — Création de la conversation

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    #raw("POST /api/v1/conversations", lang: "txt") \
    Cookie #raw("accessToken", lang: "ts") (Alice) \
    #raw("{ title: \"Jeu d'essai CDA\", receiverId: 27 }", lang: "js")
  ],
  [
    #raw("201 Created", lang: "txt") \
    Conversation au statut #raw("Open", lang: "sql") \
    Exactement 2 participants \
    Aucun message
  ],
  [
    Conversation #raw("id = 17", lang: "sql") créée à 16:27:11.755 \
    Statut #raw("Open", lang: "sql"), participants Alice ↔ Bob \
    #raw("nb_messages = 0", lang: "sql")
  ],
  [
    *Conforme.* La cardinalité (0,2) est respectée dès la création : les deux
    lignes #raw("user_has_conversation", lang: "sql") sont insérées en une
    fois. Le fil est vide, ce qui armera la branche premier message.
  ],
)

#figure(
  image("../assets/jeu-essai/etape-2a-dialog-creation.png", width: 92%),
  caption: [Étape 2 — dialogue de création, Bob sélectionné parmi les seuls membres suivis.],
)

== Étape 3 — Envoi du message et affichage optimiste

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    Event #raw("message:send", lang: "ts") \
    #raw("{ conversationId: 17, message: \"Salut Bob !…\" }", lang: "js") \
    Socket authentifié par cookie
  ],
  [
    Affichage immédiat côté Alice, avant réponse serveur \
    Persistance d'un message \
    #raw("updated_at", lang: "sql") de la conversation modifié
  ],
  [
    Message affiché instantanément dans le fil d'Alice \
    Message #raw("id = 108", lang: "sql") persisté à 16:27:20.973 \
    #raw("updated_at", lang: "sql") passé à 16:27:20.972
  ],
  [
    *Conforme.* L'écart de 9 secondes entre la création de la conversation et
    le message confirme que le fil était bien vide à l'ouverture. La mise à
    jour de l'horodatage prouve l'exécution du #raw("Promise.all", lang: "ts")
    décrit en #ref(<sec-realisations>, supplement: [section]).
  ],
)

#figure(
  image("../assets/jeu-essai/etape-3c-alice-optimistic.png", width: 92%),
  caption: [Étape 3 — le message apparaît immédiatement côté Alice, avant confirmation du serveur.],
)

== Étape 4 — Réception temps réel par Bob

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    Bob authentifié, page conversations ouverte \
    *Aucune conversation sélectionnée* \
    Socket inscrit à la room #raw("user:27", lang: "ts")
  ],
  [
    Réception de #raw("conversation:new", lang: "ts") \
    Notification visuelle \
    Conversation ajoutée en tête de liste
  ],
  [
    Toast « Alice a démarré un nouvel échange » affiché \
    Conversation visible en tête de liste \
    *Mais dupliquée : deux entrées identiques*
  ],
  [
    *Partiellement conforme.* La diffusion temps réel fonctionne — Bob est
    notifié sans être dans la conversation, ce qui valide le modèle de rooms à
    deux niveaux. L'affichage présente en revanche un écart, analysé en
    #ref(<sub-ecarts>, supplement: [sous-section]).
  ],
)

#figure(
  image("../assets/jeu-essai/etape-4a-bob-notification.png", width: 92%),
  caption: [Étape 4 — Bob reçoit la notification sans avoir ouvert la conversation. Le doublon d'affichage visible dans la liste est analysé plus bas.],
)

== Étape 5 — Réconciliation côté Alice

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  inset: 6pt,
  align: top + left,
  stroke: 0.5pt + rgb("#d0d7de"),
  [*Données d'entrée*], [*Données attendues*], [*Données obtenues*], [*Analyse*],
  [
    Alice reçoit #raw("message:new", lang: "ts") \
    en retour de sa propre émission
  ],
  [
    Le message optimiste reste affiché \
    Aucun doublon dans le fil \
    Un seul message en base
  ],
  [
    Fil d'Alice inchangé, un seul message affiché \
    #raw("COUNT(message) = 1", lang: "sql") pour la conversation 17
  ],
  [
    *Conforme.* Le filtre #raw("sender.id === user.id", lang: "ts") ignore le
    retour serveur pour l'émetteur : l'affichage optimiste reste l'état final,
    sans duplication.
  ],
)

#figure(
  image("../assets/jeu-essai/etape-5-alice-reconciliation.png", width: 92%),
  caption: [Étape 5 — après retour serveur, le fil d'Alice reste à un seul message.],
)

== Preuves en base de données

Les requêtes ci-dessous ont été exécutées directement sur PostgreSQL, avant et
après le scénario.

*R1 — le lien de suivi existe.*

```sql
SELECT f.id, u1.firstname AS suiveur, u2.firstname AS suivi, f.created_at
FROM follow f
JOIN "user" u1 ON u1.id = f.follower_id
JOIN "user" u2 ON u2.id = f.followed_id
WHERE u1.email = 'alice.dupont@example.com'
  AND u2.email = 'bob.martin@example.com';

 id | suiveur | suivi |       created_at
----+---------+-------+-------------------------
  1 | Alice   | Bob   | 2026-08-22 18:37:48.027
```

*R1bis — la contrainte d'unicité interdit le doublon.* Tentative volontaire
d'insertion d'un lien déjà existant :

```sql
INSERT INTO follow (follower_id, followed_id) VALUES (1, 27);

ERROR:  duplicate key value violates unique constraint
        "follow_followed_id_follower_id_key"
DETAIL:  Key (followed_id, follower_id)=(27, 1) already exists.
```

La règle « un seul suivi par couple » n'est pas seulement applicative : elle est
garantie au niveau de la base. Un `INSERT` direct, qui contournerait tout le
code métier, échoue quand même.

*R2 — la conversation compte exactement deux participants.*

```sql
SELECT c.id, c.title, c.status,
       COUNT(uhc.user_id) AS nb_participants,
       STRING_AGG(u.firstname, ' <-> ' ORDER BY u.firstname) AS participants
FROM conversation c
JOIN user_has_conversation uhc ON uhc.conversation_id = c.id
JOIN "user" u ON u.id = uhc.user_id
WHERE c.title = 'Jeu d''essai CDA'
GROUP BY c.id, c.title, c.status
HAVING COUNT(uhc.user_id) = 2;

 id |      title      | status | nb_participants | participants
----+-----------------+--------+-----------------+---------------
 17 | Jeu d'essai CDA | Open   |               2 | Alice <-> Bob
```

*R3 — comptage des messages et propagation de l'horodatage.* Le
#raw("LEFT JOIN", lang: "sql") est délibéré : il rend visible le zéro de
l'étape 2, qu'une jointure interne masquerait en ne renvoyant aucune ligne.

```sql
SELECT c.id, c.title, COUNT(m.id) AS nb_messages,
       MAX(m.created_at) AS dernier_message, c.updated_at,
       (c.updated_at > c.created_at) AS conversation_touchee
FROM conversation c
LEFT JOIN message m ON m.conversation_id = c.id
WHERE c.title = 'Jeu d''essai CDA'
GROUP BY c.id, c.title, c.updated_at, c.created_at;

 id | nb_messages |     dernier_message     |       updated_at        | conversation_touchee
----+-------------+-------------------------+-------------------------+----------------------
 17 |           1 | 2026-08-23 16:27:20.973 | 2026-08-23 16:27:20.972 | t
```

Le booléen `conversation_touchee` à `t` prouve que l'écriture du message et la
mise à jour de la conversation ont bien eu lieu ensemble.

*R4 — cohérence de la dénormalisation `receiver_id`.* La colonne duplique une
information déductible des participants ; la sous-requête vérifie qu'elle reste
cohérente.

```sql
SELECT m.id, exp.firstname AS expediteur, dest.firstname AS destinataire,
       LEFT(m.content, 40) AS contenu, m.created_at,
       (dest.id IN (SELECT user_id FROM user_has_conversation
                    WHERE conversation_id = m.conversation_id))
         AS destinataire_participe
FROM message m
JOIN "user" exp  ON exp.id  = m.sender_id
JOIN "user" dest ON dest.id = m.receiver_id
JOIN conversation c ON c.id = m.conversation_id
WHERE c.title = 'Jeu d''essai CDA';

 id  | expediteur | destinataire |                 contenu                  | destinataire_participe
-----+------------+--------------+------------------------------------------+------------------------
 108 | Alice      | Bob          | Salut Bob ! Je te contacte pour un échan | t
```

*R5 — évaluations Alice → Bob.* La requête renvoie une ligne, mais
*elle provient du seed de développement, pas du scénario* : elle est horodatée
à la seconde du seed (22/08, 18:37:48). La conversation « Jeu d'essai CDA »
reste au statut #raw("Open", lang: "sql"), et le jeu d'essai n'a donc créé
aucune évaluation — celle-ci n'étant proposée qu'à la clôture.

*R6 — vue d'ensemble après scénario.*

```sql
SELECT u.firstname,
       COUNT(DISTINCT uhc.conversation_id) AS conversations,
       COUNT(DISTINCT m.id)                AS messages_envoyes,
       COUNT(DISTINCT f.followed_id)       AS abonnements
FROM "user" u
LEFT JOIN user_has_conversation uhc ON uhc.user_id = u.id
LEFT JOIN message m ON m.sender_id = u.id
LEFT JOIN follow f  ON f.follower_id = u.id
WHERE u.email IN ('alice.dupont@example.com','bob.martin@example.com')
GROUP BY u.id, u.firstname ORDER BY u.id;

 firstname | conversations | messages_envoyes | abonnements
-----------+---------------+------------------+-------------
 Alice     |             4 |               11 |           2
 Bob       |             2 |                4 |           2
```

== Analyse des écarts <sub-ecarts>

*Écart constaté — doublon d'affichage côté destinataire.* À l'étape 4, la
nouvelle conversation apparaît *deux fois* dans la liste de Bob, alors que la
base n'en contient qu'une.

Le contrôle en base est sans ambiguïté : une seule ligne dans
#raw("conversation", lang: "sql") (#raw("id = 17", lang: "sql")) et deux lignes
dans #raw("user_has_conversation", lang: "sql") — une par participant, comme
attendu. *L'anomalie est donc purement côté client* : la persistance est
correcte, seul l'affichage duplique l'entrée.

*Cause identifiée.* Le mutateur #raw("addConversation", lang: "ts")
(#raw("useConversationList.ts:43-45", lang: "ts")) insère la conversation reçue
en tête de liste sans vérifier qu'elle s'y trouve déjà :

```ts
const addConversation = useCallback((conv: Conversation) => {
  setConversations((prev) => [conv, ...prev]);
}, []);
```

Aucune garde sur l'identifiant. Si l'event #raw("conversation:new", lang: "ts")
est reçu deux fois, ou s'il arrive alors que la conversation figure déjà dans
la liste, l'entrée est dupliquée.

*Correctif proposé.* Déduplication par identifiant avant insertion :

```ts
const addConversation = useCallback((conv: Conversation) => {
  setConversations((prev) =>
    prev.some((c) => c.id === conv.id) ? prev : [conv, ...prev],
  );
}, []);
```

*Réserve d'interprétation.* L'observation a été faite en *mode développement*,
où React StrictMode monte les effets deux fois et peut donc enregistrer le
listener Socket.IO en double — ce qui suffirait à expliquer la double
réception. *Je n'ai pas vérifié si l'anomalie se reproduit en production.* Ce
qui est établi indépendamment du mode d'exécution, en revanche, c'est l'absence
de garde dans #raw("addConversation", lang: "ts") : le correctif reste
pertinent dans les deux cas, et son coût est de deux lignes.

*Bilan.* Quatre étapes sur cinq sont conformes sans réserve. La cinquième
valide le mécanisme temps réel visé — Bob est bien notifié sans être dans la
conversation — mais révèle un défaut d'affichage qui n'avait pas été détecté
pendant le projet, faute de tests frontend. C'est une illustration concrète de
la dette relevée en #ref(<sec-plan-tests>, supplement: [section]) : un test
d'intégration sur la liste de conversations l'aurait mis en évidence.
