# 10.1 Scénarios de qualité

## Performance

| ID | Scénario | Métrique | Cible |
| -- | -------- | -------- | ----- |
| P1 | Chargement page d'accueil | Time to First Byte | < 200ms |
| P2 | Recherche de compétences | Temps de réponse | < 300ms |
| P3 | Affichage profil | Largest Contentful Paint | < 2.5s |
| P4 | Envoi de message | Temps de réponse | < 500ms |

---

## Utilisabilité

| ID | Scénario | Métrique | Cible |
| -- | -------- | -------- | ----- |
| U1 | Inscription nouvel utilisateur | Nombre d'étapes | ≤ 3 |
| U2 | Trouver un membre | Clics nécessaires | ≤ 2 |
| U3 | Envoyer premier message | Temps pour accomplir | < 1min |
| U4 | Navigation mobile | Touch targets | ≥ 44px |

---

## Sécurité

| ID | Scénario | Exigence |
| -- | -------- | -------- |
| S1 | Stockage mot de passe | Hash bcrypt (10 rounds) |
| S2 | Transmission données | HTTPS obligatoire |
| S3 | Session expirée | JWT 15min, refresh 7j |
| S4 | Accès non autorisé | 401/403 approprié |

---

## Maintenabilité

| ID | Scénario | Métrique | Cible |
| -- | -------- | -------- | ----- |
| M1 | Ajout nouvelle feature | Temps d'onboarding | < 1 jour |
| M2 | Correction de bug | Localisation | < 30min |
| M3 | Couverture de tests | Coverage | > 70% |
| M4 | Documentation | Sections Arc42 | 12/12 |

---

## Métriques de code

### ESLint / TypeScript

```typescript
// Configuration stricte
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Complexité cyclomatique

| Seuil | Action |
| ----- | ------ |
| 1-10 | Acceptable |
| 11-20 | À surveiller |
| > 20 | Refactoring requis |

---

[← Retour à l'index](./index.md)
