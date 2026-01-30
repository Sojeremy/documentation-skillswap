# SkillSwap - Guide Docker

## Demarrage rapide (5 minutes)

### 1. Cloner le repo et aller a la racine du projet

```bash
git clone git@github.com:O-clock-Dublin/projet-skillswap.git
cd projet-skillswap
```

### 2. Lancer l'initialisation complete

```bash
npm run docker:init
```

Cette commande fait tout automatiquement :

- Cree le fichier `.env.docker` a partir du template
- Build les images Docker (frontend + backend)
- Demarre tous les services (PostgreSQL, Backend, Frontend, Nginx, Meilisearch, Adminer)
- Genere le client Prisma
- Execute les migrations de base de donnees
- Seed la base de donnees avec des donnees de test

### 3. Acceder a l'application

| Service     | URL                       | Description                    |
| ----------- | ------------------------- | ------------------------------ |
| Frontend    | http://localhost:8888     | Application Next.js (ISR)      |
| API         | http://localhost:8888/api | API Express                    |
| Meilisearch | http://localhost:7700     | Moteur de recherche            |
| Adminer     | http://localhost:8080     | Interface admin PostgreSQL     |
| PostgreSQL  | localhost:5433            | Base de donnees (port externe) |

---

## Recuperer les mises a jour (Git Pull)

Quand un collegue a pousse des modifications, suivez ces etapes :

### 1. Recuperer les changements

```bash
git pull origin dev
```

### 2. Verifier si `.env.docker.example` a change

```bash
git diff HEAD~1 devops/.env.docker.example
```

Si le fichier a change, vous devez mettre a jour votre `.env.docker` local :

```bash
# Option 1 : Reset complet (recommande si beaucoup de changements)
rm devops/.env.docker
npm run docker:setup

# Option 2 : Ajouter manuellement les nouvelles variables
# Comparez .env.docker.example avec votre .env.docker
```

### 3. Rebuild et redemarrer les containers

```bash
npm run docker:build
```

### 4. Si des migrations ont ete ajoutees

```bash
npm run docker:migrate
npm run docker:seed  # Optionnel : recharger les donnees de test
```

---

## Commandes disponibles

Toutes les commandes se lancent depuis la **racine du projet**.

### Commandes principales

| Commande              | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `npm run docker:init` | **Premiere installation** - Setup complet            |
| `npm run docker:up`   | Demarre les containers (sans rebuild)                |
| `npm run docker:down` | Arrete les containers et supprime les volumes        |
| `npm run docker:logs` | Affiche les logs en temps reel (Ctrl+C pour quitter) |

### Commandes de maintenance

| Commande               | Description                               |
| ---------------------- | ----------------------------------------- |
| `npm run docker:build` | Rebuild et redemarre les containers       |
| `npm run docker:clean` | Reset complet (supprime volumes + images) |
| `npm run docker:setup` | Cree `.env.docker` a partir du template   |

### Commandes Prisma (base de donnees)

| Commande                  | Description                       |
| ------------------------- | --------------------------------- |
| `npm run docker:generate` | Regenere le client Prisma         |
| `npm run docker:migrate`  | Execute les migrations en attente |
| `npm run docker:seed`     | Seed la base de donnees           |

---

## Workflow quotidien

### Matin : demarrer l'environnement

```bash
npm run docker:up
```

### Soir : arreter l'environnement

```bash
npm run docker:down
```

### Voir les logs en cas de probleme

```bash
npm run docker:logs
```

---

## Troubleshooting

### "Le container ne demarre pas"

```bash
# Voir les logs pour identifier l'erreur
npm run docker:logs

# Si le probleme persiste, reset complet
npm run docker:clean
npm run docker:init
```

### "J'ai des erreurs de permissions sur node_modules"

```bash
# Les node_modules sont dans des volumes Docker nommes
# Pour reset :
npm run docker:down
npm run docker:up
```

### "La base de donnees est corrompue"

```bash
# Supprime tout et recommence
npm run docker:clean
npm run docker:init
```

### "Je veux executer une commande dans un container"

```bash
# Ouvrir un shell dans le backend
docker compose -p skillswap -f devops/docker-compose.dev.yml exec backend sh

# Ouvrir un shell dans le frontend
docker compose -p skillswap -f devops/docker-compose.dev.yml exec frontend sh
```

---

## Configuration

### Variables d'environnement

Le fichier `devops/.env.docker` contient toutes les variables.
Il est cree automatiquement par `npm run docker:init`.

**Important** : Ce fichier n'est PAS versionne (contient des secrets).

#### Variables principales

| Variable               | Description                                        | Exemple                       |
| ---------------------- | -------------------------------------------------- | ----------------------------- |
| `POSTGRES_PASSWORD`    | Mot de passe PostgreSQL                            | `your_secure_password_here`   |
| `JWT_SECRET`           | Secret pour les tokens JWT (min 32 caracteres)     | `openssl rand -base64 32`     |
| `NEXT_PUBLIC_API_URL`  | URL publique de l'API (utilisee par le navigateur) | `http://localhost:8888`       |
| `INTERNAL_API_URL`     | URL interne de l'API (utilisee par le SSR/ISR)     | `http://backend:3000`         |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (pour SEO/sitemap)            | `http://localhost:8888`       |
| `MEILI_MASTER_KEY`     | Cle Meilisearch (min 16 caracteres)                | `dev_secret_key_min_16_chars` |

#### Variables critiques pour le SSR/ISR

```bash
# IMPORTANT : Ces variables sont necessaires pour que Next.js
# puisse appeler l'API depuis le reseau Docker (server-side)

# URL interne (reseau Docker) - utilisee par les Server Components
INTERNAL_API_URL=http://backend:3000

# URL publique - utilisee par les Client Components (navigateur)
NEXT_PUBLIC_API_URL=http://localhost:8888

# URL du site - utilisee pour le sitemap et les metadonnees SEO
NEXT_PUBLIC_SITE_URL=http://localhost:8888
```

Pour regenerer un JWT_SECRET securise :

```bash
openssl rand -base64 32
```

### Ports utilises

| Port | Service     |
| ---- | ----------- |
| 8888 | Nginx       |
| 8080 | Adminer     |
| 7700 | Meilisearch |
| 5433 | PostgreSQL  |

Si un port est deja utilise, modifiez-le dans `devops/.env.docker`.

---

## Architecture Docker

```
                         +-------------+
                         |   Nginx     |
                         | (port 8888) |
                         +------+------+
                                |
           +--------------------+--------------------+
           |                                         |
    +------v------+                          +-------v-------+
    |  Frontend   |   INTERNAL_API_URL       |    Backend    |
    |  (Next.js)  |------------------------->|   (Express)   |
    |    ISR      |  http://backend:3000     +-------+-------+
    +-------------+                                  |
                                    +----------------+----------------+
                                    |                                 |
                            +-------v-------+                 +-------v-------+
                            |  PostgreSQL   |                 |  Meilisearch  |
                            | (port 5433)   |                 | (port 7700)   |
                            +---------------+                 +---------------+
```

### Flux des requetes

1. **Client (navigateur)** → Nginx → Frontend ou Backend (selon `/api`)
2. **Server Components (ISR)** → Backend via `INTERNAL_API_URL` (reseau Docker interne)
3. **Backend** → PostgreSQL (donnees) + Meilisearch (recherche)

### Volumes Docker

Les `node_modules` et le cache Next.js sont stockes dans des **volumes Docker nommes**.
Cela evite les conflits de permissions entre le container et votre machine.

| Volume                            | Contenu               |
| --------------------------------- | --------------------- |
| `skillswap_postgres_data`         | Donnees PostgreSQL    |
| `skillswap_meilisearch_data`      | Index Meilisearch     |
| `skillswap_backend_node_modules`  | Dependencies backend  |
| `skillswap_frontend_node_modules` | Dependencies frontend |
| `skillswap_frontend_next`         | Cache Next.js (.next) |

---

## ISR et SEO

Le frontend utilise **ISR (Incremental Static Regeneration)** pour le SEO :

- Les pages sont pre-rendues cote serveur
- Les donnees sont revalidees toutes les heures (`revalidate = 3600`)
- Les metadonnees (title, description, OpenGraph) sont generees dynamiquement

### Pages avec ISR

| Page           | Revalidation | Description                               |
| -------------- | ------------ | ----------------------------------------- |
| `/` (landing)  | 1 heure      | Membres et categories pre-fetches         |
| `/profil/[id]` | 1 heure      | Metadonnees dynamiques pour chaque profil |
| `/sitemap.xml` | 1 heure      | Sitemap dynamique avec tous les profils   |

### Verifier que l'ISR fonctionne

```bash
# Verifier que le contenu est pre-rendu (pas de skeleton)
curl -s http://localhost:8888 | grep -o "Membres de la communauté"

# Verifier les metadonnees d'un profil
curl -s http://localhost:8888/profil/1 | grep -o "<title>.*</title>"

# Verifier le sitemap
curl -s http://localhost:8888/sitemap.xml
```

---

## Structure des fichiers

```
devops/
├── backend/
│   ├── Dockerfile.dev       # Image dev avec hot-reload
│   └── Dockerfile.prod      # Image prod optimisee
├── frontend/
│   ├── Dockerfile.dev       # Image dev avec hot-reload
│   └── Dockerfile.prod      # Image prod optimisee
├── nginx/
│   ├── dev.conf             # Config nginx pour dev
│   └── prod.conf            # Config nginx pour prod
├── docker-compose.dev.yml   # Stack de developpement
├── docker-compose.prod.yml  # Stack de production
├── .env.docker.example      # Template des variables
└── .env.docker              # Variables (non versionne)
```
