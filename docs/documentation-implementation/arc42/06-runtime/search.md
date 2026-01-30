# 6.2 Recherche de compétences

## Flow de recherche avec debounce

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant F as Frontend (useSearch)
    participant B as Backend
    participant MS as Meilisearch
    participant DB as PostgreSQL

    U->>F: Tape "React" dans le champ
    Note over F: Debounce 300ms
    F->>F: setQuery("React")
    Note over F: Attente 300ms...
    U->>F: Ajoute " Native"
    Note over F: Reset timer
    Note over F: Attente 300ms...
    F->>F: setDebouncedQuery("React Native")
    F->>B: GET /api/search?q=React+Native
    B->>MS: POST /indexes/members/search
    MS-->>B: { hits: [id1, id2, id3] }
    B->>DB: SELECT * FROM user WHERE id IN (id1, id2, id3)
    DB-->>B: Users avec skills, ratings
    B-->>F: { results: [...], total: 3 }
    F-->>U: Affiche 3 profils
```

---

## Hook useSearch

```typescript
// Simplifié pour illustration
function useSearch(initialQuery = '', debounceMs = 300) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Fetch effect
  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMembers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  return { query, setQuery, results: data, isLoading };
}
```

---

## Points clés

| Aspect | Implémentation |
| ------ | -------------- |
| **Debounce** | 300ms pour éviter les requêtes inutiles |
| **Meilisearch** | Recherche full-text avec typo-tolerance |
| **Hydratation** | IDs de Meilisearch → données complètes de PostgreSQL |
| **Cache** | TanStack Query avec staleTime de 5 minutes |

---

## Filtres disponibles

```mermaid
graph LR
    subgraph "Filtres"
        A[Query texte]
        B[Catégorie]
        C[Ville]
        D[Disponibilité]
    end

    A --> E[Recherche]
    B --> E
    C --> E
    D --> E
```

| Filtre | Paramètre | Exemple |
| ------ | --------- | ------- |
| Texte libre | `q` | `React Native` |
| Catégorie | `categoryId` | `1` (Développement) |
| Ville | `city` | `Paris` |
| Disponibilité | `available` | `true` |

---

[← Retour à l'index](./index.md)
