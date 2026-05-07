# Codes d'erreur

!!! info "Document orienté consumer API"
    Cette page décrit les erreurs **telles que retournées par l'API** et les
    bonnes pratiques pour les consommer côté client. Pour une vue
    architecturale (hiérarchie de classes, cas pris en charge par le
    middleware `errorHandler`), consulter
    [`arc42/06-runtime/error-handling.md`](../arc42/06-runtime/error-handling.md).

---

## Format de réponse d'erreur

Toutes les erreurs HTTP renvoyées par l'API SkillSwap suivent **le même
format minimaliste** :

```json
{
  "error": "string"
}
```

- **Une seule clé** : `error`.
- **Valeur** : une chaîne de caractères en français ou en anglais selon le
  service émetteur.
- **Aucune** clé `success`, `code`, `details` ou objet imbriqué.

!!! warning "Comment lire la réponse côté consumer"
    `response.json().error` (chaîne).
    **Ne pas** lire `response.json().error.message`, `error.code` ou
    `error.details` — ces clés n'existent pas. Toute logique de switch côté
    client doit s'appuyer sur le **statut HTTP**, pas sur un code machine.

### Cas particulier — validation Zod (422)

Lorsqu'une validation Zod échoue, le backend concatène les messages des
issues (un par ligne, dédupliqué) via `prettifyZodError`
(`backend/src/lib/formatZodError.ts`). La valeur de `error` est donc une
chaîne **multi-ligne** :

```json
{
  "error": "Email invalide\nLe mot de passe doit contenir au moins 8 caractères"
}
```

Le frontend l'affiche tel quel dans un toast `sonner` ; le saut de ligne
préserve la lisibilité.

---

## Codes HTTP utilisés

### Succès (2xx)

| Code | Nom        | Utilisation                                                   |
|------|------------|---------------------------------------------------------------|
| 200  | OK         | GET, certaines mutations idempotentes                         |
| 201  | Created    | Création (`POST /auth/register`, `POST /conversations`)       |
| 204  | No Content | Suppression réussie (`DELETE /conversations/:id`, etc.)       |

### Erreurs client (4xx)

| Code | Nom                  | Origine côté backend                                                                            |
|------|----------------------|-------------------------------------------------------------------------------------------------|
| 400  | Bad Request          | `BadRequestError`, `FileValidationError`, Multer (autre que `LIMIT_FILE_SIZE`), Prisma validation |
| 401  | Unauthorized         | `UnauthorizedError`, `jwt.TokenExpiredError`, `jwt.JsonWebTokenError`                           |
| 403  | Forbidden            | `ForbiddenError` (non participant, ressource d'un autre utilisateur)                            |
| 404  | Not Found            | `NotFoundError`, Prisma `P2025`                                                                 |
| 409  | Conflict             | `ConflictError`, Prisma `P2002` (unique), Prisma `P2003` (foreign key)                          |
| 413  | Payload Too Large    | Multer `LIMIT_FILE_SIZE` (taille fichier > 5 MB)                                                |
| 422  | Unprocessable Entity | `ZodError`, `UnprocessableEntityError`                                                          |

### Erreurs serveur (5xx)

| Code | Nom                   | Origine                                                          |
|------|-----------------------|------------------------------------------------------------------|
| 500  | Internal Server Error | Erreur inattendue (fallback) — message générique                 |
| 503  | Service Unavailable   | `Prisma.PrismaClientInitializationError` (DB injoignable)        |

---

## Exemples de messages réels par statut

Tous les exemples ci-dessous sont issus du code (services backend, error middleware).

### 401 — Unauthorized

```json
{ "error": "Invalid email or password" }
```
> `backend/src/services/auth.service.ts:60` — login échoué

```json
{ "error": "Expired JWT token" }
```
> `backend/src/middlewares/error.middleware.ts:23` — `jwt.TokenExpiredError`

```json
{ "error": "Invalid Refresh Token" }
```
> `backend/src/services/auth.service.ts:91`

### 403 — Forbidden

```json
{ "error": "Conversation closed" }
```
> `backend/src/services/message.service.ts:117` — envoi sur conversation fermée

```json
{ "error": "Vous devez suivre cet utilisateur" }
```
> Issu du middleware `requireSimpleFollow` (création de conversation/notation)

### 404 — Not Found

```json
{ "error": "User not found" }
```
> `backend/src/services/auth.service.ts:100`

```json
{ "error": "Conversation not found" }
```
> `backend/src/services/message.service.ts:32`

```json
{ "error": "Resource not found" }
```
> Mappé par défaut depuis Prisma `P2025`

### 409 — Conflict

```json
{ "error": "Email address already in use" }
```
> `backend/src/services/auth.service.ts:19`

```json
{ "error": "Vous suivez déjà cet utilisateur" }
```
> `backend/src/services/follow.service.ts:22`

```json
{ "error": "Conflict: resource already exists" }
```
> Mappé depuis Prisma `P2002` (contrainte d'unicité)

### 413 — Payload Too Large

```json
{ "error": "Fichier trop volumineux. Taille maximale : 5MB" }
```
> Multer `LIMIT_FILE_SIZE` (avatar)

### 422 — Unprocessable Entity

```json
{ "error": "Validation Zod : message multi-ligne" }
```
> Voir « Cas particulier — validation Zod » plus haut.

### 500 — Internal Server Error

```json
{ "error": "Unexpected server error" }
```
> Fallback générique du middleware ; les détails sont consignés dans les
> logs serveur uniquement.

---

## Recommandations côté consumer

1. **Switcher sur le statut HTTP**, pas sur une clé `code`. Les statuts sont
   stables et documentés ; il n'existe pas de code machine côté backend.
2. **Lire directement `response.json().error`** comme une chaîne ; ne pas
   présumer une structure imbriquée.
3. **Gérer `401` séparément** pour déclencher un refresh token (cf.
   `frontend/src/lib/api-client.ts`, qui retente automatiquement après un
   appel `POST /auth/refresh`).
4. **Afficher tel quel le contenu de `error`** lorsqu'il est destiné à
   l'utilisateur final (les messages métier sont rédigés en français pour
   les flows utilisateur — follow, conversation, profil).

---

## Navigation

| Précédent                                | Retour                       |
|------------------------------------------|------------------------------|
| [← Authentification](authentication.md)  | [🏠 Accueil](../index.md)    |
