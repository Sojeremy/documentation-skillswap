# DevOps Quickref — SkillSwap (DEV + PROD)

> Usage : à imprimer ou laisser ouvert sur un 2e écran le jour de la soutenance.
> Couvre l'environnement dev local Docker **et** l'environnement de production sur VPS OVH.

---

# Partie 1 — Environnement DEV LOCAL (Docker)

## URLs d'accès

| Service | URL | Credentials |
|---|---|---|
| Frontend (Next.js) | http://localhost:8888 | — |
| API health check | http://localhost:8888/api/v1/health | — |
| Adminer (UI BDD) | http://localhost:8080 | Server: `postgres` · User: `skillswap` · Pass: voir `devops/.env.docker` · BDD: `skillswap` |
| Meilisearch | http://localhost:7700 | Master key: voir `devops/.env.docker` |
| Postgres (host direct) | localhost:5433 | User: `skillswap` · BDD: `skillswap` |

⚠️ Le README dit `/api/health`, le vrai endpoint est `/api/v1/health` (port 8888 + préfixe v1). Écart doc/code à mentionner dans la doc.

Pour récupérer les secrets BDD/Meilisearch :
```bash
grep -E "POSTGRES_PASSWORD|MEILI_MASTER_KEY" devops/.env.docker
```

## Commandes Docker dev

```bash
# Premier lancement (cold start)
cd ~/Desktop/SkillSwap/projet-skillswap
npm run docker:init

# Si 502 après le init : le backend a crashé avant prisma generate, restart
docker compose -p skillswap -f devops/docker-compose.dev.yml restart backend

# Lancement quotidien (warm start, après init déjà fait)
npm run docker:up

# Stop sans détruire les volumes (recommandé)
docker compose -p skillswap -f devops/docker-compose.dev.yml stop

# Down avec destruction des volumes ⚠️ EFFACE LA BDD
npm run docker:down

# Reset total (containers + volumes + images locales)
npm run docker:clean

# Logs (tous services)
npm run docker:logs

# Logs d'un service
docker logs skillswap-backend-1 --tail 50
docker logs skillswap-frontend-1 --tail 50

# Status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Health check
curl -s http://localhost:8888/api/v1/health
```

## Seed de démonstration (41 users réalistes)

Le seed standard (`docker:seed`) ne crée que rôles + catégories + skills. Pour avoir des **users de test** avec mots de passe :

```bash
docker compose -p skillswap -f devops/docker-compose.dev.yml exec backend \
  npx ts-node src/models/seeding.dev.ts
```

Ça crée 41 utilisateurs (Alice, Bob, Claire, David…), 16 conversations, des messages, follows, ratings. Tous les users ont le mot de passe `password123` (hashé argon2).

Login de test : `alice.dupont@example.com` / `password123`

## Accès BDD locale

```bash
# psql interactif
docker compose -p skillswap -f devops/docker-compose.dev.yml exec postgres \
  psql -U skillswap -d skillswap

# Requête one-shot
docker compose -p skillswap -f devops/docker-compose.dev.yml exec postgres \
  psql -U skillswap -d skillswap -c 'SELECT COUNT(*) FROM "user";'
```

⚠️ Les tables sont en **snake_case lowercase** (`user`, `skill`, `category`, `evaluation`, `user_has_skill`, etc.). `user` est un mot réservé Postgres → toujours mettre `"user"` entre guillemets dans les requêtes SQL directes.

## Lancer les tests dans les containers

```bash
# Backend (5/7 specs plantent à cause d'un bug seeding tests, dette technique reconnue)
docker compose -p skillswap -f devops/docker-compose.dev.yml exec backend \
  node --test --experimental-test-coverage ./src/**/*.spec.test.ts 2>&1 | tail -50

# Frontend prod (le repo prod n'a PAS test:coverage installé)
# Le repo doc enrichi a Vitest, le repo prod non.
```

---

# Partie 2 — Environnement PROD (VPS OVH)

## Connexion SSH

Alias configuré dans `~/.ssh/config` : pour récupérer awk '/^# SkillSwap prod VPS/,/^$/' ~/.ssh/config   ou    grep -A5 "skillswap-vps" ~/.ssh/config
```bash
ssh skillswap-vps
```

Détails (pour mémoire) :
- IP : `137.74.114.18`
- User : `ubuntu`
- Hostname VPS : `vps-2b6c4aed`
- Path projet : `/home/ubuntu/projet-skillswap/`
- Clé SSH : `~/.ssh/id_ed25519`

## URLs publiques

| URL | Description |
|---|---|
| https://skill-swap.fr | Frontend (Next.js via nginx + Let's Encrypt) |
| https://skill-swap.fr/api/v1/health | API health check |

## Vérifier l'état de la prod

```bash
# Containers prod
ssh skillswap-vps "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

# Système
ssh skillswap-vps "df -h / && uptime"

# Logs des derniers déploiements
ssh skillswap-vps "cd ~/projet-skillswap && git log --oneline -10"

# Logs backend prod
ssh skillswap-vps "docker logs skillswap-backend-1 --tail 30"

# Health check
curl -s https://skill-swap.fr/api/v1/health
```

## Procédure de déploiement applicatif

Le déploiement est **automatique sur push main** via le workflow `.github/workflows/deploy-prod.yml` (utilise `appleboy/ssh-action`).

Sur le VPS, le script exécuté lors du déploiement :
```bash
cd /home/ubuntu/projet-skillswap
git fetch --all --prune
git reset --hard origin/main
docker compose -p skillswap -f devops/docker-compose.prod.yml build --no-cache backend
docker compose -p skillswap -f devops/docker-compose.prod.yml up -d backend
docker compose -p skillswap -f devops/docker-compose.prod.yml build --no-cache frontend
docker compose -p skillswap -f devops/docker-compose.prod.yml up -d frontend
```

Pour forcer un déploiement manuel : déclencher le workflow via GitHub Actions UI (`workflow_dispatch`).

## Accès BDD prod

**Pas d'Adminer en prod** (bonne pratique sécu). Trois options pour requêter la BDD prod :

### Option 1 — psql one-shot via SSH (le plus rapide)

```bash
ssh skillswap-vps 'docker exec skillswap-postgres-prod psql -U skillswap -d skillswap -c "SELECT COUNT(*) FROM \"user\";"'
```

### Option 2 — Session psql interactive (recommandé pour démos)

```bash
ssh -t skillswap-vps "docker exec -it skillswap-postgres-prod psql -U skillswap -d skillswap"
```

Tu te retrouves dans une session `skillswap=#` interactive sur la prod. Tape tes requêtes, vois les résultats. Tape `\q` ou `exit` pour sortir.

### Option 3 — Adminer temporaire via tunnel SSH (le plus visuel)

À lancer 5-10 min avant la démo, à supprimer après.

```bash
# 1. Trouver le nom du réseau Docker prod
ssh skillswap-vps "docker network ls | grep skillswap"

# 2. Lancer un Adminer temporaire dans le réseau prod
# (remplace SKILLSWAP_NET par le vrai nom retourné ci-dessus)
ssh skillswap-vps "docker run -d --rm --name adminer-temp \
  --network SKILLSWAP_NET \
  -p 127.0.0.1:8080:8080 \
  adminer"

# 3. Ouvrir un tunnel SSH local (autre terminal, à laisser ouvert pendant la démo)
ssh -L 8081:127.0.0.1:8080 skillswap-vps -N

# 4. Dans ton navigateur : http://localhost:8081
#    Server: skillswap-postgres-prod · User: skillswap · BDD: skillswap
#    Mot de passe : à récupérer via :
#    ssh skillswap-vps "grep '^POSTGRES_PASSWORD' ~/projet-skillswap/devops/.env.docker"

# 5. Après la démo, tuer le container
ssh skillswap-vps "docker rm -f adminer-temp"
```

Le `127.0.0.1:8080` côté VPS empêche que Adminer soit accessible depuis l'extérieur — il n'est joignable que via ton tunnel SSH.

## Volumétrie prod actuelle

À partir des dernières mesures (mai 2026) :

| Donnée | Volume |
|---|---|
| Utilisateurs | 23 |
| Skills | 28 |
| Catégories | 8 |
| Conversations | 17 |
| Messages | 57 |
| Évaluations | 5 |
| Follows | 32 |

À actualiser le jour J avec :
```bash
ssh skillswap-vps 'docker exec skillswap-postgres-prod psql -U skillswap -d skillswap -c "SELECT \
  (SELECT COUNT(*) FROM \"user\") AS users, \
  (SELECT COUNT(*) FROM message) AS messages, \
  (SELECT COUNT(*) FROM conversation) AS conversations, \
  (SELECT COUNT(*) FROM follow) AS follows;"'
```

## Backup BDD prod (snapshot avant démo)

```bash
ssh skillswap-vps "docker exec -t skillswap-postgres-prod pg_dump -U skillswap skillswap" \
  > ~/skillswap-prod-backup-$(date +%Y%m%d-%H%M).sql
```

À garder en sécurité, à ne jamais committer.

---

# Partie 3 — Procédure « démo jury »

À chronométrer et tester avant J-1.

## Préparation (5-10 min avant la soutenance)

```bash
# 1. Vérifier que la prod répond
curl -s https://skill-swap.fr/api/v1/health
# → {"status":"ok"}

# 2. Démarrer l'env local (au cas où)
cd ~/Desktop/SkillSwap/projet-skillswap
npm run docker:up
sleep 30
curl -s http://localhost:8888/api/v1/health
# → {"status":"ok"}

# 3. (Optionnel) Lancer Adminer temporaire en prod pour démo SQL visuelle
ssh skillswap-vps "docker run -d --rm --name adminer-temp \
  --network skillswap_default \
  -p 127.0.0.1:8080:8080 \
  adminer"
ssh -L 8081:127.0.0.1:8080 skillswap-vps -N &  # En arrière-plan

# 4. Ouvrir les onglets navigateur
xdg-open https://skill-swap.fr &
xdg-open http://localhost:8081 &  # Adminer prod via tunnel
```

## Pendant la démo

- **Démo applicative** : sur https://skill-swap.fr (vraie prod)
- **Démo SQL** : via psql interactif sur prod ou Adminer tunneled
- **Code source** : VS Code ouvert sur ton repo doc avec la doc Arc42

## Après la démo

```bash
# Tuer le tunnel SSH (si lancé)
pkill -f "ssh -L 8081"

# Tuer Adminer temporaire en prod
ssh skillswap-vps "docker rm -f adminer-temp"
```

---

# Partie 4 — Pièges connus à mémoriser

1. **Endpoint health** : `/api/v1/health`, pas `/api/health` (le README est faux)
2. **`docker:init`** non idempotent : si le backend crash après `init`, faire `restart backend` manuellement
3. **`docker:down`** avec `-v` détruit les volumes. Préférer `stop` pour conserver les données
4. **Premier compile Next.js** peut prendre 30-90s. Attendre avant de tester le frontend
5. **Tables BDD en snake_case** : `"user"` (avec quotes), `skill`, `evaluation` (pas `rating`), `user_has_skill`
6. **Modèle Prisma `Rating` mappé à la table `evaluation`** : naming inconsistant à mentionner comme dette technique
7. **Le repo doc et le repo prod sont différents** : le repo doc a des ajouts personnels (Storybook, Vitest, Playwright, TypeDoc) absents en prod
8. **Nginx prod marqué unhealthy** mais le site répond. Healthcheck mal calibré, pas un vrai problème

---

# Partie 5 — Restauration rapide après crash

## Backend dev local crash après `init`

```bash
docker compose -p skillswap -f devops/docker-compose.dev.yml restart backend
sleep 10
curl -s http://localhost:8888/api/v1/health
# Si erreur "Cannot find module 'prisma/generated/...'"
npm run docker:generate
docker compose -p skillswap -f devops/docker-compose.dev.yml restart backend
```

## Tunnel SSH bloqué

```bash
# Tuer tous les tunnels SSH actifs
pkill -f "ssh -L"
# Et relancer
ssh -L 8081:127.0.0.1:8080 skillswap-vps -N &
```

## VPS prod ne répond plus (panique mode)

```bash
# Vérifier les containers
ssh skillswap-vps "docker ps -a"

# Si un container est down :
ssh skillswap-vps "docker compose -p skillswap -f ~/projet-skillswap/devops/docker-compose.prod.yml up -d"

# Si problème plus profond, voir les logs :
ssh skillswap-vps "docker logs skillswap-backend-1 --tail 50"
ssh skillswap-vps "docker logs skillswap-nginx-prod --tail 30"
```

⚠️ **Ne jamais redéployer en prod 30 min avant la soutenance**. Si la prod est cassée, présente sur le local Docker et explique honnêtement « la prod a un incident, voici l'environnement de dev qui fonctionne ».