# ADR-006 : Atomic Design

## Statut

Accepté (2024-12)

## Contexte

Le frontend SkillSwap nécessite une organisation claire des ~57 composants React pour faciliter la réutilisation, assurer la cohérence visuelle et permettre une maintenance efficace.

## Décision

**Atomic Design** (Brad Frost) plutôt qu'une structure plate ou feature-based.

## Alternatives considérées

| Alternative       | Avantages                    | Inconvénients                    |
| ----------------- | ---------------------------- | -------------------------------- |
| Feature-based     | Colocation par fonctionnalité| Duplication de composants        |
| Flat structure    | Simple                       | Ingérable avec 50+ composants    |
| DDD               | Alignement métier            | Over-engineering pour cette taille|

## Conséquences

### Positives

- Structure claire et prévisible
- Facilite la documentation (Storybook)
- Nomenclature comprise par tous les développeurs React

### Négatives

- Parfois difficile de décider molecule vs organism
- Nécessite une discipline pour maintenir la hiérarchie

## Structure adoptée

```plaintext
components/
├── atoms/          # 16 composants (Button, Input, Avatar)
├── molecules/      # 9 composants (ProfileCard, MessageBubble)
├── organisms/      # 30 composants (Header, SearchPage)
├── layouts/        # 1 composant (MainLayout)
└── providers/      # 1 composant (AuthProvider)
```

## Règles de composition

1. **Atoms** : Aucune dépendance vers d'autres composants internes
2. **Molecules** : Composent uniquement des atoms
3. **Organisms** : Peuvent utiliser atoms, molecules et autres organisms

---

[← Retour à l'index](./index.md)
