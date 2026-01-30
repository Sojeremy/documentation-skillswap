# API Reference

## Vue d'ensemble

L'API SkillSwap est une API REST qui permet de gérer les profils utilisateurs, les compétences, les conversations et le système de suivi.

### Base URL

| Environnement | URL |
| ------------- | --- |
| Docker (via Nginx) | `http://localhost:8888/api/v1` |
| Backend direct | `http://localhost:3000/api/v1` |
| Production | `https://api.skillswap.fr/api/v1` |

### Authentification

L'API utilise des **JWT (JSON Web Tokens)** stockés dans des cookies HTTP-only :

- `accessToken` : valide 15 minutes
- `refreshToken` : valide 7 jours

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
| **Profiles** | 5 | Consultation, modification, mot de passe, suppression, notation |
| **Skills** | 4 | Liste, ajout et suppression de compétences/intérêts |
| **Availabilities** | 3 | Liste, ajout et suppression de disponibilités |
| **Follows** | 4 | Abonnés, abonnements, suivre/ne plus suivre |
| **Conversations** | 5 | Liste, création, détail, fermeture, suppression |
| **Messages** | 4 | Liste, envoi, modification, suppression |
| **Categories** | 1 | Liste des catégories |
| **Total** | **31** | |

---

## Documentation interactive

Accédez à l'interface [Swagger UI](swagger.md) pour tester les endpoints directement.

---

## Navigation

| Retour | Suivant |
| ------ | ------- |
| [🏠 Accueil](../index.md) | [Authentification →](authentication.md) |
