# MPD — Modèle Physique de Données

> Généré le 2026-08-09 depuis la base PostgreSQL 16 montée à partir des
> 6 migrations réelles. Source : catalogue `information_schema` / `pg_catalog`.
> Aucune lecture du code applicatif.

**14 tables**, **18 clés étrangères**, **4 types énumérés**.

## Types énumérés

| Type | Valeurs |
|------|---------|
| `RoleOfUser` | Membre |
| `StatusOfConversation` | Open, Close |
| `Time` | Morning, Afternoon |
| `dayInAWeek` | Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche |

## Tables

### `available`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('available_id_seq'::reg…` |
| `day` | dayInAWeek | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `time_slot` | Time | non | — |

- **PK** : `id`

### `category`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('category_id_seq'::regc…` |
| `name` | text | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `slug` | text | non | — |

- **PK** : `id`
- **UNIQUE** `slug` — index `category_slug_key`

### `conversation`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('conversation_id_seq'::…` |
| `status` | StatusOfConversation | non | `'Open'::"StatusOfConversation"` |
| `title` | text | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `id`

### `evaluation`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('evaluation_id_seq'::re…` |
| `comments` | text | oui | — |
| `score` | integer | non | — |
| `evaluator_id` | integer | non | — |
| `evaluated_id` | integer | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `id`
- **UNIQUE** `evaluator_id, evaluated_id` — index `evaluation_evaluator_id_evaluated_id_key`
- **FK** `evaluated_id` → `user(id)` — ON DELETE CASCADE
- **FK** `evaluator_id` → `user(id)` — ON DELETE CASCADE

### `follow`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('follow_id_seq'::regclass)` |
| `followed_id` | integer | non | — |
| `follower_id` | integer | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `id`
- **UNIQUE** `followed_id, follower_id` — index `follow_followed_id_follower_id_key`
- **FK** `followed_id` → `user(id)` — ON DELETE CASCADE
- **FK** `follower_id` → `user(id)` — ON DELETE CASCADE

### `message`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('message_id_seq'::regcl…` |
| `sender_id` | integer | non | — |
| `receiver_id` | integer | non | — |
| `content` | text | non | — |
| `conversation_id` | integer | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `id`
- **FK** `conversation_id` → `conversation(id)` — ON DELETE CASCADE
- **FK** `receiver_id` → `user(id)` — ON DELETE CASCADE
- **FK** `sender_id` → `user(id)` — ON DELETE CASCADE

### `refresh_token`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('refresh_token_id_seq':…` |
| `token` | text | non | — |
| `user_id` | integer | non | — |
| `expire_at` | timestamp without time zone | non | — |
| `issued_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `id`
- **UNIQUE** `token` — index `refresh_token_token_key`
- **INDEX** `user_id` — index `refresh_token_user_id_idx`
- **FK** `user_id` → `user(id)` — ON DELETE CASCADE

### `role`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('role_id_seq'::regclass)` |
| `name` | RoleOfUser | non | `'Membre'::"RoleOfUser"` |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `id`

### `skill`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('skill_id_seq'::regclass)` |
| `name` | text | non | — |
| `category_id` | integer | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `id`
- **FK** `category_id` → `category(id)` — ON DELETE CASCADE

### `user`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `id` | integer | non | `nextval('user_id_seq'::regclass)` |
| `firstname` | text | non | — |
| `lastname` | text | non | — |
| `email` | text | non | — |
| `password` | text | non | — |
| `address` | text | oui | — |
| `postal_code` | integer | oui | — |
| `city` | text | oui | — |
| `age` | integer | oui | — |
| `description` | text | oui | — |
| `role_id` | integer | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `avatar_url` | text | oui | — |

- **PK** : `id`
- **UNIQUE** `email` — index `user_email_key`
- **FK** `role_id` → `role(id)` — ON DELETE CASCADE

### `user_has_available`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `user_id` | integer | non | — |
| `available_id` | integer | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `user_id,available_id`
- **FK** `available_id` → `available(id)` — ON DELETE CASCADE
- **FK** `user_id` → `user(id)` — ON DELETE CASCADE

### `user_has_conversation`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `user_id` | integer | non | — |
| `conversation_id` | integer | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `user_id,conversation_id`
- **FK** `conversation_id` → `conversation(id)` — ON DELETE CASCADE
- **FK** `user_id` → `user(id)` — ON DELETE CASCADE

### `user_has_interest`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `user_id` | integer | non | — |
| `skill_id` | integer | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `user_id,skill_id`
- **FK** `skill_id` → `skill(id)` — ON DELETE CASCADE
- **FK** `user_id` → `user(id)` — ON DELETE CASCADE

### `user_has_skill`

| Colonne | Type | Null | Défaut |
|---------|------|:----:|--------|
| `user_id` | integer | non | — |
| `skill_id` | integer | non | — |
| `created_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |
| `updated_at` | timestamp without time zone | non | `CURRENT_TIMESTAMP` |

- **PK** : `user_id,skill_id`
- **FK** `skill_id` → `skill(id)` — ON DELETE CASCADE
- **FK** `user_id` → `user(id)` — ON DELETE CASCADE
