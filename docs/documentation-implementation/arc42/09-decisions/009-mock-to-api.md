# ADR-009 : Mock-to-API Pattern

## Statut

Accepté (2024-12)

## Contexte

Le développement frontend et backend de SkillSwap se fait en parallèle. Le frontend ne peut pas avancer sans les endpoints API, et les démos sont impossibles sans données réalistes.

## Décision

**Pattern Mock-to-API** avec des données fictives typées pour permettre un développement frontend autonome avec transition fluide vers l'API réelle.

## Alternatives considérées

| Alternative      | Avantages                    | Inconvénients                    |
| ---------------- | ---------------------------- | -------------------------------- |
| MSW              | Intercepte au niveau réseau  | Configuration complexe           |
| Backend-first    | Pas de code à jeter          | Bloque le frontend               |
| JSON Server      | API REST rapide              | Pas de logique métier            |

## Conséquences

### Positives

- Frontend peut avancer sans attendre le backend
- Types partagés garantissent la compatibilité
- Démos possibles à tout moment
- Transition vers l'API = changer une ligne d'import

### Négatives

- Code mock à maintenir temporairement
- Risque de divergence mock/API si les types changent

## Structure

```plaintext
lib/
├── api-client.ts      # Client HTTP réel
├── api-types.ts       # Types TypeScript partagés
└── mock-data/
    ├── mockUser.ts
    ├── mockProfile.ts
    ├── mockCategories.ts
    ├── mockMembers.ts
    └── mockConversation.ts
```

## État actuel

Tous les mocks ont été remplacés par l'API réelle.

---

[← Retour à l'index](./index.md)
