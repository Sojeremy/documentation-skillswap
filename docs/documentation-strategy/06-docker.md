# Documentation Docker & Infrastructure

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 22 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| Structure `/docs/docs/infrastructure/` | ✅ Terminé | Dossier créé avec tous les fichiers |
| index.md (overview) | ✅ Terminé | Vue d'ensemble complète |
| services.md | ✅ Terminé | 6 services documentés |
| networks.md | ✅ Terminé | Configuration réseau Docker |
| volumes.md | ✅ Terminé | Persistence et backups |
| troubleshooting.md | ✅ Terminé | Problèmes courants et solutions |
| Arc42 §7 (Deployment) | ✅ Terminé | Intégré dans 07-deployment.md |
| Intégration MkDocs | ✅ Terminé | Navigation complète |

**Progression globale** : ✅ **100%**

---

## Objectif

Documenter l'architecture Docker de SkillSwap pour :

- Visualiser les services et leurs interconnexions
- Faciliter le déploiement et le debugging
- Intégrer dans Arc42 section §7 (Deployment View)
- Servir de référence pour l'équipe DevOps

---

## Architecture actuelle

### Services Docker Compose

| Service | Image | Port interne | Port exposé | Rôle |
| ------- | ----- | ------------ | ----------- | ---- |
| **nginx** | nginx:alpine | 80 | 80, 443 | Reverse proxy, SSL |
| **frontend** | node:20-alpine | 3001 | - | Next.js SSR |
| **backend** | node:20-alpine | 3000 | - | API Express |
| **postgres** | postgres:16-alpine | 5432 | 5433 (dev) | Base de données |
| **meilisearch** | getmeili/meilisearch:v1.6 | 7700 | 7700 (dev) | Moteur recherche |
| **adminer** | adminer:latest | 8080 | 8080 (dev) | Admin BDD |

### Diagramme réseau

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                        Réseau Docker                        │
│                                                             │
│  ┌─────────┐     ┌──────────┐                              │
│  │  nginx  │────►│ frontend │ :3001                        │
│  └────┬────┘     └──────────┘                              │
│       │                                                     │
│       │          ┌──────────┐                              │
│       └─────────►│ backend  │ :3000                        │
│                  └────┬─────┘                              │
│                       │                                     │
│       ┌───────────────┼───────────────┐                    │
│       ▼               ▼               ▼                    │
│  ┌──────────┐  ┌────────────┐  ┌─────────┐                │
│  │ postgres │  │ meilisearch│  │ adminer │                │
│  │   :5432  │  │   :7700    │  │  :8080  │                │
│  └──────────┘  └────────────┘  └─────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## Outil de visualisation : docker-compose-viz

### Installation et utilisation

```bash
# Génération PNG
docker run --rm -it \
  -v $(pwd)/devops:/input:ro \
  -v $(pwd)/docs/docs/infrastructure:/output \
  pmsipilot/docker-compose-viz \
  render -m image /input/docker-compose.dev.yml \
  -o /output/docker-architecture.png

# Génération SVG (meilleure qualité)
docker run --rm -it \
  -v $(pwd)/devops:/input:ro \
  -v $(pwd)/docs/docs/infrastructure:/output \
  pmsipilot/docker-compose-viz \
  render -m image /input/docker-compose.dev.yml \
  -o /output/docker-architecture.svg --force
```

### Alternative : Graphviz manuel

```bash
# Si docker-compose-viz pose problème
docker run --rm -v $(pwd):/data \
  mingrammer/diagrams:latest python /data/scripts/docker-diagram.py
```

---

## Fichiers Docker existants

| Fichier | Emplacement | Contenu |
| ------- | ----------- | ------- |
| `docker-compose.dev.yml` | `/devops/` | Config développement (hot reload) |
| `docker-compose.prod.yml` | `/devops/` | Config production (optimisé) |
| `Dockerfile.frontend` | `/frontend/` | Image Next.js |
| `Dockerfile.backend` | `/backend/` | Image Express |
| `nginx.conf` | `/devops/nginx/` | Config reverse proxy |

---

## Structure cible dans `/docs/docs/`

```plaintext
docs/docs/
├── infrastructure/
│   ├── index.md                  # Overview infrastructure
│   ├── docker-architecture.png   # Graphe généré (dev)
│   ├── docker-architecture.svg   # Version vectorielle
│   ├── docker-prod.png           # Graphe production
│   ├── services.md               # Détail de chaque service
│   ├── networks.md               # Configuration réseau
│   ├── volumes.md                # Volumes et persistence
│   └── troubleshooting.md        # Problèmes courants
│
└── arc42/
    └── 07-deployment.md          # Intègre les diagrammes
```

---

## Checklist : Ce qu'il faut documenter

### Pour chaque service

- [ ] **Nom** : postgres, backend, etc.
- [ ] **Image** : Version exacte (postgres:16-alpine)
- [ ] **Ports** : Interne et exposé
- [ ] **Variables d'environnement** : Listées (sans valeurs sensibles)
- [ ] **Volumes** : Montages et persistence
- [ ] **Dépendances** : `depends_on` et health checks
- [ ] **Ressources** : Limites CPU/RAM (prod)

### Pour le réseau

- [ ] **Réseaux Docker** : skillswap_network, etc.
- [ ] **Communication** : Qui parle à qui
- [ ] **Ports exposés** : Dev vs Prod

### Pour les volumes

- [ ] **postgres_data** : Données PostgreSQL
- [ ] **meilisearch_data** : Index Meilisearch
- [ ] **Backup strategy** : Comment sauvegarder

---

## Intégration Arc42 Section 7

```markdown
<!-- docs/docs/arc42/07-deployment.md -->
# Vue Déploiement

## Architecture Docker

### Environnement de développement

![Docker Dev Architecture](../infrastructure/docker-architecture.png)

### Environnement de production

![Docker Prod Architecture](../infrastructure/docker-prod.png)

## Services

| Service | Image | Port | Rôle |
| ------- | ----- | ---- | ---- |
| nginx | nginx:alpine | 80, 443 | Reverse proxy, SSL termination |
| frontend | node:20-alpine | 3001 | Application Next.js (SSR) |
| backend | node:20-alpine | 3000 | API REST Express.js |
| postgres | postgres:16-alpine | 5432 | Base de données relationnelle |
| meilisearch | getmeili/meilisearch:v1.6 | 7700 | Moteur de recherche full-text |
| adminer | adminer:latest | 8080 | Interface admin BDD (dev only) |

## Différences Dev / Prod

| Aspect | Dev | Prod |
| ------ | --- | ---- |
| Hot reload | ✅ Activé | ❌ Désactivé |
| Adminer | ✅ Exposé | ❌ Non inclus |
| SSL | ❌ HTTP | ✅ HTTPS |
| Volumes | Montage local | Named volumes |
| Logs | Console | Fichiers + rotation |
```

---

## Plan d'action détaillé

### Phase 1 : Analyse (J6 matin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 1.1 | Analyser docker-compose.dev.yml | Inventaire services | 6 services listés |
| 1.2 | Analyser docker-compose.prod.yml | Différences notées | Tableau comparatif |
| 1.3 | Lister les volumes et réseaux | Config complète | Pas d'oubli |
| 1.4 | Créer structure `/docs/docs/infrastructure/` | Dossier créé | `ls -la` |

### Phase 2 : Génération diagrammes (J6 matin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 2.1 | Installer docker-compose-viz | Image Docker | `docker images` |
| 2.2 | Générer PNG environnement dev | `docker-architecture.png` | Image lisible |
| 2.3 | Générer SVG environnement dev | `docker-architecture.svg` | Vectoriel OK |
| 2.4 | Générer diagramme prod | `docker-prod.png` | Image lisible |

### Phase 3 : Rédaction documentation (J6 après-midi - 2h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 3.1 | Créer `infrastructure/index.md` | Overview complet | Diagrammes intégrés |
| 3.2 | Créer `infrastructure/services.md` | Détail 6 services | Format uniforme |
| 3.3 | Créer `infrastructure/networks.md` | Config réseau | Schéma clair |
| 3.4 | Créer `infrastructure/volumes.md` | Volumes + backups | Stratégie documentée |
| 3.5 | Créer `infrastructure/troubleshooting.md` | Problèmes courants | Solutions listées |

### Phase 4 : Intégration Arc42 (J6 fin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 4.1 | Rédiger `arc42/07-deployment.md` | Section complète | Diagrammes visibles |
| 4.2 | Ajouter à `mkdocs.yml` nav | Menu infrastructure | Navigation OK |
| 4.3 | Créer liens croisés | §5 → §7, §6 → §7 | Liens fonctionnels |
| 4.4 | Vérifier rendu MkDocs | `mkdocs serve` | Images affichées |

---

## Dépendances

### Requiert (inputs)

| Dépendance | Fichier source | Statut |
| ---------- | -------------- | ------ |
| MkDocs configuré | 02-arc42-mkdocs.md | Phase A |
| Docker Compose files | devops/*.yml | ✅ Existant |
| Docker installé | Système | ✅ Requis |

### Bloque (outputs)

| Fichier dépendant | Raison |
| ----------------- | ------ |
| 02-arc42-mkdocs.md | Section §7 Deployment |
| 13-deploiement.md | Référence architecture |
| 12-soutenance.md | Fiche infrastructure |

---

## Critères de validation

### Obligatoires (must-have)

- [ ] Diagramme docker-compose généré (PNG ou SVG)
- [ ] Arc42 §7 rédigé avec architecture Docker
- [ ] 6 services documentés avec ports et rôles
- [ ] Différences Dev/Prod expliquées
- [ ] Images visibles dans MkDocs

### Optionnels (nice-to-have)

- [ ] Diagramme interactif (Mermaid)
- [ ] Scripts de backup documentés
- [ ] Monitoring (Prometheus/Grafana) documenté
- [ ] Diagramme de séquence startup

---

## Ressources nécessaires

### Outils

```bash
# docker-compose-viz
docker pull pmsipilot/docker-compose-viz

# Alternative: Graphviz
brew install graphviz  # macOS
apt install graphviz   # Ubuntu
```

### Documentation

- Docker Compose : <https://docs.docker.com/compose/>
- docker-compose-viz : <https://github.com/pmsipilot/docker-compose-viz>
- Arc42 Deployment : <https://docs.arc42.org/section-7/>

### Temps estimé

| Phase | Durée | Effort |
| ----- | ----- | ------ |
| Phase 1 | 1h | Analyse |
| Phase 2 | 1h | Génération |
| Phase 3 | 2h | Rédaction |
| Phase 4 | 1h | Intégration |
| **Total** | **5h** | ~0.5 jour |

---

## Risques spécifiques

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| docker-compose-viz obsolète | Pas de graphe | Fallback: Mermaid manuel |
| Images trop grandes | Illisibles | Générer en SVG + zoom |
| Config Docker change | Rework | Documenter après stabilisation |

---

## Fichiers à créer (checklist finale)

```plaintext
docs/docs/
├── [ ] infrastructure/
│   ├── [ ] index.md                  # Overview
│   ├── [ ] docker-architecture.png   # Diagramme dev (généré)
│   ├── [ ] docker-architecture.svg   # Version SVG (généré)
│   ├── [ ] docker-prod.png           # Diagramme prod (généré)
│   ├── [ ] services.md               # Détail services
│   ├── [ ] networks.md               # Configuration réseau
│   ├── [ ] volumes.md                # Volumes et persistence
│   └── [ ] troubleshooting.md        # Problèmes courants
│
└── [ ] arc42/
    └── [ ] 07-deployment.md          # Section Arc42
```

**Total** : 5 fichiers manuels + 3 générés + 1 Arc42 = **9 fichiers**

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [05-database](./05-database.md) | [07-docusaurus-diataxis](./07-docusaurus-diataxis.md) |
