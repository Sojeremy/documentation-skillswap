# Documentation API

---

## Auth (`/api/v1/auth`)

| Méthode | Route       | Description                         | Notes                                                                                               |
| ------- | ----------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| POST    | `/register` | Inscription d’un nouvel utilisateur | Requiert `email`, `password`, `firstname`, `lastname` et `confirmation`. Retourne un token d’accès. |
| POST    | `/login`    | Connexion d’un utilisateur          | Requiert `email` et `password`. Retourne un token d’accès et un refresh token.                      |
| POST    | `/logout`   | Déconnexion de l’utilisateur        | Invalide le token d’accès courant. Nécessite un header `Authorization`.                             |
| POST    | `/refresh`  | Rafraîchir le token d’accès         | Requiert un `refresh_token` valide. Retourne un nouveau token d’accès.                              |
| GET     | `/me`       | Récupérer l’utilisateur courant     | Nécessite un header `Authorization: Bearer <token>`.                                                |

---

## Profil (`/api/v1/profile`)

| Méthode | Route                 | Description                     | Notes                                                                                                                                         |
| ------- | --------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| GET     | `/:id`                | Récupérer un profil complet     | Accessible uniquement aux membres. Retourne des infos privées si `/:id` = utilisateur authentifié.                                             |
| PUT     | `/:id`                | Mettre à jour un profil         | Seule la personne authentifiée peut modifier son profil. 
| POST    | `/:id/rating` | Évaluer un participant          | Requiert `score` (note de 1 à 5) et `comment` (string). Seuls les participants peuvent évaluer l'autre participant lors de la clôture. |
| POST    | `/skills`             | Ajouter une compétence          | Opère uniquement sur le profil authentifié. Requiert `name` (unique par profil). Maximum 10 compétences.                                      |
| DELETE  | `/skills/:id`         | Supprimer une compétence        | Seule la personne authentifiée peut supprimer ses compétences.                                                                                |
| POST    | `/interests`          | Ajouter un intérêt              | Opère uniquement sur le profil authentifié. Requiert `name` (string). Pas de limite de nombre.                                                |
| DELETE  | `/interests/:id`      | Supprimer un intérêt            | Seule la personne authentifiée peut supprimer ses intérêts.                                                                                   |
| POST    | `/availabilities`     | Ajouter une disponibilité       | Opère uniquement sur le profil authentifié. Requiert `start_time`, `end_time` (string format ISO 8601) et `day` (string jour de la semaine) . |
| PUT     | `/availabilities/:id` | Modifier une disponibilité      | Seule la personne authentifiée peut modifier ses disponibilités.                                                                              |
| DELETE  | `/availabilities/:id` | Supprimer une disponibilité     | Seule la personne authentifiée peut supprimer ses disponibilités.                                                                             |
| DELETE  | `/`                   | Supprimer le compte authentifié | Action irréversible. Supprime le profil de l'utilisateur, son id dans ses conversations, ses messages et ses évaluations.                                                                                   |

---

---

## Follows (`/api/v1/follows`)

| Méthode | Route                | Description                                                  | Notes                                                                                                                                                                      |
| ------- | -------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST    | `/:user_id/follow`   | Suivre un utilisateur                                        | Requiert un `user_id` valide. L’utilisateur authentifié ne peut pas se suivre lui-même. Retourne un message de confirmation ou une erreur si l’utilisateur est déjà suivi. |
| DELETE  | `/:user_id/unfollow` | Ne plus suivre un utilisateur                                | Requiert un `user_id` valide. Retourne un message de confirmation ou une erreur si l’utilisateur n’était pas suivi.                                                        |
| GET     | `/followers`         | Lister les followers de l’utilisateur authentifié            | Retourne une liste des utilisateurs qui suivent l’utilisateur authentifié.                                                                                                 |
| GET     | `/following`         | Lister les utilisateurs suivis par l’utilisateur authentifié | Retourne une liste des utilisateurs suivis par l’utilisateur authentifié.                                                                                                  |

---

## Recherches (`/api/v1/search`)

| Méthode | Route        | Description                         | Notes                                                                      |
| ------- | ------------ | ----------------------------------- | -------------------------------------------------------------------------- |
| GET     | `/`          | Rechercher des utilisateurs         | Query params : `?page=1&limit=20&category=bricolage&skill=montage-meuble`. |
| GET     | `/top-rated` | Teaser public des meilleurs profils | Query params : `?limit=6`. Trie par note moyenne.                          |

---

## Conversations (`/api/v1/conversations`)

| Méthode | Route         | Description                     | Notes                                                                                                                                  |
| ------- | ------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| GET     | `/`           | Lister les conversations        | Retourne les conversations de l’utilisateur authentifié.                                                                               |
| POST    | `/`           | Créer une nouvelle conversation | Requiert `title` (string), `receiver_id`. L'utilisateur authentifié doit suivre le deuxième utilisateur de la conversation
| GET     | `/:id`        | Récupérer une conversation      | Seuls les participants peuvent accéder à la conversation.                                                                           |
| DELETE     | `/:id`        | Supprime l'id de l'utilisateur authentifié dans la conversation      | Seuls les participants peuvent supprimer leur conversation.                              |
| PUT     | `/:id/close`  | Fermer une conversation         | Seuls les participants peuvent fermer la conversation.                                                                                 |

---

## Messages (`/api/v1/conversations/:conversation_id/messages`)

| Méthode | Route  | Description                            | Notes                                                                             |
| ------- | ------ | -------------------------------------- | --------------------------------------------------------------------------------- |
| GET     | `/`    | Lister les messages d’une conversation | Seuls les participants peuvent lire les messages.                                 |
| POST    | `/`    | Envoyer un message                     | Requiert `content` (string). Seuls les participants peuvent envoyer des messages. |
| GET     | `/:id` | Récupérer un message spécifique        | Seuls les participants peuvent accéder au message.                                |

---

## Catégories (`/api/v1/categories`)

| Méthode | Route | Description           | Notes                                                                            |
| ------- | ----- | --------------------- | -------------------------------------------------------------------------------- |
| GET     | `/`   | Lister les catégories | Query params : `?order=recent&limit=3`. Par défaut, trie par ordre alphabétique. |



