# Codes d'erreur

## Format des erreurs

Toutes les erreurs suivent ce format :

```json
{
  "success": false,
  "error": "Description de l'erreur",
  "code": "ERROR_CODE"
}
```

Pour les erreurs de validation (422), le format inclut les détails :

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Format email invalide"
    },
    {
      "field": "password",
      "message": "Minimum 8 caractères requis"
    }
  ]
}
```

---

## Codes HTTP

### Succès (2xx)

| Code | Nom | Description | Utilisation |
| ---- | --- | ----------- | ----------- |
| 200 | OK | Requête réussie | GET, PUT, PATCH |
| 201 | Created | Ressource créée | POST |
| 204 | No Content | Succès sans contenu | DELETE |

### Erreurs client (4xx)

| Code | Nom | Description | Exemple |
| ---- | --- | ----------- | ------- |
| 400 | Bad Request | Requête malformée | JSON invalide |
| 401 | Unauthorized | Non authentifié | Token manquant/expiré |
| 403 | Forbidden | Accès refusé | Pas propriétaire du profil |
| 404 | Not Found | Ressource inexistante | Utilisateur ID 999 |
| 409 | Conflict | Conflit de données | Email déjà utilisé |
| 422 | Unprocessable Entity | Validation échouée | Champs invalides |

### Erreurs serveur (5xx)

| Code | Nom | Description |
| ---- | --- | ----------- |
| 500 | Internal Server Error | Erreur serveur inattendue |

---

## Erreurs par endpoint

### Auth

| Endpoint | Code | Erreur | Cause |
| -------- | ---- | ------ | ----- |
| POST /auth/register | 409 | "Email déjà utilisé" | Email existant |
| POST /auth/register | 422 | Validation | Champs invalides |
| POST /auth/login | 401 | "Identifiants incorrects" | Email ou password faux |
| POST /auth/refresh | 401 | "Token invalide" | RefreshToken expiré |
| GET /auth/me | 401 | "Non authentifié" | Pas de token |

### Profiles

| Endpoint | Code | Erreur | Cause |
| -------- | ---- | ------ | ----- |
| GET /profiles/:id | 404 | "Utilisateur non trouvé" | ID inexistant |
| PUT /profiles/:id | 403 | "Non autorisé" | Pas le propriétaire |
| POST /profiles/:id/rating | 403 | "Vous devez suivre cet utilisateur" | Pas abonné |

### Conversations

| Endpoint | Code | Erreur | Cause |
| -------- | ---- | ------ | ----- |
| POST /conversations | 403 | "Vous devez suivre le destinataire" | Pas abonné |
| GET /conversations/:id | 404 | "Conversation non trouvée" | ID inexistant |
| POST /conversations/:id/messages | 400 | "Message vide" | Contenu vide |

### Follows

| Endpoint | Code | Erreur | Cause |
| -------- | ---- | ------ | ----- |
| POST /follows/:id/follow | 400 | "Déjà suivi" | Déjà abonné |
| POST /follows/:id/follow | 400 | "Impossible de se suivre soi-même" | Auto-follow |
| DELETE /follows/:id/follow | 400 | "Vous ne suivez pas cet utilisateur" | Pas abonné |

---

## Gestion des erreurs côté client

### Exemple React avec TanStack Query

```typescript
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const loginMutation = useMutation({
  mutationFn: (data: LoginData) => api.post('/auth/login', data),
  onError: (error: ApiError) => {
    switch (error.status) {
      case 401:
        toast.error('Email ou mot de passe incorrect');
        break;
      case 422:
        // Afficher les erreurs de validation
        error.details?.forEach(d => {
          setError(d.field, { message: d.message });
        });
        break;
      default:
        toast.error('Une erreur est survenue');
    }
  },
});
```

### Intercepteur Axios global

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Tenter un refresh
      try {
        await api.post('/auth/refresh');
        return api.request(error.config);
      } catch {
        // Rediriger vers login
        window.location.href = '/connexion';
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Codes d'erreur métier

| Code | Description |
| ---- | ----------- |
| `AUTH_ERROR` | Erreur d'authentification |
| `VALIDATION_ERROR` | Erreur de validation Zod |
| `NOT_FOUND` | Ressource non trouvée |
| `FORBIDDEN` | Accès non autorisé |
| `CONFLICT` | Conflit de données |
| `RATE_LIMIT` | Trop de requêtes |

---

## Navigation

| Précédent | Retour |
| --------- | ------ |
| [← Authentification](authentication.md) | [🏠 Accueil](../index.md) |
