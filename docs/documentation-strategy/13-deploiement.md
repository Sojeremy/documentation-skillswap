# Deploiement Vercel

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 22 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| Compte Vercel | ⏳ Non démarré | Phase E |
| Projet skillswap-docs (MkDocs) | ⏳ Non démarré | docs.skillswap.vercel.app |
| Projet skillswap-guide (Docusaurus) | ⏳ Non démarré | guide.skillswap.vercel.app |
| Projet skillswap-storybook | ⏳ Non démarré | storybook.skillswap.vercel.app |
| Domaines custom configurés | ⏳ Non démarré | DNS + SSL |
| Auto-deploy sur push | ⏳ Non démarré | CI/CD Vercel |
| URLs documentées dans README | ⏳ Non démarré | Liens visibles |

**Progression globale** : ⏳ **0%** (Phase E non démarrée)

---

## Architecture multi-apps

```plaintext
skillswap/
├── docs/                    → docs.skillswap.vercel.app (MkDocs)
├── user-docs/               → guide.skillswap.vercel.app (Docusaurus)
└── frontend/
    └── .storybook/          → storybook.skillswap.vercel.app
```

---

## Option A: Monorepo avec 3 projets Vercel

```bash
# Creer 3 projets dans Vercel Dashboard
# Chacun pointe vers le meme repo mais avec des Root Directory differents

Projet 1: skillswap-docs
  - Root Directory: docs
  - Build Command: mkdocs build
  - Output Directory: site

Projet 2: skillswap-guide
  - Root Directory: user-docs
  - Build Command: npm run build
  - Output Directory: build

Projet 3: skillswap-storybook
  - Root Directory: frontend
  - Build Command: npm run build-storybook
  - Output Directory: storybook-static
```

---

## Option B: Scripts de build centralises

```json
// package.json (racine)
{
  "scripts": {
    "build:docs": "cd docs && mkdocs build",
    "build:guide": "cd user-docs && npm run build",
    "build:storybook": "cd frontend && npm run build-storybook",
    "build:all": "npm run build:docs && npm run build:guide && npm run build:storybook"
  }
}
```

---

## Configuration Vercel (vercel.json)

```json
{
  "buildCommand": "npm run build:all",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/docs/:path*", "destination": "/docs/site/:path*" },
    { "source": "/guide/:path*", "destination": "/user-docs/build/:path*" },
    { "source": "/storybook/:path*", "destination": "/frontend/storybook-static/:path*" }
  ]
}
```

---

## URLs finales

| Documentation | URL | Contenu |
| ------------- | --- | ------- |
| **Technique** | docs.skillswap.vercel.app | Arc42, ADRs, OpenAPI, TypeDoc |
| **Utilisateur** | guide.skillswap.vercel.app | Tutorials, How-to, FAQ |
| **Composants** | storybook.skillswap.vercel.app | Catalogue UI interactif |
| **API Reference** | docs.skillswap.vercel.app/api-reference | TypeDoc (hooks, utils) |

---

## Plan d'action détaillé

### Phase 1 : Préparation (J28 matin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 1.1 | Créer compte Vercel | Compte actif | Login OK |
| 1.2 | Connecter repo GitHub | Repo linké | Import visible |
| 1.3 | Vérifier builds locaux | Tous passent | `npm run build` OK |
| 1.4 | Préparer variables d'environnement | Liste env vars | Documentées |

### Phase 2 : Déploiement MkDocs (J28 matin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 2.1 | Créer projet skillswap-docs | Projet Vercel | Dashboard visible |
| 2.2 | Configurer Root Directory: `docs` | Build settings | Config OK |
| 2.3 | Configurer Build Command: `mkdocs build` | Build settings | Syntaxe valide |
| 2.4 | Configurer Output Directory: `site` | Build settings | Chemin correct |
| 2.5 | Déclencher premier déploiement | URL live | Site accessible |
| 2.6 | Vérifier navigation et recherche | Tests manuels | Fonctionnel |

### Phase 3 : Déploiement Docusaurus (J28 après-midi - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 3.1 | Créer projet skillswap-guide | Projet Vercel | Dashboard visible |
| 3.2 | Configurer Root Directory: `user-docs` | Build settings | Config OK |
| 3.3 | Configurer Build Command: `npm run build` | Build settings | Syntaxe valide |
| 3.4 | Configurer Output Directory: `build` | Build settings | Chemin correct |
| 3.5 | Déclencher premier déploiement | URL live | Site accessible |
| 3.6 | Vérifier tutoriels et how-to guides | Tests manuels | Fonctionnel |

### Phase 4 : Déploiement Storybook (J28 après-midi - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 4.1 | Créer projet skillswap-storybook | Projet Vercel | Dashboard visible |
| 4.2 | Configurer Root Directory: `frontend` | Build settings | Config OK |
| 4.3 | Configurer Build Command: `npm run build-storybook` | Build settings | Syntaxe valide |
| 4.4 | Configurer Output Directory: `storybook-static` | Build settings | Chemin correct |
| 4.5 | Déclencher premier déploiement | URL live | Site accessible |
| 4.6 | Vérifier composants et interactions | Tests manuels | Fonctionnel |

### Phase 5 : Domaines et finalisation (J28 fin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 5.1 | Configurer domaine custom docs | docs.skillswap.vercel.app | DNS OK |
| 5.2 | Configurer domaine custom guide | guide.skillswap.vercel.app | DNS OK |
| 5.3 | Configurer domaine custom storybook | storybook.skillswap.vercel.app | DNS OK |
| 5.4 | Vérifier HTTPS sur tous les domaines | Certificats | SSL OK |
| 5.5 | Tester auto-deploy sur push | Push test | Rebuild déclenché |
| 5.6 | Documenter URLs dans README | README mis à jour | Liens visibles |

---

## Configuration détaillée Vercel

### Projet 1 : skillswap-docs (MkDocs)

```json
{
  "framework": null,
  "buildCommand": "pip install mkdocs-material && mkdocs build",
  "outputDirectory": "site",
  "installCommand": "pip install -r requirements.txt",
  "devCommand": "mkdocs serve"
}
```

### Projet 2 : skillswap-guide (Docusaurus)

```json
{
  "framework": "docusaurus-2",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "devCommand": "npm start"
}
```

### Projet 3 : skillswap-storybook (Storybook)

```json
{
  "framework": null,
  "buildCommand": "npm run build-storybook",
  "outputDirectory": "storybook-static",
  "installCommand": "npm install",
  "devCommand": "npm run storybook"
}
```

---

## Variables d'environnement

| Variable | Projet | Valeur | Secret |
| -------- | ------ | ------ | ------ |
| `NODE_VERSION` | Tous | `20` | Non |
| `PYTHON_VERSION` | docs | `3.11` | Non |
| `SITE_URL` | docs | `https://docs.skillswap.vercel.app` | Non |
| `SITE_URL` | guide | `https://guide.skillswap.vercel.app` | Non |

---

## Dépendances

### Requiert (inputs)

| Dépendance | Fichier source | Statut |
| ---------- | -------------- | ------ |
| MkDocs configuré | 02-arc42-mkdocs.md | Phase A |
| Docusaurus configuré | 07-docusaurus-diataxis.md | Phase B |
| Storybook configuré | 08-storybook.md | Phase C |
| Tests passent | 10-tests.md | Phase D |
| Compte Vercel | Système | À créer |
| Repo GitHub | Système | ✅ Existant |

### Bloque (outputs)

| Fichier dépendant | Raison |
| ----------------- | ------ |
| 12-soutenance.md | URLs pour démo |
| README.md projet | Liens documentation |
| 00-plan-action-global.md | Validation finale |

---

## Critères de validation

### Obligatoires (must-have)

- [ ] MkDocs déployé et accessible (docs.skillswap.vercel.app)
- [ ] Docusaurus déployé et accessible (guide.skillswap.vercel.app)
- [ ] Storybook déployé et accessible (storybook.skillswap.vercel.app)
- [ ] HTTPS actif sur tous les domaines
- [ ] Auto-deploy sur push to main
- [ ] URLs documentées dans README principal

### Optionnels (nice-to-have)

- [ ] Domaine custom (skillswap.dev)
- [ ] Preview deployments sur PR
- [ ] Analytics (Vercel Analytics)
- [ ] Protection par mot de passe (staging)
- [ ] Notifications Slack sur deploy

---

## Ressources nécessaires

### Outils

```bash
# Vercel CLI (optionnel)
npm install -g vercel

# Login Vercel
vercel login

# Deploy manuel
vercel --prod
```

### Accès requis

- [ ] Compte Vercel (gratuit ou Pro)
- [ ] Accès admin repo GitHub
- [ ] Droits sur organisation Vercel

### Documentation

- Vercel : <https://vercel.com/docs>
- Vercel + MkDocs : <https://vercel.com/guides/deploying-mkdocs>
- Vercel + Docusaurus : <https://docusaurus.io/docs/deployment#deploying-to-vercel>
- Vercel + Storybook : <https://storybook.js.org/docs/sharing/publish-storybook#vercel>

### Temps estimé

| Phase | Durée | Effort |
| ----- | ----- | ------ |
| Phase 1 | 1h | Préparation |
| Phase 2 | 1h | MkDocs |
| Phase 3 | 1h | Docusaurus |
| Phase 4 | 1h | Storybook |
| Phase 5 | 1h | Domaines |
| **Total** | **5h** | ~0.5 jour |

---

## Risques spécifiques

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| Build MkDocs échoue | Pas de docs techniques | Tester `mkdocs build` en local |
| Limite gratuite Vercel | Déploiements bloqués | Monitorer usage, plan Pro si besoin |
| DNS propagation lente | URLs inaccessibles | Prévoir 24-48h, tester avec IP |
| Dépendances non trouvées | Build fail | Vérifier requirements.txt / package.json |
| Cache Vercel obsolète | Ancien contenu | Purger cache, redéployer |

---

## Checklist de test post-déploiement

### Pour chaque site

- [ ] Page d'accueil charge
- [ ] Navigation fonctionne
- [ ] Recherche fonctionne (si applicable)
- [ ] Images s'affichent
- [ ] Liens internes fonctionnent
- [ ] HTTPS actif (pas d'avertissement)
- [ ] Responsive mobile OK

---

## Fichiers à créer/modifier (checklist finale)

```plaintext
Racine projet/
├── [ ] README.md                   # Ajouter section "Documentation"
│       - URL MkDocs
│       - URL Docusaurus
│       - URL Storybook
│
├── [ ] docs/
│   └── [ ] requirements.txt        # Dépendances Python MkDocs
│
├── [ ] user-docs/
│   └── [ ] package.json            # Vérifier scripts build
│
└── [ ] frontend/
    └── [ ] package.json            # Vérifier scripts storybook
```

**Total** : 1 README + 1 requirements + 2 vérifications = **4 fichiers**

**Projets Vercel** : 3 projets à créer dans le dashboard

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [12-soutenance](./12-soutenance.md) | [14-planning](./14-planning.md) |
