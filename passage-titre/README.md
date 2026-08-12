# Passage du titre — Dossier Projet CDA & Slides soutenance

Dossier de Projet et slides pour la soutenance du **Titre Professionnel
Concepteur Développeur d'Applications (Niveau 6 RNCP)** — promotion Dublin,
école O'clock.

**Soutenance** : mardi 13 mai 2026.
**Projet** : SkillSwap (https://skill-swap.fr).

## Structure

```
passage-titre/
├── dossier/
│   ├── main.typ                 # Entrée Typst (importe template + sections)
│   ├── template.typ             # Page de garde + headers/footer + code light
│   ├── sections/                # 15 fichiers .typ (00 → 14)
│   ├── annexes/index.typ        # Annexes
│   ├── assets/                  # Captures + diagrammes
│   └── output/                  # PDF compilé (gitignored sauf le PDF final)
└── slides/
    ├── soutenance.md            # Slides Marp (Markdown)
    ├── theme/skillswap.css      # Thème custom cohérent avec le dossier
    ├── assets/                  # Captures + ressources
    └── output/                  # PDF compilé (gitignored sauf le PDF final)
```

## Pré-requis

### Typst (compilation du dossier)

Installation Linux — au choix :

```bash
# Option 1 (recommandée si cargo installé)
cargo install --locked typst-cli

# Option 2 — binaire pré-compilé (sans Rust)
# Télécharger la dernière release depuis :
# https://github.com/typst/typst/releases
# Puis :
sudo mv typst /usr/local/bin/
```

Vérifier : `typst --version`.

### Marp (compilation des slides)

```bash
npm install -g @marp-team/marp-cli
```

Vérifier : `marp --version`.

## Compilation

### Dossier (PDF final attendu : `dossier_de_projet.pdf`)

```bash
cd passage-titre/dossier
typst compile main.typ output/dossier_de_projet.pdf
```

> ⚠️ Le nom **`dossier_de_projet.pdf`** est exigé par O'clock pour le dépôt.
> Ne pas le renommer.

Mode watch (rebuild automatique pendant la rédaction) :

```bash
cd passage-titre/dossier
typst watch main.typ output/dossier_de_projet.pdf
```

### Slides

```bash
cd passage-titre/slides
marp soutenance.md --pdf -o output/presentation.pdf --theme-set theme/skillswap.css --allow-local-files
```

Mode preview HTML (utile pendant la rédaction) :

```bash
cd passage-titre/slides
marp soutenance.md --html -o output/presentation.html --theme-set theme/skillswap.css
```

## Conventions

- **Tout en français** : commentaires, titres, contenu.
- **Code light obligatoire** dans les blocs de code (exigence O'clock).
  Le style est appliqué automatiquement via `template.typ`.
- **Polices** : Inter (texte) + JetBrains Mono (code). Fallbacks
  système (DejaVu Sans / Liberation Sans) si non installées.
- **Couleur d'accent** : `#A71E34` — sourcée de la palette du frontend
  (`primary-700`, `frontend/src/app/globals.css`). Teinte pâle associée :
  `#FDF2F4` (`primary-50`).
- **Numérotation des headings** : `1.1.1.` (3 niveaux dans le sommaire).

## Personnalisation

- **Nom de famille du candidat** : remplacer `[NOM_DE_FAMILLE]` dans
  `dossier/main.typ` (ligne `candidat:`) et dans `slides/soutenance.md`
  (front matter + slide intro).
- **Couleur d'accent** : variable `accent` en haut de `template.typ` et
  variable CSS `--accent` dans `theme/skillswap.css`.

## Contenu déjà câblé

Les sections sont des **squelettes commentés** avec des `// TODO :` et des
références aux fichiers existants du repo (audit messagerie, ERD, ADRs,
diagrammes UML). Le contenu rédactionnel reste à écrire.

Référence canonique pour le choix de la fonctionnalité représentative
(messagerie temps réel) : [`docs/audits/feature-inventory-cda.md`](../docs/audits/feature-inventory-cda.md).
