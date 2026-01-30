[**SkillSwap Frontend API**](index.md)

***

[SkillSwap Frontend API](index.md) / APIClient

# APIClient

## Description

Centralized API client for communicating with the SkillSwap backend.

Features:
- **Automatic token refresh**: Handles 401 errors with JWT refresh
- **Request cancellation**: AbortController support
- **Type-safe responses**: Generic ApiResponse wrapper
- **Cookie-based auth**: Uses httpOnly cookies for security

## Example

```tsx
import { api } from '@/lib/api-client';

// Authentication
const user = await api.login({ email, password });

// Search
const results = await api.searchMembers({ q: 'javascript', limit: 10 });

// Profile
const profile = await api.getProfile(userId);
```

## Classes

### ApiError

Defined in: [lib/api-client.ts:358](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-client.ts#L358)

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new ApiError**(`message`, `status`): [`ApiError`](#apierror)

Defined in: [lib/api-client.ts:359](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-client.ts#L359)

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `status` | `number` |

###### Returns

[`ApiError`](#apierror)

###### Overrides

`Error.constructor`

#### Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="status"></a> `status` | `public` | `number` | [lib/api-client.ts:361](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-client.ts#L361) |

## Variables

### api

> `const` **api**: `ApiClient`

Defined in: [lib/api-client.ts:372](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-client.ts#L372)

## References

### default

Renames and re-exports [api](#api)

***

## API Methods

L'instance `api` expose les méthodes suivantes, organisées par domaine fonctionnel.

### Authentication (5 méthodes)

#### register()

> **register**(`data`: `RegisterData`): `Promise`\<`ApiResponse`\<`CurrentUser`\>\>

Inscrit un nouvel utilisateur.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data.firstname` | `string` | Prénom |
| `data.lastname` | `string` | Nom |
| `data.email` | `string` | Email |
| `data.password` | `string` | Mot de passe (min 8 caractères) |
| `data.confirmation` | `string` | Confirmation du mot de passe |

```tsx
const response = await api.register({
  firstname: 'Marie',
  lastname: 'Dupont',
  email: 'marie@example.com',
  password: 'SecurePass123!',
  confirmation: 'SecurePass123!'
});
```

***

#### login()

> **login**(`data`: `LoginData`): `Promise`\<`ApiResponse`\<`CurrentUser`\>\>

Connecte un utilisateur existant.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data.email` | `string` | Email |
| `data.password` | `string` | Mot de passe |

```tsx
const { data: user } = await api.login({
  email: 'marie@example.com',
  password: 'SecurePass123!'
});
```

***

#### getMe()

> **getMe**(): `Promise`\<`ApiResponse`\<`CurrentUser`\>\>

Récupère l'utilisateur actuellement connecté.

```tsx
const { data: currentUser } = await api.getMe();
```

***

#### logout()

> **logout**(): `Promise`\<`ApiResponse`\<`void`\>\>

Déconnecte l'utilisateur (supprime les cookies).

```tsx
await api.logout();
router.push('/connexion');
```

***

#### refreshToken()

> **refreshToken**(): `Promise`\<`ApiResponse`\<`void`\>\>

Rafraîchit le token d'accès. Appelé automatiquement sur erreur 401.

```tsx
// Généralement appelé automatiquement
await api.refreshToken();
```

***

### Account Management (2 méthodes)

#### deleteAccount()

> **deleteAccount**(): `Promise`\<`ApiResponse`\<`void`\>\>

Supprime définitivement le compte de l'utilisateur connecté.

```tsx
await api.deleteAccount();
window.location.href = '/';
```

***

#### updatePassword()

> **updatePassword**(`data`: `UpdatePasswordData`): `Promise`\<`ApiResponse`\<`void`\>\>

Change le mot de passe de l'utilisateur connecté.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data.currentPassword` | `string` | Mot de passe actuel |
| `data.newPassword` | `string` | Nouveau mot de passe |
| `data.confirmation` | `string` | Confirmation |

```tsx
await api.updatePassword({
  currentPassword: 'ancien123',
  newPassword: 'nouveau456',
  confirmation: 'nouveau456'
});
```

***

### Categories (2 méthodes)

#### getCategories()

> **getCategories**(`params?`): `Promise`\<`ApiResponse`\<`Category[]`\>\>

Récupère la liste des catégories.

| Parameter | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| `params.order` | `string` | - | Ordre de tri |
| `params.limit` | `number` | - | Nombre maximum |

```tsx
const { data: categories } = await api.getCategories({ limit: 10 });
```

***

#### getTopCategories()

> **getTopCategories**(`params?`): `Promise`\<`ApiResponse`\<`CategoryWithCount[]`\>\>

Récupère les catégories les plus populaires.

| Parameter | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| `params.limit` | `number` | `6` | Nombre de catégories |

```tsx
const { data: topCategories } = await api.getTopCategories({ limit: 6 });
```

***

### Skills (1 méthode)

#### getSkills()

> **getSkills**(): `Promise`\<`ApiResponse`\<`Skill[]`\>\>

Récupère la liste de toutes les compétences.

```tsx
const { data: skills } = await api.getSkills();
```

***

### Search (2 méthodes)

#### getTopRatedMembers()

> **getTopRatedMembers**(`params?`): `Promise`\<`ApiResponse`\<`MemberCard[]`\>\>

Récupère les membres les mieux notés.

| Parameter | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| `params.limit` | `number` | `8` | Nombre de membres |

```tsx
const { data: topMembers } = await api.getTopRatedMembers({ limit: 8 });
```

***

#### searchMembers()

> **searchMembers**(`params?`): `Promise`\<`ApiResponse`\<`SearchResponse`\>\>

Recherche des membres avec filtres et pagination.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params.q` | `string` | Terme de recherche |
| `params.category` | `string` | Slug de catégorie |
| `params.sort` | `string` | Tri (rating:desc, createdAt:desc) |
| `params.page` | `number` | Numéro de page |
| `params.limit` | `number` | Résultats par page |

```tsx
const { data: results } = await api.searchMembers({
  q: 'javascript',
  category: 'developpement-web',
  page: 1,
  limit: 12
});
```

***

### Profile (10 méthodes)

#### getProfile()

> **getProfile**(`id`: `number`): `Promise`\<`ApiResponse`\<`Profile`\>\>

Récupère le profil complet d'un utilisateur.

```tsx
const { data: profile } = await api.getProfile(userId);
```

***

#### updateUserProfile()

> **updateUserProfile**(`userId`: `number`, `data`: `UpdateUserProfileData`): `Promise`\<`ApiResponse`\<`Profile`\>\>

Met à jour les informations du profil.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data.firstname` | `string` | Prénom |
| `data.lastname` | `string` | Nom |
| `data.email` | `string` | Email |
| `data.city` | `string` | Ville |
| `data.description` | `string` | Biographie |
| `data.age` | `number` | Âge |

```tsx
await api.updateUserProfile(userId, {
  city: 'Paris',
  description: 'Développeur passionné'
});
```

***

#### updateAvatar()

> **updateAvatar**(`file`: `File`): `Promise`\<`ApiResponse`\<`{ avatarUrl: string }`\>\>

Upload une nouvelle image de profil.

```tsx
const { data } = await api.updateAvatar(file);
console.log('Nouvel avatar:', data.avatarUrl);
```

***

#### deleteAvatar()

> **deleteAvatar**(): `Promise`\<`ApiResponse`\<`void`\>\>

Supprime l'avatar et remet l'avatar par défaut.

```tsx
await api.deleteAvatar();
```

***

#### addUserSkill()

> **addUserSkill**(`data`: `{ skillId: number }`): `Promise`\<`ApiResponse`\<`void`\>\>

Ajoute une compétence au profil.

```tsx
await api.addUserSkill({ skillId: 5 });
```

***

#### deleteUserSkill()

> **deleteUserSkill**(`id`: `number`): `Promise`\<`ApiResponse`\<`void`\>\>

Supprime une compétence du profil.

```tsx
await api.deleteUserSkill(skillId);
```

***

#### addUserInterest()

> **addUserInterest**(`data`: `{ skillId: number }`): `Promise`\<`ApiResponse`\<`void`\>\>

Ajoute un intérêt (compétence recherchée) au profil.

```tsx
await api.addUserInterest({ skillId: 3 });
```

***

#### deleteUserInterest()

> **deleteUserInterest**(`id`: `number`): `Promise`\<`ApiResponse`\<`void`\>\>

Supprime un intérêt du profil.

```tsx
await api.deleteUserInterest(interestId);
```

***

#### addUserAvailability()

> **addUserAvailability**(`data`: `{ day: string, timeSlot: string }`): `Promise`\<`ApiResponse`\<`void`\>\>

Ajoute une disponibilité au profil.

| Parameter | Type | Values |
| ------ | ------ | ------ |
| `data.day` | `string` | Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche |
| `data.timeSlot` | `string` | Morning, Afternoon |

```tsx
await api.addUserAvailability({ day: 'Lundi', timeSlot: 'Morning' });
```

***

#### deleteUserAvailability()

> **deleteUserAvailability**(`id`: `number`): `Promise`\<`ApiResponse`\<`void`\>\>

Supprime une disponibilité du profil.

```tsx
await api.deleteUserAvailability(availabilityId);
```

***

### Conversations (5 méthodes)

#### getAllUserConversations()

> **getAllUserConversations**(`params?`): `Promise`\<`ApiResponse`\<`Conversation[]`\>\>

Récupère toutes les conversations de l'utilisateur.

```tsx
const { data: conversations } = await api.getAllUserConversations({ limit: 20 });
```

***

#### getOneConversation()

> **getOneConversation**(`id`: `number`): `Promise`\<`ApiResponse`\<`ConversationWithMessages`\>\>

Récupère une conversation avec ses participants.

```tsx
const { data: conversation } = await api.getOneConversation(convId);
```

***

#### createConversation()

> **createConversation**(`data`: `AddConversationData`): `Promise`\<`ApiResponse`\<`Conversation`\>\>

Crée une nouvelle conversation.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data.title` | `string` | Titre de la conversation |
| `data.receiverId` | `number` | ID du destinataire |

```tsx
const { data: newConv } = await api.createConversation({
  title: 'Échange React/Python',
  receiverId: 42
});
```

***

#### deleteOneConversation()

> **deleteOneConversation**(`id`: `number`): `Promise`\<`ApiResponse`\<`void`\>\>

Quitte une conversation.

```tsx
await api.deleteOneConversation(convId);
```

***

#### closeOneConversation()

> **closeOneConversation**(`id`: `number`): `Promise`\<`ApiResponse`\<`Conversation`\>\>

Ferme une conversation (change le statut à "Close").

```tsx
await api.closeOneConversation(convId);
```

***

### Messages (2 méthodes)

#### getConversationMessages()

> **getConversationMessages**(`conversationId`: `number`, `params?`): `Promise`\<`ApiResponse`\<`Message[]`\>\>

Récupère les messages d'une conversation avec pagination par curseur.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params.limit` | `number` | Nombre de messages |
| `params.cursor` | `number` | ID du dernier message (pour pagination) |

```tsx
const { data: messages } = await api.getConversationMessages(convId, {
  limit: 50,
  cursor: lastMessageId
});
```

***

#### addMessage()

> **addMessage**(`id`: `number`, `data`: `{ message: string }`): `Promise`\<`ApiResponse`\<`Message`\>\>

Envoie un message dans une conversation.

```tsx
const { data: newMessage } = await api.addMessage(convId, {
  message: 'Bonjour !'
});
```

***

### Follow (3 méthodes)

#### followUser()

> **followUser**(`userId`: `number`): `Promise`\<`ApiResponse`\<`void`\>\>

Suit un utilisateur.

```tsx
await api.followUser(userId);
```

***

#### unfollowUser()

> **unfollowUser**(`userId`: `number`): `Promise`\<`ApiResponse`\<`void`\>\>

Arrête de suivre un utilisateur.

```tsx
await api.unfollowUser(userId);
```

***

#### getMyFollows()

> **getMyFollows**(): `Promise`\<`ApiResponse`\<`UserInfo[]`\>\>

Récupère la liste des utilisateurs suivis.

```tsx
const { data: following } = await api.getMyFollows();
```

***

### Rating (1 méthode)

#### rateUser()

> **rateUser**(`id`: `number`, `data`: `AddRatingData`): `Promise`\<`ApiResponse`\<`Rating`\>\>

Note un utilisateur.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data.score` | `number` | Note de 0 à 5 |
| `data.comment` | `string` | Commentaire (optionnel) |

```tsx
await api.rateUser(userId, {
  score: 5,
  comment: 'Excellent échange !'
});
