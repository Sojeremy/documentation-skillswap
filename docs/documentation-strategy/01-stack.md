# Stack Documentation

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 22 janvier 2025

| Critère | Statut | Notes |
|---------|--------|-------|
| Outils validés | ✅ Terminé | Tous les outils du tableau choisis |
| MkDocs Material installé | ✅ Terminé | venv configuré dans /docs/.venv/ |
| Node/npm versions | ✅ Terminé | Node 20+ |
| Équipe alignée | ✅ Terminé | Stack approuvée |

**Progression globale** : ✅ **100%**

---

## Objectif

Définir et valider les choix d'outils pour la documentation SkillSwap afin de :

- Assurer la cohérence technique de la stack documentation
- Justifier chaque choix pour le jury
- Servir de référence pour l'équipe

---

## Outils et justifications

| Besoin | Outil | Justification |
| ------ | ----- | ------------- |
| Format | **Markdown** | Universel, GitHub natif, tous les outils le supportent |
| Doc technique | **MkDocs Material** | Simple, beau, Mermaid natif, search integre |
| Architecture | **Arc42** | Template standard industrie, 12 sections structurees |
| Diagrammes | **Structurizr + Mermaid** | C4 Model sans redondance, export Mermaid pour MD |
| API | **OpenAPI 3.0 + Swagger UI** | Standard REST, interface interactive |
| BDD | **Prisma ERD + SchemaSpy** | ERD auto-genere + documentation detaillee |
| Docker | **docker-compose-viz** | Graphe PNG/SVG propre |
| Doc utilisateur | **Docusaurus** | React-based, Diataxis-friendly |
| Composants | **Storybook** | Catalogue interactif, addon docs |
| Code (hooks, utils) | **TypeDoc** | API reference auto-generee depuis TSDoc |
| Tests | **Vitest + Playwright** | Tests unitaires, composants, E2E |
| Design | **Figma** | Importe depuis Storybook (design tokens) |
| Deploiement | **Vercel** | 4 apps separees, preview branches |

---

## Pourquoi ces choix ?

### Markdown plutot qu'AsciiDoc

- GitHub natif (preview automatique)
- MkDocs et Docusaurus utilisent Markdown
- Plus simple a maintenir pour une equipe

### Prisma ERD + SchemaSpy

- **Prisma ERD** : Zero config, genere depuis schema.prisma
- **SchemaSpy** : Documentation plus detaillee (relations, index, contraintes)

### OpenAPI + Swagger UI (sans OpenAPI Generator)

- Le projet a deja `api-types.ts` maintenu manuellement
- OpenAPI Generator ajouterait de la complexite inutile
- Swagger UI suffit pour la documentation interactive

### Testing Library + User Event

- Teste les composants comme un utilisateur les utilise
- Plus resistant au refactoring que les tests d'implementation
- `user-event` simule les interactions realistes (typing, focus, blur)

---

## Plan d'action détaillé

### Phase 1 : Validation des choix (J1 - 2h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 1.1 | Revoir chaque outil du tableau | Liste validée | Équipe OK |
| 1.2 | Vérifier compatibilité versions | Matrice versions | Pas de conflit |
| 1.3 | Documenter alternatives rejetées | Section "Pourquoi" | Justifications claires |

### Phase 2 : Installation outils (J1 - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 2.1 | Installer MkDocs Material | `pip install` OK | `mkdocs --version` |
| 2.2 | Installer Structurizr CLI | CLI disponible | `structurizr-cli --version` |
| 2.3 | Vérifier Node/npm versions | Node 20+ | `node --version` |

---

## Dépendances

### Requiert (inputs)

| Dépendance | Source | Statut |
| ---------- | ------ | ------ |
| Décision équipe | Réunion kickoff | À valider J1 |
| Accès GitHub | Repo existant | ✅ Existant |

### Bloque (outputs)

| Fichier dépendant | Raison |
| ----------------- | ------ |
| 02-arc42-mkdocs | Utilise MkDocs Material |
| 03-diagrammes | Utilise Structurizr |
| Tous les autres | Stack validée requise |

---

## Critères de validation

### Obligatoires (must-have)

- [x] Tous les outils installables sans erreur
- [x] Justification documentée pour chaque choix
- [x] Équipe alignée sur la stack

### Optionnels (nice-to-have)

- [ ] Comparatif détaillé avec alternatives
- [ ] POC rapide de chaque outil

---

## Ressources nécessaires

### Outils

```bash
# Python (MkDocs)
pip install mkdocs-material mkdocs-swagger-ui-tag

# Node.js (Storybook, TypeDoc, Vitest)
npm install -D storybook typedoc vitest @playwright/test

# Structurizr (optionnel, CLI)
brew install structurizr-cli  # macOS
# ou Docker: docker pull structurizr/cli
```

### Temps estimé

| Phase | Durée | Effort |
| ----- | ----- | ------ |
| Phase 1 | 2h | Validation |
| Phase 2 | 1h | Installation |
| **Total** | **3h** | ~0.5 jour |

---

## Risques spécifiques

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| Outil deprecated | Rework | Vérifier maintenance active |
| Incompatibilité versions | Blocage | Tester sur machine propre |
| Équipe pas alignée | Confusion | Réunion de validation J1 |

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [00-plan-action-global](./00-plan-action-global.md) | [02-arc42-mkdocs](./02-arc42-mkdocs.md) |
