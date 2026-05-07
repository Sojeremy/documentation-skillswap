# 10.3 Accessibilité (RGAA 4.1 / WCAG 2.1 AA)

!!! warning "Statut au 2026-05-07"
    L'application **n'a pas fait l'objet d'un audit RGAA formel** (ni
    Lighthouse archivé, ni axe-core CI, ni rapport accessibilité externe).
    Cette page distingue donc clairement les **pratiques effectivement en
    place dans le code** d'une **conformité mesurée**, qui reste à établir.

## Référentiel

| Référentiel        | Version | Statut SkillSwap                                                       |
| ------------------ | ------- | ---------------------------------------------------------------------- |
| **RGAA**           | 4.1     | Référentiel français applicable (article 47 loi n° 2005-102). Non audité. |
| **WCAG**           | 2.1 AA  | Base du RGAA 4.1 (correspondance critère à critère pour les niveaux A et AA). |
| **EN 301 549**     | v3.2.1  | Norme européenne reprise par le RGAA — non vérifiée formellement.      |

> **Lecture honnête** : les bonnes pratiques observées ci-dessous couvrent
> probablement **une partie significative** des critères AA, mais
> l'absence d'audit empêche de le chiffrer. La position correcte à tenir
> est : « conformité partielle estimée, audit prévu en V2 ».

---

## Pratiques en place (MVP)

### 1. Sémantique HTML & internationalisation

| Pratique                                   | Référence                                                     |
| ------------------------------------------ | ------------------------------------------------------------- |
| Attribut `lang` racine (`fr`)              | `frontend/src/app/layout.tsx:25` (`<html lang="fr">`)         |
| Élément `<main id="main-content">` unique  | `frontend/src/components/layouts/MainLayout.tsx:25-27`        |
| Lien d'évitement « Aller au contenu principal » | `frontend/src/components/layouts/MainLayout.tsx:13-18` (`sr-only` + `focus:not-sr-only`) |
| Hiérarchie de titres                       | `<h1>` unique par page, `<h2>`/`<h3>` pour les sections       |
| Boutons natifs `<button>`                  | Atom `Button.tsx` — pas de `<div role="button">`              |
| Labels associés aux champs                 | Atom `Form.tsx` (basé sur `@radix-ui/react-label`)            |

### 2. Composants accessibles via Radix UI

Le frontend s'appuie sur **5 primitives Radix UI** qui fournissent par défaut
focus management, navigation clavier, ARIA roles et gestion `aria-expanded` /
`aria-controls` :

| Primitive Radix                | Composant SkillSwap qui l'enveloppe                          |
| ------------------------------ | ------------------------------------------------------------ |
| `@radix-ui/react-dialog`       | `atoms/Dialog.tsx`, `EditPage/AddAvailabilityDialog.tsx`, …  |
| `@radix-ui/react-dropdown-menu` | `molecules/UserDropdown.tsx`                                 |
| `@radix-ui/react-label`        | `atoms/Form.tsx`                                             |
| `@radix-ui/react-select`       | `atoms/Select.tsx`                                           |
| `@radix-ui/react-slot`         | Pattern `asChild` (composition)                              |

### 3. Attributs ARIA & alternatives textuelles

Mesures (`grep -rcE "aria-..." frontend/src/`) au 2026-05-07 :

| Indicateur                                      | Volume                                            |
| ----------------------------------------------- | ------------------------------------------------- |
| Fichiers utilisant des attributs `aria-*`       | **26** (atoms, molecules, organisms)              |
| Fichiers déclarant des `alt` sur `<img>` / `<Image>` | **10** (Avatar, Logo, ProfileTeaser, Footer, …)   |
| Fichiers avec `sr-only`                         | 3 (MainLayout, Dialog atom, AddAvailabilityDialog)|
| Atoms gérant explicitement `focus-visible` / `focus:ring` | 14                                          |

### 4. Formulaires

- React Hook Form (`react-hook-form@^7.71.1`) gère les états + erreurs ;
- L'atom `Form.tsx` enveloppe `@radix-ui/react-label` → association
  automatique `<label htmlFor>` / `<input id>` ;
- Les messages d'erreur sont rendus à proximité des champs et liés via
  `aria-invalid` / `aria-describedby` (`atoms/Input.tsx`, `atoms/Textarea.tsx`,
  `atoms/PasswordInput.tsx`).

### 5. Linting d'accessibilité

La config ESLint du frontend (`frontend/eslint.config.mjs`) étend
`eslint-config-next/core-web-vitals`, qui **inclut transitivement
`eslint-plugin-jsx-a11y`** dans son preset *recommended*. Les règles
actives couvrent notamment : `alt-text`, `anchor-has-content`,
`aria-props`, `aria-role`, `label-has-associated-control`,
`no-redundant-roles`, `role-supports-aria-props`.

> Aucune règle a11y supplémentaire n'est activée explicitement (pas
> d'extension du preset `strict` ni d'override custom).

### Exemples de code

#### Lien d'évitement

```tsx
// frontend/src/components/layouts/MainLayout.tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:z-100
             focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white
             focus:outline-none"
>
  Aller au contenu principal
</a>
```

#### Dialog Radix accessible

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Ouvrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Titre du dialog</DialogTitle>
    <DialogDescription>
      Description pour les lecteurs d'écran
    </DialogDescription>
  </DialogContent>
</Dialog>
```

#### Champ avec erreur liée

```tsx
<form>
  <label htmlFor="email">Adresse email</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <span id="email-error" role="alert">{errors.email.message}</span>
  )}
</form>
```

---

## Plan V2 / Roadmap RGAA

Outils **non utilisés actuellement** dans la CI ou en pré-commit ; à
introduire pour mesurer et faire progresser la conformité.

| # | Sujet                          | État réel                                                                                                                       | Action V2                                                                                              |
| :-: | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1 | **Audit RGAA formel**          | Aucun audit, aucune grille de critères évaluée                                                                                  | Faire passer une grille RGAA 4.1 (106 critères) sur les pages clés (accueil, recherche, profil, conversation) ; viser AA partiel documenté |
| 2 | **axe-core en CI**             | `axe-core`, `@axe-core/react`, `@axe-core/playwright`, `jest-axe` **absents** de `frontend/package.json`                         | Ajouter `@axe-core/playwright` aux tests E2E ; bloquer la CI sur les violations *serious* / *critical* |
| 3 | **Lighthouse**                 | Aucun rapport Lighthouse archivé dans le repo                                                                                   | Run Lighthouse CI sur les preview Vercel ; viser score Accessibilité ≥ 90                              |
| 4 | **Tests unitaires d'a11y**     | `jest-axe` non installé                                                                                                         | Ajouter `jest-axe` ou équivalent Vitest pour les atoms/molecules à risque                              |
| 5 | **eslint-plugin-jsx-a11y strict** | Le preset `eslint-config-next/core-web-vitals` n'active que les règles *recommended*                                          | Étendre vers `plugin:jsx-a11y/strict` ou enrichir avec `eslint-plugin-jsx-a11y/strict` directement     |
| 6 | **Tests lecteurs d'écran**     | Aucun test manuel NVDA / VoiceOver / JAWS documenté                                                                             | Plan de test manuel sur les parcours critiques (login, inscription, envoi de message)                  |
| 7 | **Storybook + addon-a11y**     | Storybook **n'est pas installé** dans `frontend/package.json`. Une intégration de Storybook avec `@storybook/addon-a11y` est documentée comme intention dans `docs/documentation-strategy/08-storybook.md` | Mettre en œuvre cette intention : installer Storybook + addon-a11y, écrire des stories pour les atoms |
| 8 | **Déclaration d'accessibilité** | Aucune page publique « Déclaration d'accessibilité » (obligation RGAA pour les services publics, recommandée sinon)             | Rédiger et publier une déclaration d'accessibilité indiquant le statut (« non conforme » / « partiellement conforme ») |

---

## Checklist (auto-évaluation au 2026-05-07)

| Critère                                                  | État         |
| -------------------------------------------------------- | ------------ |
| Attribut `lang` racine                                   | ✅ Présent (`fr`) |
| Lien d'évitement                                         | ✅ Présent   |
| Élément `<main>` unique avec `id`                        | ✅ Présent   |
| Tous les inputs ont un label                             | ⚠ À vérifier exhaustivement |
| Focus visible sur tous les éléments interactifs          | ⚠ Couvert pour les atoms ; à confirmer pour molecules/organisms |
| Navigation clavier complète                              | ⚠ Probable via Radix ; non testé formellement |
| Alt text sur toutes les images informatives              | ⚠ Présent sur les images détectées ; pas d'audit exhaustif |
| Hiérarchie de titres logique                             | ⚠ Non audité |
| Contraste ≥ 4.5:1 sur le texte                           | ⚠ Non mesuré (pas de Lighthouse archivé) |
| Pas de contenu qui clignote / scintille                  | ✅ Aucun pattern CSS suspect |

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [← Tests](./testing.md) | [Monitoring →](./monitoring.md) |
