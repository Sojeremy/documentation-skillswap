# Volumes Docker

Les volumes Docker persistent les données entre les redémarrages de conteneurs.

## Volumes déclarés

### Développement

```yaml
volumes:
  postgres_data:          # Données PostgreSQL
  backend_node_modules:   # Dépendances backend
  frontend_node_modules:  # Dépendances frontend
  frontend_next:          # Cache Next.js
```

### Production

```yaml
volumes:
  postgres_data:          # Données PostgreSQL
  meilisearch_data:       # Index de recherche Meilisearch
  avatars_data:           # Images de profil utilisateurs
  certbot_www:            # Challenge ACME pour SSL
  certbot_conf:           # Certificats Let's Encrypt
```

## Détail des volumes

### postgres_data

| Propriété | Valeur |
|-----------|--------|
| Chemin conteneur | `/var/lib/postgresql/data` |
| Persistance | **Critique** - Contient toutes les données |
| Backup | Recommandé |
| Environnement | Dev + Prod |

```yaml
postgres:
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

!!! danger "Ne jamais supprimer"
    La suppression de ce volume entraîne la **perte de toutes les données**.

### backend_node_modules

| Propriété | Valeur |
|-----------|--------|
| Chemin conteneur | `/app/node_modules` |
| Persistance | Utile pour accélérer les builds |
| Backup | Non nécessaire |
| Environnement | Dev uniquement |

```yaml
backend:
  volumes:
    - ../backend:/app
    - backend_node_modules:/app/node_modules
```

**Pourquoi ?** Évite que le montage du code source écrase les node_modules installés dans l'image.

### frontend_node_modules

| Propriété | Valeur |
|-----------|--------|
| Chemin conteneur | `/app/node_modules` |
| Persistance | Utile pour accélérer les builds |
| Backup | Non nécessaire |
| Environnement | Dev uniquement |

### frontend_next

| Propriété | Valeur |
|-----------|--------|
| Chemin conteneur | `/app/.next` |
| Persistance | Cache de build Next.js |
| Backup | Non nécessaire |
| Environnement | Dev uniquement |

**Pourquoi ?** Accélère le Hot Module Replacement en persistant le cache de compilation.

### meilisearch_data (Prod + Dev)

| Propriété | Valeur |
|-----------|--------|
| Chemin conteneur | `/meili_data` |
| Persistance | **Importante** - Index de recherche |
| Backup | Recommandé (peut être reconstruit) |
| Environnement | Dev + Prod |

```yaml
meilisearch:
  volumes:
    - meilisearch_data:/meili_data
```

**Reconstruction** : En cas de perte, exécuter `npm run search:reindex` pour reconstruire l'index.

### avatars_data (Prod uniquement)

| Propriété | Valeur |
|-----------|--------|
| Chemin conteneur | `/app/public/avatars` |
| Persistance | **Critique** - Images utilisateurs |
| Backup | Recommandé |
| Environnement | Prod uniquement |

```yaml
backend:
  volumes:
    - avatars_data:/app/public/avatars
```

!!! warning "Production uniquement"
    En développement, les avatars sont stockés dans le bind mount du code source.

### certbot_www (Prod uniquement)

| Propriété | Valeur |
|-----------|--------|
| Chemin conteneur | `/var/www/certbot` |
| Persistance | Temporaire (challenges ACME) |
| Backup | Non nécessaire |
| Environnement | Prod uniquement |

```yaml
nginx:
  volumes:
    - certbot_www:/var/www/certbot:ro
certbot:
  volumes:
    - certbot_www:/var/www/certbot:rw
```

**Usage** : Partagé entre Nginx (lecture) et Certbot (écriture) pour la validation de domaine.

### certbot_conf (Prod uniquement)

| Propriété | Valeur |
|-----------|--------|
| Chemin conteneur | `/etc/letsencrypt` |
| Persistance | **Critique** - Certificats SSL |
| Backup | Fortement recommandé |
| Environnement | Prod uniquement |

```yaml
nginx:
  volumes:
    - certbot_conf:/etc/letsencrypt:ro
certbot:
  volumes:
    - certbot_conf:/etc/letsencrypt:rw
```

!!! danger "Ne jamais supprimer"
    La perte de ce volume nécessite de régénérer les certificats SSL.

## Bind mounts (développement)

En plus des volumes nommés, le développement utilise des bind mounts pour le code source :

```yaml
backend:
  volumes:
    - ../backend:/app                    # Bind mount (code source)
    - backend_node_modules:/app/node_modules  # Volume nommé
```

| Type | Avantage | Inconvénient |
|------|----------|--------------|
| Bind mount | Code live-reload | Performance sur Windows/Mac |
| Volume nommé | Performance | Pas de sync avec host |

## Gestion des volumes

### Lister les volumes

```bash
docker volume ls
```

### Inspecter un volume

```bash
docker volume inspect skillswap-dev_postgres_data
```

### Supprimer les volumes inutilisés

```bash
# Attention : supprime les données !
docker volume prune
```

### Sauvegarder PostgreSQL

```bash
# Backup
docker compose -f docker-compose.dev.yml exec postgres \
  pg_dump -U skillswap skillswap > backup.sql

# Restore
docker compose -f docker-compose.dev.yml exec -T postgres \
  psql -U skillswap skillswap < backup.sql
```

### Réinitialiser les node_modules

Si les dépendances sont corrompues :

```bash
# Supprimer le volume
docker volume rm skillswap-dev_backend_node_modules

# Reconstruire
docker compose -f docker-compose.dev.yml build backend
docker compose -f docker-compose.dev.yml up -d backend
```

## Espace disque

### Vérifier l'utilisation

```bash
docker system df -v
```

### Nettoyer

```bash
# Conteneurs arrêtés, images non utilisées, volumes orphelins
docker system prune --volumes

# ATTENTION : supprime TOUT
docker system prune -a --volumes
```

## Meilleures pratiques

| Pratique | Description |
|----------|-------------|
| Volumes nommés | Toujours préférer aux volumes anonymes |
| Backup régulier | Sauvegarder `postgres_data` quotidiennement en prod |
| .dockerignore | Exclure node_modules du contexte de build |
| Séparation dev/prod | Moins de volumes en production |

## Voir aussi

- [Services](./services.md)
- [Networks](./networks.md)
- [Troubleshooting](./troubleshooting.md)
