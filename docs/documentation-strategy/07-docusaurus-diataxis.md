# Documentation Utilisateur (Docusaurus + Diataxis)

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 23 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| Setup Docusaurus | ✅ Terminé | TypeScript, français, branding SkillSwap |
| Configuration Diataxis (4 sections) | ✅ Terminé | Tutorials, How-to, Explanation, Reference |
| Tutoriels (4 articles) | ✅ Terminé | getting-started, create-profile, add-skills, first-exchange |
| How-to Guides (6 guides) | ✅ Terminé | search-members, send-message, rate-user, follow-members, edit-profile, manage-availabilities |
| Explanation (3 articles) | ✅ Terminé | how-it-works, trust-system, categories |
| Reference (3 pages) | ✅ Terminé | categories-list, settings, faq |
| Screenshots | ⏳ Non démarré | À capturer après feature freeze |

**Progression globale** : ✅ **95%** (contenu complet, screenshots à ajouter)

---

## Objectif

Créer une documentation utilisateur pour SkillSwap afin de :

- Guider les nouveaux utilisateurs dans leurs premiers pas
- Fournir des guides pratiques pour les tâches courantes
- Expliquer le fonctionnement de la plateforme
- Servir de référence pour les fonctionnalités avancées

---

## Framework Diataxis

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                        DIATAXIS                              │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                       │
│  APPRENTISSAGE       │  ACTION                              │
│  (Learning-oriented) │  (Task-oriented)                     │
│                      │                                       │
│  ┌────────────────┐  │  ┌────────────────┐                  │
│  │   TUTORIALS    │  │  │  HOW-TO GUIDES │                  │
│  │                │  │  │                │                  │
│  │ "Apprendre"    │  │  │ "Accomplir"    │                  │
│  │ Pas à pas      │  │  │ Étapes directes│                  │
│  └────────────────┘  │  └────────────────┘                  │
│                      │                                       │
├──────────────────────┼──────────────────────────────────────┤
│                      │                                       │
│  COMPRÉHENSION       │  INFORMATION                         │
│  (Understanding)     │  (Information-oriented)              │
│                      │                                       │
│  ┌────────────────┐  │  ┌────────────────┐                  │
│  │  EXPLANATION   │  │  │   REFERENCE    │                  │
│  │                │  │  │                │                  │
│  │ "Comprendre"   │  │  │ "Consulter"    │                  │
│  │ Contexte, why  │  │  │ Facts, specs   │                  │
│  └────────────────┘  │  └────────────────┘                  │
│                      │                                       │
└──────────────────────┴──────────────────────────────────────┘
```

---

## Inventaire du contenu à créer

### Tutorials (Apprentissage)

| Article | Description | Durée lecture |
| ------- | ----------- | ------------- |
| 01-getting-started | Premiers pas sur SkillSwap | 5 min |
| 02-create-profile | Créer son profil complet | 8 min |
| 03-add-skills | Ajouter ses compétences | 5 min |
| 04-first-exchange | Réaliser son premier échange | 10 min |

### How-to Guides (Action)

| Guide | Cas d'usage | Étapes |
| ----- | ----------- | ------ |
| search-members | Trouver un membre par compétence | 5 |
| send-message | Contacter un membre | 4 |
| rate-member | Évaluer après un échange | 3 |
| follow-member | Suivre un membre | 2 |
| edit-profile | Modifier son profil | 4 |
| manage-availabilities | Gérer ses disponibilités | 3 |

### Explanation (Compréhension)

| Article | Question répondue |
| ------- | ----------------- |
| how-skillswap-works | Comment fonctionne l'échange de compétences ? |
| trust-and-ratings | Comment le système de confiance fonctionne-t-il ? |
| skill-categories | Comment sont organisées les compétences ? |

### Reference (Information)

| Page | Contenu |
| ---- | ------- |
| categories-list | Liste exhaustive des catégories |
| account-settings | Tous les paramètres du compte |
| faq | Questions fréquentes |

---

## Structure cible Docusaurus

```plaintext
user-docs/
├── docusaurus.config.js          # Configuration principale
├── sidebars.js                   # Navigation latérale
├── package.json                  # Dépendances
│
├── docs/
│   ├── intro.md                  # Page d'accueil
│   │
│   ├── tutorials/                # APPRENTISSAGE
│   │   ├── _category_.json
│   │   ├── 01-getting-started.md
│   │   ├── 02-create-profile.md
│   │   ├── 03-add-skills.md
│   │   └── 04-first-exchange.md
│   │
│   ├── how-to/                   # ACTION
│   │   ├── _category_.json
│   │   ├── search-members.md
│   │   ├── send-message.md
│   │   ├── rate-member.md
│   │   ├── follow-member.md
│   │   ├── edit-profile.md
│   │   └── manage-availabilities.md
│   │
│   ├── explanation/              # COMPRÉHENSION
│   │   ├── _category_.json
│   │   ├── how-skillswap-works.md
│   │   ├── trust-and-ratings.md
│   │   └── skill-categories.md
│   │
│   └── reference/                # INFORMATION
│       ├── _category_.json
│       ├── categories-list.md
│       ├── account-settings.md
│       └── faq.md
│
├── static/
│   └── img/
│       ├── screenshots/          # Captures d'écran app
│       │   ├── home.png
│       │   ├── profile.png
│       │   ├── search.png
│       │   └── messaging.png
│       └── icons/
│
└── src/
    └── css/
        └── custom.css            # Styles personnalisés
```

---

## Configuration Docusaurus

```javascript
// docusaurus.config.js
module.exports = {
  title: 'SkillSwap - Guide Utilisateur',
  tagline: 'Échangez vos compétences',
  url: 'https://skillswap-guide.vercel.app',
  baseUrl: '/',
  favicon: 'img/favicon.ico',

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'SkillSwap',
      logo: { alt: 'SkillSwap', src: 'img/logo.svg' },
      items: [
        { to: '/tutorials/getting-started', label: 'Tutoriels', position: 'left' },
        { to: '/how-to/search-members', label: 'Guides', position: 'left' },
        { to: '/explanation/how-skillswap-works', label: 'Comprendre', position: 'left' },
        { to: '/reference/faq', label: 'Référence', position: 'left' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Tutoriels', to: '/tutorials/getting-started' },
            { label: 'FAQ', to: '/reference/faq' },
          ],
        },
      ],
    },
  },
};
```

---

## Plan d'action détaillé

### Phase 1 : Setup Docusaurus (J8 matin - 2h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 1.1 | Créer projet Docusaurus | `user-docs/` créé | `npx create-docusaurus` |
| 1.2 | Configurer `docusaurus.config.js` | Config SkillSwap | `npm start` OK |
| 1.3 | Configurer `sidebars.js` | Navigation Diataxis | 4 sections visibles |
| 1.4 | Ajouter styles custom | `custom.css` | Couleurs SkillSwap |

### Phase 2 : Tutorials (J8 après-midi - 3h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 2.1 | Rédiger `01-getting-started.md` | Tutorial complet | Pas à pas clair |
| 2.2 | Rédiger `02-create-profile.md` | Tutorial complet | Screenshots inclus |
| 2.3 | Rédiger `03-add-skills.md` | Tutorial complet | Screenshots inclus |
| 2.4 | Rédiger `04-first-exchange.md` | Tutorial complet | Flow complet |

### Phase 3 : How-to Guides (J9 matin - 3h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 3.1 | Rédiger `search-members.md` | Guide complet | Étapes numérotées |
| 3.2 | Rédiger `send-message.md` | Guide complet | Étapes numérotées |
| 3.3 | Rédiger `rate-member.md` | Guide complet | Étapes numérotées |
| 3.4 | Rédiger 3 guides restants | 3 guides | Format uniforme |

### Phase 4 : Explanation + Reference (J9 après-midi - 2h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 4.1 | Rédiger 3 articles Explanation | 3 articles | Contexte clair |
| 4.2 | Rédiger `categories-list.md` | Liste complète | Toutes catégories |
| 4.3 | Rédiger `account-settings.md` | Référence complète | Tous paramètres |
| 4.4 | Rédiger `faq.md` | 10+ questions | Réponses utiles |

### Phase 5 : Screenshots et finalisation (J9 fin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 5.1 | Capturer screenshots app | 10+ images | Qualité HD |
| 5.2 | Optimiser images | WebP ou PNG compressé | < 100KB chacune |
| 5.3 | Intégrer dans articles | Images linkées | Affichage OK |
| 5.4 | Relecture finale | Corrections | Pas de typos |

---

## Dépendances

### Requiert (inputs)

| Dépendance | Fichier source | Statut |
| ---------- | -------------- | ------ |
| Application fonctionnelle | frontend/ | ✅ Existant |
| Liste des catégories | Backend API | ✅ Existant |
| Screenshots | App en dev | À capturer |

### Bloque (outputs)

| Fichier dépendant | Raison |
| ----------------- | ------ |
| 13-deploiement.md | URL Docusaurus à déployer |
| 12-soutenance.md | Fiches référencent la doc utilisateur |

---

## Critères de validation

### Obligatoires (must-have)

- [x] Docusaurus fonctionnel en local (`npm start`)
- [x] 4 tutoriels complets (screenshots à ajouter)
- [x] 6 how-to guides avec étapes numérotées
- [x] 3 articles explanation
- [x] FAQ avec 10+ questions/réponses
- [x] Navigation Diataxis claire

### Optionnels (nice-to-have)

- [ ] Recherche full-text fonctionnelle
- [ ] Dark mode
- [ ] Versioning de la documentation
- [ ] Traduction anglais

---

## Ressources nécessaires

### Outils

```bash
# Installation
npx create-docusaurus@latest user-docs classic

# Développement local
cd user-docs && npm start

# Build production
npm run build
```

### Documentation

- Docusaurus : <https://docusaurus.io/docs>
- Diataxis : <https://diataxis.fr/>
- Screenshots : Utiliser l'app en dev

### Temps estimé

| Phase | Durée | Effort |
| ----- | ----- | ------ |
| Phase 1 | 2h | Setup |
| Phase 2 | 3h | Tutorials |
| Phase 3 | 3h | How-to |
| Phase 4 | 2h | Explanation + Reference |
| Phase 5 | 1h | Screenshots |
| **Total** | **11h** | ~1.5 jours |

---

## Risques spécifiques

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| App change après screenshots | Rework images | Screenshots après feature freeze |
| Docusaurus breaking changes | Build cassé | Fixer version dans package.json |
| Contenu trop technique | Inaccessible | Relecture par non-dev |

---

## Fichiers à créer (checklist finale)

```plaintext
user-docs/
├── [x] docusaurus.config.ts
├── [x] sidebars.ts
├── [x] package.json
│
├── [x] docs/
│   ├── [x] index.md
│   ├── [x] tutorials/
│   │   ├── [x] getting-started.md
│   │   ├── [x] create-profile.md
│   │   ├── [x] add-skills.md
│   │   └── [x] first-exchange.md
│   ├── [x] how-to/
│   │   ├── [x] search-members.md
│   │   ├── [x] send-message.md
│   │   ├── [x] rate-user.md
│   │   ├── [x] follow-members.md
│   │   ├── [x] edit-profile.md
│   │   └── [x] manage-availabilities.md
│   ├── [x] explanation/
│   │   ├── [x] how-it-works.md
│   │   ├── [x] trust-system.md
│   │   └── [x] categories.md
│   └── [x] reference/
│       ├── [x] categories-list.md
│       ├── [x] settings.md
│       └── [x] faq.md
│
└── [ ] static/img/screenshots/
    ├── [ ] home.png
    ├── [ ] profile.png
    ├── [ ] search.png
    └── [ ] messaging.png
```

**Total** : 3 configs + 17 articles = **20 fichiers créés** (screenshots à ajouter)

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [06-docker](./06-docker.md) | [08-storybook](./08-storybook.md) |
