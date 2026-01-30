[**SkillSwap Frontend API**](index.md)

***

[SkillSwap Frontend API](index.md) / hooks

# hooks

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

Defined in: [hooks/useAutoScroll.ts:32](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useAutoScroll.ts#L32)

Hook to automatically scroll to the bottom when content changes.

Uses ResizeObserver to detect content size changes and automatically
scrolls to the bottom. Behavior varies based on context:
- **Smooth scroll**: For new messages in the same conversation
- **Instant scroll**: When switching to a different conversation

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

Defined in: [hooks/useFormState.ts:99](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useFormState.ts#L99)

Generic form state management hook with Zod validation.

Provides complete form state management including:
- **Field state**: Track values and changes
- **Validation**: Zod schema integration with field-level errors
- **Submission**: Async submit with loading state
- **Error clearing**: Auto-clear errors on field change

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

Defined in: [hooks/useIsMobile.ts:30](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useIsMobile.ts#L30)

Hook for detecting mobile viewport based on screen width.

Uses ResizeObserver to track viewport changes and returns a boolean
indicating if the current viewport is below the specified breakpoint.
Returns `false` during SSR to avoid hydration mismatches.

##### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `breakpoint` | `number` | `768` | Width threshold in pixels. |

##### Returns

`boolean`

`true` if viewport width is below breakpoint, `false` otherwise

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

Defined in: [hooks/useSearch.ts:104](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/hooks/useSearch.ts#L104)

Hook for searching members with debounce, pagination, and category filtering.

Provides a complete search experience with:
- **Debounced input**: Waits for user to stop typing before searching
- **Pagination**: Supports page-based navigation through results
- **Category filtering**: Filter results by skill category
- **Automatic cancellation**: Cancels in-flight requests when new search starts

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `UseSearchOptions` | Configuration options for search behavior |

##### Returns

`UseSearchReturn`

Search state and control functions

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
