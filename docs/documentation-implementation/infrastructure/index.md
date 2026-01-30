# Infrastructure

## Vue d'ensemble

SkillSwap utilise **Docker Compose** pour orchestrer tous les services en développement et en production.

| Environnement | Fichier | Services |
| ------------- | ------- | -------- |
| Développement | `docker-compose.dev.yml` | 5 (+ Adminer) |
| Production | `docker-compose.prod.yml` | 4 |

---

## Architecture

```mermaid
graph TB
    subgraph "Docker Network: skillswap"
        NGINX[Nginx<br/>:80/:8888]
        FRONTEND[Next.js<br/>:3000]
        BACKEND[Express<br/>:3000]
        POSTGRES[(PostgreSQL 16<br/>:5432)]
        ADMINER[Adminer<br/>:8080]
    end

    CLIENT[Browser] -->|HTTP/HTTPS| NGINX
    NGINX -->|/| FRONTEND
    NGINX -->|/api/*| BACKEND
    BACKEND -->|TCP| POSTGRES
    ADMINER -->|TCP| POSTGRES

    style ADMINER fill:#f9f,stroke:#333,stroke-dasharray: 5 5
```

!!! note "Adminer"
    Adminer n'est disponible qu'en environnement de développement.

---

## Services

### Backend

API Express.js avec Prisma ORM.

=== "Développement"

    ```dockerfile
    FROM node:24
    WORKDIR /app

    # Installer netcat pour wait-for-postgres
    RUN apt-get update && apt-get install -y netcat-openbsd

    COPY backend/package*.json ./
    RUN npm install
    COPY backend/. .

    ENV NODE_ENV=development
    EXPOSE 3000
    CMD ["npm", "run", "dev"]
    ```

=== "Production"

    ```dockerfile
    # Stage 1: Build
    FROM node:24 AS builder
    WORKDIR /app
    COPY backend/package*.json ./
    RUN npm ci
    COPY backend/. .
    RUN npx prisma generate
    RUN npm run build

    # Stage 2: Production
    FROM node:24 AS runner
    WORKDIR /app
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/prisma ./prisma

    ENV NODE_ENV=production
    EXPOSE 3000
    CMD ["node", "dist/index.js"]
    ```

---

### Frontend

Application Next.js avec SSR.

| Caractéristique | Développement | Production |
| --------------- | ------------- | ---------- |
| Hot Reload | ✅ Oui | ❌ Non |
| Build optimisé | ❌ Non | ✅ Oui |
| Source maps | ✅ Oui | ❌ Non |

---

### PostgreSQL

Base de données relationnelle.

| Paramètre | Valeur |
| --------- | ------ |
| Image | `postgres:16-alpine` |
| Port interne | 5432 |
| Port externe (dev) | 5433 |
| Volume | `postgres_data` |

**Healthcheck** :
```bash
pg_isready -U skillswap -d skillswap
```

---

### Nginx

Reverse proxy et load balancer.

```nginx
# Configuration simplifiée
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://frontend;
    }

    location /api {
        proxy_pass http://backend;
    }
}
```

---

## Docker Compose

### Développement

```yaml
# devops/docker-compose.dev.yml
name: skillswap-dev

services:
  backend:
    build:
      context: ..
      dockerfile: ./devops/backend/Dockerfile.dev
    volumes:
      - ../backend:/app                    # Hot reload
      - backend_node_modules:/app/node_modules
    expose:
      - '3000'
    env_file:
      - .env.docker
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build:
      context: ../frontend
      dockerfile: ../devops/frontend/Dockerfile.dev
    volumes:
      - ../frontend:/app                   # Hot reload
      - frontend_node_modules:/app/node_modules
      - frontend_next:/app/.next
    expose:
      - '3000'
    depends_on:
      - backend

  postgres:
    image: postgres:16-alpine
    ports:
      - '5433:5432'                        # Port externe différent
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U skillswap -d skillswap']
      interval: 5s
      timeout: 5s
      retries: 5

  adminer:
    image: adminer
    ports:
      - '8080:8080'                        # Interface BDD

  nginx:
    image: nginx:alpine
    ports:
      - '8888:80'                          # Accès via localhost:8888
    volumes:
      - ./nginx/dev.conf:/etc/nginx/conf.d/default.conf:ro

volumes:
  postgres_data:
  backend_node_modules:
  frontend_node_modules:
  frontend_next:
```

---

### Production

```yaml
# devops/docker-compose.prod.yml
name: skillswap-prod

services:
  backend:
    build:
      context: ..
      dockerfile: ./devops/backend/Dockerfile.prod
    restart: always
    expose:
      - '3000'
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ['CMD', 'nc', '-z', 'localhost', '3000']
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ../frontend
      dockerfile: ../devops/frontend/Dockerfile.prod
    restart: always
    expose:
      - '3000'
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ['CMD', 'nc', '-z', 'localhost', '3000']
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U skillswap -d skillswap']
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - '80:80'                            # Port standard HTTP
    healthcheck:
      test: ['CMD', 'nc', '-z', 'localhost', '80']
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
```

---

## Variables d'environnement

### Fichier `.env.docker`

```bash
# PostgreSQL
POSTGRES_USER=skillswap
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=skillswap
DATABASE_PORT=5433

# Backend
DATABASE_URL=postgresql://skillswap:password@postgres:5432/skillswap
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8888/api

# Ports (optionnels)
ADMINER_PORT=8080
```

---

## Commandes utiles

### Développement

```bash
# Démarrer tous les services
cd devops
docker compose -f docker-compose.dev.yml up -d

# Voir les logs
docker compose -f docker-compose.dev.yml logs -f

# Voir les logs d'un service
docker compose -f docker-compose.dev.yml logs -f backend

# Arrêter tous les services
docker compose -f docker-compose.dev.yml down

# Reconstruire les images
docker compose -f docker-compose.dev.yml build --no-cache

# Accéder au shell d'un container
docker compose -f docker-compose.dev.yml exec backend sh
```

### Production

```bash
# Build et démarrage
cd devops
docker compose -f docker-compose.prod.yml up -d --build

# Vérifier l'état des services
docker compose -f docker-compose.prod.yml ps

# Voir les healthchecks
docker inspect --format='{{json .State.Health}}' skillswap-nginx-prod
```

### Base de données

```bash
# Accéder à PostgreSQL
docker compose -f docker-compose.dev.yml exec postgres psql -U skillswap -d skillswap

# Backup de la base
docker compose -f docker-compose.dev.yml exec postgres pg_dump -U skillswap skillswap > backup.sql

# Restaurer un backup
cat backup.sql | docker compose -f docker-compose.dev.yml exec -T postgres psql -U skillswap -d skillswap
```

---

## Volumes

| Volume | Service | Chemin | Description |
| ------ | ------- | ------ | ----------- |
| `postgres_data` | postgres | `/var/lib/postgresql/data` | Données persistantes |
| `backend_node_modules` | backend | `/app/node_modules` | Dépendances (dev) |
| `frontend_node_modules` | frontend | `/app/node_modules` | Dépendances (dev) |
| `frontend_next` | frontend | `/app/.next` | Build Next.js (dev) |

!!! warning "Suppression des volumes"
    `docker compose down -v` supprime les volumes et donc toutes les données !

---

## Ports exposés

### Développement

| Service | Port interne | Port externe | URL |
| ------- | ------------ | ------------ | --- |
| Nginx | 80 | 8888 | `http://localhost:8888` |
| PostgreSQL | 5432 | 5433 | `localhost:5433` |
| Adminer | 8080 | 8080 | `http://localhost:8080` |

### Production

| Service | Port interne | Port externe | URL |
| ------- | ------------ | ------------ | --- |
| Nginx | 80 | 80 | `http://domain.com` |

---

## Healthchecks

Tous les services critiques ont des healthchecks configurés :

```mermaid
sequenceDiagram
    participant DC as Docker Compose
    participant PG as PostgreSQL
    participant BE as Backend
    participant FE as Frontend
    participant NG as Nginx

    DC->>PG: pg_isready
    PG-->>DC: healthy
    DC->>BE: Start (depends_on: postgres healthy)
    DC->>BE: nc -z localhost 3000
    BE-->>DC: healthy
    DC->>FE: Start (depends_on: backend)
    DC->>FE: nc -z localhost 3000
    FE-->>DC: healthy
    DC->>NG: Start (depends_on: frontend, backend healthy)
    DC->>NG: nc -z localhost 80
    NG-->>DC: healthy
```

---

## Navigation

| Retour |
| ------ |
| [🏠 Accueil](../index.md) |
