# Documentation Base de Données

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 22 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| Structure `/docs/docs/database/` | ✅ Terminé | Dossier créé avec tous les fichiers |
| ERD Mermaid | ✅ Terminé | 14 modèles dans index.md |
| Documentation modèles (14) | ✅ Terminé | User, Skill, Category, etc. |
| Relations documentées | ✅ Terminé | relations.md avec cardinalités |
| Enums (4) | ✅ Terminé | RoleOfUser, StatusOfConversation, etc. |
| Migrations | ✅ Terminé | Historique dans migrations.md |
| Intégration MkDocs | ✅ Terminé | Navigation complète |

**Progression globale** : ✅ **100%**

---

## Objectif

Documenter le schéma PostgreSQL de SkillSwap pour :

- Comprendre le modèle de données métier
- Faciliter l'onboarding des nouveaux développeurs
- Servir de référence pour l'API et les diagrammes C4

---

## Outils recommandés

| Outil | Rôle | Sortie |
| ----- | ---- | ------ |
| **Prisma ERD Generator** | Génère un diagramme ER depuis `schema.prisma` | SVG/PNG |
| **SchemaSpy** | Documentation HTML détaillée avec navigation | HTML |

### Prisma ERD Generator

```bash
# Installation
npm install -D prisma-erd-generator @mermaid-js/mermaid-cli
```

```prisma
// Ajouter dans schema.prisma
generator erd {
  provider = "prisma-erd-generator"
  output   = "../docs/docs/database/erd.svg"
  theme    = "forest"
}
```

```bash
# Génération
npx prisma generate
```

### SchemaSpy

```bash
# Via Docker (connecté à PostgreSQL local)
docker run -v "$PWD/docs/docs/database/schemaspy:/output" \
  --network=host \
  schemaspy/schemaspy:latest \
  -t pgsql11 \
  -host localhost -port 5433 \
  -db skillswap -u skillswap -p password \
  -o /output
```

**Résultat** : Site HTML navigable avec :

- Diagrammes interactifs
- Liste des tables avec colonnes
- Relations et foreign keys
- Index et contraintes
- Anomalies détectées

---

## Structure cible dans `/docs/docs/database/`

```plaintext
docs/docs/database/
├── index.md              # Overview + ERD intégré
├── erd.svg               # Diagramme généré par Prisma ERD
├── models/
│   ├── user.md           # Modèle User détaillé
│   ├── skill.md          # Modèle Skill détaillé
│   ├── conversation.md   # Modèle Conversation détaillé
│   └── ...               # Autres modèles
├── relations.md          # Tableau des relations avec cardinalités
├── enums.md              # Documentation des 4 enums
├── migrations.md         # Historique des migrations
└── schemaspy/            # Output SchemaSpy (HTML)
    └── index.html
```

---

## Checklist : Ce qu'il faut documenter

### Schéma actuel SkillSwap

| Élément | Quantité | À documenter |
| ------- | -------- | ------------ |
| **Modèles** | 14 | User, Role, Skill, Category, UserHasSkill, UserHasInterest, Conversation, Message, UserHasConversation, Rating, Follow, Available, UserHasAvailable, RefreshToken |
| **Enums** | 4 | RoleOfUser, StatusOfConversation, dayInAWeek, Time |
| **Migrations** | 6 | De `init_db` à `make_comment_optional` |
| **Relations N:N** | 4 | User↔Skill, User↔Interest, User↔Conversation, User↔Available |

### Pour chaque modèle, documenter

- [ ] **Rôle métier** : À quoi sert ce modèle dans SkillSwap ?
- [ ] **Champs** : Nom, type, contraintes (unique, nullable, default)
- [ ] **Relations** : Liens vers autres modèles avec cardinalité
- [ ] **Mapping** : Nom de la table SQL (`@@map`)

### Pour les relations, documenter

- [ ] **Cardinalité** : 1:1, 1:N, N:N
- [ ] **Contrainte** : CASCADE, SET NULL, RESTRICT
- [ ] **Table de jonction** : Si N:N, quelle table ?

---

## Exemple de documentation (modèle User)

```markdown
# User

## Rôle métier
Représente un membre inscrit sur SkillSwap. C'est le modèle central
qui connecte toutes les fonctionnalités : compétences, messagerie,
évaluations, abonnements.

## Champs

| Champ | Type | Contraintes | Description |
| ----- | ---- | ----------- | ----------- |
| id | Int | PK, Auto | Identifiant unique |
| email | String | Unique | Email de connexion |
| firstname | String | Required | Prénom |
| lastname | String | Required | Nom |
| password | String | Required | Hash argon2id |
| city | String? | Optional | Ville |
| avatarUrl | String? | Optional | URL photo profil |
| description | String? | Optional | Bio |
| createdAt | DateTime | Default now | Date inscription |

## Relations

| Relation | Modèle cible | Type | Description |
| -------- | ------------ | ---- | ----------- |
| role | Role | N:1 | Rôle de l'utilisateur |
| skills | UserHasSkill | 1:N | Compétences possédées |
| interests | UserHasInterest | 1:N | Compétences recherchées |
| conversations | UserHasConversation | 1:N | Conversations |
| evaluationsReceived | Rating | 1:N | Avis reçus |
| followedUsers | Follow | 1:N | Abonnements |
```

---

## Intégration MkDocs

```yaml
# mkdocs.yml (extrait)
nav:
  - Base de données:
      - Vue d'ensemble: database/index.md
      - Modèles:
          - User: database/models/user.md
          - Skill: database/models/skill.md
          - Conversation: database/models/conversation.md
      - Relations: database/relations.md
      - Enums: database/enums.md
      - Migrations: database/migrations.md
      - SchemaSpy: database/schemaspy/index.html
```

---

## Configuration PostgreSQL (référence)

| Paramètre | Dev | Prod |
| --------- | --- | ---- |
| Image | postgres:16-alpine | postgres:16-alpine |
| Port host | 5433 | Non exposé |
| Port container | 5432 | 5432 |
| Database | skillswap | skillswap |
| User | skillswap | skillswap |
| Volume | postgres_data | postgres_data |

---

## Plan d'action détaillé

### Phase 1 : Préparation (J5 matin - 2h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 1.1 | Vérifier que PostgreSQL tourne | Container healthy | `docker ps` |
| 1.2 | Installer prisma-erd-generator | package.json mis à jour | `npm ls prisma-erd-generator` |
| 1.3 | Ajouter le generator dans schema.prisma | Generator configuré | Pas d'erreur Prisma |
| 1.4 | Créer la structure `/docs/docs/database/` | Dossiers créés | `ls -la` |

### Phase 2 : Génération automatique (J5 matin - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 2.1 | Générer ERD avec Prisma | `erd.svg` | Fichier lisible |
| 2.2 | Lancer SchemaSpy via Docker | Dossier `schemaspy/` | `index.html` accessible |
| 2.3 | Vérifier les diagrammes générés | Screenshots | Toutes les tables visibles |

### Phase 3 : Documentation manuelle (J5-J6 - 4h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 3.1 | Créer `index.md` avec overview | Page d'accueil BDD | ERD intégré |
| 3.2 | Documenter les 5 modèles principaux | `models/user.md`, `skill.md`, `category.md`, `conversation.md`, `message.md` | Format respecté |
| 3.3 | Documenter les 9 modèles secondaires | 9 fichiers `.md` | Format respecté |
| 3.4 | Créer `relations.md` | Tableau des relations | Cardinalités OK |
| 3.5 | Créer `enums.md` | 4 enums documentés | Valeurs listées |
| 3.6 | Créer `migrations.md` | Historique des 6 migrations | Dates + descriptions |

### Phase 4 : Intégration (J6 - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 4.1 | Ajouter la section dans `mkdocs.yml` | Navigation mise à jour | Menu visible |
| 4.2 | Vérifier le rendu local | `mkdocs serve` | Pages accessibles |
| 4.3 | Lier depuis Arc42 §5 (Building Blocks) | Liens croisés | Navigation fluide |

---

## Dépendances

### Requiert (inputs)

| Dépendance | Fichier source | Statut |
| ---------- | -------------- | ------ |
| MkDocs configuré | 02-arc42-mkdocs.md | Phase A |
| PostgreSQL running | docker-compose.dev.yml | Infra existante |
| schema.prisma stable | backend/prisma/schema.prisma | ✅ Existant |

### Bloque (outputs)

| Fichier dépendant | Raison |
| ----------------- | ------ |
| 04-api-openapi.md | Schemas API basés sur modèles BDD |
| 03-diagrammes.md | C4 Component montre les entités |
| 12-soutenance.md | Fiche architecture inclut le schéma |

---

## Critères de validation

### Obligatoires (must-have)

- [ ] ERD généré et visible dans MkDocs
- [ ] 14 modèles documentés avec rôle métier
- [ ] 4 enums avec toutes les valeurs
- [ ] Relations N:N clairement expliquées
- [ ] SchemaSpy accessible (même si non intégré dans nav)

### Optionnels (nice-to-have)

- [ ] Exemples de requêtes Prisma pour chaque modèle
- [ ] Diagramme de séquence pour les relations complexes
- [ ] Index des performances documenté

---

## Ressources nécessaires

### Outils

```bash
# Installation
npm install -D prisma-erd-generator @mermaid-js/mermaid-cli

# SchemaSpy (Docker)
docker pull schemaspy/schemaspy:latest
```

### Accès

- [ ] PostgreSQL local (port 5433)
- [ ] Credentials BDD (skillswap/password)

### Temps estimé

| Phase | Durée | Effort |
| ----- | ----- | ------ |
| Phase 1 | 2h | Setup |
| Phase 2 | 1h | Automatisé |
| Phase 3 | 4h | Rédaction |
| Phase 4 | 1h | Intégration |
| **Total** | **8h** | ~1 jour |

---

## Risques spécifiques

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| ERD generator incompatible | Pas de diagramme | Fallback: Mermaid manuel |
| SchemaSpy timeout | Pas de doc HTML | Optionnel, continuer sans |
| Schema change pendant doc | Rework | Documenter après feature freeze |

---

## Fichiers à créer (checklist finale)

```plaintext
docs/docs/database/
├── [ ] index.md
├── [ ] erd.svg (généré)
├── [ ] models/
│   ├── [ ] user.md
│   ├── [ ] role.md
│   ├── [ ] skill.md
│   ├── [ ] category.md
│   ├── [ ] user-has-skill.md
│   ├── [ ] user-has-interest.md
│   ├── [ ] conversation.md
│   ├── [ ] message.md
│   ├── [ ] user-has-conversation.md
│   ├── [ ] rating.md
│   ├── [ ] follow.md
│   ├── [ ] available.md
│   ├── [ ] user-has-available.md
│   └── [ ] refresh-token.md
├── [ ] relations.md
├── [ ] enums.md
├── [ ] migrations.md
└── [ ] schemaspy/ (généré)
```

**Total** : 1 index + 14 modèles + 3 fichiers annexes + 2 générés = **20 fichiers**

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [04-api-openapi](./04-api-openapi.md) | [06-docker](./06-docker.md) |
