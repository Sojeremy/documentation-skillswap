# Réseaux Docker

## Réseau par défaut

Docker Compose crée automatiquement un réseau pour chaque projet. Les services communiquent via leurs noms de service.

```mermaid
graph TB
    subgraph "skillswap-dev_default"
        nginx[nginx]
        frontend[frontend:3000]
        backend[backend:3000]
        postgres[postgres:5432]
        adminer[adminer:8080]
    end

    nginx --> frontend
    nginx --> backend
    backend --> postgres
    adminer --> postgres
```

## Nom du réseau

| Environnement | Nom du réseau |
|---------------|---------------|
| Dev | `skillswap-dev_default` |
| Prod | `skillswap-prod_default` |

## Résolution DNS

Les services se découvrent par leur nom :

| Service | Hostname | Port interne |
|---------|----------|--------------|
| Frontend | `frontend` | 3000 |
| Backend | `backend` | 3000 |
| PostgreSQL | `postgres` | 5432 |
| Adminer | `adminer` | 8080 |
| Nginx | `nginx` | 80 |

### Exemple de connexion

```typescript
// Backend → PostgreSQL
DATABASE_URL="postgresql://user:pass@postgres:5432/skillswap"

// Frontend → Backend (via nginx)
NEXT_PUBLIC_API_URL="http://nginx/api"

// Nginx → Services
proxy_pass http://frontend:3000;
proxy_pass http://backend:3000;
```

## Ports exposés

### Développement

| Service | Port interne | Port externe | Accès |
|---------|--------------|--------------|-------|
| nginx | 80 | 8888 | http://localhost:8888 |
| postgres | 5432 | 5433 | localhost:5433 |
| adminer | 8080 | 8080 | http://localhost:8080 |

### Production

| Service | Port interne | Port externe | Accès |
|---------|--------------|--------------|-------|
| nginx | 80 | 80 | http://domaine.com |

!!! note "Isolation"
    En production, seul nginx expose un port. Les autres services sont accessibles uniquement via le réseau interne Docker.

## Communication inter-services

```mermaid
sequenceDiagram
    participant C as Client
    participant N as Nginx
    participant F as Frontend
    participant B as Backend
    participant P as PostgreSQL

    C->>N: GET /
    N->>F: proxy_pass frontend:3000
    F-->>N: HTML
    N-->>C: HTML

    C->>N: POST /api/auth/login
    N->>B: proxy_pass backend:3000
    B->>P: SELECT * FROM user
    P-->>B: User data
    B-->>N: JSON response
    N-->>C: JSON response
```

## Inspecter le réseau

```bash
# Lister les réseaux
docker network ls

# Détails du réseau
docker network inspect skillswap-dev_default

# Conteneurs connectés
docker network inspect skillswap-dev_default --format '{{range .Containers}}{{.Name}} {{end}}'
```

## Configuration personnalisée (optionnel)

Si besoin de réseaux isolés :

```yaml
networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge

services:
  nginx:
    networks:
      - frontend-network

  frontend:
    networks:
      - frontend-network

  backend:
    networks:
      - frontend-network
      - backend-network

  postgres:
    networks:
      - backend-network
```

!!! info "Non utilisé"
    Cette configuration n'est pas implémentée dans SkillSwap car le réseau par défaut suffit pour notre architecture.

## Voir aussi

- [Services](./services.md)
- [Volumes](./volumes.md)
- [Troubleshooting](./troubleshooting.md)
