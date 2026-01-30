# Troubleshooting Docker

Guide de résolution des problèmes courants avec Docker.

## Diagnostic rapide

```bash
# Statut des conteneurs
docker compose -f docker-compose.dev.yml ps

# Logs de tous les services
docker compose -f docker-compose.dev.yml logs --tail=50

# Logs d'un service spécifique
docker compose -f docker-compose.dev.yml logs -f backend
```

---

## Problèmes de démarrage

### Le backend ne démarre pas

**Symptôme** : Le backend redémarre en boucle

**Causes possibles** :

1. **PostgreSQL pas prêt**

```bash
# Vérifier le healthcheck
docker compose -f docker-compose.dev.yml ps postgres
# Doit afficher "healthy"
```

2. **Variables d'environnement manquantes**

```bash
# Vérifier .env.docker
cat devops/.env.docker

# Variables requises
DATABASE_URL=postgresql://user:pass@postgres:5432/skillswap
JWT_SECRET=...
```

3. **Erreur Prisma**

```bash
# Régénérer le client
docker compose -f docker-compose.dev.yml exec backend npx prisma generate

# Appliquer les migrations
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev
```

### Le frontend ne démarre pas

**Symptôme** : Erreur de build ou page blanche

```bash
# Reconstruire l'image
docker compose -f docker-compose.dev.yml build --no-cache frontend
docker compose -f docker-compose.dev.yml up -d frontend
```

### PostgreSQL ne démarre pas

**Symptôme** : `postgres exited with code 1`

**Solution** :

```bash
# Vérifier les logs
docker compose -f docker-compose.dev.yml logs postgres

# Si corruption des données
docker volume rm skillswap-dev_postgres_data
docker compose -f docker-compose.dev.yml up -d postgres
# ATTENTION : Perte de données !
```

---

## Problèmes de connexion

### Impossible d'accéder à localhost:8888

**Checklist** :

```bash
# 1. Nginx est-il démarré ?
docker compose -f docker-compose.dev.yml ps nginx

# 2. Port occupé ?
lsof -i :8888

# 3. Vérifier la config nginx
docker compose -f docker-compose.dev.yml exec nginx cat /etc/nginx/conf.d/default.conf
```

### Erreur CORS

**Symptôme** : `Access-Control-Allow-Origin` error

**Solution** : Vérifier que toutes les requêtes passent par nginx (même origine).

```typescript
// ❌ Mauvais (CORS)
fetch('http://localhost:3000/api/...')

// ✅ Bon (même origine via nginx)
fetch('/api/...')
```

### Backend ne répond pas

**Symptôme** : `502 Bad Gateway`

```bash
# Le backend est-il actif ?
docker compose -f docker-compose.dev.yml ps backend

# Teste la connexion interne
docker compose -f docker-compose.dev.yml exec nginx curl http://backend:3000/api/v1/health
```

---

## Problèmes de performance

### Build très lent

**Solution** : Optimiser le contexte de build

```bash
# Vérifier la taille du contexte
du -sh backend/
du -sh frontend/

# Vérifier .dockerignore
cat backend/.dockerignore
# Doit contenir : node_modules, .git, dist, etc.
```

### Hot reload ne fonctionne pas (frontend)

**Solution** :

```bash
# Vérifier que le volume est monté
docker compose -f docker-compose.dev.yml exec frontend ls -la /app

# Redémarrer avec reconstruction du cache
docker volume rm skillswap-dev_frontend_next
docker compose -f docker-compose.dev.yml up -d frontend
```

### Changements backend pas pris en compte

**Vérifier nodemon** :

```bash
# Logs du backend (doit afficher "restarting due to changes")
docker compose -f docker-compose.dev.yml logs -f backend
```

---

## Problèmes de base de données

### Erreur de migration Prisma

```bash
# Voir l'état des migrations
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate status

# Réinitialiser (ATTENTION : perte de données)
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate reset
```

### Données corrompues

```bash
# Backup avant tout
docker compose -f docker-compose.dev.yml exec postgres \
  pg_dump -U skillswap skillswap > backup_$(date +%Y%m%d).sql

# Réinitialiser
docker volume rm skillswap-dev_postgres_data
docker compose -f docker-compose.dev.yml up -d postgres
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev
docker compose -f docker-compose.dev.yml exec backend npx prisma db seed
```

### Connexion refusée à PostgreSQL

```bash
# Tester depuis le backend
docker compose -f docker-compose.dev.yml exec backend \
  npx prisma db execute --stdin <<< "SELECT 1"

# Vérifier les credentials
docker compose -f docker-compose.dev.yml exec postgres \
  psql -U skillswap -c "SELECT current_user"
```

---

## Problèmes de mémoire/espace

### Plus d'espace disque

```bash
# Voir l'utilisation Docker
docker system df

# Nettoyer les images non utilisées
docker image prune -a

# Nettoyer tout (ATTENTION)
docker system prune -a --volumes
```

### Conteneur OOM (Out of Memory)

```bash
# Vérifier les limites
docker stats

# Ajouter des limites dans docker-compose
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
```

---

## Commandes de récupération

### Tout redémarrer

```bash
cd devops
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d
```

### Reconstruction complète

```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up -d
```

### Reset complet (DANGER)

```bash
# Supprime TOUTES les données
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml exec backend npx prisma migrate dev
docker compose -f docker-compose.dev.yml exec backend npx prisma db seed
```

---

## Logs et debugging

### Suivre les logs en temps réel

```bash
# Tous les services
docker compose -f docker-compose.dev.yml logs -f

# Un service avec timestamp
docker compose -f docker-compose.dev.yml logs -f -t backend
```

### Shell dans un conteneur

```bash
# Backend (Node.js)
docker compose -f docker-compose.dev.yml exec backend sh

# PostgreSQL
docker compose -f docker-compose.dev.yml exec postgres psql -U skillswap

# Nginx
docker compose -f docker-compose.dev.yml exec nginx sh
```

### Inspecter un conteneur

```bash
docker inspect skillswap-postgres
```

---

## Voir aussi

- [Services](./services.md)
- [Volumes](./volumes.md)
- [Networks](./networks.md)
