# Déploiement MkDocs sur Vercel

## Option 1 : Via GitHub Actions (Recommandé)

Vercel ne supporte pas nativement Python. La méthode recommandée est d'utiliser GitHub Actions pour builder et déployer.

### Étapes

1. **Créer le fichier `.github/workflows/deploy-mkdocs.yml`** (voir ci-dessous)
2. **Configurer les secrets GitHub** :
   - `VERCEL_TOKEN` : Token API Vercel
   - `VERCEL_ORG_ID` : ID de l'organisation Vercel
   - `VERCEL_PROJECT_ID` : ID du projet Vercel

### Workflow GitHub Actions

```yaml
name: Deploy MkDocs to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'
          cache-dependency-path: docs/requirements.txt

      - name: Install dependencies
        run: pip install -r docs/requirements.txt

      - name: Build MkDocs
        run: cd docs && mkdocs build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: docs/site
          vercel-args: '--prod'
```

## Option 2 : Via Vercel CLI (Local)

```bash
# Installer les dépendances Python
cd docs
pip install -r requirements.txt

# Builder MkDocs
mkdocs build

# Déployer sur Vercel
cd site
vercel --prod
```

## Option 3 : Utiliser un service alternatif

MkDocs fonctionne nativement avec :
- **GitHub Pages** : `mkdocs gh-deploy`
- **Netlify** : Support Python natif
- **Read the Docs** : Intégration MkDocs native

## Tester localement

```bash
cd docs
pip install -r requirements.txt
mkdocs serve
# Ouvrir http://localhost:8000
```
