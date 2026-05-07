# Role-Based Access Control

Matrice de contrôle d'accès des **38 endpoints** de l'API SkillSwap. La distinction
est binaire en V1 entre **Visiteur** (non authentifié) et **Membre** (authentifié,
seul rôle métier `RoleOfUser.Membre` en seed prod).

Source de vérité : `backend/src/routers/*.ts` + `backend/src/middlewares/{auth,conv}.middleware.ts`.

## Légende

| Code | Sens |
|------|------|
| `yes` | Autorisé sans condition supplémentaire |
| `no` | Non autorisé (401 si Visiteur, 403 si tentative interdite) |
| `self` | Autorisé sur ses propres ressources (middleware `isOwner` ou implicite via `req.userId`) |
| `self*` | Autorisé si participant/auteur de la ressource (vérification effectuée dans le controller, pas par un middleware déclaratif) |
| `follower` | Autorisé si Membre **et** suit la cible (`requireFollow` ou `requireSimpleFollow`) |

---

## Health (`/api/v1`)

| Verbe | Chemin     | Visiteur | Membre |
| ----- | ---------- | -------- | ------ |
| GET   | `/health`  | yes      | yes    |

---

## Auth (`/api/v1/auth`)

| Verbe | Chemin       | Visiteur | Membre |
| ----- | ------------ | -------- | ------ |
| POST  | `/register`  | yes      | yes    |
| POST  | `/login`     | yes      | yes    |
| POST  | `/logout`    | yes      | yes    |
| POST  | `/refresh`   | yes      | yes    |
| GET   | `/me`        | no       | yes    |

---

## Profiles (`/api/v1/profiles`)

| Verbe  | Chemin                  | Visiteur | Membre              |
| ------ | ----------------------- | -------- | ------------------- |
| PATCH  | `/avatar`               | no       | self                |
| DELETE | `/avatar`               | no       | self                |
| POST   | `/skills`               | no       | self                |
| DELETE | `/skills/:id`           | no       | self                |
| POST   | `/interests`            | no       | self                |
| DELETE | `/interests/:id`        | no       | self                |
| POST   | `/availabilities`       | no       | self                |
| DELETE | `/availabilities/:id`   | no       | self                |
| PATCH  | `/password`             | no       | self                |
| DELETE | `/`                     | no       | self                |
| GET    | `/public/:id`           | yes      | yes                 |
| GET    | `/:id`                  | no       | yes                 |
| PATCH  | `/:id`                  | no       | self (`isOwner`)    |
| POST   | `/:id/rating`           | no       | follower            |

!!! note "POST /:id/rating — règle métier"
    Le notateur doit suivre la cible (middleware `requireFollow` paramétré `{ source: 'params', field: 'id', allowSelf: false }`). Un Membre qui ne suit pas la cible reçoit 403.

---

## Follows (`/api/v1/follows`)

| Verbe  | Chemin              | Visiteur | Membre |
| ------ | ------------------- | -------- | ------ |
| GET    | `/followers`        | no       | yes    |
| GET    | `/following`        | no       | yes    |
| POST   | `/:id/follow`       | no       | yes    |
| DELETE | `/:id/follow`       | no       | yes    |

---

## Conversations (`/api/v1/conversations`)

| Verbe  | Chemin           | Visiteur | Membre   |
| ------ | ---------------- | -------- | -------- |
| GET    | `/`              | no       | yes      |
| POST   | `/`              | no       | follower |
| GET    | `/:id`           | no       | self*    |
| DELETE | `/:id`           | no       | self*    |
| PATCH  | `/:id/close`     | no       | self*    |

!!! note "POST / — règle métier"
    Le créateur doit suivre le destinataire (middleware `requireSimpleFollow`, vérification **unidirectionnelle** sender → receiver). Pas de mutual follow requis (cf. fiche `models/follow.md`).

---

## Messages (sous `/api/v1/conversations/:id/...`)

| Verbe  | Chemin                          | Visiteur | Membre |
| ------ | ------------------------------- | -------- | ------ |
| GET    | `/:id/messages`                 | no       | self*  |
| POST   | `/:id/messages`                 | no       | self*  |
| PATCH  | `/:id/message/:messageId`       | no       | self*  |
| DELETE | `/:id/message/:messageId`       | no       | self*  |

!!! note "self* sur les messages"
    - Pour GET et POST : "participant à la conversation" — vérifié dans le controller.
    - Pour PATCH et DELETE : "auteur du message" — vérifié dans le controller (`senderId === req.userId`).

---

## Search (`/api/v1/search`)

| Verbe | Chemin        | Visiteur | Membre |
| ----- | ------------- | -------- | ------ |
| GET   | `/`           | no       | yes    |
| GET   | `/top-rated`  | yes      | yes    |

---

## Categories (`/api/v1/categories`)

| Verbe | Chemin        | Visiteur | Membre |
| ----- | ------------- | -------- | ------ |
| GET   | `/top-rated`  | yes      | yes    |

---

## Skills (`/api/v1/skills`)

| Verbe | Chemin | Visiteur | Membre |
| ----- | ------ | -------- | ------ |
| GET   | `/`    | no       | yes    |

---

## Availabilities (`/api/v1/availabilities`)

| Verbe | Chemin | Visiteur | Membre |
| ----- | ------ | -------- | ------ |
| GET   | `/`    | no       | yes    |

---

## Récapitulatif par niveau d'accès

| Niveau d'accès                          | Nombre d'endpoints |
| --------------------------------------- | :----------------: |
| Public (Visiteur + Membre, `yes/yes`)   | 8                  |
| Auth membre simple (`no/yes`)           | 10                 |
| Auth + ownership (`no/self`)            | 11                 |
| Auth + follower (`no/follower`)         | 2                  |
| Auth + participant/auteur (`no/self*`)  | 7                  |
| **Total**                               | **38**             |

Détail des 8 endpoints publics : `GET /health`, `POST /auth/{register,login,logout,refresh}` (4), `GET /profiles/public/:id`, `GET /search/top-rated`, `GET /categories/top-rated`.

---

## Voir aussi

- [Liste détaillée des endpoints (paths, params, validators Zod)](./endpoints-api.md)
- [Authentification — détail JWT, cookies, rotation](../documentation-implementation/arc42/08-crosscutting/authentication.md)
- [Validation Zod — schémas par domaine](../documentation-implementation/arc42/08-crosscutting/security.md#validation-zod--couverture-par-domaine)
- [Règles métier follow (simple vs mutual)](../documentation-implementation/database/models/follow.md#règles-métier)
