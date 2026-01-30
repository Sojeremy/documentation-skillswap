# ADR-002 : Tailwind CSS + shadcn/ui

## Statut

Accepté (2024-12)

## Contexte

Choix de la solution de styling pour le frontend SkillSwap.

## Décision

**Tailwind CSS avec shadcn/ui** plutôt que CSS Modules ou Styled Components.

## Alternatives considérées

```mermaid
graph LR
    A[Options] --> B[CSS Modules]
    A --> C[Styled Components]
    A --> D[Tailwind + shadcn]

    B --> B1[Verbose]
    B --> B2[Pas de design system]

    C --> C1[Runtime CSS]
    C --> C2[Bundle size]

    D --> D1[Utility-first]
    D --> D2[Composants accessibles]
    D --> D3[Pas de runtime]
```

## Conséquences

### Positives

- Utility-first : développement rapide
- shadcn/ui : composants accessibles prêts à l'emploi
- Pas de CSS runtime (meilleure performance)
- Design system cohérent

### Négatives

- Classes longues dans le JSX
- Apprentissage des utilitaires Tailwind

## Configuration

```plaintext
components/
└── ui/                 # Composants shadcn/ui copiés
    ├── button.tsx
    ├── card.tsx
    └── dialog.tsx
```

---

[← Retour à l'index](./index.md)
