# 8.5 Sécurité

## Mesures implémentées

| Mesure | Implémentation | Protection contre |
| ------ | -------------- | ----------------- |
| **Hash passwords** | bcrypt (10 rounds) | Vol de BDD |
| **JWT httpOnly** | Cookies sécurisés | XSS |
| **Validation Zod** | Input sanitization | Injection |
| **CORS** | Origins whitelist | CSRF |
| **Helmet** | Headers sécurisés | Clickjacking |
| **Rate limiting** | express-rate-limit | DDoS, Brute force |

---

## Headers de sécurité (Helmet)

```typescript
app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true,
}));
```

---

## Configuration CORS

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par fenêtre
  message: 'Trop de requêtes, réessayez plus tard',
});

app.use('/api/', limiter);
```

---

## OWASP Top 10

| Vulnérabilité | Mesure |
| ------------- | ------ |
| Injection | Validation Zod, Prisma (requêtes paramétrées) |
| Broken Authentication | JWT HTTP-only, refresh token rotation |
| Sensitive Data Exposure | HTTPS, hash bcrypt |
| XXE | Pas de parsing XML |
| Broken Access Control | Middleware auth, vérification ownership |
| Security Misconfiguration | Helmet, variables d'environnement |
| XSS | Cookies HTTP-only, CSP |
| Insecure Deserialization | Validation stricte des entrées |

---

[← Retour à l'index](./index.md)
