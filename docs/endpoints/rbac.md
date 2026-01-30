# Role-Based Access Control

---

## Auth (`/api/v1/auth`)

| Verbe | Chemin      | Visiteur | Membre |
| ----- | ----------- | -------- | ------ |
| POST  | `/register` | yes      | yes    |
| POST  | `/login`    | yes      | yes    |
| POST  | `/logout`   | no       | yes    |
| POST  | `/refresh`  | no       | yes    |
| GET   | `/me`       | no       | yes    |

---

## Profil (`/api/v1/profile`)

| Verbe  | Chemin                | Visiteur | Membre |
| ------ | --------------------- | -------- | ------ |
| GET    | `/:id`                | no       | yes    |
| PUT    | `/:id`                | no       | self   |
| POST   | `/skills`             | no       | self   |
| DELETE | `/skills/:id`         | no       | self   |
| POST   | `/interests`          | no       | self   |
| DELETE | `/interests/:id`      | no       | self   |
| POST   | `/availabilities`     | no       | self   |
| PUT    | `/availabilities/:id` | no       | self   |
| DELETE | `/availabilities/:id` | no       | self   |
| DELETE | `/`                   | no       | self   |

---

## Follows (`/api/v1/follows`)

| Verbe  | Chemin               | Visiteur | Membre |
| ------ | -------------------- | -------- | ------ |
| POST   | `/:user_id/follow`   | no       | yes    |
| DELETE | `/:user_id/unfollow` | no       | yes    |
| GET    | `/followers`         | no       | yes    |
| GET    | `/following`         | no       | yes    |

---

## Recherches (`/api/v1/search`)

| Verbe | Chemin       | Visiteur | Membre |
| ----- | ------------ | -------- | ------ |
| GET   | `/`          | no       | yes    |
| GET   | `/top-rated` | yes      | yes    |

---

## Conversations (`/api/v1/conversations`)

| Verbe | Chemin        | Visiteur | Membre |
| ----- | ------------- | -------- | ------ |
| GET   | `/`           | no       | yes    |
| POST  | `/`           | no       | yes    |
| GET   | `/:id`        | no       | self\* |
| PUT   | `/:id/close`  | no       | self\* |
| POST  | `/:id/rating` | no       | self\* |

---

`*` = Seuls les participants à la conversation peuvent évaluer l'autre participant **lors de la clôture**.

---

## Messages (`/api/v1/conversations/:conversation_id/messages`)

| Verbe | Chemin | Visiteur | Membre |
| ----- | ------ | -------- | ------ |
| GET   | `/`    | no       | self\* |
| POST  | `/`    | no       | self\* |
| GET   | `/:id` | no       | self\* |

`*` = Seuls les participants à la conversation peuvent lire ou envoyer des messages.

---

## Evaluations (`/api/v1/categories`)

| Verbe | Chemin | Visiteur | Membre |
| ----- | ------ | -------- | ------ |
| GET   | `/`    | yes      | yes    |
