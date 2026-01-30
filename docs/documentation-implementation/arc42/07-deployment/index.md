# 7. Vue Déploiement

## 7.1 Infrastructure Docker

### Architecture des containers

```mermaid
graph TB
    subgraph "Docker Network: skillswap-network"
        subgraph "Frontend Container"
            NEXT[Next.js App<br/>Port 3000]
        end

        subgraph "Backend Container"
            EXPRESS[Express API<br/>Port 3000]
        end

        subgraph "Database Container"
            PG[(PostgreSQL 16<br/>Port 5432)]
        end

        subgraph "Search Container"
            MS[(Meilisearch<br/>Port 7700)]
        end

        subgraph "Reverse Proxy"
            NGINX[Nginx<br/>Port 80/443]
        end
    end

    CLIENT[Client Browser] -->|HTTPS| NGINX
    NGINX -->|HTTP| NEXT
    NGINX -->|HTTP /api/*| EXPRESS
    EXPRESS -->|TCP| PG
    EXPRESS -->|HTTP| MS
```

---

## 7.2 Configuration Docker Compose

### Services principaux

```yaml
# docker-compose.yml (simplifié)
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8888
      - INTERNAL_API_URL=http://backend:3000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://skillswap:password@postgres:5432/skillswap
      - MEILISEARCH_HOST=http://meilisearch:7700
    depends_on:
      - postgres
      - meilisearch

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=skillswap
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

  meilisearch:
    image: getmeili/meilisearch:v1.6
    volumes:
      - meilisearch_data:/meili_data
    environment:
      - MEILI_MASTER_KEY=masterKey

volumes:
  postgres_data:
  meilisearch_data:
```

---

## 7.3 Environnements

### Développement local

| Service | URL | Description |
| ------- | --- | ----------- |
| Frontend | `http://localhost:8888` | Next.js via Nginx |
| Backend | `http://localhost:8888/api` | Express via Nginx |
| PostgreSQL | `localhost:5432` | Base de données |
| Meilisearch | `http://localhost:7700` | Moteur de recherche |
| Prisma Studio | `http://localhost:5555` | Interface BDD |

### Production (cible)

```mermaid
graph LR
    subgraph "Cloud Provider"
        LB[Load Balancer]
        subgraph "App Servers"
            APP1[Container 1]
            APP2[Container 2]
        end
        subgraph "Data Layer"
            DB[(PostgreSQL<br/>Managed)]
            SEARCH[(Meilisearch<br/>Cloud)]
        end
    end

    DNS[DNS] --> LB
    LB --> APP1
    LB --> APP2
    APP1 --> DB
    APP2 --> DB
    APP1 --> SEARCH
    APP2 --> SEARCH
```

---

## 7.4 Scripts de déploiement

### Commandes disponibles

```bash
# Développement
npm run dev           # Lance frontend + backend
docker-compose up -d  # Lance tous les services

# Production
npm run build         # Build frontend + backend
npm run start         # Lance en mode production

# Base de données
npx prisma migrate dev    # Applique les migrations
npx prisma db seed        # Seed les données
npx prisma studio         # Interface graphique
```

---

## 7.5 Volumes et persistance

| Volume | Container | Chemin | Description |
| ------ | --------- | ------ | ----------- |
| `postgres_data` | postgres | `/var/lib/postgresql/data` | Données PostgreSQL |
| `meilisearch_data` | meilisearch | `/meili_data` | Index de recherche |
| `avatars_data` | backend | `/app/public/avatars` | Avatars utilisateurs (prod) |
| `certbot_www` | nginx | `/var/www/certbot` | Challenge ACME SSL (prod) |
| `certbot_conf` | nginx | `/etc/letsencrypt` | Certificats SSL (prod) |

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [← 6. Runtime](../06-runtime/index.md) | [8. Crosscutting →](../08-crosscutting/index.md) |
