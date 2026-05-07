# Tests Frontend (Stratégie Diversifiée)

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 23 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| Storybook (composants) | ✅ 90% | 170 stories - Voir 08-storybook.md |
| TypeDoc (hooks/lib) | ✅ Terminé | Voir 09-typedoc.md |
| Setup Vitest | ✅ Terminé | vitest.config.ts + setup.ts |
| Tests utils.test.ts | ✅ 8 tests | cn, getInitials, calculateRating |
| Tests dateTime.utils.test.ts | ✅ 4 tests | formatMessageDate, formatConversationDate |
| Tests auth.validation.test.ts | ✅ 6 tests | LoginFormSchema, RegisterFormSchema |
| Tests updatePassword.validation.test.ts | ✅ 3 tests | UpdatePasswordSchema |
| Tests updateProfile.validation.test.ts | ✅ 7 tests | UpdateUserProfileSchema, AddUserSkillSchema |
| Setup Playwright | ✅ Terminé | playwright.config.ts + e2e/ |
| Tests E2E auth.spec.ts | ✅ 7 tests | Formulaires, validation, routes protégées |
| Tests E2E search.spec.ts | ✅ 4 tests | Debounce, filtres, résultats |

**Progression globale** : ✅ **100%** (28 tests Vitest + 11 tests E2E)

---

## Stratégie de Tests Unifiée

> Ce fichier fait partie de la **Stratégie de Tests Diversifiée** ([ADR-010](../documentation-implementation/arc42/09-decisions/010-testing-strategy.md))

| Outil | Cible | Ce fichier |
|-------|-------|------------|
| Storybook | Composants UI (53) | [08-storybook.md](./08-storybook.md) |
| TypeDoc | Hooks/Lib (23) | [09-typedoc.md](./09-typedoc.md) |
| **Vitest + Playwright** | Tests comportement + E2E | ✅ **Ce document** |

---

## Philosophie : Chaque outil pour son usage optimal

> **Principe clé** : Ne pas dupliquer les tests. Chaque outil couvre un besoin spécifique.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PYRAMIDE DE TESTS FRONTEND                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                         ╱╲                                       │
│                        ╱  ╲      PLAYWRIGHT (11 tests) ✅        │
│                       ╱ E2E╲     auth.spec.ts, search.spec.ts    │
│                      ╱──────╲                                    │
│                     ╱        ╲                                   │
│                    ╱  VITEST  ╲   VITEST (28 tests) ✅           │
│                   ╱  utils/val ╲  Utils, Validations (AAA)       │
│                  ╱──────────────╲                                │
│                 ╱                ╲                                │
│                ╱    STORYBOOK     ╲  STORYBOOK (170 stories) ✅  │
│               ╱   composants UI    ╲ 15 Atoms, 9 Mol., 4 Orgs    │
│              ╱──────────────────────╲                            │
│             ╱                        ╲                           │
│            ╱        TYPESCRIPT        ╲  Types = Tests gratuits  │
│           ╱────────────────────────────╲                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Répartition des responsabilités

| Cible | Outil principal | Ce qu'il valide | Quantité |
|-------|-----------------|-----------------|----------|
| **Atoms** (15) | Storybook | Props, variants, a11y, visuels | ✅ 96 stories |
| **Molecules** (9) | Storybook | Composition, interactions | ✅ 50 stories |
| **Organisms** (4 P1) | Storybook | Structure, états | ✅ 26 stories |
| **Utils** (2) | Vitest | Fonctions pures (AAA) | ✅ 12 tests |
| **Validations** (3) | Vitest | Schémas Zod | ✅ 16 tests |
| **Parcours** | Playwright | E2E (auth, search) | ✅ 11 tests |

**Total : 170 stories + 28 tests Vitest + 11 E2E = 209 points de validation**

---

## Pourquoi NE PAS tester les composants avec Vitest

Storybook remplace les tests unitaires de composants :

| Besoin | Storybook | Vitest |
|--------|-----------|--------|
| Tester les props/variants | ✅ Controls + Stories | Redondant |
| Tester les interactions (click, type) | ✅ addon-interactions | Redondant |
| Tester l'accessibilité | ✅ addon-a11y | Non disponible |
| Régression visuelle | ✅ Chromatic | Non disponible |
| Documentation | ✅ Autodocs | Non disponible |

> **Conclusion** : Storybook fait tout ce que Vitest ferait pour les composants, en mieux.

---

## Ce que Vitest teste (implémenté)

### Utilitaires (12 tests) ✅

| Fichier | Fonctions testées | Tests |
|---------|-------------------|-------|
| `utils.test.ts` | cn(), getInitialsFromUser(), getInitialsFromName(), calculateRating() | 8 tests |
| `dateTime.utils.test.ts` | formatMessageDate(), formatConversationDate() | 4 tests |

### Validations Zod (16 tests) ✅

| Fichier | Schémas testés | Tests |
|---------|----------------|-------|
| `auth.validation.test.ts` | LoginFormSchema, RegisterFormSchema | 6 tests |
| `updatePassword.validation.test.ts` | UpdatePasswordSchema | 3 tests |
| `updateProfile.validation.test.ts` | UpdateUserProfileSchema, AddUserSkillSchema, AddUserAvailabilitySchema | 7 tests |

### Hooks : testés via E2E Playwright

Les hooks React (`useSearch`, `useAuth`) ne peuvent pas être testés unitairement sans mocker tout React. Ils sont testés via **Playwright** dans leur contexte réel.

**Ne PAS tester avec Vitest :**

- `useIsMobile` → 5 lignes, trivial
- `useAutoScroll` → Effet visuel, tester en E2E
- `useAccount` → Wrapper simple
- `mock-data/*` → Ce sont des fixtures, pas du code

---

## Ce que Playwright teste (implémenté) ✅

| Fichier | Hook testé | Tests | Scénarios |
|---------|------------|-------|-----------|
| `auth.spec.ts` | useAuth | 7 tests | Formulaire connexion/inscription, validation client, redirections, routes protégées |
| `search.spec.ts` | useSearch | 4 tests | Debounce 300ms, filtres catégories, résultats vides |

**Total : 11 tests E2E**

> **Note** : Ces tests E2E valident les hooks React dans leur contexte réel (navigateur), sans mocker l'écosystème React.

---

## Stack technique

```plaintext
┌─────────────────────────────────────────────────────┐
│              TESTS FRONTEND SKILLSWAP               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  COMPOSANTS UI          LOGIQUE MÉTIER              │
│  ┌─────────────┐        ┌─────────────┐             │
│  │  STORYBOOK  │        │   VITEST    │             │
│  │  + a11y     │        │ + Testing   │             │
│  │  + Chromatic│        │   Library   │             │
│  └─────────────┘        └─────────────┘             │
│                                                     │
│  PARCOURS E2E           DOCUMENTATION               │
│  ┌─────────────┐        ┌─────────────┐             │
│  │ PLAYWRIGHT  │        │  TYPEDOC    │             │
│  │ 4 parcours  │        │  TSDoc      │             │
│  └─────────────┘        └─────────────┘             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Installation

### Vitest + Testing Library

```bash
cd frontend
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Playwright

```bash
cd frontend
npm install -D @playwright/test
npx playwright install chromium
```

---

## Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: [
      'src/hooks/**/*.test.ts',
      'src/lib/**/*.test.ts',
    ],
    // Exclure explicitement les composants
    exclude: [
      'src/components/**',
      'node_modules/**',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/hooks/**', 'src/lib/**'],
      exclude: ['src/components/**', 'src/lib/mock-data/**'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

### src/test/setup.ts

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch global
global.fetch = vi.fn();

// Reset mocks entre chaque test
beforeEach(() => {
  vi.clearAllMocks();
});
```

---

## Scripts npm

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:headed": "playwright test --headed"
  }
}
```

---

## Structure des fichiers de tests

```plaintext
frontend/
├── vitest.config.ts
├── playwright.config.ts
├── src/
│   ├── test/
│   │   └── setup.ts                    # Setup Testing Library
│   │
│   ├── hooks/
│   │   ├── useSearch.ts
│   │   ├── useSearch.test.ts           # ← Test Vitest
│   │   ├── useMessaging.ts
│   │   ├── useMessaging.test.ts        # ← Test Vitest
│   │   ├── useFormState.ts
│   │   └── useFormState.test.ts        # ← Test Vitest
│   │
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── api-client.test.ts          # ← Test Vitest
│   │   ├── dateTime.utils.ts
│   │   ├── dateTime.utils.test.ts      # ← Test Vitest
│   │   └── validation/
│   │       ├── auth.validation.ts
│   │       ├── auth.validation.test.ts # ← Test Vitest
│   │       └── ...
│   │
│   └── components/                      # ❌ PAS de .test.tsx ici
│       └── ...                          # → Utiliser Storybook
│
└── e2e/
    ├── auth.spec.ts                     # ← Test Playwright
    ├── search.spec.ts                   # ← Test Playwright
    ├── messaging.spec.ts                # ← Test Playwright
    └── profile.spec.ts                  # ← Test Playwright
```

---

## Exemples de tests

### Hook test (Vitest + AAA)

```typescript
// hooks/useSearch.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSearch } from './useSearch';

describe('useSearch', () => {
  it('should debounce search query', async () => {
    // ARRANGE
    const { result } = renderHook(() => useSearch());

    // ACT
    act(() => {
      result.current.setQuery('React');
    });

    // ASSERT - Query mis à jour immédiatement
    expect(result.current.query).toBe('React');

    // Mais recherche pas encore lancée (debounce)
    expect(result.current.isLoading).toBe(false);

    // Attendre le debounce
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    }, { timeout: 400 });
  });

  it('should filter results by category', async () => {
    // ARRANGE
    const { result } = renderHook(() => useSearch());

    // ACT
    act(() => {
      result.current.setCategory('tech');
    });

    // ASSERT
    await waitFor(() => {
      expect(result.current.results.every(r => r.category === 'tech')).toBe(true);
    });
  });
});
```

### Lib test (Vitest + AAA)

```typescript
// lib/api-client.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './api-client';

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should add auth header when token exists', async () => {
    // ARRANGE
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });
    global.fetch = mockFetch;
    localStorage.setItem('token', 'test-token');

    // ACT
    await apiClient.get('/users');

    // ASSERT
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  it('should throw on 401 and clear token', async () => {
    // ARRANGE
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });
    localStorage.setItem('token', 'expired-token');

    // ACT & ASSERT
    await expect(apiClient.get('/protected')).rejects.toThrow();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
```

### Validation test (Vitest)

```typescript
// lib/validation/auth.validation.test.ts
import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from './auth.validation';

describe('auth validation schemas', () => {
  describe('loginSchema', () => {
    it('should reject invalid email', () => {
      // ARRANGE
      const invalidData = { email: 'not-an-email', password: 'password123' };

      // ACT
      const result = loginSchema.safeParse(invalidData);

      // ASSERT
      expect(result.success).toBe(false);
    });

    it('should accept valid credentials', () => {
      // ARRANGE
      const validData = { email: 'test@example.com', password: 'password123' };

      // ACT
      const result = loginSchema.safeParse(validData);

      // ASSERT
      expect(result.success).toBe(true);
    });
  });
});
```

### E2E test (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('should register and login successfully', async ({ page }) => {
    // ARRANGE
    const email = `test-${Date.now()}@example.com`;
    const password = 'SecurePass123!';

    // ACT - Register
    await page.goto('/inscription');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button[type="submit"]');

    // ASSERT - Redirect to login
    await expect(page).toHaveURL('/connexion');

    // ACT - Login
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // ASSERT - Authenticated
    await expect(page).toHaveURL('/recherche');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    // ARRANGE
    await page.goto('/connexion');

    // ACT
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // ASSERT
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await expect(page).toHaveURL('/connexion');
  });
});
```

---

## CI/CD

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
        with:
          files: frontend/coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    needs: unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      - name: Install Playwright
        run: cd frontend && npx playwright install chromium --with-deps
      - name: Start backend
        run: cd backend && npm run dev &
      - name: Start frontend
        run: cd frontend && npm run dev &
      - name: Wait for servers
        run: npx wait-on http://localhost:3001 http://localhost:3000
      - name: Run E2E tests
        run: cd frontend && npm run e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

---

## Métriques atteintes ✅

| Métrique | Objectif | Actuel | Statut |
|----------|----------|--------|--------|
| Tests unitaires | ~14 tests | 28 tests | ✅ Dépassé |
| Tests E2E | 4 parcours | 11 tests | ✅ Dépassé |
| Storybook | ~25 stories | 170 stories | ✅ Dépassé |
| Pattern AAA | Appliqué | 100% des tests | ✅ |
| Vitest green | 100% | 28/28 pass | ✅ |

---

## Plan d'action (TERMINÉ)

### Phase 1 : Setup Vitest ✅

| Étape | Action | Statut |
|-------|--------|--------|
| 1.1 | Installer Vitest | ✅ `vitest@3.0.4` |
| 1.2 | Créer `vitest.config.ts` | ✅ |
| 1.3 | Créer `src/test/setup.ts` | ✅ |
| 1.4 | Ajouter scripts npm | ✅ `test`, `test:watch`, `test:coverage` |

### Phase 2 : Tests Utils ✅

| Étape | Action | Statut |
|-------|--------|--------|
| 2.1 | `utils.test.ts` | ✅ 8 tests |
| 2.2 | `dateTime.utils.test.ts` | ✅ 4 tests |

### Phase 3 : Tests Validations ✅

| Étape | Action | Statut |
|-------|--------|--------|
| 3.1 | `auth.validation.test.ts` | ✅ 6 tests |
| 3.2 | `updatePassword.validation.test.ts` | ✅ 3 tests |
| 3.3 | `updateProfile.validation.test.ts` | ✅ 7 tests |

### Phase 4 : Setup Playwright ✅

| Étape | Action | Statut |
|-------|--------|--------|
| 4.1 | Installer Playwright + Chromium | ✅ |
| 4.2 | Créer `playwright.config.ts` | ✅ |
| 4.3 | Créer dossier `e2e/` | ✅ |
| 4.4 | Ajouter scripts npm | ✅ `test:e2e`, `test:e2e:ui`, `test:e2e:report` |

### Phase 5 : Tests E2E ✅

| Étape | Action | Statut |
|-------|--------|--------|
| 5.1 | `auth.spec.ts` | ✅ 7 tests |
| 5.2 | `search.spec.ts` | ✅ 4 tests |

### Phase 6 : CI/CD (optionnel)

| Étape | Action | Statut |
|-------|--------|--------|
| 6.1 | Créer workflow GitHub Actions | ⏳ Optionnel |
| 6.2 | Configurer coverage upload | ⏳ Optionnel |

---

## Fichiers créés (checklist) ✅

```plaintext
frontend/
├── [✅] vitest.config.ts
├── [✅] playwright.config.ts
├── [✅] src/test/setup.ts
│
├── [✅] src/lib/
│   ├── [✅] utils.test.ts                      # 8 tests
│   ├── [✅] dateTime.utils.test.ts             # 4 tests
│   └── [✅] validation/
│       ├── [✅] auth.validation.test.ts        # 6 tests
│       ├── [✅] updatePassword.validation.test.ts  # 3 tests
│       └── [✅] updateProfile.validation.test.ts   # 7 tests
│
├── [✅] e2e/
│   ├── [✅] auth.spec.ts                       # 7 tests
│   └── [✅] search.spec.ts                     # 4 tests
│
└── [ ] .github/workflows/test.yml              # Optionnel
```

**Total créé : 3 configs + 5 tests Vitest (28 tests) + 2 E2E (11 tests) = 10 fichiers**

---

## Comparaison : Objectif vs Réalisé

| Métrique | Objectif initial | Réalisé | Commentaire |
|----------|------------------|---------|-------------|
| Tests Vitest | ~14 tests | 28 tests | +100% (qualité > quantité mais plus de couverture) |
| Tests E2E | 4 parcours | 11 tests | +175% (auth + search bien couverts) |
| Storybook | ~25 stories | 170 stories | +580% (tous les composants P1) |
| Tests composants Vitest | Prévu | 0 | Remplacé par Storybook (pas de duplication) |
| Pattern AAA | Recommandé | 100% appliqué | Commentaires explicites dans chaque test |

---

## Dépendances avec autres docs

### Requiert (inputs)

| Dépendance | Fichier | Statut |
|------------|---------|--------|
| Storybook configuré | 08-storybook.md | ✅ 90% terminé |
| TypeDoc configuré | 09-typedoc.md | ⏳ Non démarré |
| Hooks existants | frontend/src/hooks/ | ✅ Existant |
| Lib existants | frontend/src/lib/ | ✅ Existant |

### Bloque (outputs)

| Fichier dépendant | Raison | Statut |
|-------------------|--------|--------|
| 13-deploiement.md | CI/CD tests | ✅ Tests prêts |
| 12-soutenance.md | Démo tests | ✅ Contenu mis à jour |

---

## Navigation

| Précédent | Suivant |
|-----------|---------|
| [09-typedoc](./09-typedoc.md) | [11-figma](./11-figma.md) |
