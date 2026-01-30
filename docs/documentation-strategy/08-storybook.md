# Storybook (Composants UI)

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 23 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| Setup Storybook | ✅ Terminé | Storybook 10.2.0 avec nextjs-vite |
| Configuration `.storybook/` | ✅ Terminé | main.ts, preview.ts + Tailwind |
| Stories Atoms (15) | ✅ Terminé | 15/15 atoms documentés (100%) |
| Stories Molecules (9) | ✅ Terminé | 9/9 molecules documentés (100%) |
| Stories Organisms (4 P1) | ✅ Terminé | Header, AuthForm, SearchBar, Footer |
| Addon a11y | ✅ Installé | @storybook/addon-a11y inclus |

**Progression globale** : ✅ **100%** (Atoms 100%, Molecules 100%, Organisms P1 100%)

### Stories créés (15/15 Atoms)

| Composant | Stories | Variants documentés |
|-----------|---------|---------------------|
| Button | ✅ 11 | default, destructive, outline, secondary, ghost, link, sizes, loading |
| Input | ✅ 5 | default, withLabel, withError, disabled, allStates |
| Avatar | ✅ 7 | withImage, withInitials, customInitials, withStatus, offline, allSizes |
| Badge | ✅ 9 | default, outline, category, availability, primary, selected, withRemove |
| Rating | ✅ 8 | default, withCount, interactive, largeSize, empty, fullStars, allScores |
| Card | ✅ 5 | default, withFooter, profileCard, simple, cardGrid |
| Label | ✅ 4 | default, required, withInput, disabled |
| Textarea | ✅ 6 | default, withLabel, withHelperText, withError, disabled, allStates |
| Separator | ✅ 4 | horizontal, vertical, inContent, verticalInline |
| PasswordInput | ✅ 6 | default, withLabel, withError, disabled, withValue, allStates |
| Logo | ✅ 8 | default, small, large, xl, iconOnly, withoutText, asLink, allSizes |
| Dialog | ✅ 4 | default, confirmation, withForm, withoutCloseButton |
| DropdownMenu | ✅ 6 | default, withLabelsAndGroups, checkboxes, radioGroup, submenu, userMenu |
| Icons | ✅ 5 | allIcons, sizes, withColors, ratingStars, navigationIcons |
| Link | ✅ 8 | default, nav, footer, cta, allVariants, navBar, footerLinks, inline |

### Stories créés (9/9 Molecules)

| Composant | Stories | Variants documentés |
|-----------|---------|---------------------|
| ProfileCard | ✅ 6 | default, withoutAvatar, manySkills, noReviews, singleSkill, cardGrid |
| MessageBubble | ✅ 5 | received, sent, longMessage, withoutAvatar, conversation |
| EmptyState | ✅ 7 | noConversations, noResults, noMembers, emptyInbox, withoutAction, customIcon, allVariants |
| ConversationItem | ✅ 7 | default, withUnread, active, activeWithUnread, withoutAvatar, longMessage, conversationList |
| ConfirmDialog | ✅ 5 | default, deleteConfirmation, logoutConfirmation, cancelAction, loading |
| StepHowItWorks | ✅ 5 | step1, step2, step3, allSteps, longDescription |
| UserDropdown | ✅ 4 | default, withoutAvatar, withoutSettings, inHeader |
| ConversationSkeleton | ✅ 3 | default, fullWidth, inSidebar |
| Pagination | ✅ 8 | default, middlePage, lastPage, fewPages, manyPages, singlePage, interactive, withContent |

### Stories créés (4/4 Organisms P1)

| Composant | Stories | Variants documentés |
|-----------|---------|---------------------|
| Header | ✅ 7 | loggedOut, loggedOutHomePage, loggedIn, loggedInHomePage, loggedInNoAvatar, loading, withContent |
| AuthForm | ✅ 8 | login, register, loginLoading, registerLoading, loginWithError, registerWithError, interactive, sideBySide |
| SearchBar | ✅ 7 | empty, withQuery, shortQuery, loading, customMinChars, interactive, inSearchPage |
| Footer | ✅ 4 | loggedOut, loggedIn, withContent, fullPage |

---

## Objectif

Documenter les composants React de SkillSwap pour :

- Créer un catalogue visuel interactif pour l'équipe
- Faciliter la revue de design avec les parties prenantes
- Détecter les régressions visuelles (Chromatic)
- Tester les composants en isolation
- Encourager la réutilisation de composants existants

---

## Stratégie de Tests Unifiée

> Ce fichier fait partie de la **Stratégie de Tests Diversifiée** ([ADR-010](../documentation-implementation/arc42/09-decisions/010-testing-strategy.md))

| Outil | Cible | Ce fichier |
|-------|-------|------------|
| **Storybook** | Composants UI (53) | ✅ **Ce document** |
| TypeDoc | Hooks/Lib (23) | [09-typedoc.md](./09-typedoc.md) |
| Vitest + Playwright | Tests comportement + E2E | [10-tests.md](./10-tests.md) |

**Principe clé** : Storybook documente ET teste les composants. Pas besoin de tests Vitest pour les composants React.

---

## Pourquoi Storybook ?

| Avantage | Description |
| -------- | ----------- |
| **Documentation visuelle** | Catalogue interactif de tous les composants |
| **Isolation** | Développer sans démarrer toute l'app |
| **Playground** | Tester les props en temps réel |
| **Accessibilité** | Addon a11y pour vérifier WCAG |
| **Collaboration** | Partage facile avec designers/PO |

---

## Inventaire composants

| Catégorie | Quantité | Exemples |
| --------- | -------- | -------- |
| **Atoms** | 15 | Button, Input, Badge, Avatar, Rating, Card |
| **Molecules** | 8 | ProfileCard, MessageBubble, EmptyState, ConversationItem |
| **Organisms** | 30 | Header, AuthForm, SearchPage, ConversationSection |
| **Total** | **53** | - |

### Détail par catégorie

#### Atoms (15)

| Composant | Props principales | Variants |
| --------- | ----------------- | -------- |
| Button | variant, size, disabled | default, destructive, outline, ghost |
| Input | type, error, disabled | text, email, password |
| Avatar | src, initials, size | sm, md, lg |
| Badge | variant | par catégorie (couleur) |
| Rating | value, readonly | interactive, display |
| Card | className | default, hover |
| Label | htmlFor | - |
| Textarea | rows, disabled | - |
| Separator | orientation | horizontal, vertical |
| Select | options, value | - |
| Checkbox | checked, disabled | - |
| Switch | checked, disabled | - |
| Skeleton | className | - |
| Tooltip | content | - |
| Dialog | open, onClose | - |

#### Molecules (8)

| Composant | Composition | Contexte |
| --------- | ----------- | -------- |
| ProfileCard | Avatar + Badge + Button | Liste membres |
| MessageBubble | Text + Time | Conversation |
| EmptyState | Icon + Text + Button | États vides |
| ConversationItem | Avatar + Preview + Badge | Liste conversations |
| ConfirmDialog | Dialog + Buttons | Actions critiques |
| SkillBadge | Badge + Icon | Compétences |
| SearchInput | Input + Icon | Barre recherche |
| UserAvatar | Avatar + Status | En ligne/hors ligne |

#### Organisms (30)

| Composant | Page/Section | Priorité |
| --------- | ------------ | -------- |
| Header | Global | P1 |
| Footer | Global | P2 |
| AuthForm | Login/Register | P1 |
| ProfileForm | Profil | P1 |
| SearchBar | Recherche | P1 |
| SearchResults | Recherche | P1 |
| ConversationList | Messagerie | P1 |
| MessageThread | Messagerie | P1 |
| ... | ... | P2-P3 |

---

## Installation

```bash
npx storybook@latest init
```

### Structure générée

```plaintext
frontend/
├── .storybook/
│   ├── main.ts           # Config addons et framework
│   ├── preview.ts        # Decorators globaux et styles
│   └── preview-head.html # Scripts/styles globaux
```

### Addons installés

| Addon | Rôle | Statut |
| ----- | ---- | ------ |
| `@storybook/addon-essentials` | Actions, controls, docs, viewport | ✅ Inclus |
| `@storybook/addon-a11y` | Tests accessibilité automatiques | ✅ Installé |
| `@storybook/addon-interactions` | Tests d'interaction | ✅ Installé |
| `@storybook/addon-designs` | Intégration Figma | Optionnel |

---

## Structure cible des stories

```plaintext
src/components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx      # ← Story colocalisée
│   │   └── index.ts
│   ├── Avatar/
│   │   ├── Avatar.tsx
│   │   ├── Avatar.stories.tsx
│   │   └── index.ts
│   └── ...
│
├── molecules/
│   ├── ProfileCard/
│   │   ├── ProfileCard.tsx
│   │   ├── ProfileCard.stories.tsx
│   │   └── index.ts
│   └── ...
│
└── organisms/
    ├── Header/
    │   ├── Header.tsx
    │   ├── Header.stories.tsx
    │   └── index.ts
    └── ...
```

---

## Checklist : Composants à documenter

### Priorité 1 (Core - 100% coverage)

| Composant | Type | Variants à documenter |
| --------- | ---- | --------------------- |
| Button | Atom | default, destructive, outline, ghost, sizes |
| Input | Atom | default, error, disabled |
| Avatar | Atom | withImage, withInitials, sizes |
| Badge | Atom | couleurs par catégorie |
| Rating | Atom | readonly, interactive, sizes |
| Card | Atom | default, hover |

### Priorité 2 (Molecules clés)

| Composant | Type | Variants à documenter |
| --------- | ---- | --------------------- |
| ProfileCard | Molecule | default, loading, noAvatar, manySkills |
| MessageBubble | Molecule | sent, received, withTime |
| EmptyState | Molecule | noResults, noConversations |
| ConversationItem | Molecule | unread, selected |
| ConfirmDialog | Molecule | delete, logout |

### Priorité 3 (Organisms essentiels)

| Composant | Type | Variants à documenter |
| --------- | ---- | --------------------- |
| Header | Organism | loggedIn, loggedOut, mobile |
| AuthForm | Organism | login, register, loading, errors |
| SearchBar | Organism | empty, withQuery |
| Footer | Organism | default |

---

## Exemple de story (template)

```typescript
// components/atoms/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'nav'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variants individuels
export const Default: Story = {
  args: { children: 'Bouton par défaut', variant: 'default' },
};

export const Loading: Story = {
  args: { children: 'Enregistrer', isLoading: true, loadingText: 'Enregistrement' },
};

// Gallery de tous les variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
```

> **Note** : Storybook 10.2 utilise `@storybook/nextjs-vite` et `satisfies Meta<typeof Component>` pour un meilleur typage.

---

## Configuration type

### main.ts

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
};

export default config;
```

### preview.ts

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

---

## Plan d'action détaillé

### Phase 1 : Setup Storybook (J10 matin - 2h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 1.1 | Initialiser Storybook | `.storybook/` créé | `npm run storybook` |
| 1.2 | Configurer `main.ts` | Addons installés | Pas d'erreurs |
| 1.3 | Configurer `preview.ts` | Styles globaux | CSS chargé |
| 1.4 | Tester avec 1 composant | Story visible | Rendu OK |

### Phase 2 : Stories Atoms P1 (J10 après-midi - 3h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 2.1 | Créer `Button.stories.tsx` | Tous variants | 5+ stories |
| 2.2 | Créer `Input.stories.tsx` | Tous variants | 3+ stories |
| 2.3 | Créer `Avatar.stories.tsx` | Tous variants | 4+ stories |
| 2.4 | Créer `Badge.stories.tsx` | Tous variants | Par catégorie |
| 2.5 | Créer `Rating.stories.tsx` | Tous variants | 3+ stories |
| 2.6 | Créer `Card.stories.tsx` | Tous variants | 2+ stories |

### Phase 3 : Stories Molecules (J11 - 3h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 3.1 | Créer `ProfileCard.stories.tsx` | Tous variants | 4+ stories |
| 3.2 | Créer `MessageBubble.stories.tsx` | Tous variants | 3+ stories |
| 3.3 | Créer `EmptyState.stories.tsx` | Tous variants | 2+ stories |
| 3.4 | Créer `ConversationItem.stories.tsx` | Tous variants | 3+ stories |
| 3.5 | Créer `ConfirmDialog.stories.tsx` | Tous variants | 2+ stories |

### Phase 4 : Stories Organisms (J12 - 3h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 4.1 | Créer `Header.stories.tsx` | Tous variants | 3+ stories |
| 4.2 | Créer `AuthForm.stories.tsx` | Tous variants | 4+ stories |
| 4.3 | Créer `SearchBar.stories.tsx` | Tous variants | 2+ stories |
| 4.4 | Créer `Footer.stories.tsx` | Default | 1+ story |

### Phase 5 : Finalisation (J12 fin - 30min) ✅

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 5.1 | Vérifier scripts npm | package.json | ✅ `npm run storybook` OK |
| 5.2 | Build production | storybook-static/ | ✅ `npm run build-storybook` OK |

---

## Dépendances

### Requiert (inputs)

| Dépendance | Fichier source | Statut |
| ---------- | -------------- | ------ |
| Composants existants | frontend/src/components/ | ✅ Existant |
| Tailwind configuré | tailwind.config.js | ✅ Existant |
| Node 20+ | Système | ✅ Requis |

### Bloque (outputs)

| Fichier dépendant | Raison |
| ----------------- | ------ |
| 11-figma.md | Storybook ↔ Figma integration |
| 13-deploiement.md | URL Storybook à déployer |
| 12-soutenance.md | Démo composants |

---

## Critères de validation

### Obligatoires (must-have) ✅

- [x] Storybook fonctionnel (`npm run storybook`)
- [x] 15/15 Atoms documentés (100%)
- [x] 9/9 Molecules documentées (100%)
- [x] 4/4 Organisms P1 documentés (100%)
- [x] `npm run build-storybook` sans erreur
- [x] Autodocs activé sur tous les composants
- [x] Addon a11y installé et fonctionnel

### Optionnels (nice-to-have)

- [ ] Tests d'interaction sur composants complexes
- [ ] Intégration Figma (addon-designs)

---

## Ressources nécessaires

### Outils

```bash
# Développement
npm run storybook         # Port 6006

# Build
npm run build-storybook   # output: storybook-static/
```

### Documentation

- Storybook : <https://storybook.js.org/docs>
- Addon a11y : <https://storybook.js.org/addons/@storybook/addon-a11y>

### Temps estimé

| Phase | Durée | Statut |
| ----- | ----- | ------ |
| Phase 1 | 2h | ✅ Setup |
| Phase 2 | 3h | ✅ Atoms |
| Phase 3 | 3h | ✅ Molecules |
| Phase 4 | 3h | ✅ Organisms |
| Phase 5 | 30min | ✅ Finalisation |
| **Total** | **~11h** | ✅ Terminé |

---

## Risques spécifiques

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| Composants non isolables | Stories complexes | ✅ Résolu avec props explicites |
| Breaking changes Storybook | Build cassé | Version fixée (10.2.0) |

---

## Métriques atteintes ✅

| Métrique | Objectif | Actuel | Statut |
| -------- | -------- | ------ | ------ |
| Atoms documentés | 100% (15/15) | 15/15 | ✅ |
| Molecules documentés | 75% (6/8) | 9/9 (100%) | ✅ Dépassé |
| Organisms P1 documentés | 100% (4/4) | 4/4 | ✅ |
| Total stories | ~25 | 170 | ✅ Dépassé |
| Accessibilité | Addon a11y | Installé | ✅ |

---

## Fichiers à créer (checklist finale)

```plaintext
frontend/
├── [✅] .storybook/
│   ├── [✅] main.ts
│   ├── [✅] preview.ts
│   └── [ ] preview-head.html
│
├── [✅] src/components/atoms/
│   ├── [✅] Button.stories.tsx
│   ├── [✅] Input.stories.tsx
│   ├── [✅] Avatar.stories.tsx
│   ├── [✅] Badge.stories.tsx
│   ├── [✅] Rating.stories.tsx
│   ├── [✅] Card.stories.tsx
│   ├── [✅] Label.stories.tsx
│   ├── [✅] Textarea.stories.tsx
│   ├── [✅] Separator.stories.tsx
│   ├── [✅] PasswordInput.stories.tsx
│   ├── [✅] Logo.stories.tsx
│   ├── [✅] Dialog.stories.tsx
│   ├── [✅] DropdownMenu.stories.tsx
│   ├── [✅] Icons.stories.tsx
│   └── [✅] Link.stories.tsx
│
├── [✅] src/components/molecules/
│   ├── [✅] ProfileCard.stories.tsx
│   ├── [✅] MessageBubble.stories.tsx
│   ├── [✅] EmptyState.stories.tsx
│   ├── [✅] ConversationItem.stories.tsx
│   ├── [✅] ConfirmDialog.stories.tsx
│   ├── [✅] StepHowItWorks.stories.tsx
│   ├── [✅] UserDropdown.stories.tsx
│   ├── [✅] ConversationSkeleton.stories.tsx
│   └── [✅] Pagination.stories.tsx
│
└── [✅] src/components/organisms/
    ├── [✅] Header/Header.stories.tsx
    ├── [✅] AuthForm.stories.tsx
    ├── [✅] SearchPage/SearchBar.stories.tsx
    └── [✅] Footer.stories.tsx
```

**Total** : 3 configs + 15 atoms + 9 molecules + 4 organisms = **31 fichiers** ✅

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [07-docusaurus-diataxis](./07-docusaurus-diataxis.md) | [09-typedoc](./09-typedoc.md) |
