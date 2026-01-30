# CI/CD Pipeline

## Vue d'ensemble

Le projet SkillSwap utilise **GitHub Actions** pour automatiser le déploiement en production. Le pipeline se déclenche automatiquement lors d'un push sur la branche `main`.

---

## Workflow de déploiement

### Fichier de configuration

**Emplacement** : `.github/workflows/deploy-prod.yml`

### Déclencheurs

| Événement | Description |
|-----------|-------------|
| `push` sur `main` | Déploiement automatique à chaque merge |
| `workflow_dispatch` | Déclenchement manuel depuis l'interface GitHub |

### Concurrence

```yaml
concurrency:
  group: deploy-prod
  cancel-in-progress: true
```

- Un seul déploiement peut s'exécuter à la fois
- Les déploiements en attente sont annulés si un nouveau push arrive

---

## Étapes du déploiement

### 1. Connexion SSH au VPS

Le workflow utilise l'action `appleboy/ssh-action@v1.0.3` pour se connecter au serveur de production.

### 2. Mise à jour du code

```bash
git fetch --all --prune
git reset --hard origin/main
```

- Récupère les dernières modifications
- Force la synchronisation avec `origin/main`

### 3. Rebuild et redémarrage du Backend

```bash
docker compose -p skillswap -f devops/docker-compose.prod.yml build --no-cache backend
docker compose -p skillswap -f devops/docker-compose.prod.yml up -d backend
```

- Build sans cache pour garantir les dernières modifications
- Redémarrage en mode détaché

### 4. Rebuild et redémarrage du Frontend

```bash
docker compose -p skillswap -f devops/docker-compose.prod.yml build --no-cache frontend
docker compose -p skillswap -f devops/docker-compose.prod.yml up -d frontend
```

### 5. Vérification

```bash
docker compose -p skillswap -f devops/docker-compose.prod.yml ps
docker compose -p skillswap -f devops/docker-compose.prod.yml logs --tail=80 backend frontend
```

- Affiche le statut des containers
- Affiche les 80 dernières lignes de logs

---

## Secrets GitHub requis

Ces secrets doivent être configurés dans **Settings > Secrets and variables > Actions** du repository GitHub :

| Secret | Description | Exemple |
|--------|-------------|---------|
| `VPS_HOST` | Adresse IP du serveur | `123.45.67.89` |
| `VPS_USER` | Utilisateur SSH | `deploy` |
| `VPS_SSH_KEY` | Clé privée SSH | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_PORT` | Port SSH | `22` |
| `VPS_PROJECT_PATH` | Chemin du projet sur le VPS | `/var/www/skillswap` |

### Génération de la clé SSH

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Copier la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github_deploy.pub user@vps-ip

# La clé privée (~/.ssh/github_deploy) doit être ajoutée comme secret VPS_SSH_KEY
```

---

## Diagramme du flux

```mermaid
sequenceDiagram
    participant Dev as Développeur
    participant GH as GitHub
    participant GA as GitHub Actions
    participant VPS as Serveur VPS

    Dev->>GH: git push origin main
    GH->>GA: Déclenche workflow
    GA->>VPS: Connexion SSH
    VPS->>VPS: git fetch && git reset --hard
    VPS->>VPS: docker compose build backend
    VPS->>VPS: docker compose up -d backend
    VPS->>VPS: docker compose build frontend
    VPS->>VPS: docker compose up -d frontend
    VPS->>GA: Statut des containers + logs
    GA->>GH: Résultat du workflow
```

---

## Déploiement manuel

### Depuis l'interface GitHub

1. Aller dans **Actions** > **Deploy PROD to VPS (Docker)**
2. Cliquer sur **Run workflow**
3. Sélectionner la branche `main`
4. Cliquer sur **Run workflow**

### Depuis le terminal (sur le VPS)

```bash
cd /var/www/skillswap  # ou votre VPS_PROJECT_PATH

# Mise à jour du code
git fetch --all --prune
git reset --hard origin/main

# Rebuild complet
docker compose -p skillswap -f devops/docker-compose.prod.yml build --no-cache
docker compose -p skillswap -f devops/docker-compose.prod.yml up -d

# Vérification
docker compose -p skillswap -f devops/docker-compose.prod.yml ps
```

---

## Troubleshooting

### Le déploiement échoue à la connexion SSH

1. Vérifier que la clé SSH est correctement configurée dans les secrets
2. Vérifier que l'utilisateur a les droits d'accès au projet
3. Vérifier que le port SSH est correct

### Les containers ne démarrent pas

```bash
# Sur le VPS, vérifier les logs
docker compose -p skillswap -f devops/docker-compose.prod.yml logs backend
docker compose -p skillswap -f devops/docker-compose.prod.yml logs frontend

# Vérifier l'espace disque
df -h

# Nettoyer les images Docker inutilisées
docker system prune -a
```

### Le frontend ne se connecte pas au backend

Vérifier que les variables d'environnement sont correctes :
- `NEXT_PUBLIC_API_URL` doit pointer vers l'URL publique
- `INTERNAL_API_URL` doit pointer vers `http://backend:3000`

---

## Bonnes pratiques

1. **Toujours tester en local** avant de push sur `main`
2. **Vérifier les logs** après chaque déploiement
3. **Ne jamais commiter de secrets** dans le code
4. **Utiliser des tags** pour les releases importantes

---

## Navigation

| Précédent | Suivant |
|-----------|---------|
| [← Volumes](./volumes.md) | [Index Infrastructure →](./index.md) |
