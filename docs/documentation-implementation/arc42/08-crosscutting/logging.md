# 8.4 Logging

## Niveaux de log

| Niveau | Usage | Exemple |
| ------ | ----- | ------- |
| `error` | Erreurs critiques | Échec BDD, crash |
| `warn` | Anomalies non-bloquantes | Rate limit approché |
| `info` | Événements métier | User créé, login |
| `debug` | Développement | Requêtes SQL |

---

## Structure des logs

```typescript
logger.info("User registered", {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
});
```

---

## Format de sortie

```json
{
  "level": "info",
  "message": "User registered",
  "userId": 42,
  "email": "user@example.com",
  "timestamp": "2025-01-22T10:30:00.000Z"
}
```

---

## Configuration par environnement

| Environnement | Niveau minimum | Destination |
| ------------- | -------------- | ----------- |
| Development | `debug` | Console |
| Production | `info` | Console + fichier |
| Test | `error` | Console |

---

[← Retour à l'index](./index.md)
