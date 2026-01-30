[**SkillSwap Frontend API**](../index.md)

***

[SkillSwap Frontend API](../index.md) / lib/api-client

# lib/api-client

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
