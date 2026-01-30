# Déploiement des Documentations sur Vercel

Ce guide explique comment déployer les 3 documentations du projet SkillSwap sur Vercel.

## Vue d'ensemble

| Documentation | Technologie | URL | Dossier |
|--------------|-------------|-----|---------|
| **Technique** | MkDocs Material | `docs.skillswap.vercel.app` | `/docs` |
| **Utilisateur** | Docusaurus 3.9 | `guide.skillswap.vercel.app` | `/user-docs` |
| **Composants** | Storybook 10 | `storybook.skillswap.vercel.app` | `/frontend` |

---

## Méthode 1 : GitHub Actions (Recommandé)

Cette méthode utilise GitHub Actions pour builder et déployer automatiquement.

### Étape 1 : Créer les projets Vercel

Créer **3 projets vides** sur Vercel (sans connecter de repo) :

1. `skillswap-docs` (MkDocs)
2. `skillswap-guide` (Docusaurus)
3. `skillswap-storybook` (Storybook)

Pour chaque projet :
```bash
vercel project add skillswap-docs
vercel project add skillswap-guide
vercel project add skillswap-storybook
```

### Étape 2 : Récupérer les IDs

```bash
# Récupérer l'ID de l'organisation
vercel whoami

# Pour chaque projet, récupérer l'ID
vercel project ls
```

### Étape 3 : Configurer les secrets GitHub

Dans **Settings > Secrets and variables > Actions**, ajouter :

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Token API Vercel (Settings > Tokens) |
| `VERCEL_ORG_ID` | ID de l'organisation/team Vercel |
| `VERCEL_MKDOCS_PROJECT_ID` | ID du projet skillswap-docs |
| `VERCEL_DOCUSAURUS_PROJECT_ID` | ID du projet skillswap-guide |
| `VERCEL_STORYBOOK_PROJECT_ID` | ID du projet skillswap-storybook |

### Étape 4 : Configurer les domaines

Dans chaque projet Vercel, ajouter le domaine personnalisé :

- `skillswap-docs` → `docs.skillswap.vercel.app`
- `skillswap-guide` → `guide.skillswap.vercel.app`
- `skillswap-storybook` → `storybook.skillswap.vercel.app`

### Étape 5 : Déclencher le déploiement

Le workflow se déclenche automatiquement sur push vers `main` quand les fichiers concernés changent.

Déploiement manuel :
1. Aller dans **Actions** > **Deploy Documentation to Vercel**
2. Cliquer sur **Run workflow**
3. Choisir la cible (all, mkdocs, docusaurus, storybook)

---

## Méthode 2 : Déploiement direct Vercel (Docusaurus & Storybook uniquement)

### Docusaurus

```bash
cd user-docs
vercel
# Suivre les instructions
# Root Directory: ./
# Build Command: npm run build
# Output Directory: build
```

### Storybook

```bash
cd storybook
vercel
# Suivre les instructions
# Build Command: cd ../frontend && npm install && npm run build-storybook -- --output-dir ../storybook/storybook-static
# Output Directory: storybook-static
```

### MkDocs (Local build + Deploy)

```bash
cd docs
pip install -r requirements.txt
mkdocs build
cd site
vercel --prod
```

---

## Méthode 3 : Vercel Import (Monorepo)

Importer le repo 3 fois avec des "Root Directory" différents :

### Projet 1 : Docusaurus
- **Root Directory**: `user-docs`
- **Framework**: Docusaurus 2
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### Projet 2 : Storybook
- **Root Directory**: `frontend`
- **Framework**: Other
- **Build Command**: `npm run build-storybook`
- **Output Directory**: `storybook-static`

### Projet 3 : MkDocs
⚠️ Ne fonctionne pas directement (Python non supporté). Utiliser la Méthode 1.

---

## Tester localement

### MkDocs
```bash
cd docs
pip install -r requirements.txt
mkdocs serve
# → http://localhost:8000
```

### Docusaurus
```bash
cd user-docs
npm install
npm start
# → http://localhost:3000
```

### Storybook
```bash
cd frontend
npm install
npm run storybook
# → http://localhost:6006
```

---

## Structure des fichiers créés

```
projet-skillswap/
├── .github/
│   └── workflows/
│       └── deploy-docs.yml      # GitHub Actions workflow
├── docs/
│   ├── vercel.json              # Config Vercel MkDocs
│   ├── requirements.txt         # Dépendances Python
│   └── DEPLOY.md                # Instructions MkDocs
├── user-docs/
│   └── vercel.json              # Config Vercel Docusaurus
└── storybook/
    ├── vercel.json              # Config Vercel Storybook
    ├── package.json             # Package pour build
    └── .gitignore               # Ignorer storybook-static
```

---

## Troubleshooting

### MkDocs : "pip not found"
Vercel ne supporte pas Python nativement. Utiliser GitHub Actions.

### Storybook : Build échoue
Vérifier que toutes les dépendances sont installées :
```bash
cd frontend
rm -rf node_modules
npm install
npm run build-storybook
```

### Docusaurus : Broken links
Vérifier les liens dans la config :
```bash
cd user-docs
npm run build
# Les erreurs seront affichées
```
