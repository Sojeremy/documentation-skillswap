# Documentation API (OpenAPI + Swagger)

[← Retour au README](./README.md)

---

## 📊 État d'avancement

> **Dernière mise à jour** : 22 janvier 2025

| Livrable | Statut | Notes |
|----------|--------|-------|
| openapi.yaml | ✅ Terminé | 31/31 endpoints documentés |
| Swagger UI intégré | ✅ Terminé | Accessible dans MkDocs |
| Guide authentification | ✅ Terminé | authentication.md complet |
| Codes d'erreur | ✅ Terminé | errors.md documenté |
| Exemples de flux | ✅ Terminé | 3 exemples (auth, search, messaging) |
| Validation OpenAPI | ⚠️ Warnings | 10 nullable, 5 security-defined (mineurs) |

**Progression globale** : ✅ **100%**

---

## Objectif

Documenter l'API REST de SkillSwap pour :

- Fournir une référence interactive aux développeurs frontend
- Faciliter l'onboarding des nouveaux membres de l'équipe
- Permettre les tests d'API directement depuis la documentation
- Servir de contrat entre frontend et backend

---

## OpenAPI vs Swagger

| Terme | Définition |
| ----- | ---------- |
| **OpenAPI 3.0** | Spécification (format YAML/JSON) décrivant l'API |
| **Swagger UI** | Visualiseur web interactif qui lit le fichier OpenAPI |

```plaintext
schema.prisma  →  TypeScript Types  →  OpenAPI YAML  →  Swagger UI
     ↓                   ↓                  ↓               ↓
  14 modèles       api-types.ts        openapi.yaml    Interface web
```

**Choix SkillSwap** : OpenAPI + Swagger UI (sans Generator - `api-types.ts` est maintenu manuellement)

---

## Inventaire API actuel

| Groupe | Endpoints | Auth | Description |
| ------ | --------- | ---- | ----------- |
| **Auth** | 5 | 1/5 | register, login, logout, refresh, me |
| **Profiles** | 13 | 13/13 | CRUD profil, skills, interests, availabilities, ratings |
| **Conversations** | 8 | 8/8 | CRUD conversations et messages |
| **Follows** | 4 | 4/4 | followers, following, follow/unfollow |
| **Categories** | 1 | 0/1 | Liste des catégories |
| **Total** | **31** | **26/31** | 6 publics, 25 authentifiés |

### Authentification

- **Méthode** : JWT via cookies HTTP
- **Tokens** : `accessToken` + `refreshToken`
- **Middleware** : `checkAuth` valide le token et injecte `req.userId`

---

## Moyens

### Swagger UI pour MkDocs

```bash
pip install mkdocs-swagger-ui-tag
```

```yaml
# mkdocs.yml
plugins:
  - swagger-ui-tag
```

### Alternative: Redoc

```bash
npm install -g @redocly/cli
redocly build-docs openapi.yaml --output docs/api/index.html
```

---

## Structure cible dans `/docs/docs/api/`

```plaintext
docs/docs/api/
├── index.md              # Overview + Swagger UI intégré
├── openapi.yaml          # Spécification OpenAPI 3.0 complète
├── authentication.md     # Guide auth (JWT, cookies, refresh)
├── errors.md             # Codes d'erreur et format
└── examples/
    ├── auth-flow.md      # Exemple: register → login → me
    ├── search-flow.md    # Exemple: recherche membre
    └── messaging-flow.md # Exemple: conversation complète
```

---

## Checklist : Ce qu'il faut documenter

### Pour chaque endpoint

- [ ] **Méthode + Path** : `POST /api/v1/auth/register`
- [ ] **Description** : Inscription d'un nouveau membre
- [ ] **Tags** : `[Auth]`
- [ ] **Authentification** : Bearer token requis ? Non
- [ ] **Request body** : Schema avec exemple
- [ ] **Responses** : 200, 400, 401, 404, 422, etc.
- [ ] **Paramètres** : query, path, headers

### Schemas à documenter

| Schema | Champs clés |
| ------ | ----------- |
| User | id, email, firstname, lastname, avatarUrl |
| Member | id, firstname, lastname, skills[], rating |
| Skill | id, name, categoryId |
| Category | id, name, slug |
| Conversation | id, status, participants[] |
| Message | id, content, createdAt, senderId |
| Rating | id, score, comment |
| Error | success: false, error: string |

### Codes d'erreur standards

| Code | Signification | Cas d'usage |
| ---- | ------------- | ----------- |
| 200 | OK | GET, PUT réussi |
| 201 | Created | POST réussi |
| 204 | No Content | DELETE réussi |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Token manquant/expiré |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Doublon (email existe) |
| 422 | Unprocessable | Validation Zod échouée |

---

## Exemple de documentation (1 endpoint)

```yaml
/auth/register:
  post:
    tags: [Auth]
    summary: Inscription d'un nouveau membre
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [email, password, firstname, lastname]
            properties:
              email:
                type: string
                format: email
                example: "marie@example.com"
              password:
                type: string
                minLength: 8
              firstname:
                type: string
              lastname:
                type: string
    responses:
      '201':
        description: Inscription réussie
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthResponse'
      '409':
        description: Email déjà utilisé
```

> **Note** : La spécification complète (31 endpoints) sera dans `/docs/docs/api/openapi.yaml`

---

## Intégration MkDocs

```markdown
<!-- docs/docs/api/index.md -->
# API Reference

## Vue d'ensemble

L'API SkillSwap suit les conventions REST avec authentification JWT.

<swagger-ui src="./openapi.yaml"/>
```

---

## Workflow de documentation

```plaintext
1. Développeur ajoute/modifie un endpoint
              ↓
2. Mettre à jour openapi.yaml
              ↓
3. Vérifier avec swagger-cli validate
              ↓
4. PR inclut les changements API + doc
```

```bash
# Validation du fichier OpenAPI
npx @redocly/cli lint openapi.yaml
```

---

## Plan d'action détaillé

### Phase 1 : Préparation (J4 matin - 2h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 1.1 | Analyser les routes backend | Inventaire complet | 31 endpoints listés |
| 1.2 | Créer la structure `/docs/docs/api/` | Dossier + fichiers vides | `ls -la` |
| 1.3 | Installer mkdocs-swagger-ui-tag | Plugin actif | `mkdocs serve` OK |
| 1.4 | Créer le squelette `openapi.yaml` | Header + info | Syntaxe valide |

### Phase 2 : Documentation Auth + Profiles (J4 après-midi - 3h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 2.1 | Documenter 5 endpoints Auth | Spec complète | Swagger UI affiche |
| 2.2 | Documenter 13 endpoints Profiles | Spec complète | Swagger UI affiche |
| 2.3 | Définir schemas réutilisables | `components/schemas` | Pas de duplication |
| 2.4 | Créer `authentication.md` | Guide complet | Flow JWT clair |

### Phase 3 : Documentation Conversations + Follows (J5 matin - 2h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 3.1 | Documenter 8 endpoints Conversations | Spec complète | Swagger UI affiche |
| 3.2 | Documenter 4 endpoints Follows | Spec complète | Swagger UI affiche |
| 3.3 | Documenter 1 endpoint Categories | Spec complète | Swagger UI affiche |
| 3.4 | Créer `errors.md` | Format erreurs | Codes listés |

### Phase 4 : Intégration et exemples (J5 après-midi - 1h)

| Étape | Action | Livrable | Validation |
| ----- | ------ | -------- | ---------- |
| 4.1 | Créer `index.md` avec Swagger UI | Page d'accueil | Rendu interactif |
| 4.2 | Créer 3 exemples de flow | auth-flow, search, messaging | Pas à pas clairs |
| 4.3 | Valider avec Redocly CLI | 0 erreurs | `lint` passe |
| 4.4 | Ajouter à `mkdocs.yml` nav | Menu API visible | Navigation OK |

---

## Dépendances

### Requiert (inputs)

| Dépendance | Fichier source | Statut |
| ---------- | -------------- | ------ |
| MkDocs configuré | 02-arc42-mkdocs.md | Phase A |
| Backend stable | backend/src/routes/*.ts | ✅ Existant |
| Types API | backend/src/types/api-types.ts | ✅ Existant |

### Bloque (outputs)

| Fichier dépendant | Raison |
| ----------------- | ------ |
| 07-docusaurus-diataxis.md | How-to guides référencent l'API |
| 03-diagrammes.md | Séquences montrent les appels API |
| 12-soutenance.md | Fiches incluent la démo API |

---

## Critères de validation

### Obligatoires (must-have)

- [x] 31/31 endpoints documentés dans `openapi.yaml`
- [x] Swagger UI accessible et fonctionnel dans MkDocs
- [x] Schemas `components/schemas` sans duplication
- [x] Guide authentification (JWT flow) rédigé
- [x] `redocly lint openapi.yaml` passe sans erreur (warnings mineurs acceptables)

### Optionnels (nice-to-have)

- [ ] Exemples de requêtes cURL pour chaque endpoint
- [ ] Postman collection générée depuis OpenAPI
- [ ] Tests d'intégration API automatisés

---

## Ressources nécessaires

### Outils

```bash
# MkDocs plugin
pip install mkdocs-swagger-ui-tag

# Validation
npm install -g @redocly/cli
redocly lint openapi.yaml

# Optionnel: génération Postman
npm install -g openapi-to-postmanv2
```

### Documentation

- OpenAPI Spec : <https://spec.openapis.org/oas/v3.0.3>
- Swagger UI : <https://swagger.io/tools/swagger-ui/>
- Redocly CLI : <https://redocly.com/docs/cli/>

### Temps estimé

| Phase | Durée | Effort |
| ----- | ----- | ------ |
| Phase 1 | 2h | Setup |
| Phase 2 | 3h | Auth + Profiles |
| Phase 3 | 2h | Conv + Follows |
| Phase 4 | 1h | Intégration |
| **Total** | **8h** | ~1 jour |

---

## Risques spécifiques

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| API change pendant doc | Rework | Documenter après feature freeze |
| OpenAPI trop verbeux | Maintenance lourde | Utiliser $ref partout |
| Swagger UI lent | UX dégradée | Lazy loading, pagination |

---

## Fichiers à créer (checklist finale)

```plaintext
docs/docs/api/
├── [ ] index.md              # Overview + Swagger UI
├── [ ] openapi.yaml          # 31 endpoints documentés
├── [ ] authentication.md     # Guide JWT complet
├── [ ] errors.md             # Format erreurs standard
└── [ ] examples/
    ├── [ ] auth-flow.md      # register → login → me
    ├── [ ] search-flow.md    # recherche membre
    └── [ ] messaging-flow.md # conversation complète
```

**Total** : 1 index + 1 spec + 2 guides + 3 exemples = **7 fichiers**

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [03-diagrammes](./03-diagrammes.md) | [05-database](./05-database.md) |
