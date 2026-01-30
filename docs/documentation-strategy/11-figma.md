# Figma (Design System)

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 22 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| Script extraction tokens | ⏳ Non démarré | Phase C |
| design-tokens.json | ⏳ Non démarré | Export Tailwind |
| Fichier Figma Design System | ⏳ Non démarré | Tokens Studio |
| Import tokens dans Figma | ⏳ Non démarré | Plugin configuré |
| Lien Storybook ↔ Figma (5 composants) | ⏳ Non démarré | addon-designs |

**Progression globale** : ⏳ **0%** (Phase C non démarrée)

---

## Objectif

Créer un pont entre le code et le design pour SkillSwap afin de :

- Synchroniser les design tokens entre Tailwind et Figma
- Permettre aux designers de travailler avec les vraies valeurs du code
- Lier les composants Storybook aux maquettes Figma
- Maintenir une source unique de vérité pour le design system

---

## Workflow : Code → Figma → Storybook

```plaintext
1. Tailwind CSS définit les design tokens
              ↓
2. Script extrait les tokens en JSON
              ↓
3. Tokens importés dans Figma via Tokens Studio
              ↓
4. Designers créent/modifient les maquettes
              ↓
5. Storybook lie chaque composant à son node Figma
              ↓
6. Développeurs voient design + code côte à côte
```

---

## Design Tokens à extraire

### Depuis Tailwind

| Token | Source Tailwind | Usage |
| ----- | --------------- | ----- |
| **Colors** | `theme.colors` | Palette principale, catégories |
| **Spacing** | `theme.spacing` | Marges, paddings |
| **Font sizes** | `theme.fontSize` | Typographie |
| **Font weights** | `theme.fontWeight` | Graisses |
| **Border radius** | `theme.borderRadius` | Arrondis |
| **Shadows** | `theme.boxShadow` | Ombres portées |
| **Breakpoints** | `theme.screens` | Responsive |

### Tokens SkillSwap spécifiques

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--color-primary` | `#DC2626` (red-600) | Actions principales |
| `--color-secondary` | `#1F2937` (gray-800) | Texte principal |
| `--color-background` | `#FFFFFF` | Fond clair |
| `--color-surface` | `#F3F4F6` (gray-100) | Cartes, sections |
| `--radius-sm` | `0.25rem` | Petits éléments |
| `--radius-md` | `0.375rem` | Boutons, inputs |
| `--radius-lg` | `0.5rem` | Cartes |

---

## Étape 1 : Extraire les tokens depuis Tailwind

### Script d'extraction

```javascript
// scripts/extract-tokens.js
const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../tailwind.config.js');
const fs = require('fs');

const fullConfig = resolveConfig(tailwindConfig);

const tokens = {
  colors: fullConfig.theme.colors,
  spacing: fullConfig.theme.spacing,
  fontSize: fullConfig.theme.fontSize,
  fontWeight: fullConfig.theme.fontWeight,
  borderRadius: fullConfig.theme.borderRadius,
  boxShadow: fullConfig.theme.boxShadow,
  screens: fullConfig.theme.screens,
};

// Format pour Tokens Studio
const tokensStudio = {
  global: {
    colors: {},
    spacing: {},
    typography: {},
    borderRadius: {},
  },
};

// Transformer pour format Figma
Object.entries(tokens.colors).forEach(([key, value]) => {
  if (typeof value === 'string') {
    tokensStudio.global.colors[key] = { value, type: 'color' };
  } else {
    Object.entries(value).forEach(([shade, color]) => {
      tokensStudio.global.colors[`${key}-${shade}`] = { value: color, type: 'color' };
    });
  }
});

fs.writeFileSync(
  'tokens/design-tokens.json',
  JSON.stringify(tokensStudio, null, 2)
);

console.log('Tokens exported to tokens/design-tokens.json');
```

### Commande npm

```json
// package.json
{
  "scripts": {
    "tokens:extract": "node scripts/extract-tokens.js",
    "tokens:watch": "nodemon --watch tailwind.config.js --exec npm run tokens:extract"
  }
}
```

---

## Étape 2 : Importer dans Figma

### Plugin Tokens Studio

1. Installer **Tokens Studio for Figma** (plugin gratuit)
2. Créer un nouveau fichier Figma "SkillSwap Design System"
3. Ouvrir Tokens Studio → Import → Upload JSON
4. Sélectionner `tokens/design-tokens.json`
5. Appliquer les tokens comme styles Figma

### Synchronisation Git (optionnel)

```json
// tokens/figma-sync.json
{
  "tokenStorage": "git",
  "gitRepo": "https://github.com/your-org/skillswap",
  "branch": "main",
  "filePath": "tokens/design-tokens.json"
}
```

---

## Étape 3 : Lier Storybook ↔ Figma

### Installation addon

```bash
npm install -D @storybook/addon-designs
```

### Configuration Storybook

```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  addons: [
    // ... autres addons
    '@storybook/addon-designs',
  ],
};
```

### Exemple de story avec lien Figma

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xxx/SkillSwap?node-id=123:456',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Button' },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xxx/SkillSwap?node-id=123:456&mode=design',
    },
  },
};

export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xxx/SkillSwap?node-id=123:789',
    },
  },
};
```

---

## Structure Figma recommandée

```plaintext
SkillSwap Design System (Fichier Figma)
├── 📄 Cover
├── 📁 Foundations
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Icons
├── 📁 Components
│   ├── Atoms
│   │   ├── Button
│   │   ├── Input
│   │   ├── Avatar
│   │   └── ...
│   ├── Molecules
│   │   ├── ProfileCard
│   │   ├── MessageBubble
│   │   └── ...
│   └── Organisms
│       ├── Header
│       ├── Footer
│       └── ...
└── 📁 Pages
    ├── Home
    ├── Search
    ├── Profile
    └── Messaging
```

---

## Plan d'action détaillé

### Phase 1 : Setup tokens (J14 matin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 1.1 | Créer dossier `tokens/` | Dossier créé | `ls -la` |
| 1.2 | Écrire `scripts/extract-tokens.js` | Script fonctionnel | `npm run tokens:extract` |
| 1.3 | Générer `design-tokens.json` | Fichier JSON | Tokens visibles |
| 1.4 | Ajouter script npm | package.json | Commande OK |

### Phase 2 : Import Figma (J14 matin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 2.1 | Créer fichier Figma "Design System" | Fichier créé | URL accessible |
| 2.2 | Installer Tokens Studio | Plugin actif | Icône visible |
| 2.3 | Importer tokens JSON | Tokens chargés | Palette visible |
| 2.4 | Appliquer comme styles | Styles Figma | Dropdown rempli |

### Phase 3 : Lier Storybook (J14 après-midi - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 3.1 | Installer addon-designs | package.json | `npm ls` |
| 3.2 | Configurer dans main.ts | Addon actif | Pas d'erreur |
| 3.3 | Ajouter URL Figma sur 5 composants P1 | Stories mises à jour | Panel Design visible |
| 3.4 | Tester navigation Figma | Liens fonctionnels | Clic → Figma |

### Phase 4 : Documentation (J14 fin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 4.1 | Documenter workflow dans README | Guide équipe | Process clair |
| 4.2 | Créer checklist composants/nodes | Mapping complet | Tableau rempli |
| 4.3 | Former l'équipe | Session 15min | Questions répondues |

---

## Dépendances

### Requiert (inputs)

| Dépendance | Fichier source | Statut |
| ---------- | -------------- | ------ |
| Storybook configuré | 08-storybook.md | Phase C |
| Tailwind configuré | tailwind.config.js | ✅ Existant |
| Compte Figma | Organisation | À vérifier |

### Bloque (outputs)

| Fichier dépendant | Raison |
| ----------------- | ------ |
| 08-storybook.md | Addon-designs intégré |
| 12-soutenance.md | Démo design system |

---

## Critères de validation

### Obligatoires (must-have)

- [ ] Script extraction tokens fonctionnel
- [ ] `design-tokens.json` généré automatiquement
- [ ] Fichier Figma avec tokens importés
- [ ] 5 composants P1 liés à Figma dans Storybook
- [ ] Panel "Design" visible dans Storybook

### Optionnels (nice-to-have)

- [ ] Synchronisation Git tokens ↔ Figma
- [ ] Tous les composants liés à Figma
- [ ] Maquettes de toutes les pages
- [ ] Design tokens CSS variables

---

## Ressources nécessaires

### Outils

```bash
# Extraction tokens
npm install -D tailwindcss

# Storybook addon
npm install -D @storybook/addon-designs

# Watch mode
npm install -D nodemon
```

### Accès

- [ ] Compte Figma (gratuit ou org)
- [ ] Plugin Tokens Studio (gratuit)
- [ ] URLs des nodes Figma pour chaque composant

### Documentation

- Tokens Studio : <https://tokens.studio/>
- Storybook addon-designs : <https://storybook.js.org/addons/@storybook/addon-designs>
- Tailwind config : <https://tailwindcss.com/docs/configuration>

### Temps estimé

| Phase | Durée | Effort |
| ----- | ----- | ------ |
| Phase 1 | 1h | Setup tokens |
| Phase 2 | 1h | Import Figma |
| Phase 3 | 1h | Lier Storybook |
| Phase 4 | 1h | Documentation |
| **Total** | **4h** | ~0.5 jour |

---

## Risques spécifiques

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| Pas de designer dans l'équipe | Figma inutilisé | Focus sur tokens uniquement |
| Tokens Studio payant | Coût | Plan gratuit suffisant |
| Maquettes pas à jour | Confusion | Sync régulière ou skip |

---

## Mapping Composants ↔ Figma (checklist)

| Composant | Node ID Figma | Statut |
| --------- | ------------- | ------ |
| Button | `123:456` | [ ] À lier |
| Input | `123:789` | [ ] À lier |
| Avatar | `124:001` | [ ] À lier |
| ProfileCard | `125:001` | [ ] À lier |
| Header | `126:001` | [ ] À lier |

> **Note** : Remplir les Node IDs une fois le fichier Figma créé.

---

## Fichiers à créer (checklist finale)

```plaintext
frontend/
├── [ ] scripts/
│   └── [ ] extract-tokens.js         # Script extraction
├── [ ] tokens/
│   └── [ ] design-tokens.json        # Tokens exportés (généré)
│
├── [ ] .storybook/
│   └── [ ] main.ts                   # + addon-designs
│
└── [ ] src/components/
    ├── [ ] atoms/Button/Button.stories.tsx    # + parameters.design
    ├── [ ] atoms/Input/Input.stories.tsx      # + parameters.design
    ├── [ ] atoms/Avatar/Avatar.stories.tsx    # + parameters.design
    ├── [ ] molecules/ProfileCard/...stories   # + parameters.design
    └── [ ] organisms/Header/Header.stories    # + parameters.design
```

**Total** : 1 script + 1 JSON généré + 5 stories mises à jour = **7 fichiers**

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [10-tests](./10-tests.md) | [12-soutenance](./12-soutenance.md) |
