# 8.1 Authentification et Autorisation

## Flow JWT

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant DB as Database

    C->>A: POST /auth/login (credentials)
    A->>DB: Verify user
    DB-->>A: User data
    A->>A: Generate JWT (15min) + Refresh (7d)
    A-->>C: { accessToken, refreshToken }

    Note over C: Stocke tokens en cookies httpOnly

    C->>A: GET /api/profile (Authorization: Bearer JWT)
    A->>A: Verify JWT signature
    alt Token valide
        A-->>C: 200 + data
    else Token expiré
        A-->>C: 401 Unauthorized
        C->>A: POST /auth/refresh (refreshToken)
        A->>DB: Verify refresh token
        A-->>C: New accessToken
    end
```

---

## Structure du JWT

```typescript
interface JWTPayload {
  sub: number;      // User ID
  email: string;
  role: string;
  iat: number;      // Issued at
  exp: number;      // Expiration
}
```

---

## Configuration des tokens

| Token | Durée | Stockage | Usage |
| ----- | ----- | -------- | ----- |
| `accessToken` | 15 min | Cookie HTTP-only | Authentifier les requêtes |
| `refreshToken` | 7 jours | Cookie HTTP-only + BDD | Renouveler l'accessToken |

---

## Middleware d'authentification

```typescript
// middlewares/auth.middleware.ts
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};
```

---

[← Retour à l'index](./index.md)
