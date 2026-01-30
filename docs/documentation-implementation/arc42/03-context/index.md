# 3. Contexte et Périmètre

## 3.1 Contexte métier

SkillSwap s'inscrit dans l'économie collaborative en permettant l'échange de compétences sans transaction monétaire.

### Acteurs externes

```mermaid
C4Context
    title Diagramme de Contexte - SkillSwap

    Person(user, "Utilisateur", "Membre inscrit qui<br/>propose et recherche<br/>des compétences")
    Person(visitor, "Visiteur", "Utilisateur non connecté<br/>qui consulte le site")
    Person(admin, "Administrateur", "Gère la plateforme<br/>et modère le contenu")

    System(skillswap, "SkillSwap", "Plateforme d'échange<br/>de compétences")

    System_Ext(email, "Service Email", "Envoi de notifications<br/>et confirmations")
    System_Ext(meilisearch, "Meilisearch", "Moteur de recherche<br/>full-text")

    Rel(visitor, skillswap, "Consulte les profils publics")
    Rel(user, skillswap, "Gère son profil, recherche,<br/>échange des messages")
    Rel(admin, skillswap, "Administre et modère")
    Rel(skillswap, email, "Envoie des emails")
    Rel(skillswap, meilisearch, "Indexe et recherche")
```

---

## 3.2 Contexte technique

### Interfaces externes

| Système externe | Type | Protocole | Description |
| --------------- | ---- | --------- | ----------- |
| **Meilisearch** | Service | HTTP/REST | Recherche full-text des membres et compétences |
| **PostgreSQL** | Base de données | TCP/5432 | Stockage des données persistantes |
| **SMTP (futur)** | Service | SMTP/587 | Envoi d'emails transactionnels |

### Frontières du système

```mermaid
flowchart TB
    subgraph Internet
        Browser[Navigateur Web]
    end

    subgraph "SkillSwap Platform"
        subgraph "Frontend Container"
            NextJS[Next.js App]
        end

        subgraph "Backend Container"
            Express[Express API]
        end

        subgraph "Data Layer"
            PG[(PostgreSQL)]
            MS[(Meilisearch)]
        end
    end

    Browser -->|HTTPS| NextJS
    NextJS -->|HTTP| Express
    Express -->|TCP| PG
    Express -->|HTTP| MS
```

---

## 3.3 Utilisateurs et rôles

| Rôle | Permissions | Cas d'usage |
| ---- | ----------- | ----------- |
| **Visiteur** | Lecture seule | Consulter les profils publics, page d'accueil |
| **Membre** | CRUD sur son profil, messagerie | Gérer son profil, contacter d'autres membres |
| **Admin** | Toutes permissions | Modérer, gérer les catégories, voir les statistiques |

---

## 3.4 Flux de données principaux

### Inscription d'un utilisateur

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL

    U->>F: Remplit le formulaire
    F->>F: Validation Zod (client)
    F->>B: POST /api/auth/register
    B->>B: Validation Zod (serveur)
    B->>B: Hash du mot de passe (bcrypt)
    B->>DB: INSERT user
    DB-->>B: User créé
    B->>B: Génère JWT + Refresh Token
    B-->>F: 201 + tokens
    F->>F: Stocke tokens
    F-->>U: Redirection vers profil
```

### Recherche de compétences

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant MS as Meilisearch
    participant DB as PostgreSQL

    U->>F: Tape "React" dans la recherche
    F->>F: Debounce 300ms
    F->>B: GET /api/search?q=React
    B->>MS: Search "React"
    MS-->>B: Liste des IDs matchés
    B->>DB: SELECT users WHERE id IN (...)
    DB-->>B: Users avec détails
    B-->>F: Résultats formatés
    F-->>U: Affiche les profils
```

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [← 2. Contraintes](../02-constraints/index.md) | [4. Stratégie →](../04-solution-strategy/index.md) |
