# 10.2 Tests & Qualité de code

Cette page sépare clairement **ce qui tourne aujourd'hui** dans le dépôt de
production de **ce qui est planifié** post-soutenance. Toutes les
références pointent vers le code à la date du **2026-05-07**.

---

## État actuel (MVP)

### Backend — `node --test` natif

Le backend utilise le **test runner natif de Node** (≥ 22), sans framework
externe. Aucun outil de coverage n'est branché en CI ; Node propose
`--experimental-test-coverage`, qui n'est cependant pas utilisé pour
l'instant.

#### Scripts définis (`backend/package.json`)

```json
"test:unit":       "node --test ./src/**/*.unit.test.ts",
"test:unit:watch": "node --test --watch ./src/**/*.unit.test.ts",
"test:spec":       "node --test --env-file=./src/test/config/.env.test --import ./src/test/config/global-setup.ts --experimental-test-isolation=none ./src/**/*.spec.test.ts"
```

#### Fichiers de tests présents (7 specs)

| Fichier                                                             | Domaine                              |
| ------------------------------------------------------------------- | ------------------------------------ |
| `backend/src/controllers/auth.controller.spec.test.ts`              | Authentification (register, login, refresh) |
| `backend/src/controllers/conv.spec.test.ts`                         | Conversations                         |
| `backend/src/controllers/follow.controller.spec.test.ts`            | Follow / unfollow                     |
| `backend/src/controllers/message.spec.test.ts`                      | Messages                              |
| `backend/src/controllers/profile.controller.spec.test.ts`           | Profil                                |
| `backend/src/controllers/search.controller.spec.test.ts`            | Recherche Meilisearch                 |
| `backend/src/realtime/socket.spec.test.ts`                          | WebSocket Socket.io                   |

Aucun fichier `*.unit.test.ts` n'est présent : le script `test:unit`
existe par anticipation mais n'a pas de cible à exécuter pour l'instant.

#### Setup global

Le fichier `backend/src/test/config/global-setup.ts` (importé via
`--import`) prépare l'environnement de tests d'intégration : il attend la
base PostgreSQL et Meilisearch, instancie `app` Express et le serveur
Socket.io, et nettoie l'état entre tests via `beforeEach`.

!!! danger "Dette technique : 5/7 specs en échec"
    Au 2026-05-07, **5 des 7 specs échouent** au démarrage avec une erreur
    `roleId: NaN` / `Argument 'role' is missing`. La cause se situe dans
    le **code des fixtures** (`beforeAll` qui ne crée pas correctement le
    rôle parent `Role { name: Membre }` avant de tenter d'insérer des
    utilisateurs), pas dans le code applicatif. À corriger en V2 (cf.
    Roadmap §1). Les specs `auth.controller.spec.test.ts` et
    `socket.spec.test.ts` passent sur les parcours qui ne dépendent pas
    de cette fixture.

#### Couverture mesurée

Aucune mesure de couverture n'est calculée ni stockée à ce jour. Les
chiffres « > 70 % », « > 80 % » historiquement annoncés dans la doc
n'ont jamais été produits par un outil. Position honnête à tenir : « la
couverture n'est pas mesurée à la date de la soutenance ».

### Frontend — pas de framework de test installé

Le `frontend/package.json` du dépôt de production ne contient **aucun**
framework de test (`grep -iE "vitest|playwright|jest|testing-library|storybook"` → 0 résultat).

Les seuls scripts disponibles sont :

```json
"scripts": {
  "dev":    "next dev",
  "build":  "next build",
  "start":  "next start",
  "lint":   "eslint . --ext .ts,.tsx",
  "format": "prettier --write ."
}
```

> Une intégration de **Vitest, Playwright et Storybook (avec Chromatic +
> addon-a11y)** est documentée comme intention dans `docs/documentation-strategy/`
> et a été **ajoutée au périmètre documentaire post-soutenance**. Elle ne
> fait pas partie du dépôt frontend de production à cette date.

---

## Qualité de code

### ESLint — configuration

| Périmètre  | Fichier                          | Preset / extension                                                |
| ---------- | -------------------------------- | ----------------------------------------------------------------- |
| Racine     | `eslint.config.mjs`              | Flat config `typescript-eslint` (recommended) + `eslint-config-prettier` + plugin Prettier |
| Frontend   | `frontend/eslint.config.mjs`     | `eslint-config-next/core-web-vitals` (inclut `eslint-plugin-jsx-a11y` recommended) |
| Backend    | _hérite du racine_               | Pas de config dédiée                                              |

#### Scripts npm

| Localisation        | Script                          |
| ------------------- | ------------------------------- |
| Racine              | `npm run lint` → `eslint .`     |
| `frontend/`         | `npm run lint` → `eslint . --ext .ts,.tsx` |
| `backend/`          | `npm run lint` → `eslint . --ext .ts`      |

!!! warning "Dette : flag `--ext` retiré dans ESLint v9"
    Les scripts frontend et backend invoquent ESLint avec `--ext .ts,.tsx`.
    Or `eslint@^9` (flat config) **a retiré ce flag** : les extensions sont
    déclarées dans `eslint.config.mjs` via `files: ["**/*.ts", "**/*.tsx"]`.
    En l'état, `npm run lint` casse côté frontend et backend (« Invalid
    option `--ext` »). Action V2 : retirer `--ext` des scripts et déplacer
    la liste de fichiers dans la config flat.

### Prettier

- Configuration : `.prettierrc` racine, ignorés via `.prettierignore`.
- Activé en règle ESLint (`'prettier/prettier': 'error'` dans la config racine).

!!! warning "Dette : 129 fichiers frontend non conformes"
    Un `prettier --check .` côté `frontend/` retourne **129 fichiers non
    formatés** au 2026-05-07. Le hook pre-commit lance `prettier --write`
    sur le racine uniquement, ce qui n'a jamais touché ces fichiers.
    Action V2 : un seul `prettier --write .` couplé à une CI qui exécute
    `prettier --check .` à chaque PR.

### Husky — hook pre-commit

Le hook `.husky/pre-commit` réel enchaîne :

```sh
#!/bin/sh
set -e
echo "Running root lint..."     ; npm run lint
echo "Running root format..."   ; npm run format
echo "Running frontend lint..." ; cd frontend && npm run lint && cd ..
echo "Running backend lint..."  ; cd backend && npm run lint && cd ..
echo "✅ Husky pre-commit passed"
```

> Conséquence des deux dettes ci-dessus : sur une machine avec ESLint v9
> propre, le hook **échoue avant d'arriver aux étapes frontend/backend**
> (ou l'inverse selon l'ordre). En pratique, les commits passent
> uniquement parce que le code couvert par le racine reste minimal et
> que les warnings ne sont pas bloquants.

---

## Roadmap V2

| # | Sujet                                              | Action                                                                                                  |
| :-: | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 1 | **Fix fixture `roleId: NaN`**                     | Corriger le `beforeAll` global pour s'assurer que `Role { name: Membre }` est créé avant tout `userFactory(...)` |
| 2 | **Coverage natif backend**                        | Ajouter un script `test:coverage` avec `node --test --experimental-test-coverage --test-coverage-include='src/**/*.ts'` ; archiver le rapport en CI |
| 3 | **Tests `*.unit.test.ts` réels**                  | Le script `test:unit` pointe sur un glob vide — écrire les premiers tests unitaires (services, lib)     |
| 4 | **Framework de test frontend**                    | Choisir entre Vitest (rapide, ESM-first) et Jest (mature) ; couvrir prioritairement les hooks `messaging/*` et `profile/*` |
| 5 | **E2E**                                           | Playwright sur les parcours critiques : inscription, login, recherche, envoi de message                 |
| 6 | **Migration ESLint v9 propre**                    | Retirer `--ext` des scripts ; déclarer les `files: ["**/*.ts", "**/*.tsx"]` dans la flat config         |
| 7 | **Format global**                                 | `prettier --write .` une fois ; ajouter `prettier --check .` en gate CI                                 |
| 8 | **CI bloquante sur tests/lint/format**            | Pipeline GitHub Actions qui exécute lint, format check, et `npm run test:spec` avec services Docker     |
| 9 | **Storybook + Chromatic + addon-a11y**            | Cf. ADR-010 ; chantier de documentation post-soutenance, à formaliser dans `frontend/`                  |

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [← Scénarios](./scenarios.md) | [Accessibilité →](./accessibility.md) |
