# Strategie de Documentation - SkillSwap

> **Objectif**: Preparer une documentation complete pour la soutenance du Titre Professionnel CDA
>
> **Approche**: Documentation as Code (Markdown, tout versionne dans Git)
>
> **Duree**: 30 jours | **Deploiement**: Vercel

---

## État d'avancement global

> **Dernière mise à jour** : 23 janvier 2025

| Phase | Statut | Progression |
|-------|--------|-------------|
| **Phase A : Fondations** | ✅ Terminée | 100% |
| **Phase B : Backend** | ✅ Terminée | 100% |
| **Phase C : Frontend** | ✅ Terminée | 100% |
| **Phase D : Qualité** | ✅ Terminée | 100% |
| **Phase E : Finalisation** | ⏳ Non démarrée | 0% |

### Livrables terminés

| Livrable | Fichiers | Notes |
|----------|----------|-------|
| MkDocs Material | ✅ Configuré | Site fonctionnel localhost:8000 |
| Arc42 (12 sections) | ✅ 32 fichiers | Structure hiérarchique en sous-dossiers |
| ADRs (9 décisions) | ✅ Éclatés | 9 fichiers individuels dans `arc42/09-decisions/` |
| OpenAPI/Swagger | ✅ 31 endpoints | Validation réussie |
| Documentation BDD | ✅ 14 modèles | ERD, relations, enums, migrations |
| Infrastructure Docker | ✅ Complète | Services, réseaux, volumes, troubleshooting |
| Frontend | ✅ Éclaté | 57 composants, 10 hooks dans `arc42/05-building-blocks/` |
| Storybook | ✅ 90% | 170 stories (15 atoms, 9 molecules, 4 organisms) |
| Tests Vitest | ✅ 28 tests | Utils, validations avec pattern AAA |
| Tests E2E | ✅ 11 tests | Playwright (auth.spec.ts, search.spec.ts) |
| TypeDoc | ✅ 100% | 10 hooks, 9 fichiers lib, intégré MkDocs |

### Restructuration Arc42 (22 janvier 2025)

Les sections Arc42 volumineuses ont été éclatées en fichiers individuels pour une navigation granulaire :

| Section | Fichiers |
|---------|----------|
| 05-building-blocks | `index.md`, `frontend.md`, `backend.md`, `database.md` |
| 06-runtime | `index.md`, `authentication.md`, `search.md`, `messaging.md`, `error-handling.md` |
| 08-crosscutting | `index.md`, `authentication.md`, `validation.md`, `error-handling.md`, `logging.md`, `security.md`, `i18n.md` |
| 09-decisions | `index.md` + 9 ADRs (001-nextjs à 009-mock-to-api) |
| 10-quality | `index.md`, `scenarios.md`, `testing.md`, `accessibility.md`, `monitoring.md` |

**Bénéfices** : Navigation via menus déroulants multi-niveaux dans MkDocs Material

### Prochaines étapes (Phase E)

1. **Docusaurus** : Documentation utilisateur avec modèle Diataxis
2. **Fiches soutenance** : 6 fiches techniques + Q&R jury (contenu préparé dans 12-soutenance.md)
3. **Déploiement Vercel** : 3 URLs (docs, guide, storybook)

---

## Vue d'ensemble

```plaintext
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOCUMENTATION SKILLSWAP                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   TECHNIQUE     │    │   UTILISATEUR   │    │   PRESENTATION  │          │
│  │    (MkDocs)     │    │  (Docusaurus)   │    │    (Fiches)     │          │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘          │
│           │                      │                      │                    │
│  ┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐          │
│  │ Arc42 (12 sec.) │    │ Diataxis Model  │    │ Fiches Revision │          │
│  │ ADRs            │    │ Tutorials       │    │ Q&R Jury        │          │
│  │ OpenAPI/Swagger │    │ How-to Guides   │    │ Demo Script     │          │
│  │ Prisma ERD      │    │ Explanations    │    │                 │          │
│  │ SchemaSpy       │    │                 │    │                 │          │
│  └────────┬────────┘    └────────┬────────┘    └─────────────────┘          │
│           │                      │                                           │
│  ┌────────▼──────────────────────▼────────┐                                 │
│  │         DIAGRAMMES AS CODE             │                                 │
│  │     Structurizr (C4)  │   Mermaid      │                                 │
│  └────────────────────────────────────────┘                                 │
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐          │
│  │   STORYBOOK     │    │    TYPEDOC      │    │     FIGMA       │          │
│  │  (Composants)   │    │ (Hooks, Utils)  │    │   (UI/UX)       │          │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘          │
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐                                 │
│  │     TESTS       │    │  DOCKER VIZ     │                                 │
│  │ (Vitest + E2E)  │    │ (Infra)         │                                 │
│  └─────────────────┘    └─────────────────┘                                 │
│                                                                              │
│                    Deploiement: VERCEL (4 apps)                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Navigation

| # | Document | Description |
| - | -------- | ----------- |
| 0 | [**Plan d'Action Global**](./00-plan-action-global.md) | Vision d'ensemble, phases, dépendances |
| 1 | [Stack Documentation](./01-stack.md) | Outils et justifications |
| 2 | [Arc42 + MkDocs](./02-arc42-mkdocs.md) | Architecture technique |
| 3 | [Diagrammes](./03-diagrammes.md) | Structurizr + Mermaid |
| 4 | [API OpenAPI](./04-api-openapi.md) | OpenAPI + Swagger UI |
| 5 | [Base de Donnees](./05-database.md) | Prisma ERD + SchemaSpy |
| 6 | [Docker](./06-docker.md) | docker-compose-viz |
| 7 | [Docusaurus](./07-docusaurus-diataxis.md) | Documentation utilisateur |
| 8 | [Storybook](./08-storybook.md) | Composants UI |
| 9 | [TypeDoc](./09-typedoc.md) | Documentation code |
| 10 | [Tests](./10-tests.md) | Vitest + Playwright |
| 11 | [Figma](./11-figma.md) | Design System |
| 12 | [Soutenance](./12-soutenance.md) | Fiches + Q&R Jury |
| 13 | [Deploiement](./13-deploiement.md) | Vercel |
| 14 | [Planning](./14-planning.md) | Planning 30 jours |

---

## URLs finales (3 déploiements Vercel)

| Documentation | URL | Contenu |
| ------------- | --- | ------- |
| **Technique** | docs.skillswap.vercel.app | Arc42, ADRs, OpenAPI, TypeDoc (hooks/utils intégré) |
| **Utilisateur** | guide.skillswap.vercel.app | Docusaurus - Tutorials, How-to, FAQ (Diataxis) |
| **Composants** | storybook.skillswap.vercel.app | Catalogue UI interactif (170 stories) |

---

Dernière mise à jour : 23 janvier 2025
