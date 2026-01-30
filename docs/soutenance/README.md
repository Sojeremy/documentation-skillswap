# Préparation Soutenance

Ce dossier contient les fiches de révision et documents de préparation pour la soutenance du projet SkillSwap.

## Structure

```plaintext
docs/soutenance/
├── README.md                         # Ce fichier
├── fiches/
│   ├── _template.md                  # Template pour créer de nouvelles fiches
│   ├── 01-architecture-globale.md    # ⏳ À créer
│   ├── 02-atomic-design.md           # ⏳ À créer
│   ├── 03-useSearch-hook.md          # ⏳ À créer
│   ├── 04-auth-flow.md               # ⏳ À créer
│   ├── 05-messaging-system.md        # ⏳ À créer
│   ├── 06-meilisearch-integration.md # ⏳ À créer
│   └── 07-testing-strategy.md        # ✅ Créé
│
├── qr-jury.md                        # ⏳ À créer - Questions/réponses anticipées
└── demo-script.md                    # ⏳ À créer - Script de démonstration
```

## Fiches disponibles

| # | Fiche | Statut | Description |
|---|-------|--------|-------------|
| 01 | Architecture globale | ⏳ | Vue C4, séparation frontend/backend |
| 02 | Atomic Design | ⏳ | Organisation des composants React |
| 03 | useSearch hook | ⏳ | Recherche avec debounce |
| 04 | Auth flow | ⏳ | JWT + refresh tokens |
| 05 | Messaging system | ⏳ | Architecture temps réel |
| 06 | Meilisearch integration | ⏳ | Moteur de recherche |
| 07 | [Testing Strategy](./fiches/07-testing-strategy.md) | ✅ | Stratégie de tests diversifiée |

## Format des fiches

Chaque fiche suit le template `_template.md` :

1. **En une phrase** - Description concise
2. **Schéma mental** - Diagramme Mermaid
3. **Points clés** - 5 points maximum
4. **Code essentiel** - 10 lignes maximum
5. **Questions du jury** - Q&R anticipées
6. **Liens** - Références vers la documentation

## Liens utiles

- Plan de préparation : [12-soutenance.md](../documentation-strategy/12-soutenance.md)
- Documentation Arc42 : [arc42/](../documentation-implementation/arc42/)
- ADRs : [09-decisions/](../documentation-implementation/arc42/09-decisions/)
