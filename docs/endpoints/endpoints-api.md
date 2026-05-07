# Documentation API

L'API REST SkillSwap est montée sous le préfixe `/api/v1` (cf. `backend/src/app.ts`).
Toutes les routes authentifiées utilisent le **cookie HTTP-only `accessToken`**
(pas de header `Authorization: Bearer ...`).

---

## Health (`/api/v1`)

| Méthode | Route     | Auth   | Description                                |
| ------- | --------- | ------ | ------------------------------------------ |
| GET     | `/health` | Public | Health check, retourne `{ status: 'ok' }` |

---

## Auth (`/api/v1/auth`)

| Méthode | Route       | Auth        | Description                         | Notes |
| ------- | ----------- | ----------- | ----------------------------------- | ----- |
| POST    | `/register` | Public      | Inscription                         | Body : `firstname, lastname, email, password, confirmation` (Zod `registerSchema`). Set-Cookie `accessToken` + `refreshToken` |
| POST    | `/login`    | Public      | Connexion                           | Body : `email, password` (Zod `loginSchema`). Set-Cookie tokens |
| POST    | `/logout`   | Public      | Déconnexion                         | Lit le `refreshToken` cookie pour le supprimer en BDD ; `clearCookie` sur les tokens |
| POST    | `/refresh`  | Public      | Rafraîchir l'accessToken            | Lit le `refreshToken` cookie ; **rotation systématique** : tous les refresh tokens de l'utilisateur sont supprimés avant émission du nouveau |
| GET     | `/me`       | `checkAuth` | Récupérer l'utilisateur courant   | Renvoie l'utilisateur identifié par le cookie `accessToken` |

---

## Profiles (`/api/v1/profiles`)

| Méthode | Route                  | Auth                              | Description |
| ------- | ---------------------- | --------------------------------- | ----------- |
| PATCH   | `/avatar`              | `checkAuth`                       | Upload d'un avatar (`multipart/form-data`, champ `avatar`, middleware `uploadAvatar`) |
| DELETE  | `/avatar`              | `checkAuth`                       | Suppression de l'avatar courant |
| POST    | `/skills`              | `checkAuth`                       | Ajouter une compétence au profil. Body : `{ skillId: number }` (Zod `addSkillsProfileSchema`) |
| DELETE  | `/skills/:id`          | `checkAuth`                       | Retirer la compétence `:id` du profil |
| POST    | `/interests`           | `checkAuth`                       | Ajouter un intérêt. Body : `{ skillId: number }` (même schéma que skills) |
| DELETE  | `/interests/:id`       | `checkAuth`                       | Retirer l'intérêt `:id` |
| POST    | `/availabilities`      | `checkAuth`                       | Ajouter une disponibilité. Body : `{ day: <enum dayInAWeek>, timeSlot: 'Morning' \| 'Afternoon' }` (Zod `addProfileAvailabilitiesSchema`) |
| DELETE  | `/availabilities/:id`  | `checkAuth`                       | Retirer la disponibilité `:id` |
| PATCH   | `/password`            | `checkAuth`                       | Changer le mot de passe. Body : `{ currentPassword, newPassword, confirmation }` (Zod `updatePasswordSchema`) |
| DELETE  | `/`                    | `checkAuth`                       | Supprimer le compte authentifié (action irréversible : profil, conversations, messages, évaluations) |
| GET     | `/public/:id`          | **Public**                        | Profil public d'un utilisateur (pas de cookies requis ; commentaire code : "Public endpoint for SEO - used by search engines, social media crawlers, and SSR") |
| GET     | `/:id`                 | `checkAuth`                       | Profil complet d'un utilisateur (vue privée) |
| PATCH   | `/:id`                 | `checkAuth` + `isOwner`           | Modifier le profil. Body : champs partiels validés par `changeOwnProfileSchema` (Zod) |
| POST    | `/:id/rating`          | `checkAuth` + `requireFollow`     | Noter un utilisateur. Body : `{ score: 0-5, comment?: string }` (Zod `addRatingToUserSchema`). Le notateur doit suivre la cible (middleware `requireFollow`) |

---

## Follows (`/api/v1/follows`)

| Méthode | Route          | Auth                              | Description |
| ------- | -------------- | --------------------------------- | ----------- |
| GET     | `/followers`   | `checkAuth`                       | Liste des utilisateurs qui suivent l'utilisateur authentifié |
| GET     | `/following`   | `checkAuth`                       | Liste des utilisateurs suivis par l'utilisateur authentifié |
| POST    | `/:id/follow`  | `checkAuth` + `parseNumericParams` | Suivre l'utilisateur `:id` |
| DELETE  | `/:id/follow`  | `checkAuth` + `parseNumericParams` | Cesser de suivre l'utilisateur `:id` |

---

## Conversations (`/api/v1/conversations`)

| Méthode | Route          | Auth                                 | Description |
| ------- | -------------- | ------------------------------------ | ----------- |
| GET     | `/`            | `checkAuth`                          | Liste des conversations de l'utilisateur authentifié |
| POST    | `/`            | `checkAuth` + `requireSimpleFollow`  | Créer une conversation. Body : `{ title: string (1-256), receiverId: number }` (Zod `CreateConversationSchema`). Le créateur doit suivre le destinataire (`requireSimpleFollow`) |
| GET     | `/:id`         | `checkAuth`                          | Détail d'une conversation (réservé aux participants) |
| DELETE  | `/:id`         | `checkAuth`                          | Supprimer la conversation `:id` (réservé aux participants) |
| PATCH   | `/:id/close`   | `checkAuth`                          | Fermer la conversation (passe le statut à `Close`) |

---

## Messages (sous `/api/v1/conversations/:id/...`)

| Méthode | Route                         | Auth        | Description |
| ------- | ----------------------------- | ----------- | ----------- |
| GET     | `/:id/messages`               | `checkAuth` | Lister les messages de la conversation. Query : `?limit=, ?cursor=` |
| POST    | `/:id/messages`               | `checkAuth` | Envoyer un message. Body : `{ message: string (1-2000) }` (Zod `CreateMessageSchema`) |
| PATCH   | `/:id/message/:messageId`     | `checkAuth` | Modifier le message `:messageId`. Body : `{ message: string (1-2000) }` |
| DELETE  | `/:id/message/:messageId`     | `checkAuth` | Supprimer le message `:messageId` |

!!! note "Asymétrie pluriel/singulier"
    Les routes utilisent `messages` (pluriel) pour la collection (GET, POST) et `message/:messageId` (singulier) pour l'item (PATCH, DELETE). Conservé tel quel dans le code prod ; à harmoniser en V2 si refactor planifié.

---

## Search (`/api/v1/search`)

| Méthode | Route         | Auth        | Description |
| ------- | ------------- | ----------- | ----------- |
| GET     | `/`           | `checkAuth` | Recherche de profils (Meilisearch + hydratation Prisma). Query (Zod `SearchParamsSchema`) : `?q=, ?category=<slug>, ?page=, ?limit=, ?sort=` |
| GET     | `/top-rated`  | **Public**  | Top profils par note moyenne (pas de `checkAuth`). Query (Zod `TopRatedSchema`) : `?limit=` (requis) |

---

## Categories (`/api/v1/categories`)

| Méthode | Route          | Auth   | Description |
| ------- | -------------- | ------ | ----------- |
| GET     | `/top-rated`   | Public | Top catégories par nombre d'utilisateurs. Query (Zod `GetTopUserCategoriesQuerySchema`) : `?limit=` (≤ 100, optionnel) |

!!! note "Pas de liste plate des catégories"
    Aucun `GET /api/v1/categories/` ne renvoie la liste des catégories ; seule la route `/top-rated` est exposée. Les 8 catégories du seed (Développement Web, Design, Marketing, Langues, Cuisine, Sport, Musique, Bricolage) sont consommées en frontend via cet endpoint trié + cache local.

---

## Skills (`/api/v1/skills`)

| Méthode | Route | Auth        | Description |
| ------- | ----- | ----------- | ----------- |
| GET     | `/`   | `checkAuth` | Liste plate des compétences (toutes catégories confondues). 28 compétences en seed prod. |

---

## Availabilities (`/api/v1/availabilities`)

| Méthode | Route | Auth        | Description |
| ------- | ----- | ----------- | ----------- |
| GET     | `/`   | `checkAuth` | Liste plate des disponibilités (référentiel : 14 créneaux = 7 jours × 2 demi-journées) |

---

## Récapitulatif

| Catégorie | Endpoints | Publics | Authentifiés |
| --------- | --------- | ------- | ------------ |
| Health | 1 | 1 | 0 |
| Auth | 5 | 4 | 1 |
| Profiles | 14 | 1 | 13 |
| Follows | 4 | 0 | 4 |
| Conversations | 5 | 0 | 5 |
| Messages | 4 | 0 | 4 |
| Search | 2 | 1 | 1 |
| Categories | 1 | 1 | 0 |
| Skills | 1 | 0 | 1 |
| Availabilities | 1 | 0 | 1 |
| **Total** | **38** | **8** | **30** |

---

## Voir aussi

- [Matrice RBAC complète](./rbac.md)
- [Authentification — détail JWT, cookies, rotation](../documentation-implementation/arc42/08-crosscutting/authentication.md)
- [Validation Zod — schémas par domaine](../documentation-implementation/arc42/08-crosscutting/security.md#validation-zod--couverture-par-domaine)
