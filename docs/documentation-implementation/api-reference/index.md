# API Reference

## Vue d'ensemble

L'API SkillSwap est une API REST qui permet de gérer les profils utilisateurs, les compétences, les conversations et le système de suivi.

### Base URL

| Environnement | URL |
| ------------- | --- |
| Docker (via Nginx) | `http://localhost:8888/api/v1` |
| Backend direct | `http://localhost:3000/api/v1` |
| Production | `https://skill-swap.fr/api/v1` |

### Authentification

L'API utilise des **JWT (JSON Web Tokens)** stockés dans des cookies HTTP-only :

- `accessToken` : valide 1 heure (`TOKEN_EXPIRE` env, défaut 3600 s)
- `refreshToken` : valide 30 jours (constante en dur côté backend)

Voir le [guide d'authentification](authentication.md) pour plus de détails.

### Format des réponses

Toutes les réponses suivent ce format :

```json
{
  "success": true,
  "data": { ... }
}
```

En cas d'erreur :

```json
{
  "success": false,
  "error": "Description de l'erreur"
}
```

Voir les [codes d'erreur](errors.md) pour la liste complète.

---

## Endpoints par catégorie

| Catégorie | Endpoints | Description |
| --------- | --------- | ----------- |
| **Auth** | 5 | Inscription, connexion, déconnexion, refresh, profil connecté |
| **Profiles** | 14 | Consultation publique/privée, mise à jour profil, avatar, skills, intérêts, disponibilités, password, notation, suppression compte |
| **Follows** | 4 | Abonnés, abonnements, suivre/ne plus suivre |
| **Conversations** | 5 | Liste, création, détail, suppression, fermeture |
| **Messages** | 4 | Liste, envoi, modification, suppression (sous `/conversations/:id/...`) |
| **Search** | 2 | Recherche utilisateurs, top-rated public |
| **Categories** | 1 | Top-rated (pas de liste plate exposée) |
| **Skills** | 1 | Liste plate (auth requise) |
| **Availabilities** | 1 | Liste plate (auth requise) |
| **Health** | 1 | Health check `/api/v1/health` |
| **Total** | **38** | |

---

## Documentation interactive

Accédez à l'interface [Swagger UI](swagger.md) pour tester les endpoints directement.

---

## Navigation

| Retour | Suivant |
| ------ | ------- |
| [🏠 Accueil](../index.md) | [Authentification →](authentication.md) |
