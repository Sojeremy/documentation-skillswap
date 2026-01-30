# 8.3 Gestion des erreurs

## Hiérarchie des erreurs

```typescript
// Base error
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

// Erreurs spécifiques
class ValidationError extends AppError {
  constructor(errors: ZodError) {
    super(400, "Validation failed", "VALIDATION_ERROR");
  }
}

class AuthenticationError extends AppError {
  constructor() {
    super(401, "Non authentifié", "AUTH_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} non trouvé`, "NOT_FOUND");
  }
}
```

---

## Format de réponse d'erreur

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Email invalide" }
    ]
  }
}
```

---

## Codes d'erreur

| Code | HTTP | Description |
| ---- | ---- | ----------- |
| `VALIDATION_ERROR` | 400 | Données invalides |
| `AUTH_ERROR` | 401 | Non authentifié |
| `FORBIDDEN` | 403 | Accès interdit |
| `NOT_FOUND` | 404 | Ressource non trouvée |
| `CONFLICT` | 409 | Conflit (ex: email déjà utilisé) |
| `INTERNAL_ERROR` | 500 | Erreur serveur |

---

[← Retour à l'index](./index.md)
