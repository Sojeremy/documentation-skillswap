# Documentation Technique - Frontend SkillSwap

> **Derniere mise a jour**: 27 janvier 2026
> **Branch**: `SEO` (prete a merger dans `main`)

---

## Statut des fonctionnalites

| Fonctionnalite              | Statut        | Documentation                                            |
| --------------------------- | ------------- | -------------------------------------------------------- |
| Structure du code           | Reference     | [structure-actuelle.md](./structure-actuelle.md)         |
| Optimisation SEO            | ✅ Implemente | [seo-optimization.md](./seo-optimization.md)             |
| Profil Teaser (SEO/Convers) | ✅ Implemente | [profil-teaser-strategy.md](./profil-teaser-strategy.md) |

---

## Resume des implementations (Janvier 2026)

### SEO - Ce qui a ete fait

```
Phase 0 : Documentation        ✅ Complete
Phase 1 : Fondations SEO       ✅ Complete
Phase 2 : Profils optimises    ✅ Complete (95%)
Phase 3 : JSON-LD              ⏳ Futur
Phase 4 : Avance               ⏳ Futur
```

**Fichiers crees/modifies :**

| Fichier                          | Description                           |
| -------------------------------- | ------------------------------------- |
| `app/robots.ts`                  | robots.txt dynamique                  |
| `app/sitemap.ts`                 | Sitemap dynamique (tous les profils)  |
| `app/(app)/profil/[id]/page.tsx` | Server Component + `generateMetadata` |
| `middleware.ts`                  | Route `/profil/*` publique            |
| `devops/.env.docker`             | `INTERNAL_API_URL` pour Docker        |

**Resultats SEO :**

- Google peut crawler `/`, `/recherche`, `/profil/*`
- Metadata dynamiques par profil (title, description, canonical, Open Graph)
- ISR active (revalidation toutes les heures)
- Pages privees bloquees (`/conversation`, `/mon-profil`)

---

### Profil Teaser - Ce qui a ete fait

**Concept** : Compromis SEO/Conversion inspire de LinkedIn, Superprof, Malt.

```
Visiteur non connecte          Utilisateur connecte
─────────────────────          ────────────────────
     ProfileTeaser       →          ProfileFull
   (donnees limitees)              (profil complet)
   + CTA inscription               + toutes fonctionnalites
```

**Fichiers crees :**

| Fichier                                              | Description                         |
| ---------------------------------------------------- | ----------------------------------- |
| `components/organisms/ProfilePage/ProfileTeaser.tsx` | Vue limitee pour visiteurs          |
| `components/organisms/ProfilePage/ProfileFull.tsx`   | Vue complete pour connectes         |
| `components/organisms/ProfilePage/ProfileClient.tsx` | Orchestrateur (teaser vs full)      |
| `backend/src/services/profile.service.ts`            | Endpoint `GET /profiles/public/:id` |
| `lib/api-types.ts`                                   | Type `ProfileTeaser`                |

**Donnees exposees dans le Teaser (SEO-friendly) :**

| Visible                 | Masque               |
| ----------------------- | -------------------- |
| Prenom + initiale nom   | Nom complet          |
| Avatar                  | Email                |
| Ville                   | Description complete |
| Liste des competences   | Avis detailles       |
| Note moyenne + nb avis  | Disponibilites       |
| Description (150 chars) | Centres d'interet    |

---

## Axes d'amelioration (Futur)

Ces fonctionnalites sont des "nice-to-have" identifies mais non prioritaires :

### Phase 3 : Donnees structurees JSON-LD

| Tache                 | Impact                         | Effort |
| --------------------- | ------------------------------ | ------ |
| Schema `Person`       | Rich snippets (etoiles Google) | Moyen  |
| Schema `Organization` | Info entreprise dans Google    | Faible |
| Schema `WebSite`      | Search box dans Google         | Faible |

**Benefice** : Les profils apparaissent avec etoiles et infos enrichies dans les resultats Google.

### Phase 4 : Optimisations avancees

| Tache                    | Impact                     | Effort |
| ------------------------ | -------------------------- | ------ |
| Open Graph images        | Previews visuelles partage | Moyen  |
| Pages `/competences/*`   | SEO par categorie          | Eleve  |
| Breadcrumbs + schema     | Navigation structuree      | Faible |
| `generateStaticParams()` | Pre-render au build        | Faible |

**Benefice** : Meilleure visibilite sur les reseaux sociaux et SEO par categorie de competence.

---

## Documents de reference

### Structure du code

Vue d'ensemble du frontend (~123 fichiers) :

```
frontend/src/
├── app/                12 fichiers  - Next.js App Router
├── components/         73 fichiers  - Atomic Design
├── hooks/              22 fichiers  - Custom hooks
├── lib/                15 fichiers  - Utilitaires, API, validations
└── middleware.ts       1 fichier    - Protection des routes
```

[→ Voir l'arborescence complete](./structure-actuelle.md)

### Stack technique

| Technologie | Version | Usage                  |
| ----------- | ------- | ---------------------- |
| Next.js     | 16      | Framework (App Router) |
| React       | 19      | UI Library             |
| TypeScript  | 5.x     | Typage statique        |
| Tailwind    | 4       | Styling                |
| Socket.io   | 4.8     | WebSocket temps reel   |
| Zod         | 4.3     | Validation schemas     |

---

## Conventions

### Nommage des fichiers

- `kebab-case.md` pour les documents
- Prefixer par sujet : `seo-*.md`, `profil-*.md`

### Statuts dans les documents

| Icone | Signification            |
| ----- | ------------------------ |
| ✅    | Implemente et teste      |
| ⏳    | A faire (futur)          |
| 🔄    | En cours de modification |

---

_Documentation maintenue par l'equipe SkillSwap - Janvier 2026_
