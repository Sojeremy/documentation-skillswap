# 6.4 Gestion des erreurs

## Vue d'ensemble du dispositif

Le backend SkillSwap centralise la gestion d'erreurs dans un middleware
unique `errorHandler`, monté en **dernier** dans `backend/src/app.ts:34`,
après tous les routeurs applicatifs. Tout `next(err)` déclenché par un
contrôleur ou un middleware en amont aboutit à ce handler, qui :

1. Identifie le type d'erreur (classe custom `HttpError`, erreurs JWT, Zod,
   Prisma, Multer, `FileValidationError`).
2. Mappe le type vers un statut HTTP.
3. Sérialise une réponse JSON dans le **format unique** `{ "error": "string" }`.

```mermaid
flowchart TD
    A[Controller / middleware] -->|throw or next(err)| B[errorHandler]
    B --> C{err instanceof ?}
    C -->|HttpError| D[res.status(err.statusCode).json: error: err.message]
    C -->|TokenExpiredError| E[401 — Expired JWT token]
    C -->|JsonWebTokenError| F[401 — JWT error: ...]
    C -->|ZodError| G[422 — prettifyZodError]
    C -->|Prisma P2025| H[404 — Resource not found]
    C -->|Prisma P2002| I[409 — Conflict: resource already exists]
    C -->|Prisma P2003| J[409 — Conflict: invalid relation]
    C -->|Prisma init| K[503 — Database unavailable]
    C -->|MulterError LIMIT_FILE_SIZE| L[413 — Fichier trop volumineux]
    C -->|MulterError other| M[400 — Erreur lors de l'upload]
    C -->|FileValidationError| N[400 — err.message]
    C -->|sinon| O[500 — Unexpected server error]
```

!!! info "Pourquoi ce format minimaliste ?"
    Le backend ne renvoie **qu'une seule clé `error`** (chaîne de caractères).
    Pas de `success: false`, pas de `code` machine, pas de `details`. Cette
    minceur facilite l'intégration côté frontend
    (`displayError(err)` dans `frontend/src/lib/utils.ts`) qui n'a qu'à lire
    `error.message` du `Error` JavaScript reconstruit par `api-client.ts`.

---

## Hiérarchie d'erreurs custom

`backend/src/lib/error.ts` définit une classe parente `HttpError` et **6
sous-classes** spécialisées, plus une classe `FileValidationError`
indépendante (utilisée pour les uploads).

```ts
// backend/src/lib/error.ts (extrait)
export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError       extends HttpError { /* 401 */ }
export class ForbiddenError          extends HttpError { /* 403 */ }
export class NotFoundError           extends HttpError { /* 404 */ }
export class BadRequestError         extends HttpError { /* 400 */ }
export class ConflictError           extends HttpError { /* 409 */ }
export class UnprocessableEntityError extends HttpError { /* 422 */ }

export class FileValidationError extends Error {} // pas de statusCode
```

| Classe                    | Status | Usage typique                                                              |
|---------------------------|--------|----------------------------------------------------------------------------|
| `UnauthorizedError`       | 401    | Pas authentifié, JWT absent/invalide/expiré, refresh token invalide        |
| `ForbiddenError`          | 403    | Authentifié mais pas autorisé (non participant, ressource d'un autre user) |
| `NotFoundError`           | 404    | Ressource introuvable (user, conversation, message, etc.)                  |
| `BadRequestError`         | 400    | Requête mal formée hors validation Zod (ex. fichier manquant à l'upload)   |
| `ConflictError`           | 409    | Conflit applicatif (email déjà pris, follow déjà existant, self-follow)    |
| `UnprocessableEntityError`| 422    | Règle métier non satisfaite indétectable par Zod                           |
| `FileValidationError`     | 400    | Upload invalide (MIME/extension non autorisé) — mappé en 400 par le handler |

Exemples de throw sites (pour vérifier la cohérence d'usage) :

- `auth.service.ts:19` → `ConflictError('Email address already in use')`
- `auth.service.ts:60` → `UnauthorizedError('Invalid email or password')`
- `message.service.ts:117` → `ForbiddenError('Conversation closed')`
- `follow.service.ts:10` → `ConflictError('Vous ne pouvez pas vous suivre vous-même')`
- `profile.controller.ts:128` → `BadRequestError('Aucun fichier fourni')`

---

## Format de réponse

Toutes les erreurs HTTP renvoient le même format :

```json
{
  "error": "string"
}
```

**Une seule clé `error`**, dont la valeur est une chaîne de caractères. Aucune
clé `success`, aucun objet imbriqué `error.code/message/details`.

Exemples concrets renvoyés par le backend :

```json title="401 — JWT expiré"
{ "error": "Expired JWT token" }
```

```json title="404 — Ressource Prisma absente"
{ "error": "Resource not found" }
```

```json title="409 — Email déjà pris (auth.service.ts:19)"
{ "error": "Email address already in use" }
```

```json title="422 — Validation Zod (un message par ligne)"
{ "error": "Email invalide\nMot de passe trop court" }
```

```json title="500 — Erreur inattendue"
{ "error": "Unexpected server error" }
```

---

## Cas pris en charge par `errorHandler`

Implémentation : `backend/src/middlewares/error.middleware.ts`.

| Type d'erreur                                         | Status | Message renvoyé                                          |
|-------------------------------------------------------|--------|----------------------------------------------------------|
| `HttpError` (et sous-classes)                         | `err.statusCode` | `err.message` (tel que throw côté service)               |
| `jwt.TokenExpiredError`                               | 401    | `Expired JWT token`                                      |
| `jwt.JsonWebTokenError`                               | 401    | `JWT error: ${err.message}`                              |
| `ZodError`                                            | 422    | Issues formatées via `prettifyZodError` (1 msg/ligne)    |
| `Prisma.PrismaClientKnownRequestError` `P2025`        | 404    | `Resource not found`                                     |
| `Prisma.PrismaClientKnownRequestError` `P2002`        | 409    | `Conflict: resource already exists`                      |
| `Prisma.PrismaClientKnownRequestError` `P2003`        | 409    | `Conflict: invalid relation`                             |
| Autre `PrismaClientKnownRequestError`                 | 400    | `Database request error` (+ log console)                 |
| `Prisma.PrismaClientValidationError`                  | 400    | `Invalid database query`                                 |
| `Prisma.PrismaClientInitializationError`              | 503    | `Database unavailable`                                   |
| `multer.MulterError` `LIMIT_FILE_SIZE`                | 413    | `Fichier trop volumineux. Taille maximale : 5MB`         |
| `multer.MulterError` (autre)                          | 400    | `Erreur lors de l'upload du fichier`                     |
| `FileValidationError`                                 | 400    | `err.message` (ex. type MIME non autorisé)               |
| Erreur inattendue (fallback)                          | 500    | `Unexpected server error` (+ log console)                |

!!! note "Formatage Zod — `prettifyZodError`"
    `backend/src/lib/formatZodError.ts` concatène les messages de chaque
    `issue.message` en supprimant les doublons, séparés par `\n`. Le frontend
    affiche le message tel quel dans un toast, ce qui produit un message multi-ligne
    lisible quand plusieurs champs sont invalides.

---

## Bonnes pratiques côté contrôleurs

1. **Throw explicite depuis les services** : les services
   (`auth.service.ts`, `message.service.ts`, etc.) utilisent les sous-classes
   `HttpError` adaptées plutôt que des `Error` génériques.

2. **Ne pas catch dans le contrôleur** : le pattern uniforme dans
   `*.controller.ts` est :

   ```ts
   try {
     // parse params + appel service
     return res.success(data);
   } catch (err) {
     next(err); // remonte au middleware
   }
   ```

   Aucun mapping erreur→réponse n'a lieu dans le contrôleur, ce qui garantit
   l'unicité de format.

3. **Validation Zod en entrée** : `validate('body'|'query'|'params', schema)`
   (cf. `backend/src/middlewares/auth.middleware.ts`) intercepte les payloads
   invalides avant le contrôleur ; toute violation produit un `ZodError` que
   le handler convertit en 422.

4. **Côté frontend** : `frontend/src/lib/api-client.ts` reconstruit un objet
   `Error` standard à partir de `response.json().error`. Les composants
   appellent ensuite `displayError(err)` (`frontend/src/lib/utils.ts:216`)
   qui affiche `err.message` via un toast `sonner`.

---

[← Retour à l'index](./index.md)
