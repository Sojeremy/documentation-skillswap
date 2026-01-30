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
| **App Router** | Système de routing Next.js 14 basé sur le système de fichiers |
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
| **Access Token** | Token court (15min) pour les requêtes API |
| **Refresh Token** | Token long (7j) pour renouveler l'access token |
| **bcrypt** | Algorithme de hachage pour les mots de passe |

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

## 12.4 Stack technique

### Versions utilisées

| Technologie | Version | Documentation |
| ----------- | ------- | ------------- |
| Node.js | 20 LTS | <https://nodejs.org/> |
| Next.js | 14.x | <https://nextjs.org/> |
| React | 18.x | <https://react.dev/> |
| TypeScript | 5.x | <https://typescriptlang.org/> |
| Express | 4.x | <https://expressjs.com/> |
| Prisma | 5.x | <https://prisma.io/> |
| PostgreSQL | 16 | <https://postgresql.org/> |
| Meilisearch | 1.6 | <https://meilisearch.com/> |
| Tailwind CSS | 3.x | <https://tailwindcss.com/> |
| TanStack Query | 5.x | <https://tanstack.com/query> |

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
