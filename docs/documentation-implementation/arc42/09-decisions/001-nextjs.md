# ADR-001 : Next.js App Router

## Statut

Accepté (2024-12)

## Contexte

Choix du framework frontend pour l'application React SkillSwap. L'équipe devait choisir entre plusieurs options pour le routing et le rendu.

## Décision

**Adopter Next.js 14 avec App Router** plutôt que Pages Router ou Create React App.

## Alternatives considérées

| Alternative | Avantages | Inconvénients | Raison du rejet |
| ----------- | --------- | ------------- | --------------- |
| Pages Router | Mature, documentation complète | Pattern ancien, pas de Server Components | Moins moderne |
| Create React App | Simple, bien connu | Pas de SSR, routing manuel, déprécié | Fonctionnalités limitées |
| Vite + React Router | Rapide, flexible | Pas de SSR natif, plus de config | Trop de configuration |

## Conséquences

### Positives

- Server Components par défaut (meilleure performance)
- Routing basé sur les fichiers (structure intuitive)
- SSR/SSG intégré sans configuration
- Optimisations automatiques (images, fonts)

### Négatives

- Courbe d'apprentissage pour l'équipe
- Documentation App Router encore jeune
- Certains patterns différents de React classique

## Structure adoptée

```plaintext
app/
├── (app)/              # Routes authentifiées
│   ├── conversation/
│   ├── profil/[id]/
│   └── recherche/
├── (auth)/             # Routes d'authentification
│   ├── connexion/
│   └── inscription/
├── layout.tsx          # Layout racine
└── page.tsx            # Page d'accueil
```

---

[← Retour à l'index](./index.md)
