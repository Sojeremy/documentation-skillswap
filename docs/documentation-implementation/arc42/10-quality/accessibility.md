# 10.3 Accessibilité

## Standards WCAG 2.1 AA

| Critère | Exigence | Vérification |
| ------- | -------- | ------------ |
| Contraste | Ratio ≥ 4.5:1 | Lighthouse |
| Navigation clavier | Tab order logique | Manuel |
| Labels | Tous les inputs | ESLint a11y |
| Focus visible | Outline visible | CSS |
| Alt text | Toutes les images | ESLint a11y |

---

## Composants accessibles (shadcn/ui)

Les composants shadcn/ui utilisent Radix UI qui fournit :

- **Radix UI primitives** - Composants accessibles par défaut
- **ARIA attributes** - Attributs intégrés automatiquement
- **Keyboard navigation** - Navigation native au clavier

---

## Exemples d'implémentation

### Formulaire accessible

```tsx
<form>
  <label htmlFor="email">Adresse email</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-describedby="email-error"
  />
  {errors.email && (
    <span id="email-error" role="alert">
      {errors.email.message}
    </span>
  )}
</form>
```

### Dialog accessible

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Ouvrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Titre du dialog</DialogTitle>
    <DialogDescription>
      Description pour les lecteurs d'écran
    </DialogDescription>
    {/* Contenu */}
  </DialogContent>
</Dialog>
```

---

## Outils de vérification

| Outil | Usage |
| ----- | ----- |
| Lighthouse | Audit automatique |
| axe-core | Tests automatisés |
| eslint-plugin-jsx-a11y | Linting |
| NVDA / VoiceOver | Tests manuels |

---

## Checklist

- [ ] Contraste suffisant (4.5:1 minimum)
- [ ] Tous les inputs ont un label
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Navigation au clavier fonctionnelle
- [ ] Alt text sur les images informatives
- [ ] Hiérarchie des titres logique (h1 → h2 → h3)
- [ ] Pas de contenu qui clignote

---

[← Retour à l'index](./index.md)
