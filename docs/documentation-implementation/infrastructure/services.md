# Services Docker

SkillSwap utilise Docker Compose pour orchestrer **7 services en développement** et **6 en production**.

## Vue d'ensemble

```mermaid
graph LR
    Client[Client Browser] --> Nginx
    Nginx --> Frontend[Frontend Next.js]
    Nginx --> Backend[Backend Express]
    Backend --> Postgres[(PostgreSQL)]
    Backend --> Meilisearch[(Meilisearch)]
    Adminer --> Postgres
    Certbot -.-> Nginx

    subgraph Docker Network
        Nginx
        Frontend
        Backend
        Postgres
        Meilisearch
        Adminer
        Certbot
    end
```

## Services par environnement

| Service | Dev | Prod | Port externe | Description |
|---------|-----|------|--------------|-------------|
| nginx | ✅ | ✅ | 8888 (dev) / 80, 443 (prod) | Reverse proxy |
| frontend | ✅ | ✅ | via nginx | Application Next.js |
| backend | ✅ | ✅ | via nginx | API Express |
| postgres | ✅ | ✅ | 5433 (dev only) | Base de données |
| meilisearch | ✅ | ✅ | 7700 (dev only) | Moteur de recherche |
| adminer | ✅ | ❌ | 8080 (dev only) | Interface BDD |
| certbot | ❌ | ✅ | - | Certificats SSL |

---

## Frontend (Next.js)

### Configuration

```yaml
frontend:
  build:
    context: ../frontend
    dockerfile: ../devops/frontend/Dockerfile.dev
  restart: unless-stopped
  volumes:
    - ../frontend:/app
    - frontend_node_modules:/app/node_modules
    - frontend_next:/app/.next
  expose:
    - '3000'
  env_file:
    - .env.docker
  depends_on:
    - backend
```

### Caractéristiques

| Propriété | Dev | Prod |
|-----------|-----|------|
| Image | Dockerfile.dev | Dockerfile.prod |
| Restart | unless-stopped | always |
| Volumes | Code source monté | Aucun (image optimisée) |
| NODE_ENV | development | production |
| HMR | Activé | Désactivé |

### Variables d'environnement

| Variable | Description | Dev | Prod |
|----------|-------------|-----|------|
| `CLIENT_PORT` | Port interne du frontend | `3000` | `3000` |
| `NEXT_PUBLIC_API_URL` | URL publique de l'API (côté client) | `http://localhost:8888` | `https://skill-swap.fr` |
| `NEXT_PUBLIC_SITE_URL` | URL du site (SEO, sitemap, canonical) | `http://localhost:8888` | `https://skill-swap.fr` |
| `INTERNAL_API_URL` | URL interne API (SSR, Docker network) | `http://backend:3000` | `http://backend:3000` |

!!! info "INTERNAL_API_URL"
    Cette variable est cruciale pour le Server-Side Rendering. Le frontend utilise `NEXT_PUBLIC_API_URL` côté client et `INTERNAL_API_URL` côté serveur (pour les appels depuis le réseau Docker).

### Healthcheck (prod)

```yaml
healthcheck:
  test: ['CMD', 'nc', '-z', 'localhost', '3000']
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## Backend (Express)

### Configuration

```yaml
backend:
  build:
    context: ..
    dockerfile: ./devops/backend/Dockerfile.dev
  restart: unless-stopped
  volumes:
    - ../backend:/app
    - backend_node_modules:/app/node_modules
  expose:
    - '3000'
  env_file:
    - .env.docker
  command: ['npm', 'run', 'dev']
  depends_on:
    postgres:
      condition: service_healthy
```

### Caractéristiques

| Propriété | Dev | Prod |
|-----------|-----|------|
| Image | Dockerfile.dev | Dockerfile.prod |
| Command | `npm run dev` | `node dist/index.js` |
| Watch | nodemon | Aucun |
| Prisma | Génération à chaud | Pré-généré |

### Variables d'environnement

| Variable | Description | Dev | Prod |
|----------|-------------|-----|------|
| `API_PORT` | Port interne du backend | `3000` | `3000` |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://skillswap:***@postgres:5432/skillswap` | idem |
| `JWT_SECRET` | Secret pour signer les tokens JWT (min 32 chars) | `your_secret_here` | Générer avec `openssl rand -base64 32` |
| `TOKEN_EXPIRE` | Durée de validité du token (secondes) | `3600` | `3600` |
| `ALLOWED_ORIGIN` | URL autorisée pour CORS | `http://localhost:8888` | `https://skill-swap.fr` |

!!! danger "Sécurité JWT_SECRET"
    - Minimum 32 caractères
    - Générer avec : `openssl rand -base64 32`
    - Ne jamais commiter en clair
    - Différent entre dev et prod

### Attente PostgreSQL (prod)

```yaml
command: ['wait-for-postgres.sh', 'postgres', '5432', 'node', 'dist/index.js']
```

Script qui attend que PostgreSQL soit prêt avant de démarrer l'application.

---

## PostgreSQL

### Configuration

```yaml
postgres:
  image: postgres:16-alpine
  container_name: skillswap-postgres
  restart: unless-stopped
  env_file:
    - .env.docker
  volumes:
    - postgres_data:/var/lib/postgresql/data
  ports:
    - '${DATABASE_PORT:-5433}:5432'
  healthcheck:
    test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}']
    interval: 5s
    timeout: 5s
    retries: 5
```

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `POSTGRES_USER` | Utilisateur | skillswap |
| `POSTGRES_PASSWORD` | Mot de passe | (secret) |
| `POSTGRES_DB` | Base de données | skillswap |
| `DATABASE_PORT` | Port externe | 5433 |

### Healthcheck

Le healthcheck utilise `pg_isready` pour vérifier que PostgreSQL accepte les connexions.

### Image

- **postgres:16-alpine** : Version légère basée sur Alpine Linux
- Taille : ~80MB vs ~350MB pour la version standard

---

## Nginx (Reverse Proxy)

### Configuration

```yaml
nginx:
  image: nginx:alpine
  container_name: skillswap-nginx
  restart: unless-stopped
  ports:
    - '8888:80'  # Dev
    # - '80:80'   # Prod
  volumes:
    - ./nginx/dev.conf:/etc/nginx/conf.d/default.conf:ro
  depends_on:
    - frontend
    - backend
```

### Routing

| Path | Destination | Description |
|------|-------------|-------------|
| `/` | frontend:3000 | Application Next.js |
| `/api/` | backend:3000 | API Express |
| `/socket.io/` | backend:3000 | WebSocket (temps réel) |
| `/avatars/` | backend:3000 | Images de profil |
| `/_next/webpack-hmr` | frontend:3000 | Hot Module Replacement (dev) |

### Configuration Nginx (dev)

```nginx
server {
    listen 80;
    server_name localhost;

    # Frontend (Next.js)
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Socket.IO (WebSocket)
    location /socket.io/ {
        proxy_pass http://backend:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;  # 24h pour les connexions longues
    }

    # Avatars (images de profil)
    location /avatars/ {
        proxy_pass http://backend:3000/avatars/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 1d;  # Cache 24h
        add_header Cache-Control "public, immutable";
    }

    # Next.js HMR
    location /_next/webpack-hmr {
        proxy_pass http://frontend:3000/_next/webpack-hmr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Configuration Nginx (prod)

En production, Nginx gère également :

- **HTTPS** sur le port 443
- **Redirection HTTP → HTTPS**
- **Certificats SSL** via Certbot
- **Headers de sécurité** (HSTS, X-Frame-Options, etc.)
- **Compression gzip**
- **Cache des fichiers statiques** (1 an pour les assets)

---

## Adminer (Dev uniquement)

### Configuration

```yaml
adminer:
  image: adminer
  container_name: skillswap-adminer
  restart: unless-stopped
  ports:
    - '${ADMINER_PORT:-8080}:8080'
  depends_on:
    postgres:
      condition: service_healthy
```

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `ADMINER_PORT` | Port externe pour accéder à Adminer | `8080` |

### Accès

- **URL** : http://localhost:8080 (ou `ADMINER_PORT`)
- **Système** : PostgreSQL
- **Serveur** : postgres
- **Utilisateur** : (depuis .env.docker)
- **Mot de passe** : (depuis .env.docker)
- **Base** : skillswap

!!! warning "Production"
    Adminer n'est **pas** déployé en production pour des raisons de sécurité.

---

## Meilisearch (Moteur de recherche)

### Configuration

```yaml
meilisearch:
  image: getmeili/meilisearch:v1.6
  container_name: skillswap-meilisearch
  restart: unless-stopped
  ports:
    - '7700:7700'  # Dev only
  expose:
    - '7700'       # Prod (interne uniquement)
  environment:
    - MEILI_MASTER_KEY=${MEILI_MASTER_KEY}
    - MEILI_ENV=development  # ou production
  volumes:
    - meilisearch_data:/meili_data
```

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MEILI_MASTER_KEY` | Clé d'API maître (min 16 caractères) | `your_master_key_here` |
| `MEILI_ENV` | Environnement (development/production) | `production` |
| `MEILISEARCH_HOST` | URL interne pour le backend | `http://meilisearch:7700` |
| `MEILI_API_KEY` | Clé d'API pour les requêtes | (identique à MASTER_KEY) |

### Fonctionnalités

- **Recherche full-text** : Recherche par nom, prénom, compétences
- **Tolérance aux fautes** : Correction automatique des typos
- **Filtres** : Par catégorie, ville
- **Tri** : Par note, date d'inscription
- **Pagination** : Support natif

### Index

| Index | Description | Champs searchables |
|-------|-------------|-------------------|
| `members` | Profils utilisateurs | firstname, lastname, skills |

### Commandes utiles

```bash
# Réindexer tous les membres
npm run search:reindex

# Via Docker
docker compose -f docker-compose.dev.yml exec backend npm run search:reindex
```

### Accès direct (dev)

- **URL** : http://localhost:7700
- **Dashboard** : Accessible avec la master key

---

## Certbot (SSL - Production uniquement)

### Configuration

```yaml
certbot:
  image: certbot/certbot
  container_name: skillswap-certbot
  volumes:
    - certbot_www:/var/www/certbot:rw
    - certbot_conf:/etc/letsencrypt:rw
  entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

### Fonctionnement

1. **Volumes partagés** avec Nginx :
   - `certbot_www` : Challenge ACME (vérification de domaine)
   - `certbot_conf` : Certificats SSL générés

2. **Renouvellement automatique** :
   - Vérifie toutes les 12 heures
   - Renouvelle les certificats expirant dans < 30 jours

### Génération initiale des certificats

```bash
# Sur le VPS, première fois uniquement
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d skill-swap.fr \
  -d www.skill-swap.fr \
  --email admin@skill-swap.fr \
  --agree-tos \
  --no-eff-email
```

### Configuration Nginx pour SSL

```nginx
server {
    listen 443 ssl http2;
    server_name skill-swap.fr;

    ssl_certificate /etc/letsencrypt/live/skill-swap.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/skill-swap.fr/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:...;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;
}
```

!!! info "Développement"
    Certbot n'est **pas** utilisé en développement. Le HTTP simple suffit sur localhost.

---

## Commandes utiles

### Démarrer les services

```bash
# Développement
cd devops
docker compose -f docker-compose.dev.yml up -d

# Production
docker compose -f docker-compose.prod.yml up -d
```

### Voir les logs

```bash
# Tous les services
docker compose -f docker-compose.dev.yml logs -f

# Un service spécifique
docker compose -f docker-compose.dev.yml logs -f backend
```

### Reconstruire une image

```bash
docker compose -f docker-compose.dev.yml build backend
docker compose -f docker-compose.dev.yml up -d backend
```

### Exécuter une commande dans un conteneur

```bash
# Shell dans le backend
docker compose -f docker-compose.dev.yml exec backend sh

# Prisma migrate
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev

# Prisma seed
docker compose -f docker-compose.dev.yml exec backend npx prisma db seed
```

---

## Référence des variables d'environnement

Toutes les variables sont définies dans `devops/.env.docker` (copier depuis `.env.docker.example` ou `.env.prod.example`).

### Tableau récapitulatif

| Variable | Service | Requis | Description |
|----------|---------|:------:|-------------|
| **Base de données** |
| `POSTGRES_USER` | postgres | ✅ | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | postgres | ✅ | Mot de passe PostgreSQL |
| `POSTGRES_DB` | postgres | ✅ | Nom de la base |
| `DATABASE_PORT` | postgres | ❌ | Port externe (défaut: 5433) |
| `DATABASE_URL` | backend | ✅ | Connection string complète |
| **Backend** |
| `API_PORT` | backend | ❌ | Port interne (défaut: 3000) |
| `JWT_SECRET` | backend | ✅ | Secret JWT (min 32 chars) |
| `TOKEN_EXPIRE` | backend | ❌ | Expiration JWT en secondes (défaut: 3600) |
| `ALLOWED_ORIGIN` | backend | ✅ | URL CORS autorisée |
| **Frontend** |
| `CLIENT_PORT` | frontend | ❌ | Port interne (défaut: 3000) |
| `NEXT_PUBLIC_API_URL` | frontend | ✅ | URL API publique (client-side) |
| `NEXT_PUBLIC_SITE_URL` | frontend | ✅ | URL du site (SEO) |
| `INTERNAL_API_URL` | frontend | ✅ | URL API interne (SSR) |
| **Meilisearch** |
| `MEILI_MASTER_KEY` | meilisearch | ✅ | Clé maître (min 16 chars) |
| `MEILISEARCH_HOST` | backend | ✅ | URL Meilisearch interne |
| `MEILI_API_KEY` | backend | ✅ | Clé API (= master key) |
| **Dev uniquement** |
| `ADMINER_PORT` | adminer | ❌ | Port Adminer (défaut: 8080) |

### Fichiers de configuration

```bash
# Développement
cp devops/.env.docker.example devops/.env.docker

# Production
cp devops/.env.prod.example devops/.env.docker
```

### Génération de secrets sécurisés

```bash
# JWT Secret (32+ caractères)
openssl rand -base64 32

# Meilisearch Master Key (16+ caractères)
openssl rand -hex 16

# Mot de passe PostgreSQL
openssl rand -base64 24
```

---

## Voir aussi

- [Volumes](./volumes.md)
- [Networks](./networks.md)
- [Troubleshooting](./troubleshooting.md)
