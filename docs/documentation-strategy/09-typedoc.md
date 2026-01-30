# TypeDoc (Documentation Code)

[← Retour au README](./README.md)

---

## État d'avancement

> **Dernière mise à jour** : 23 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| Setup TypeDoc | ✅ Terminé | `typedoc` + `typedoc-plugin-markdown` installés |
| Configuration typedoc.json | ✅ Terminé | 9 entry points, skipErrorChecking, exclusions |
| TSDoc Hooks (10 fichiers) | ✅ Terminé | useSearch, useMessaging, useFormState, etc. |
| TSDoc Lib (9 fichiers) | ✅ Terminé | api-client, api-types, utils, validation |
| Intégration MkDocs | ✅ Terminé | Section "TypeDoc (Hooks & Utils)" dans nav |
| Scripts npm | ✅ Terminé | `npm run docs` et `npm run docs:watch` |

**Progression globale** : ✅ **100%**

### Fichiers générés

```plaintext
docs/api/
├── index.md              # Vue d'ensemble avec table des modules
├── Hooks.md              # 10 hooks documentés avec exemples
├── APIClient.md          # Client API avec méthodes documentées
├── Utilities.md          # Fonctions utilitaires (cn, validate, etc.)
├── DateTimeUtilities.md  # formatMessageDate, formatConversationDate
└── lib/
    ├── api-types.md      # Types API (CurrentUser, Member, etc.)
    └── validation/
        ├── auth.validation.md
        ├── conversation.validation.md
        ├── updatePassword.validation.md
        └── updateProfile.validation.md
```

---

## Configuration TypeDoc

### typedoc.json

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": [
    "src/hooks/index.ts",
    "src/lib/api-client.ts",
    "src/lib/api-types.ts",
    "src/lib/utils.ts",
    "src/lib/dateTime.utils.ts",
    "src/lib/validation/auth.validation.ts",
    "src/lib/validation/updateProfile.validation.ts",
    "src/lib/validation/updatePassword.validation.ts",
    "src/lib/validation/conversation.validation.ts"
  ],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "name": "SkillSwap Frontend API",
  "readme": "none",
  "exclude": ["**/*.stories.tsx", "**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/mock-data/**"],
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true,
  "skipErrorChecking": true,
  "outputFileStrategy": "modules",
  "indexFormat": "table",
  "parametersFormat": "table"
}
```

### Scripts npm

```json
{
  "scripts": {
    "docs": "typedoc",
    "docs:watch": "typedoc --watch"
  }
}
```

---

## Hooks documentés

| Hook | Description | Catégorie |
|------|-------------|-----------|
| `useSearch` | Recherche avec debounce, pagination, filtres | Search |
| `useMessaging` | Orchestrateur conversations (compose les sub-hooks) | Messaging |
| `useConversationList` | Liste des conversations | Messaging |
| `useSelectedConversation` | Conversation sélectionnée | Messaging |
| `useConversationActions` | Actions CRUD (create, close, delete, send) | Messaging |
| `useFollowedUsers` | Utilisateurs suivis (pour nouvelle conversation) | Messaging |
| `useFormState` | Gestion état formulaire avec validation Zod | Forms |
| `useAutoScroll` | Scroll automatique avec ResizeObserver | UI |
| `useIsMobile` | Détection viewport mobile | UI |
| `useAccount` | Actions compte (password, delete) | Account |

---

## Utilitaires documentés

### utils.ts

| Fonction | Description |
|----------|-------------|
| `cn()` | Merge classes Tailwind avec clsx + tailwind-merge |
| `getInitialsFromUser()` | Initiales depuis objet UserInfo |
| `getInitialsFromName()` | Initiales depuis string nom complet |
| `calculateRating()` | Moyenne des évaluations |
| `validate()` | Validation Zod avec gestion état erreurs |
| `displayError()` | Affiche erreur en toast Sonner |

### dateTime.utils.ts

| Fonction | Description |
|----------|-------------|
| `formatMessageDate()` | "Aujourd'hui 11:47" / "Hier 14:30" / "10/01/2026" |
| `formatConversationDate()` | "il y a 5 minutes" / "il y a 2 jours" |

---

## Exemple de documentation générée

```markdown
#### useSearch()

> **useSearch**(`options`): `UseSearchReturn`

Hook for searching members with debounce, pagination, and category filtering.

##### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `UseSearchOptions` | Configuration options for search behavior |

##### Returns

`UseSearchReturn` - Search state and control functions

##### Example

```tsx
function SearchPage() {
  const { query, setQuery, results, isLoading } = useSearch();

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {isLoading && <Spinner />}
      {results?.members.map(member => <MemberCard key={member.id} {...member} />)}
    </div>
  );
}
```

---

## Intégration MkDocs

### mkdocs.yml (extrait)

```yaml
nav:
  - TypeDoc (Hooks & Utils):
      - Vue d'ensemble: typedoc/index.md
      - Hooks: typedoc/Hooks.md
      - API Client: typedoc/APIClient.md
      - Types API: typedoc/lib/api-types.md
      - Utilitaires: typedoc/Utilities.md
      - Date/Time: typedoc/DateTimeUtilities.md
      - Validation:
          - Auth: typedoc/lib/validation/auth.validation.md
          - Profil: typedoc/lib/validation/updateProfile.validation.md
          - Mot de passe: typedoc/lib/validation/updatePassword.validation.md
          - Conversation: typedoc/lib/validation/conversation.validation.md
```

---

## Stratégie de Tests Unifiée

> Ce fichier fait partie de la **Stratégie de Tests Diversifiée** ([ADR-010](../documentation-implementation/arc42/09-decisions/010-testing-strategy.md))

| Outil | Cible | Statut |
|-------|-------|--------|
| Storybook | Composants UI (170 stories) | ✅ 100% |
| **TypeDoc** | Hooks/Lib (19 fichiers) | ✅ 100% |
| Vitest | Tests unitaires (28 tests) | ✅ 100% |
| Playwright | Tests E2E (11 tests) | ✅ 100% |

---

## Commandes

```bash
# Générer la documentation
npm run docs

# Mode watch (développement)
npm run docs:watch

# Vérifier la sortie
ls -la docs/api/
```

---

## Critères de validation

### Obligatoires (must-have)

- [x] TypeDoc configuré et fonctionnel
- [x] 10/10 hooks documentés avec TSDoc
- [x] 9/9 fichiers lib documentés
- [x] Output Markdown intégré dans MkDocs
- [x] Navigation vers TypeDoc fonctionnelle

### Optionnels (nice-to-have)

- [x] Exemples de code dans chaque fonction principale
- [ ] Liens croisés vers Arc42
- [ ] Génération automatique en CI/CD

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [08-storybook](./08-storybook.md) | [10-tests](./10-tests.md) |
