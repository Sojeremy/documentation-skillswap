# Architecture Technique (MkDocs + Arc42)

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 22 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| MkDocs Material configuré | ✅ Terminé | mkdocs.yml complet, venv actif |
| Structure Arc42 (12 sections) | ✅ Terminé | 12/12 sections en sous-dossiers |
| ADRs (9 décisions) | ✅ Éclaté | 9 fichiers individuels dans `arc42/09-decisions/` |
| Frontend (57 composants) | ✅ Éclaté | Réparti dans `arc42/05-building-blocks/` |
| Runtime (4 scénarios) | ✅ Éclaté | Réparti dans `arc42/06-runtime/` |
| Crosscutting (6 concepts) | ✅ Éclaté | Réparti dans `arc42/08-crosscutting/` |
| Quality (4 aspects) | ✅ Éclaté | Réparti dans `arc42/10-quality/` |
| Navigation mkdocs.yml | ✅ Hiérarchique | Menus déroulants multi-niveaux |
| Mermaid fonctionnel | ✅ Terminé | Diagrammes rendus correctement |
| `mkdocs serve` local | ✅ Terminé | Site fonctionnel localhost:8000 |

**Progression globale** : ✅ **100%**

---

## Objectif

Mettre en place MkDocs Material avec le template Arc42 pour :

- Structurer la documentation technique en 12 sections standards
- Générer un site statique navigable et recherchable
- Intégrer diagrammes, API et BDD dans une documentation unifiée

---

## Structure actuelle dans `/docs/documentation-implementation/`

> **Note** : Suite à la restructuration du 22 janvier 2025, les sections Arc42 volumineuses ont été éclatées en sous-fichiers pour une navigation plus granulaire.

```plaintext
docs/
├── mkdocs.yml                      # Configuration MkDocs Material
└── documentation-implementation/   # Source Markdown (docs_dir)
    ├── index.md                    # Page d'accueil
    │
    ├── arc42/                      # Template Arc42 (12 sections)
    │   ├── 01-introduction/
    │   │   └── index.md            # Objectifs, parties prenantes
    │   ├── 02-constraints/
    │   │   └── index.md            # Contraintes techniques/organisationnelles
    │   ├── 03-context/
    │   │   └── index.md            # Diagramme contexte (C4 Level 1)
    │   ├── 04-solution-strategy/
    │   │   └── index.md            # Décisions architecturales macro
    │   ├── 05-building-blocks/     # ✅ ÉCLATÉ
    │   │   ├── index.md            # Vue d'ensemble + C4 Container
    │   │   ├── frontend.md         # 57 composants, 10 hooks, patterns
    │   │   ├── backend.md          # Architecture en couches, 31 endpoints
    │   │   └── database.md         # 14 modèles Prisma
    │   ├── 06-runtime/             # ✅ ÉCLATÉ
    │   │   ├── index.md            # Vue d'ensemble des scénarios
    │   │   ├── authentication.md   # Register, Login, Refresh, Logout
    │   │   ├── search.md           # Debounce + Meilisearch
    │   │   ├── messaging.md        # Conversations et messages
    │   │   └── error-handling.md   # Middleware d'erreurs
    │   ├── 07-deployment/
    │   │   └── index.md            # Infrastructure Docker
    │   ├── 08-crosscutting/        # ✅ ÉCLATÉ
    │   │   ├── index.md            # Vue d'ensemble concepts
    │   │   ├── authentication.md   # Flux JWT complet
    │   │   ├── validation.md       # Zod double validation
    │   │   ├── error-handling.md   # Hiérarchie d'erreurs
    │   │   ├── logging.md          # Niveaux de logs
    │   │   ├── security.md         # Helmet, CORS, OWASP Top 10
    │   │   └── i18n.md             # Internationalisation
    │   ├── 09-decisions/           # ✅ ÉCLATÉ (9 ADRs format MADR)
    │   │   ├── index.md            # Index des ADRs par catégorie
    │   │   ├── 001-nextjs.md
    │   │   ├── 002-tailwind.md
    │   │   ├── 003-prisma.md
    │   │   ├── 004-tanstack-query.md
    │   │   ├── 005-zod.md
    │   │   ├── 006-atomic-design.md
    │   │   ├── 007-jwt.md
    │   │   ├── 008-meilisearch.md
    │   │   └── 009-mock-to-api.md
    │   ├── 10-quality/             # ✅ ÉCLATÉ
    │   │   ├── index.md            # Arbre qualité
    │   │   ├── scenarios.md        # Métriques qualité
    │   │   ├── testing.md          # Pyramide de tests
    │   │   ├── accessibility.md    # Standards WCAG 2.1 AA
    │   │   └── monitoring.md       # Monitoring (futur)
    │   ├── 11-risks/
    │   │   └── index.md            # Risques et dette technique
    │   └── 12-glossary/
    │       └── index.md            # Glossaire métier et technique
    │
    ├── api-reference/              # Documentation API
    │   ├── index.md                # Vue d'ensemble
    │   ├── swagger.md              # Swagger UI intégré
    │   ├── authentication.md       # Guide authentification
    │   ├── errors.md               # Codes d'erreur
    │   ├── testing-tools.md        # Postman, Newman, curl
    │   ├── openapi.yaml            # Specification OpenAPI 3.0
    │   └── examples/               # Exemples de flux
    │
    ├── database/                   # Documentation BDD (14 modèles)
    │   ├── index.md                # ERD Mermaid
    │   ├── relations.md            # Relations détaillées
    │   ├── enums.md                # Enums Prisma
    │   ├── migrations.md           # Guide migrations
    │   └── models/                 # Documentation par modèle
    │
    └── infrastructure/             # Configuration Docker
        ├── index.md                # Vue d'ensemble
        ├── services.md             # Services Docker
        ├── networks.md             # Réseaux
        ├── volumes.md              # Volumes
        └── troubleshooting.md      # Dépannage
```

---

## Arc42 - Les 12 sections

| # | Section | Fichiers | Diagramme |
| - | ------- | -------- | --------- |
| 1 | Introduction | `index.md` | - |
| 2 | Contraintes | `index.md` | - |
| 3 | Contexte | `index.md` | C4 Context |
| 4 | Stratégie | `index.md` | - |
| 5 | Building Blocks | `index.md`, `frontend.md`, `backend.md`, `database.md` | C4 Container |
| 6 | Runtime | `index.md`, `authentication.md`, `search.md`, `messaging.md`, `error-handling.md` | Sequence |
| 7 | Déploiement | `index.md` | Deployment |
| 8 | Transverse | `index.md`, `authentication.md`, `validation.md`, `error-handling.md`, `logging.md`, `security.md`, `i18n.md` | - |
| 9 | Décisions | `index.md` + **9 ADRs** (001-009) | - |
| 10 | Qualité | `index.md`, `scenarios.md`, `testing.md`, `accessibility.md`, `monitoring.md` | - |
| 11 | Risques | `index.md` | - |
| 12 | Glossaire | `index.md` | - |

**Total** : 32 fichiers dans `arc42/` (dont 12 index.md + 20 sous-fichiers)

---

## Configuration MkDocs

```yaml
# mkdocs.yml (extrait - navigation hiérarchique)
site_name: SkillSwap Documentation
site_url: https://docs.skillswap.vercel.app

theme:
  name: material
  language: fr
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.expand      # Sous-menus dépliables
    - search.highlight
    - content.code.copy

nav:
  - Accueil: index.md
  - Architecture (Arc42):
      - "1. Introduction": arc42/01-introduction/index.md
      - "2. Contraintes": arc42/02-constraints/index.md
      - "3. Contexte": arc42/03-context/index.md
      - "4. Stratégie": arc42/04-solution-strategy/index.md
      - "5. Building Blocks":                          # ← ÉCLATÉ
          - Vue d'ensemble: arc42/05-building-blocks/index.md
          - Frontend: arc42/05-building-blocks/frontend.md
          - Backend: arc42/05-building-blocks/backend.md
          - Database: arc42/05-building-blocks/database.md
      - "6. Runtime":                                  # ← ÉCLATÉ
          - Vue d'ensemble: arc42/06-runtime/index.md
          - Authentification: arc42/06-runtime/authentication.md
          - Recherche: arc42/06-runtime/search.md
          - Messagerie: arc42/06-runtime/messaging.md
          - Gestion d'erreurs: arc42/06-runtime/error-handling.md
      - "7. Déploiement": arc42/07-deployment/index.md
      - "8. Concepts transverses":                     # ← ÉCLATÉ
          - Vue d'ensemble: arc42/08-crosscutting/index.md
          - Authentification: arc42/08-crosscutting/authentication.md
          - Validation: arc42/08-crosscutting/validation.md
          - Gestion d'erreurs: arc42/08-crosscutting/error-handling.md
          - Logging: arc42/08-crosscutting/logging.md
          - Sécurité: arc42/08-crosscutting/security.md
          - Internationalisation: arc42/08-crosscutting/i18n.md
      - "9. Décisions (ADRs)":                         # ← ÉCLATÉ (9 ADRs)
          - Index: arc42/09-decisions/index.md
          - "001 - Next.js": arc42/09-decisions/001-nextjs.md
          - "002 - Tailwind": arc42/09-decisions/002-tailwind.md
          - "003 - Prisma": arc42/09-decisions/003-prisma.md
          - "004 - TanStack Query": arc42/09-decisions/004-tanstack-query.md
          - "005 - Zod": arc42/09-decisions/005-zod.md
          - "006 - Atomic Design": arc42/09-decisions/006-atomic-design.md
          - "007 - JWT": arc42/09-decisions/007-jwt.md
          - "008 - Meilisearch": arc42/09-decisions/008-meilisearch.md
          - "009 - Mock-to-API": arc42/09-decisions/009-mock-to-api.md
      - "10. Qualité":                                 # ← ÉCLATÉ
          - Vue d'ensemble: arc42/10-quality/index.md
          - Scénarios: arc42/10-quality/scenarios.md
          - Tests: arc42/10-quality/testing.md
          - Accessibilité: arc42/10-quality/accessibility.md
          - Monitoring: arc42/10-quality/monitoring.md
      - "11. Risques": arc42/11-risks/index.md
      - "12. Glossaire": arc42/12-glossary/index.md
  - API Reference:
      - Vue d'ensemble: api-reference/index.md
      - Swagger UI: api-reference/swagger.md
      - Authentification: api-reference/authentication.md
      - Codes d'erreur: api-reference/errors.md
      - Outils de test: api-reference/testing-tools.md
      - Exemples: ...
  - Base de données:
      - Vue d'ensemble: database/index.md
      - Relations: database/relations.md
      - Modèles: ...
  - Infrastructure:
      - Vue d'ensemble: infrastructure/index.md
      - Services: infrastructure/services.md
      - Réseaux: infrastructure/networks.md
      - Volumes: infrastructure/volumes.md
      - Troubleshooting: infrastructure/troubleshooting.md
```

---

## Plan d'action détaillé

### Phase 1 : Setup MkDocs (J1-J2 matin - 3h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 1.1 | Créer `/docs/docs/` | Dossier créé | `ls -la` |
| 1.2 | Installer MkDocs Material | Package installé | `mkdocs --version` |
| 1.3 | Créer `mkdocs.yml` | Config de base | Pas d'erreur YAML |
| 1.4 | Créer `index.md` | Page d'accueil | `mkdocs serve` OK |
| 1.5 | Tester rendu local | Site visible | <http://localhost:8000> |

### Phase 2 : Structure Arc42 (J2 - 2h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 2.1 | Créer dossier `arc42/` | 12 fichiers `.md` | Structure complète |
| 2.2 | Ajouter templates vides | Headers + placeholders | Navigation OK |
| 2.3 | Configurer nav dans mkdocs.yml | Menu complet | 12 entrées visibles |

### Phase 3 : Rédaction sections 1-4 (J2-J3 - 4h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 3.1 | Rédiger 01-introduction | Objectifs + stakeholders | Contenu pertinent |
| 3.2 | Rédiger 02-constraints | Contraintes tech/orga | Liste complète |
| 3.3 | Rédiger 03-context | Diagramme C4 Context | Mermaid rendu |
| 3.4 | Rédiger 04-solution-strategy | Décisions macro | Justifications |

### Phase 4 : Rédaction sections 5-8 (J3-J4 - 4h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 4.1 | Rédiger 05-building-blocks | C4 Container + Component | Diagrammes OK |
| 4.2 | Rédiger 06-runtime-view | 3 séquences (auth, search, msg) | Mermaid OK |
| 4.3 | Rédiger 07-deployment | Docker architecture | Lien vers 06-docker |
| 4.4 | Rédiger 08-crosscutting | Auth, validation, errors | Patterns documentés |

### Phase 5 : Rédaction sections 9-12 + ADRs (J4-J5 - 3h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 5.1 | Créer dossier `adr/` | Template + index | Structure OK |
| 5.2 | Rédiger 6 ADRs | 6 fichiers | Format MADR |
| 5.3 | Rédiger 09-architecture-decisions | Index ADRs | Liens fonctionnels |
| 5.4 | Rédiger 10-quality, 11-risks, 12-glossary | 3 sections | Contenu pertinent |

---

## Dépendances

### Requiert (inputs)

| Dépendance | Fichier source | Statut |
| ---------- | -------------- | ------ |
| Stack validée | 01-stack.md | Phase A |
| Python 3.8+ | Système | À vérifier |

### Bloque (outputs)

| Fichier dépendant | Raison |
| ----------------- | ------ |
| 03-diagrammes | Intègre dans Arc42 §3, §5, §6 |
| 04-api-openapi | Intègre dans MkDocs nav |
| 05-database | Intègre dans MkDocs nav |
| 06-docker | Intègre dans Arc42 §7 |

---

## Critères de validation

### Obligatoires (must-have)

- [x] `mkdocs serve` fonctionne sans erreur
- [x] 12 sections Arc42 créées avec contenu complet
- [x] Navigation hiérarchique dans le menu (sous-menus dépliables)
- [x] Mermaid rendu correctement
- [x] 9 ADRs en fichiers individuels dans `arc42/09-decisions/` (format MADR)
- [x] Frontend éclaté dans `arc42/05-building-blocks/` (57 composants, 10 hooks)
- [x] Sections volumineuses éclatées (05, 06, 08, 09, 10)
- [x] Liens internes mis à jour (pas de liens cassés)

### Optionnels (nice-to-have)

- [x] Theme personnalisé (couleurs SkillSwap)
- [x] Search fonctionnel
- [x] Dark mode
- [x] Structure Arc42 en sous-dossiers (navigation granulaire)

---

## Ressources nécessaires

### Outils

```bash
# Installation
pip install mkdocs-material pymdown-extensions mkdocs-swagger-ui-tag

# Lancer en local
mkdocs serve

# Build pour production
mkdocs build
```

### Templates

- Arc42 : <https://arc42.org/download>
- MADR (ADR) : <https://adr.github.io/madr/>

### Temps estimé

| Phase | Durée | Effort |
| ----- | ----- | ------ |
| Phase 1 | 3h | Setup |
| Phase 2 | 2h | Structure |
| Phase 3 | 4h | Rédaction 1-4 |
| Phase 4 | 4h | Rédaction 5-8 |
| Phase 5 | 3h | Rédaction 9-12 + ADRs |
| **Total** | **16h** | ~2 jours |

---

## Risques spécifiques

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| Mermaid non rendu | Diagrammes cassés | Tester extension pymdownx |
| Arc42 trop verbeux | Perte de temps | Se limiter à l'essentiel |
| ADRs incomplets | Manque justification | Template strict MADR |

---

## Fichiers créés (checklist finale)

```plaintext
docs/
├── [x] mkdocs.yml
└── documentation-implementation/
    ├── [x] index.md
    ├── [x] arc42/
    │   ├── [x] 01-introduction/index.md
    │   ├── [x] 02-constraints/index.md
    │   ├── [x] 03-context/index.md
    │   ├── [x] 04-solution-strategy/index.md
    │   ├── [x] 05-building-blocks/          # ✅ ÉCLATÉ (4 fichiers)
    │   │   ├── [x] index.md
    │   │   ├── [x] frontend.md              # 57 composants, 10 hooks, patterns
    │   │   ├── [x] backend.md               # Architecture en couches
    │   │   └── [x] database.md              # 14 modèles Prisma
    │   ├── [x] 06-runtime/                  # ✅ ÉCLATÉ (5 fichiers)
    │   │   ├── [x] index.md
    │   │   ├── [x] authentication.md
    │   │   ├── [x] search.md
    │   │   ├── [x] messaging.md
    │   │   └── [x] error-handling.md
    │   ├── [x] 07-deployment/index.md
    │   ├── [x] 08-crosscutting/             # ✅ ÉCLATÉ (7 fichiers)
    │   │   ├── [x] index.md
    │   │   ├── [x] authentication.md
    │   │   ├── [x] validation.md
    │   │   ├── [x] error-handling.md
    │   │   ├── [x] logging.md
    │   │   ├── [x] security.md
    │   │   └── [x] i18n.md
    │   ├── [x] 09-decisions/                # ✅ ÉCLATÉ (10 fichiers)
    │   │   ├── [x] index.md
    │   │   ├── [x] 001-nextjs.md
    │   │   ├── [x] 002-tailwind.md
    │   │   ├── [x] 003-prisma.md
    │   │   ├── [x] 004-tanstack-query.md
    │   │   ├── [x] 005-zod.md
    │   │   ├── [x] 006-atomic-design.md
    │   │   ├── [x] 007-jwt.md
    │   │   ├── [x] 008-meilisearch.md
    │   │   └── [x] 009-mock-to-api.md
    │   ├── [x] 10-quality/                  # ✅ ÉCLATÉ (5 fichiers)
    │   │   ├── [x] index.md
    │   │   ├── [x] scenarios.md
    │   │   ├── [x] testing.md
    │   │   ├── [x] accessibility.md
    │   │   └── [x] monitoring.md
    │   ├── [x] 11-risks/index.md
    │   └── [x] 12-glossary/index.md
    ├── [x] api-reference/                   # OpenAPI + Swagger UI + testing-tools
    ├── [x] database/                        # 14 modèles Prisma
    └── [x] infrastructure/                  # Docker documentation
```

**Total** : 1 config + 1 index + **32 fichiers Arc42** + API + BDD + Infra = **Structure hiérarchique granulaire**

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [01-stack](./01-stack.md) | [03-diagrammes](./03-diagrammes.md) |
