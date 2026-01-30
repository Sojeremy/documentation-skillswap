# ADR-004 : TanStack Query

## Statut

Accepté (2024-12)

## Contexte

Gestion du state serveur côté frontend (données API, cache, synchronisation).

## Décision

**TanStack Query (React Query)** plutôt que Redux ou Zustand pour le state serveur.

## Alternatives considérées

| Aspect           | TanStack Query | Redux       | Zustand     |
| ---------------- | -------------- | ----------- | ----------- |
| Cache intelligent| Natif          | Manuel      | Manuel      |
| Revalidation     | Auto           | Manuel      | Manuel      |
| Boilerplate      | Minimal        | Beaucoup    | Minimal     |
| DevTools         | Excellent      | Bon         | Basique     |

## Conséquences

### Positives

- Cache automatique avec stale-while-revalidate
- Revalidation intelligente (focus, reconnect)
- Mutations optimistes simples
- DevTools excellent pour le debug

### Négatives

- Dépendance supplémentaire
- Provider à la racine de l'app

## Usage

```typescript
// Hooks useQuery et useMutation
const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => api.getUser(userId),
});
```

---

[← Retour à l'index](./index.md)
