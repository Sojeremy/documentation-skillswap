# 6.3 Messagerie

## Envoi d'un message

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL

    U->>F: Écrit un message et clique "Envoyer"
    F->>F: Validation (message non vide)
    F->>B: POST /api/conversations/:id/messages
    B->>B: Vérifie auth (JWT)
    B->>B: Vérifie que user appartient à la conv
    alt Non autorisé
        B-->>F: 403 Forbidden
        F-->>U: Erreur affichée
    else Autorisé
        B->>DB: INSERT INTO message
        DB-->>B: Message créé
        B-->>F: 201 Created + message
        F->>F: Ajoute message à la liste (optimistic)
        F-->>U: Message visible instantanément
    end
```

### Points clés

- **Validation d'autorisation** : Seuls les participants peuvent envoyer
- **Update optimiste** : Message affiché immédiatement côté client
- **Invalidation cache** : TanStack Query invalide la liste des messages

---

## Création d'une conversation

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur A
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL

    U->>F: Clique "Contacter" sur profil B
    F->>B: POST /api/conversations
    Note right of F: { participantId: B.id, message: "..." }
    B->>DB: Vérifie si conv existe entre A et B
    alt Conversation existe
        B-->>F: 200 OK + conversation existante
        F-->>U: Ouvre la conversation
    else Nouvelle conversation
        B->>DB: BEGIN TRANSACTION
        B->>DB: INSERT conversation
        B->>DB: INSERT user_has_conversation (A)
        B->>DB: INSERT user_has_conversation (B)
        B->>DB: INSERT message (premier message)
        B->>DB: COMMIT
        B-->>F: 201 Created + conversation
        F-->>U: Ouvre la nouvelle conversation
    end
```

### Points clés

- **Éviter les doublons** : Vérifie si une conversation existe déjà
- **Transaction** : Création atomique (conversation + participants + message)
- **Premier message** : Obligatoire pour créer une conversation

---

## Récupération des conversations

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL

    U->>F: Ouvre la page messagerie
    F->>B: GET /api/conversations
    B->>DB: SELECT conversations JOIN user_has_conversation
    Note right of B: Inclut dernier message et participant
    DB-->>B: Liste des conversations
    B-->>F: { conversations: [...] }
    F-->>U: Affiche liste triée par date
```

### Données retournées

```typescript
interface ConversationListItem {
  id: number;
  participant: {
    id: number;
    firstname: string;
    avatarUrl: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isOwn: boolean;
  };
  unreadCount: number;
}
```

---

## Hook useMessaging

```typescript
// Facade simplifiant 3 endpoints
export function useMessaging() {
  const conversationsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  return {
    conversations: conversationsQuery.data ?? [],
    isLoading: conversationsQuery.isLoading,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
}
```

---

[← Retour à l'index](./index.md)
