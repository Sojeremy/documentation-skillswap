[**SkillSwap Frontend API**](index.md)

***

[SkillSwap Frontend API](index.md) / Hooks

# Hooks

## Description

Custom React hooks for SkillSwap frontend application.

This module provides reusable hooks for:
- **UI**: Auto-scroll, mobile detection, form state management
- **Search**: Debounced search with pagination and filters
- **Messaging**: Conversation management, real-time updates, followed users

## Example

```tsx
import { useSearch, useMessaging, useIsMobile } from '@/hooks';

function MyComponent() {
  const { query, setQuery, results } = useSearch();
  const { conversations } = useMessaging();
  const isMobile = useIsMobile();
}
```

## Functions

### Hooks

#### useAutoScroll()

> **useAutoScroll**\<`T`\>(`dependency`): `RefObject`\<`HTMLDivElement` \| `null`\>

Defined in: [hooks/useAutoScroll.ts:33](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useAutoScroll.ts#L33)

Hook to automatically scroll to the bottom when content changes.

##### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | Type of the dependency used to detect context changes |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `dependency` | `T` | Value that identifies the current context (e.g., conversation ID) |

##### Returns

`RefObject`\<`HTMLDivElement` \| `null`\>

React ref to attach to the scrollable container

##### Description

Uses ResizeObserver to detect content size changes and automatically
scrolls to the bottom. Behavior varies based on context:
- **Smooth scroll**: For new messages in the same conversation
- **Instant scroll**: When switching to a different conversation

##### Example

```tsx
function MessageThread({ conversationId, messages }) {
  const scrollRef = useAutoScroll(conversationId);

  return (
    <div ref={scrollRef} className="overflow-y-auto h-96">
      <div>
        {messages.map(msg => <Message key={msg.id} {...msg} />)}
      </div>
    </div>
  );
}
```

***

#### useFormState()

> **useFormState**\<`T`\>(`options`): `UseFormStateReturn`\<`T`\>

Defined in: [hooks/useFormState.ts:100](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useFormState.ts#L100)

Generic form state management hook with Zod validation.

##### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | Form data type (must extend Record<string, unknown>) |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `UseFormStateOptions`\<`T`\> | Configuration including initial values, validation, and submit handler |

##### Returns

`UseFormStateReturn`\<`T`\>

Form state and control functions

##### Description

Provides complete form state management including:
- **Field state**: Track values and changes
- **Validation**: Zod schema integration with field-level errors
- **Submission**: Async submit with loading state
- **Error clearing**: Auto-clear errors on field change

##### Examples

Basic usage with validation:
```tsx
function LoginForm() {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useFormState({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (data) => {
      await api.login(data);
      router.push('/dashboard');
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input name="email" value={formData.email} onChange={handleChange} error={errors.email} />
      <Input name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
      <Button type="submit" disabled={isSubmitting}>Connexion</Button>
    </form>
  );
}
```

Programmatic field manipulation:
```tsx
const { setFieldValue, setFieldError, resetForm } = useFormState({ ... });

// Set value programmatically
setFieldValue('email', 'prefilled@example.com');

// Set custom error
setFieldError('email', 'Cet email est déjà utilisé');

// Reset entire form
resetForm();
```

***

#### useIsMobile()

> **useIsMobile**(`breakpoint`): `boolean`

Defined in: [hooks/useIsMobile.ts:31](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useIsMobile.ts#L31)

Hook for detecting mobile viewport based on screen width.

##### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `breakpoint` | `number` | `768` | Width threshold in pixels. |

##### Returns

`boolean`

`true` if viewport width is below breakpoint, `false` otherwise

##### Description

Uses ResizeObserver to track viewport changes and returns a boolean
indicating if the current viewport is below the specified breakpoint.
Returns `false` during SSR to avoid hydration mismatches.

##### Default Value

```ts
768
```

##### Examples

```tsx
function ResponsiveLayout() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

Custom breakpoint:
```tsx
const isTablet = useIsMobile(1024);
```

***

#### useSearch()

> **useSearch**(`options`): `UseSearchReturn`

Defined in: [hooks/useSearch.ts:105](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useSearch.ts#L105)

Hook for searching members with debounce, pagination, and category filtering.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `UseSearchOptions` | Configuration options for search behavior |

##### Returns

`UseSearchReturn`

Search state and control functions

##### Description

Provides a complete search experience with:
- **Debounced input**: Waits for user to stop typing before searching
- **Pagination**: Supports page-based navigation through results
- **Category filtering**: Filter results by skill category
- **Automatic cancellation**: Cancels in-flight requests when new search starts

##### Examples

Basic usage:
```tsx
function SearchPage() {
  const { query, setQuery, results, isLoading } = useSearch();

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {isLoading && <Spinner />}
      {results?.members.map(member => <MemberCard key={member.id} {...member} />)}
    </div>
  );
}
```

With custom options and pagination:
```tsx
function AdvancedSearch() {
  const { results, page, setPage, category, setCategory } = useSearch({
    debounceMs: 500,
    limit: 20,
    minChars: 2
  });

  return (
    <div>
      <CategoryFilter value={category} onChange={setCategory} />
      <ResultsList members={results?.members} />
      <Pagination
        page={page}
        totalPages={results?.totalPages}
        onChange={setPage}
      />
    </div>
  );
}
```

### Other

#### useConversationActions()

> **useConversationActions**(`__namedParameters`): `object`

Defined in: [hooks/messaging/useConversationActions.ts:33](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts#L33)

Hook for conversation CRUD actions
Responsibilities: create, rate, close, delete, send message

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `ConversationActionsParams` |

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `handleBack()` | () => `void` | [hooks/messaging/useConversationActions.ts:152](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts#L152) |
| `handleViewProfile()` | (`profilId`) => `void` | [hooks/messaging/useConversationActions.ts:153](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts#L153) |
| `handleNewConversation()` | () => `Promise`\<`void`\> | [hooks/messaging/useConversationActions.ts:154](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts#L154) |
| `handleAddConversation()` | (`data`) => `Promise`\<`void`\> | [hooks/messaging/useConversationActions.ts:155](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts#L155) |
| `handleRatingUser()` | (`data`) => `Promise`\<`void`\> | [hooks/messaging/useConversationActions.ts:156](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts#L156) |
| `handleEncloseConversation()` | () => `Promise`\<`void`\> | [hooks/messaging/useConversationActions.ts:157](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts#L157) |
| `handleDeleteConversation()` | () => `Promise`\<`void`\> | [hooks/messaging/useConversationActions.ts:158](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts#L158) |
| `handleSendMessage()` | (`msg`) => `Promise`\<`void`\> | [hooks/messaging/useConversationActions.ts:159](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts#L159) |

***

#### useConversationList()

> **useConversationList**(): `object`

Defined in: [hooks/messaging/useConversationList.ts:13](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationList.ts#L13)

Hook for managing the list of conversations
Responsibilities: fetch, add, update, remove conversations

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `conversations` | [`Conversation`](lib/api-types.md#conversation)[] | [hooks/messaging/useConversationList.ts:59](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationList.ts#L59) |
| `isLoading` | `boolean` | [hooks/messaging/useConversationList.ts:60](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationList.ts#L60) |
| `addConversation()` | (`conv`) => `void` | [hooks/messaging/useConversationList.ts:61](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationList.ts#L61) |
| `updateConversation()` | (`id`, `updates`) => `void` | [hooks/messaging/useConversationList.ts:62](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationList.ts#L62) |
| `removeConversation()` | (`id`) => `void` | [hooks/messaging/useConversationList.ts:63](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationList.ts#L63) |

***

#### useFollowedUsers()

> **useFollowedUsers**(): `object`

Defined in: [hooks/messaging/useFollowedUsers.ts:12](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useFollowedUsers.ts#L12)

Hook for managing followed users (used in new conversation dialog)
Responsibilities: fetch and store followed users list

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `followedUsers` | [`UserInfo`](lib/api-types.md#userinfo)[] \| `undefined` | [hooks/messaging/useFollowedUsers.ts:25](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useFollowedUsers.ts#L25) |
| `fetchFollowedUsers()` | () => `Promise`\<`void`\> | [hooks/messaging/useFollowedUsers.ts:26](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useFollowedUsers.ts#L26) |

***

#### useSelectedConversation()

> **useSelectedConversation**(): `object`

Defined in: [hooks/messaging/useSelectedConversation.ts:12](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useSelectedConversation.ts#L12)

Hook for managing the currently selected conversation
Responsibilities: selection state, fetch conversation details, clear selection

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `selectedConvId` | `number` \| `undefined` | [hooks/messaging/useSelectedConversation.ts:42](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useSelectedConversation.ts#L42) |
| `setSelectedConvId` | `Dispatch`\<`SetStateAction`\<`number` \| `undefined`\>\> | [hooks/messaging/useSelectedConversation.ts:43](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useSelectedConversation.ts#L43) |
| `selectedConv` | [`ConversationWithMsg`](lib/api-types.md#conversationwithmsg) \| `undefined` | [hooks/messaging/useSelectedConversation.ts:44](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useSelectedConversation.ts#L44) |
| `setSelectedConv` | `Dispatch`\<`SetStateAction`\<[`ConversationWithMsg`](lib/api-types.md#conversationwithmsg) \| `undefined`\>\> | [hooks/messaging/useSelectedConversation.ts:45](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useSelectedConversation.ts#L45) |
| `clearSelection()` | () => `void` | [hooks/messaging/useSelectedConversation.ts:46](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useSelectedConversation.ts#L46) |

***

#### useMessaging()

> **useMessaging**(): `object`

Defined in: [hooks/useMessaging.ts:15](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L15)

Main messaging hook - composes smaller focused hooks
Provides all conversation functionality to the ConversationPage

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `selectedConvId` | `number` \| `undefined` | [hooks/useMessaging.ts:59](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L59) |
| `setSelectedConvId` | `Dispatch`\<`SetStateAction`\<`number` \| `undefined`\>\> | [hooks/useMessaging.ts:60](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L60) |
| `selectedConv` | [`ConversationWithMsg`](lib/api-types.md#conversationwithmsg) \| `undefined` | [hooks/useMessaging.ts:61](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L61) |
| `conversations` | [`Conversation`](lib/api-types.md#conversation)[] | [hooks/useMessaging.ts:62](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L62) |
| `followedUsers` | [`UserInfo`](lib/api-types.md#userinfo)[] \| `undefined` | [hooks/useMessaging.ts:63](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L63) |
| `isConversationLoading` | `boolean` | [hooks/useMessaging.ts:64](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L64) |
| `handleBack()` | () => `void` | [hooks/useMessaging.ts:66](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L66) |
| `handleNewConversation()` | () => `Promise`\<`void`\> | [hooks/useMessaging.ts:67](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L67) |
| `handleAddConversation()` | (`data`) => `Promise`\<`void`\> | [hooks/useMessaging.ts:68](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L68) |
| `handleSendMessage()` | (`msg`) => `Promise`\<`void`\> | [hooks/useMessaging.ts:69](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L69) |
| `handleViewProfile()` | (`profilId`) => `void` | [hooks/useMessaging.ts:70](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L70) |
| `handleRatingUser()` | (`data`) => `Promise`\<`void`\> | [hooks/useMessaging.ts:71](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L71) |
| `handleEncloseConversation()` | () => `Promise`\<`void`\> | [hooks/useMessaging.ts:72](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L72) |
| `handleDeleteConversation()` | () => `Promise`\<`void`\> | [hooks/useMessaging.ts:73](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useMessaging.ts#L73) |
| `messages` | `Message[]` | Messages de la conversation sélectionnée |
| `loadMoreMessages()` | () => `Promise`\<`void`\> | Charge plus de messages (pagination) |

***

## Hooks supplémentaires

### useAccount()

> **useAccount**(): `object`

Defined in: [hooks/useAccount.ts:17](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useAccount.ts#L17)

Hook pour la gestion du compte utilisateur (mot de passe, suppression).

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `handlePasswordChange()` | (`data`: `UpdatePasswordData`) => `Promise`\<`void`\> | Change le mot de passe |
| `handleDeleteAccount()` | () => `Promise`\<`void`\> | Supprime le compte définitivement |

##### Example

```tsx
function AccountSettings() {
  const { handlePasswordChange, handleDeleteAccount } = useAccount();

  return (
    <div>
      <PasswordForm onSubmit={handlePasswordChange} />
      <DeleteAccountButton onClick={handleDeleteAccount} />
    </div>
  );
}
```

***

### useSocket()

> **useSocket**(`conversationId`): `object`

Defined in: [hooks/useSocket.ts:17](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useSocket.ts#L17)

Hook pour la communication WebSocket temps réel dans une conversation.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conversationId` | `number` | ID de la conversation active |

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `sendMessage()` | (`content`: `string`) => `void` | Envoie un message via WebSocket |
| `closeConversation()` | () => `void` | Ferme la conversation |
| `onMessage()` | (`callback`) => `void` | Écoute les nouveaux messages |
| `onConversationUpdate()` | (`callback`) => `void` | Écoute les mises à jour |
| `onConversationClosed()` | (`callback`) => `void` | Écoute la fermeture |
| `onError()` | (`callback`) => `void` | Écoute les erreurs |

##### Example

```tsx
function MessageThread({ conversationId }) {
  const { sendMessage, onMessage } = useSocket(conversationId);

  useEffect(() => {
    onMessage((msg) => {
      // Nouveau message reçu en temps réel
      addMessage(msg);
    });
  }, []);

  return <MessageInput onSend={sendMessage} />;
}
```

***

### useTopCategories()

> **useTopCategories**(): `object`

Defined in: [hooks/useTopCategories.ts:21](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useTopCategories.ts#L21)

Hook pour récupérer les catégories les plus populaires.

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `categories` | `Category[]` | Liste des top catégories |
| `isLoading` | `boolean` | État de chargement |

##### Example

```tsx
function CategoriesSection() {
  const { categories, isLoading } = useTopCategories();

  if (isLoading) return <Skeleton />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {categories.map(cat => <CategoryCard key={cat.id} {...cat} />)}
    </div>
  );
}
```

***

### useConversationMessages()

> **useConversationMessages**(`conversationId`): `object`

Defined in: [hooks/messaging/useConversationMessages.ts:13](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useConversationMessages.ts#L13)

Hook pour gérer les messages d'une conversation avec pagination.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `conversationId` | `number \| undefined` | ID de la conversation |

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `messages` | `Message[]` | Liste des messages |
| `isLoading` | `boolean` | État de chargement initial |
| `hasMore` | `boolean` | S'il y a plus de messages à charger |
| `loadMore()` | () => `Promise`\<`void`\> | Charge les messages précédents |
| `addMessage()` | (`msg`: `Message`) => `void` | Ajoute un message (temps réel) |
| `addOptimisticMessage()` | (`msg`: `Message`) => `void` | Ajoute un message optimiste |

##### Example

```tsx
function MessageList({ conversationId }) {
  const { messages, hasMore, loadMore, isLoading } = useConversationMessages(conversationId);

  return (
    <div onScroll={handleInfiniteScroll}>
      {hasMore && <button onClick={loadMore}>Charger plus</button>}
      {messages.map(msg => <MessageBubble key={msg.id} {...msg} />)}
    </div>
  );
}
```

***

### useGlobalSocket()

> **useGlobalSocket**(`callbacks`): `void`

Defined in: [hooks/messaging/useGlobalSocket.ts:23](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useGlobalSocket.ts#L23)

Hook pour écouter les événements WebSocket globaux (toutes les conversations).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callbacks` | `GlobalSocketCallbacks` | Callbacks pour les événements |

##### Description

Écoute les événements suivants :
- `conversation:updated` - Mise à jour d'une conversation
- `conversation:closed` - Fermeture d'une conversation
- `conversation:new` - Nouvelle conversation créée

##### Example

```tsx
function ConversationList() {
  const [conversations, setConversations] = useState([]);

  useGlobalSocket({
    onConversationUpdate: (conv) => {
      // Mettre à jour la conversation dans la liste
      updateConversation(conv.id, conv);
    },
    onConversationNew: (conv) => {
      // Ajouter la nouvelle conversation
      addConversation(conv);
    }
  });

  return <List items={conversations} />;
}
```

***

### useMessagingScroll()

> **useMessagingScroll**(`options`): `object`

Defined in: [hooks/messaging/useMessagingScroll.ts:14](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/messaging/useMessagingScroll.ts#L14)

Hook pour gérer le scroll dans la liste de messages (auto-scroll, infinite scroll).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `MessagingScrollOptions` | Options de configuration |

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `containerRef` | `RefObject`\<`HTMLDivElement`\> | Ref à attacher au container |
| `scrollToBottom()` | () => `void` | Force le scroll vers le bas |

##### Example

```tsx
function MessageThread({ messages }) {
  const { containerRef, scrollToBottom } = useMessagingScroll({
    messages,
    onLoadMore: loadMoreMessages
  });

  return (
    <div ref={containerRef} className="overflow-y-auto">
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
    </div>
  );
}
```

***

## Profile Hooks

### useProfile()

> **useProfile**(`userId`): `object`

Defined in: [hooks/profile/useProfile.ts:26](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/profile/useProfile.ts#L26)

Hook pour récupérer et gérer les données d'un profil utilisateur.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `userId` | `number` | ID de l'utilisateur |

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `profile` | `Profile \| undefined` | Données du profil |
| `isLoading` | `boolean` | État de chargement |
| `refetchProfile()` | () => `Promise`\<`void`\> | Recharge le profil |
| `setProfile()` | (`profile`: `Profile`) => `void` | Met à jour le profil localement |

##### Example

```tsx
function ProfilePage({ userId }) {
  const { profile, isLoading, refetchProfile } = useProfile(userId);

  if (isLoading) return <ProfileSkeleton />;
  if (!profile) return <NotFound />;

  return <ProfileFull profile={profile} onUpdate={refetchProfile} />;
}
```

***

### useProfileUpdate()

> **useProfileUpdate**(`profile`, `setProfile`): `object`

Defined in: [hooks/profile/useProfileUpdate.ts:32](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/profile/useProfileUpdate.ts#L32)

Hook pour mettre à jour le profil et l'avatar.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `profile` | `Profile` | Profil actuel |
| `setProfile` | (`profile`: `Profile`) => `void` | Setter du profil |

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `updateProfile()` | (`data`: `UpdateProfileData`) => `Promise`\<`void`\> | Met à jour les infos du profil |
| `updateAvatar()` | (`file`: `File`) => `Promise`\<`void`\> | Upload un nouvel avatar |

##### Example

```tsx
function EditProfileForm({ profile, setProfile }) {
  const { updateProfile, updateAvatar } = useProfileUpdate(profile, setProfile);

  const handleSubmit = async (data) => {
    await updateProfile(data);
    toast.success('Profil mis à jour');
  };

  return <ProfileForm onSubmit={handleSubmit} onAvatarChange={updateAvatar} />;
}
```

***

### useSkills()

> **useSkills**(`profile`, `setProfile`): `object`

Defined in: [hooks/profile/useSkills.ts:33](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/profile/useSkills.ts#L33)

Hook pour gérer les compétences d'un utilisateur.

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `addSkill()` | (`skillId`: `number`) => `Promise`\<`AddResult`\> | Ajoute une compétence |
| `deleteSkill()` | (`skillId`: `number`) => `Promise`\<`void`\> | Supprime une compétence |

##### AddResult

Type de retour de `addSkill()` :
- `'success'` - Compétence ajoutée
- `'already-exists'` - Déjà possédée
- `'limit-reached'` - Limite atteinte (max 5)
- `'error'` - Erreur serveur

##### Example

```tsx
function SkillsManager({ profile, setProfile }) {
  const { addSkill, deleteSkill } = useSkills(profile, setProfile);

  const handleAdd = async (skillId) => {
    const result = await addSkill(skillId);
    if (result === 'limit-reached') {
      toast.error('Maximum 5 compétences');
    }
  };

  return <SkillSelector onAdd={handleAdd} onDelete={deleteSkill} />;
}
```

***

### useInterests()

> **useInterests**(`profile`, `setProfile`): `object`

Defined in: [hooks/profile/useInterests.ts:37](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/profile/useInterests.ts#L37)

Hook pour gérer les intérêts (compétences recherchées) d'un utilisateur.

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `addInterest()` | (`skillId`: `number`) => `Promise`\<`AddResult`\> | Ajoute un intérêt |
| `deleteInterest()` | (`skillId`: `number`) => `Promise`\<`void`\> | Supprime un intérêt |

##### Example

```tsx
function InterestsManager({ profile, setProfile }) {
  const { addInterest, deleteInterest } = useInterests(profile, setProfile);

  return (
    <InterestSelector
      interests={profile.interests}
      onAdd={addInterest}
      onDelete={deleteInterest}
    />
  );
}
```

***

### useAvailabilities()

> **useAvailabilities**(`profile`, `setProfile`): `object`

Defined in: [hooks/profile/useAvailabilities.ts:36](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/profile/useAvailabilities.ts#L36)

Hook pour gérer les disponibilités d'un utilisateur.

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `addAvailability()` | (`data`: `AvailabilityData`) => `Promise`\<`AddResult`\> | Ajoute une disponibilité |
| `deleteAvailability()` | (`id`: `number`) => `Promise`\<`void`\> | Supprime une disponibilité |

##### Example

```tsx
function AvailabilityManager({ profile, setProfile }) {
  const { addAvailability, deleteAvailability } = useAvailabilities(profile, setProfile);

  const handleAdd = async (data) => {
    const result = await addAvailability(data);
    if (result === 'already-exists') {
      toast.error('Ce créneau existe déjà');
    }
  };

  return <AvailabilityGrid onAdd={handleAdd} onDelete={deleteAvailability} />;
}
```

***

### useDialogs()

> **useDialogs**(): `object`

Defined in: [hooks/profile/useDialogs.ts:27](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/profile/useDialogs.ts#L27)

Hook pour gérer l'état des dialogues de la page d'édition de profil.

##### Returns

`object`

| Name | Type | Description |
| ------ | ------ | ------ |
| `isAddSkillOpen` | `boolean` | Dialog ajout compétence |
| `isAddInterestOpen` | `boolean` | Dialog ajout intérêt |
| `isAddAvailabilityOpen` | `boolean` | Dialog ajout disponibilité |
| `isAvatarDialogOpen` | `boolean` | Dialog changement avatar |
| `openAddSkill()` | () => `void` | Ouvre le dialog compétence |
| `closeAddSkill()` | () => `void` | Ferme le dialog compétence |
| `openAddInterest()` | () => `void` | Ouvre le dialog intérêt |
| `closeAddInterest()` | () => `void` | Ferme le dialog intérêt |
| `openAddAvailability()` | () => `void` | Ouvre le dialog disponibilité |
| `closeAddAvailability()` | () => `void` | Ferme le dialog disponibilité |
| `openAvatarDialog()` | () => `void` | Ouvre le dialog avatar |
| `closeAvatarDialog()` | () => `void` | Ferme le dialog avatar |

##### Example

```tsx
function EditPage() {
  const dialogs = useDialogs();

  return (
    <>
      <Button onClick={dialogs.openAddSkill}>Ajouter compétence</Button>
      <AddSkillDialog open={dialogs.isAddSkillOpen} onClose={dialogs.closeAddSkill} />
    </>
  );
}
