# 6.1 Authentification

## Inscription (Register)

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL

    U->>F: Remplit formulaire inscription
    F->>F: Validation Zod (client-side)
    alt Validation échoue
        F-->>U: Affiche erreurs inline
    else Validation OK
        F->>B: POST /api/auth/register
        B->>B: Validation Zod (server-side)
        alt Email déjà utilisé
            B-->>F: 409 Conflict
            F-->>U: "Email déjà utilisé"
        else Email disponible
            B->>B: Hash password (bcrypt, 10 rounds)
            B->>DB: INSERT INTO user
            DB-->>B: User créé (id)
            B->>B: Génère JWT (15min) + Refresh Token (7j)
            B->>DB: INSERT INTO refresh_token
            B-->>F: 201 Created + { user, tokens }
            F->>F: Stocke tokens (cookies httpOnly)
            F-->>U: Redirection vers /profil
        end
    end
```

### Points clés

- **Double validation** : Zod côté client ET serveur
- **Hash sécurisé** : bcrypt avec 10 rounds
- **Tokens séparés** : accessToken (15min) + refreshToken (7j)
- **Stockage sécurisé** : Cookies HTTP-only

---

## Connexion (Login)

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL

    U->>F: Saisit email + mot de passe
    F->>B: POST /api/auth/login
    B->>DB: SELECT user WHERE email = ?
    alt User non trouvé
        B-->>F: 401 Unauthorized
        F-->>U: "Identifiants incorrects"
    else User trouvé
        B->>B: Compare password (bcrypt)
        alt Password incorrect
            B-->>F: 401 Unauthorized
            F-->>U: "Identifiants incorrects"
        else Password OK
            B->>B: Génère JWT + Refresh Token
            B->>DB: INSERT refresh_token
            B-->>F: 200 OK + { user, tokens }
            F->>F: Stocke tokens
            F-->>U: Redirection vers /recherche
        end
    end
```

### Points clés

- **Message d'erreur générique** : "Identifiants incorrects" (ne pas révéler si l'email existe)
- **Génération de tokens** : Nouveaux tokens à chaque connexion
- **Refresh token en BDD** : Pour révocation si nécessaire

---

## Refresh Token

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL

    Note over U,F: accessToken expiré

    U->>F: Requête API
    F->>B: GET /api/profile (accessToken expiré)
    B-->>F: 401 Unauthorized
    F->>B: POST /api/auth/refresh (refreshToken)
    B->>DB: SELECT refresh_token WHERE token = ?
    alt Token valide et non expiré
        B->>DB: DELETE ancien refresh_token
        B->>B: Génère nouveaux tokens
        B->>DB: INSERT nouveau refresh_token
        B-->>F: 200 OK + { tokens }
        F->>F: Met à jour tokens
        F->>B: Retry requête originale
        B-->>F: 200 OK + data
        F-->>U: Affiche données
    else Token invalide/expiré
        B-->>F: 401 Unauthorized
        F-->>U: Redirection vers /connexion
    end
```

---

## Déconnexion (Logout)

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL

    U->>F: Clique "Déconnexion"
    F->>B: POST /api/auth/logout
    B->>DB: DELETE refresh_token WHERE token = ?
    B-->>F: 200 OK + Set-Cookie (expire tokens)
    F->>F: Supprime état utilisateur
    F-->>U: Redirection vers /connexion
```

---

[← Retour à l'index](./index.md)
