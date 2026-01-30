# 5.4 Base de données

## Modèle conceptuel (14 modèles)

```mermaid
erDiagram
    User ||--o{ UserHasSkill : "possède"
    User ||--o{ UserHasInterest : "recherche"
    User ||--o{ UserHasConversation : "participe"
    User ||--o{ Rating : "reçoit"
    User ||--o{ Follow : "suit"
    User }o--|| Role : "a un"

    Skill ||--o{ UserHasSkill : "enseignée par"
    Skill ||--o{ UserHasInterest : "recherchée par"
    Skill }o--|| Category : "appartient à"

    Conversation ||--o{ Message : "contient"
    Conversation ||--o{ UserHasConversation : "implique"

    User {
        int id PK
        string email UK
        string firstname
        string lastname
        string password
        string city
        string avatarUrl
        string description
        datetime createdAt
        datetime updatedAt
    }

    Skill {
        int id PK
        string name UK
        int categoryId FK
    }

    Category {
        int id PK
        string name UK
        string description
    }

    Conversation {
        int id PK
        enum status
        datetime createdAt
    }

    Message {
        int id PK
        string content
        int senderId FK
        int conversationId FK
        boolean read
        datetime createdAt
    }

    Rating {
        int id PK
        int score
        string comment
        int raterId FK
        int ratedId FK
    }

    Follow {
        int followerId FK
        int followingId FK
        datetime createdAt
    }
```

---

## Tables de jonction

| Table | Colonnes | Rôle |
| ----- | -------- | ---- |
| `UserHasSkill` | `userId`, `skillId`, `level` | Compétences d'un utilisateur |
| `UserHasInterest` | `userId`, `skillId` | Intérêts d'un utilisateur |
| `UserHasConversation` | `userId`, `conversationId`, `role` | Participants d'une conversation |

---

## Enums Prisma

```prisma
enum Role {
  USER
  ADMIN
}

enum SkillLevel {
  DEBUTANT
  INTERMEDIAIRE
  CONFIRME
  EXPERT
}

enum ConversationStatus {
  ACTIVE
  ARCHIVED
  DELETED
}

enum ParticipantRole {
  INITIATOR
  RECEIVER
}
```

---

## Documentation détaillée

Pour plus de détails sur la base de données, consultez :

- [Vue d'ensemble](../../database/index.md) - ERD complet et structure
- [Relations](../../database/relations.md) - Détail des relations entre modèles
- [Enums](../../database/enums.md) - Documentation des énumérations
- [Migrations](../../database/migrations.md) - Guide des migrations Prisma
- [Modèles](../../database/models/user.md) - Documentation par modèle

---

## Navigation

| Précédent | Suivant |
| --------- | ------- |
| [Backend](./backend.md) | [6. Runtime](../06-runtime/index.md) |
