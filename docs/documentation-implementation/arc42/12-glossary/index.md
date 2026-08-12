# 12. Glossaire

## 12.1 Termes métier

| Terme | Définition |
| ----- | ---------- |
| **Compétence (Skill)** | Savoir-faire qu'un membre peut enseigner ou apprendre |
| **Membre** | Utilisateur inscrit sur la plateforme |
| **Échange** | Interaction entre deux membres pour partager des compétences |
| **Conversation** | Fil de messages entre deux membres |
| **Catégorie** | Regroupement thématique de compétences |
| **Follow** | Action de suivre un autre membre |
| **Rating** | Note attribuée à un membre après un échange |
| **Intérêt** | Compétence qu'un membre souhaite apprendre |

---

## 12.2 Termes techniques

### Frontend

| Terme | Définition |
| ----- | ---------- |
| **App Router** | Système de routing Next.js basé sur le système de fichiers |
| **Server Component** | Composant React rendu côté serveur (RSC) |
| **Client Component** | Composant React avec interactivité côté client |
| **Hydration** | Processus d'attachement des event handlers au HTML |
| **SSR** | Server-Side Rendering - rendu côté serveur |
| **SSG** | Static Site Generation - génération statique |
| **ISR** | Incremental Static Regeneration |

### Backend

| Terme | Définition |
| ----- | ---------- |
| **Controller** | Couche gérant les requêtes HTTP |
| **Service** | Couche contenant la logique métier |
| **Middleware** | Fonction interceptant les requêtes |
| **Router** | Définition des routes et méthodes HTTP |
| **ORM** | Object-Relational Mapping (Prisma) |

### Authentification

| Terme | Définition |
| ----- | ---------- |
| **JWT** | JSON Web Token - token d'authentification |
| **Access Token** | Token court (1 h) pour les requêtes API, en cookie `httpOnly` |
| **Refresh Token** | Token long (30 j) pour renouveler l'access token, persisté en BDD avec rotation à chaque usage |
| **argon2** | Algorithme de hachage des mots de passe (variante `argon2id`, gagnant du Password Hashing Competition 2015) |

### Infrastructure

| Terme | Définition |
| ----- | ---------- |
| **Container** | Instance isolée d'une application (Docker) |
| **Volume** | Stockage persistant pour containers |
| **Reverse Proxy** | Serveur redirigeant les requêtes (Nginx) |
| **Load Balancer** | Répartiteur de charge entre serveurs |

---

## 12.3 Acronymes

| Acronyme | Signification |
| -------- | ------------- |
| **API** | Application Programming Interface |
| **CRUD** | Create, Read, Update, Delete |
| **CSS** | Cascading Style Sheets |
| **DX** | Developer Experience |
| **E2E** | End-to-End (tests) |
| **FTS** | Full-Text Search |
| **HTTP** | HyperText Transfer Protocol |
| **HTTPS** | HTTP Secure |
| **JSON** | JavaScript Object Notation |
| **LTS** | Long Term Support |
| **MVP** | Minimum Viable Product |
| **REST** | Representational State Transfer |
| **SQL** | Structured Query Language |
| **SSL** | Secure Sockets Layer |
| **TCP** | Transmission Control Protocol |
| **TLS** | Transport Layer Security |
| **UI** | User Interface |
| **UX** | User Experience |

---

## 12.4 Stack technique & métriques

!!! info "Datation des mesures"
    **Volumétrie du code** et **volumétrie fonctionnelle** ont été recomptées
    depuis le dépôt le **2026-08-09**, avec les commandes reproductibles données
    dans chaque sous-section. Les **versions de la stack** et l'**audit npm**
    restent l'instantané du **2026-05-07** et n'ont pas été revérifiés.
    Pour rafraîchir : voir les commandes en bas de section.

### Versions de la stack

Lues depuis les `package.json` du dépôt de production (ranges `^` conservés tels que déclarés).

| Technologie       | Version (déclarée) | Source                       |
| ----------------- | ------------------ | ---------------------------- |
| Node.js           | 24                | Contrainte CI / Dockerfile   |
| Next.js           | 16.1.1             | `frontend/package.json`      |
| React             | 19.2.3             | `frontend/package.json`      |
| TypeScript        | ^5                 | `frontend` & `backend`       |
| Tailwind CSS      | ^4.1.18            | `frontend/package.json`      |
| shadcn/ui (Radix) | suite Radix UI     | `frontend/package.json`      |
| React Hook Form   | ^7.71.1            | `frontend/package.json`      |
| Zod               | ^4.3.5             | `frontend` & `backend`       |
| Express           | ^5.2.1             | `backend/package.json`       |
| Prisma            | ^7.2.0             | `backend/package.json`       |
| @prisma/client    | ^7.2.0             | `backend/package.json`       |
| socket.io         | ^4.8.3             | `backend/package.json`       |
| socket.io-client  | ^4.8.3             | `frontend/package.json`      |
| argon2            | ^0.44.0            | `backend/package.json`       |
| jsonwebtoken      | ^9.0.3             | `backend/package.json`       |
| helmet            | ^8.1.0             | `backend/package.json`       |
| meilisearch       | ^0.55.0            | `backend/package.json`       |
| multer            | ^2.0.2             | `backend/package.json`       |
| PostgreSQL        | 16-alpine          | `devops/docker-compose.*.yml`|
| Meilisearch       | v1.6               | `devops/docker-compose.*.yml`|

### Volumétrie du code

Recomptée le **2026-08-09**. Le code applicatif n'a pas évolué depuis son import
initial (`git log --oneline -- frontend/src` → 1 commit) : ces valeurs sont stables.

Méthode exacte, reproductible :

```bash
# backend — tous les .ts, fichiers de test compris
find backend -name '*.ts' -not -path '*/node_modules/*' \
     -not -path '*/generated/*' -not -path '*/dist/*' | wc -l

# frontend — .ts/.tsx de src/, hors stories et hors tests
find frontend/src \( -name '*.ts' -o -name '*.tsx' \) \
     ! -name '*.stories.tsx' ! -name '*.test.ts' ! -name '*.test.tsx' | wc -l

# pour les lignes : remplacer « | wc -l » par « -exec cat {} + | wc -l »
```

| Indicateur                                                    | Valeur     |
| ------------------------------------------------------------- | ---------- |
| Fichiers TypeScript total                                     | 182        |
| Fichiers frontend (`frontend/src/`, hors stories et tests)     | 124        |
| Fichiers backend (`backend/`, hors `generated/`, tests inclus) | 58         |
| Lignes de code total                                          | 21 746     |
| Lignes frontend                                               | 12 386     |
| Lignes backend                                                | 9 360      |

!!! warning "Les deux périmètres ne sont pas symétriques"
    Le comptage backend **inclut** les 7 fichiers `*.spec.test.ts` (51 fichiers
    hors tests), tandis que le comptage frontend **exclut** les 28 `*.stories.tsx`
    et les 5 fichiers de test. Les totaux ne sont donc pas comparables entre les
    deux moitiés du projet ; ils sont conservés tels quels pour rester cohérents
    avec les mesures antérieures.

### Volumétrie fonctionnelle

| Indicateur                       | Valeur                                |
| -------------------------------- | ------------------------------------- |
| Composants React                 | 68 (18 atoms + 9 molecules + 39 organisms + 1 layout + 1 provider) |
| Hooks personnalisés              | 24 (9 racine + 8 `messaging/` + 7 `profile/`) |
| Controllers backend              | 7                                     |
| Routers backend                  | 9                                     |
| Endpoints HTTP exposés           | 38 (37 routes applicatives + `/health`) |
| Services backend                 | 7                                     |
| Middlewares Express              | 5                                     |
| Validators Zod (backend)         | 5                                     |
| Validators Zod (frontend)        | 4                                     |
| Modèles Prisma                   | 14                                    |
| Enums Prisma                     | 4                                     |
| Migrations Prisma                | 6                                     |

### Vulnérabilités npm (production)

Mesurées via `npm audit --omit=dev` au **2026-05-07**, sur les dépendances de production
uniquement (les outils de dev ne sont pas en runtime).

| Périmètre  | Total | Critical | High | Moderate | Low | Dépendances prod |
| ---------- | :---: | :------: | :--: | :------: | :-: | :--------------: |
| `backend`  |  18   |    0     |  12  |    5     |  1  |       250        |
| `frontend` |   3   |    0     |   2  |    1     |  0  |       110        |

Les vulnérabilités sont à inspecter avant tout déploiement de production. Aucune n'est
critique à la date de mesure ; un suivi régulier est néanmoins requis.

### Photographie de la production (mai 2026)

Volumétrie applicative en base à la date de la soutenance. Données extraites manuellement
côté DBA ; à automatiser en V2 (exporteur Prometheus ou requête SQL planifiée).

| Entité            | Lignes |
| ----------------- | -----: |
| Utilisateurs      |     23 |
| Compétences       |     28 |
| Catégories        |      8 |
| Conversations     |     17 |
| Messages          |     57 |
| Évaluations       |      5 |
| Follows           |     32 |

### Rafraîchir les chiffres

```bash
# Versions
cat frontend/package.json | jq '.dependencies, .devDependencies'
cat backend/package.json  | jq '.dependencies, .devDependencies'

# Volumétrie code
find frontend/src backend -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" -not -path "*/generated/*" -not -path "*/dist/*" \
  | xargs wc -l

# Audit prod
( cd backend  && npm audit --omit=dev )
( cd frontend && npm audit --omit=dev )

# Photographie BDD
psql "$DATABASE_URL" -c "
  SELECT 'users'         AS entity, COUNT(*) FROM \"user\"      UNION ALL
  SELECT 'skills',         COUNT(*) FROM skill                  UNION ALL
  SELECT 'categories',     COUNT(*) FROM category               UNION ALL
  SELECT 'conversations',  COUNT(*) FROM conversation           UNION ALL
  SELECT 'messages',       COUNT(*) FROM message                UNION ALL
  SELECT 'evaluations',    COUNT(*) FROM evaluation             UNION ALL
  SELECT 'follows',        COUNT(*) FROM follow;
"
```

---

## 12.5 Références

### Documentation interne

- [Introduction](../01-introduction/index.md)
- [Contraintes](../02-constraints/index.md)
- [Contexte](../03-context/index.md)
- [Stratégie](../04-solution-strategy/index.md)
- [Building Blocks](../05-building-blocks/index.md)
- [Runtime](../06-runtime/index.md)
- [Déploiement](../07-deployment/index.md)
- [Crosscutting](../08-crosscutting/index.md)
- [Décisions](../09-decisions/index.md)
- [Qualité](../10-quality/index.md)
- [Risques](../11-risks/index.md)

### Ressources externes

- [Arc42 Template](https://arc42.org/)
- [C4 Model](https://c4model.com/)
- [Atomic Design](https://atomicdesign.bradfrost.com/)

---

## Navigation

| Précédent | Retour |
| --------- | ------ |
| [← 11. Risques](../11-risks/index.md) | [🏠 Accueil](../../index.md) |
