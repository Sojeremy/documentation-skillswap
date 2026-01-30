# Outils de test API

Cette page présente les outils recommandés pour tester l'API SkillSwap.

---

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ÉCOSYSTÈME DE TEST API                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐   │
│   │   OpenAPI    │ ──────► │   Postman    │ ──────► │   Newman     │   │
│   │   (Contrat)  │         │   (Tests)    │         │   (CI/CD)    │   │
│   └──────────────┘         └──────────────┘         └──────────────┘   │
│         │                        │                        │             │
│         ▼                        ▼                        ▼             │
│   Swagger UI              Collection Runner          GitHub Actions    │
│   Documentation           Mock Server                Rapports auto     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

| Outil | Rôle | Usage |
|-------|------|-------|
| **Swagger UI** | Documentation interactive | Explorer et tester les endpoints |
| **Postman** | Client API avancé | Tests manuels et automatisés |
| **Newman** | CLI Postman | Exécuter les tests en CI/CD |
| **curl** | Client HTTP basique | Tests rapides en terminal |

---

## Postman

### Installation

Télécharger depuis [postman.com/downloads](https://www.postman.com/downloads/)

### Importer la collection SkillSwap

#### Option A : Depuis OpenAPI

1. Ouvrir Postman
2. `File` → `Import`
3. Sélectionner `openapi.yaml`
4. Postman génère automatiquement toutes les requêtes

#### Option B : Importer une collection existante

1. Récupérer le fichier `.json` de la collection
2. `File` → `Import` → Sélectionner le fichier
3. La collection apparaît dans la barre latérale

### Configurer les environnements

Créer des environnements pour basculer entre les configurations :

| Variable | Local | Docker | Production |
|----------|-------|--------|------------|
| `baseUrl` | `http://localhost:3000/api/v1` | `http://localhost:8888/api/v1` | `https://api.skillswap.fr/api/v1` |
| `accessToken` | *(auto)* | *(auto)* | *(auto)* |
| `refreshToken` | *(auto)* | *(auto)* | *(auto)* |

**Créer un environnement :**

1. Cliquer sur l'icône ⚙️ (Environments)
2. `Add` → Nommer "SkillSwap Local"
3. Ajouter les variables

### Exemple de requête

```
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Scripts de test

Ajouter des tests automatiques dans l'onglet "Tests" de chaque requête :

```javascript
// Vérifier le statut
pm.test("Status is 200", function() {
    pm.response.to.have.status(200);
});

// Vérifier la structure de la réponse
pm.test("Response has correct structure", function() {
    const response = pm.response.json();
    pm.expect(response).to.have.property('success');
    pm.expect(response.success).to.be.true;
    pm.expect(response).to.have.property('data');
});

// Sauvegarder des valeurs pour les requêtes suivantes
pm.test("Save user ID", function() {
    const response = pm.response.json();
    pm.environment.set("userId", response.data.id);
});
```

### Collection Runner

Exécuter tous les tests d'une collection :

1. Cliquer sur `...` à côté de la collection
2. `Run collection`
3. Sélectionner l'environnement
4. `Run SkillSwap API`

---

## Newman (CLI)

Newman permet d'exécuter les collections Postman en ligne de commande.

### Installation

```bash
npm install -g newman
```

### Exécuter une collection

```bash
# Depuis un fichier local
newman run collection.json -e environment.json

# Avec rapport HTML
newman run collection.json -e environment.json -r htmlextra
```

### Intégration CI/CD (GitHub Actions)

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Start services
        run: docker compose up -d

      - name: Wait for API
        run: sleep 10

      - name: Install Newman
        run: npm install -g newman newman-reporter-htmlextra

      - name: Run API tests
        run: |
          newman run postman/collection.json \
            -e postman/environment-docker.json \
            -r htmlextra \
            --reporter-htmlextra-export reports/api-tests.html

      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: api-test-report
          path: reports/api-tests.html
```

---

## curl (tests rapides)

### Authentification

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Requête authentifiée
curl http://localhost:3000/api/v1/auth/me \
  -b cookies.txt
```

### Profils

```bash
# Récupérer un profil
curl http://localhost:3000/api/v1/profiles/1 \
  -b cookies.txt

# Mettre à jour son profil
curl -X PUT http://localhost:3000/api/v1/profiles/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"city":"Paris","description":"Développeur passionné"}'
```

---

## Swagger UI

L'interface Swagger UI est disponible dans cette documentation : [Swagger UI](./swagger.md)

### Fonctionnalités

- **Explorer** : Voir tous les endpoints groupés par tag
- **Tester** : Exécuter des requêtes directement
- **Schémas** : Visualiser les modèles de données
- **Exemples** : Voir les exemples de requêtes/réponses

### Authentification dans Swagger

1. Exécuter `POST /auth/login` avec vos identifiants
2. Les cookies sont automatiquement définis
3. Les requêtes suivantes utilisent ces cookies

---

## Bonnes pratiques

### Organisation des tests

```
postman/
├── collections/
│   ├── skillswap-api.json      # Collection principale
│   └── smoke-tests.json        # Tests de base rapides
├── environments/
│   ├── local.json
│   ├── docker.json
│   └── production.json
└── README.md                   # Instructions
```

### Conventions de nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Collection | `{projet}-{domaine}` | `skillswap-api` |
| Dossier | `PascalCase` | `Auth`, `Profiles` |
| Requête | `VERB Description` | `POST Login`, `GET Profile by ID` |
| Variable | `camelCase` | `{{baseUrl}}`, `{{accessToken}}` |

### Checklist avant commit

- [ ] Tests passent en local
- [ ] Variables d'environnement utilisées (pas de valeurs en dur)
- [ ] Exemples de réponses documentés
- [ ] Scripts de test ajoutés pour les nouveaux endpoints

---

## Voir aussi

- [Swagger UI](./swagger.md) - Documentation interactive
- [OpenAPI Spec](./index.md) - Spécification complète
- [Authentification](./authentication.md) - Guide d'authentification
- [ADR-007 : JWT](../arc42/09-decisions/007-jwt.md) - Décision d'architecture
