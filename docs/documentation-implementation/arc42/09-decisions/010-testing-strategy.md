# ADR-010 : Stratégie de Tests Diversifiée

## Statut

Accepté (2025-01)

## Contexte

Le frontend SkillSwap utilise l'architecture Atomic Design avec **68 composants** React et **34 fichiers** de logique métier (24 hooks + 6 utilitaires `lib/` + 4 validators Zod, comptages au 2026-08-09). Une approche naïve consistant à tout tester avec un seul outil (Jest/Vitest) créerait :

- ~90 fichiers de tests
- Une duplication significative entre tests unitaires et documentation Storybook
- Un effort disproportionné par rapport à la valeur ajoutée

Le défi est de maximiser la couverture fonctionnelle tout en minimisant l'effort et la redondance.

## Décision

Adopter une **stratégie de tests diversifiée** où chaque outil est utilisé pour ce qu'il fait le mieux :

```
┌─────────────────────────────────────────────────────────────────┐
│                    PYRAMIDE DE TESTS FRONTEND                    │
├─────────────────────────────────────────────────────────────────┤
│                         ╱╲                                       │
│                        ╱  ╲      PLAYWRIGHT (4 tests)            │
│                       ╱ E2E╲     Parcours utilisateur critiques  │
│                      ╱──────╲                                    │
│                     ╱        ╲                                   │
│                    ╱  VITEST  ╲   VITEST (~14 tests)             │
│                   ╱  hooks/lib ╲  Logique métier uniquement      │
│                  ╱──────────────╲                                │
│                 ╱                ╲                                │
│                ╱    STORYBOOK     ╲  STORYBOOK (~25 stories)     │
│               ╱   composants UI    ╲ Atoms/Molecules/Organisms   │
│              ╱──────────────────────╲                            │
│             ╱                        ╲                           │
│            ╱        TYPESCRIPT        ╲  Types = Tests gratuits  │
│           ╱────────────────────────────╲                         │
└─────────────────────────────────────────────────────────────────┘
```

### Répartition des responsabilités

| Cible | Outil | Ce qu'il valide |
|-------|-------|-----------------|
| **Composants UI** (53) | Storybook | Props, variants, interactions, accessibilité, visuels |
| **Hooks** (10) | TypeDoc + Vitest | Documentation API + comportement async |
| **Lib/Utils** (13) | TypeDoc + Vitest | Documentation API + fonctions pures |
| **Parcours utilisateur** | Playwright | Intégration E2E complète |

### Principe clé

> **Ne pas dupliquer les tests.** Storybook documente ET teste les composants.
> Écrire des tests Vitest pour les composants serait redondant.

## Alternatives considérées

| Alternative | Avantages | Inconvénients |
|-------------|-----------|---------------|
| **Tout Vitest/Jest** | Un seul outil à maîtriser | Redondant avec Storybook, pas de tests visuels |
| **Tout Cypress** | Tests E2E puissants | Trop lent pour tests unitaires, coûteux |
| **Testing Library seul** | Standard React | Pas de documentation, pas de tests visuels |
| **Pas de tests** | Rapide | Inacceptable pour un projet professionnel |

### Pourquoi Storybook remplace les tests de composants

| Besoin | Storybook | Vitest |
|--------|-----------|--------|
| Tester les props/variants | ✅ Controls + Stories | Redondant |
| Tester les interactions | ✅ addon-interactions | Redondant |
| Tester l'accessibilité | ✅ addon-a11y | Non disponible |
| Régression visuelle | ✅ Chromatic | Non disponible |
| Documentation | ✅ Autodocs | Non disponible |

## Conséquences

### Positives

- **Réduction de 50% de l'effort** : ~44 fichiers au lieu de ~90
- **Pas de redondance** : chaque test a une raison d'être
- **Meilleure couverture** : tests visuels et a11y via Storybook
- **Documentation vivante** : Storybook + TypeDoc = documentation toujours à jour
- **CI/CD efficace** : tests rapides (Vitest) + tests E2E ciblés (Playwright)

### Négatives

- **Plusieurs outils à maîtriser** : Storybook, Vitest, Playwright, TypeDoc
- **Configuration initiale** : 4 outils à configurer
- **Discipline requise** : respecter la séparation des responsabilités

## Quantification

| Métrique | Approche naïve | Approche diversifiée | Gain |
|----------|----------------|----------------------|------|
| Fichiers de tests | ~90 | ~44 | -51% |
| Tests composants Vitest | ~30 | 0 | -100% |
| Couverture fonctionnelle | ✅ | ✅ | Identique |
| Tests visuels | ❌ | ✅ Chromatic | +100% |
| Tests accessibilité | ❌ | ✅ addon-a11y | +100% |

## Implémentation

### Ce que Vitest teste (et rien d'autre)

```typescript
// ✅ Tester : logique complexe avec comportement async
// hooks/useSearch.test.ts
describe('useSearch', () => {
  it('should debounce search query', async () => { ... });
});

// ✅ Tester : fonctions pures avec edge cases
// lib/dateTime.utils.test.ts
describe('formatRelativeTime', () => {
  it('should handle null dates', () => { ... });
});

// ❌ NE PAS tester avec Vitest : composants React
// → Utiliser Storybook à la place
```

### Ce que Storybook documente

```typescript
// ✅ Documenter : tous les composants avec leurs variants
// components/atoms/Button.stories.tsx
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
```

## Statut d'implémentation au 2026-05-07

Cette ADR documente une **décision d'architecture** et la cible visée. À la
date de la soutenance, l'implémentation est partielle et asymétrique :

| Brique de l'ADR                                    | Présence dans le dépôt de production                                                       | Source de vérité                                          |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| **Vitest** (tests unitaires logique métier)        | ❌ Non installé dans `frontend/package.json`                                               | `grep -i vitest frontend/package.json` → 0 résultat       |
| **Playwright** (E2E)                               | ❌ Non installé dans `frontend/package.json`                                               | idem                                                      |
| **Storybook + addon-a11y + Chromatic**             | ❌ Aucun package `@storybook/*` dans `frontend/package.json`                               | idem                                                      |
| **TypeDoc** (hooks/lib)                            | ❌ Non installé                                                                            | idem                                                      |
| **`node --test` natif** (backend, tests d'intégration) | ✅ 7 fichiers `*.spec.test.ts` ; 5/7 en échec sur fixture (cf. [10.2 Tests](../10-quality/testing.md)) | `find backend -name "*.spec.test.ts"`            |
| **Couverture mesurée**                             | ❌ Aucun outil branché en CI                                                               | -                                                         |

L'intégration de **Vitest, Playwright, Storybook + Chromatic + addon-a11y, et
TypeDoc** a été planifiée et documentée dans `docs/documentation-strategy/`,
puis ajoutée au **périmètre documentaire post-soutenance**. La mise en
œuvre dans le code frontend reste à faire (Roadmap §4-§9 de
[10.2 Tests](../10-quality/testing.md)).

> Cette ADR est conservée telle quelle pour ne pas réécrire l'histoire :
> elle reflète la décision prise au moment de l'analyse architecturale.
> Le présent encart en consigne l'état d'avancement réel.

---

## Liens

!!! note "Documents de stratégie"
    Les plans d'action détaillés se trouvent dans le dossier `docs/documentation-strategy/` :

    - `08-storybook.md` - Configuration et stories des composants UI (intention)
    - `09-typedoc.md` - Documentation des hooks et utilitaires (intention)
    - `10-tests.md` - Tests Vitest et Playwright (intention)

---

[← Retour à l'index](./index.md)
