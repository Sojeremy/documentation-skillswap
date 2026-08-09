# MCD — Modèle Conceptuel de Données (Merise)

Source Mocodo : [`mcd.mcd`](./mcd.mcd) — rendu : [`mcd.svg`](./mcd.svg)

```bash
mocodo --input mcd.mcd --output_dir .
```

> Dérivé du schéma réel (base montée depuis les 6 migrations) **et du code de
> production**. Validé syntaxiquement : Mocodo 4.3.3 produit le rendu sans erreur.
> Libellés d'entités identiques aux tables physiques, pour rester traçables avec
> [`mpd.md`](./mpd.md), [`mld.dbml`](./mld.dbml) et [`erd.mmd`](./erd.mmd).

`refresh_token` est **exclu** du MCD : concept technique d'authentification, pas
un concept métier. Il figure évidemment au MPD et au MLD.

## Entités

| Entité | Attributs | Table physique |
|---|---|---|
| `user` | firstname, lastname, email, password, address, postal_code, city, age, description, avatar_url | `user` |
| `role` | name | `role` |
| `category` | name, slug | `category` |
| `skill` | name | `skill` |
| `available` | day, time_slot | `available` |
| `conversation` | status, title | `conversation` |
| `message` | content | `message` |

## Associations et cardinalités

Deux natures de contrainte, à ne pas confondre à l'oral :

- **Intégrité** — garantie par la base (FK `NOT NULL`, contrainte `UNIQUE`).
  Invérifiable de l'extérieur.
- **Applicative** — garantie par le code seul. Un `INSERT` SQL direct la
  contournerait.

| Association | Cardinalités | Nature | Preuve |
|---|---|---|---|
| `a_pour_rôle` | user **(1,1)** — role (0,N) | **Intégrité** | `user.role_id` FK NOT NULL + `auth.service.ts:38` |
| `appartient_à` | skill **(1,1)** — category (0,N) | **Intégrité** | `skill.category_id` FK NOT NULL ; aucune route de création de skill (seul point : `seeding.ts:101`) |
| `se_rattache_à` | message **(1,1)** — conversation (0,N) | **Intégrité** | `message.conversation_id` FK NOT NULL + `message.service.ts:112-117` |
| `émet` | message **(1,1)** — user (0,N) | **Intégrité** | `message.sender_id` FK NOT NULL |
| `destiné_à` | message **(1,1)** — user (0,N) | **Intégrité** | `message.receiver_id` FK NOT NULL ; destinataire déduit `message.service.ts:131-141` |
| `participe_à` | conversation **(0,2)** — user (0,N) | ⚠️ **Applicative** | Max 2 : `conv.service.ts:266-267` crée exactement 2 participants et aucune route n'en ajoute ; auto-conversation refusée `conv.service.ts:184`. Min 0 : `leaveConversationService` retire un participant `conv.service.ts:432-439` |
| `possède` | user (0,N) — skill (0,N) | — | Aucun minimum imposé |
| `s_intéresse_à` | user (0,N) — skill (0,N) | — | Aucun minimum imposé |
| `est_disponible` | user (0,N) — available (0,N) | — | Aucun minimum imposé |
| `suit` | user (0,N) — user (0,N), réflexive | — | Rôles : suiveur (`follower_id`) / suivi (`followed_id`) |
| `évalue` **porteuse** (score, comments) | user (0,N) — user (0,N), réflexive | — | Rôles : évaluateur (`evaluator_id`) / évalué (`evaluated_id`) |

### ⚠️ Le point à savoir défendre : les (0,2)

Une conversation naît **toujours avec exactement deux participants**, mais
**aucune contrainte SQL ne l'impose** — et le nombre peut ensuite diminuer.

**Le maximum est 2.** La création insère la paire en une fois
(`conv.service.ts:266-267`), la conversation avec soi-même est refusée
(`conv.service.ts:184`), et **aucune route n'ajoute de participant**.

**Le minimum est 0.** `DELETE /api/v1/conversations/:id` ne supprime pas la
conversation : il appelle `leaveConversationService` (`conv.service.ts:410-439`),
qui exécute `prisma.userHasConversation.delete()` (`:432-439`). Un participant
peut donc partir, et si les deux partent, la conversation subsiste **orpheline**,
sans aucun participant. Quitter exige au préalable `status = Close`
(`conv.service.ts:428-430`), ce qui limite la casse sans l'empêcher.

Le système reste cohérent : dès qu'il ne reste plus de second participant,
l'envoi d'un message échoue — `message.service.ts:131-141` côté REST, et
`socket.ts:233-238` (`No receiver`) côté temps réel.

Deux questions de jury à préparer. « Qu'est-ce qui empêche une conversation à
trois ? » → le code, pas le schéma ; une contrainte `CHECK` ou un trigger la
rendrait structurelle. « Que devient une conversation que tout le monde quitte ? »
→ elle reste en base avec ses messages, sans participant : personne ne peut plus
la lire ni y écrire, et aucun nettoyage n'est prévu.

### Règles de gestion portées par `évalue`

- **Suivre est obligatoire pour évaluer** : `profile.router.ts:92` monte
  `requireFollow({ source:'params', field:'id', allowSelf:false })`, qui vérifie
  l'existence du lien en base (`conv.middleware.ts:32`).
- **Auto-évaluation interdite** : `conv.middleware.ts:26-30`.
- **Une seule évaluation par couple** : `UNIQUE (evaluator_id, evaluated_id)` —
  contrainte d'intégrité, celle-ci.
- **`score` obligatoire** (0 à 5), **`comment` facultatif** :
  `addRatingToUserSchema` dans `profile.validation.ts`.

La même règle d'unicité vaut pour `suit` : `UNIQUE (followed_id, follower_id)`.

---

## Choix de lecture restants — à valider

**1. `message` traité comme entité, pas comme association ternaire porteuse.**
Retenu parce que le message a une identité propre (`message.id`) et un cycle de
vie autonome : il est modifiable et supprimable indépendamment
(`updateMessageService`, `deleteMessageService` dans `message.service.ts`).

**2. Jonctions considérées non porteuses.** Les quatre tables de jonction portent
`created_at`/`updated_at`, traités comme colonnes techniques d'audit. Si la date
d'acquisition d'une compétence est une donnée métier, `possède` devient porteuse.

**3. Six noms d'associations formés par moi** — `a_pour_rôle`, `appartient_à`,
`se_rattache_à`, `émet`, `destiné_à`, et le renommage de `user_has_*` en
`possède` / `s_intéresse_à` / `est_disponible` / `participe_à`. Ces associations
sont portées par des colonnes FK et n'ont pas de nom dans le schéma. `suit` et
`évalue` reprennent le sens des tables `follow` et `evaluation`.

**4. `follow` et `evaluation` ont une clé primaire technique (`id`)** dans le
schéma physique alors qu'elles sont conceptuellement des associations. Choix
d'implémentation Prisma (clé de substitution), sans portée conceptuelle.

**5. `message.receiver_id` est une dénormalisation** — le destinataire est
déductible des participants de la conversation, et le code le recalcule d'ailleurs
(`message.service.ts:131-141`). Un MCD strictement normalisé ne ferait pas figurer
`destiné_à`. Conservée ici parce que la colonne existe et est NOT NULL.
**Question de jury très plausible.**

**6. Rôles des associations réflexives non annotés** dans le rendu Mocodo :
la version 4.3.3 ne supporte pas l'annotation de patte. Les rôles sont documentés
en commentaire dans `mcd.mcd` et dans le tableau ci-dessus.
