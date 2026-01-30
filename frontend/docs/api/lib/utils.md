[**SkillSwap Frontend API**](../index.md)

***

[SkillSwap Frontend API](../index.md) / lib/utils

# lib/utils

## Functions

### Utilities

#### cn()

> **cn**(...`inputs`): `string`

Defined in: [lib/utils.ts:37](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L37)

Merge Tailwind CSS classes with clsx and tailwind-merge.

Combines multiple class values and resolves Tailwind conflicts.
Useful for component styling with conditional classes.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`inputs` | `ClassValue`[] | Class values to merge (strings, arrays, objects) |

##### Returns

`string`

Merged class string

##### Example

```tsx
<div className={cn('p-4 bg-blue-500', isActive && 'bg-green-500', className)} />
```

***

#### getInitialsFromUser()

> **getInitialsFromUser**(`user`): `string`

Defined in: [lib/utils.ts:54](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L54)

Get user initials from UserInfo object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `user` | [`UserInfo`](api-types.md#userinfo) | User object with firstname and lastname |

##### Returns

`string`

Two-letter initials (e.g., "JD") or "?" if no name

##### Example

```tsx
const initials = getInitialsFromUser({ firstname: 'John', lastname: 'Doe' }); // "JD"
```

***

#### getInitialsFromName()

> **getInitialsFromName**(`name`): `string`

Defined in: [lib/utils.ts:74](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L74)

Get initials from a full name string.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Full name (e.g., "John Doe") |

##### Returns

`string`

Two-letter initials from first two words

##### Example

```tsx
getInitialsFromName('John Doe Smith'); // "JD"
getInitialsFromName('Alice'); // "A"
```

***

#### calculateRating()

> **calculateRating**(`evaluations`): `number`

Defined in: [lib/utils.ts:97](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L97)

Calculate average rating from evaluations array.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `evaluations` | `object`[] \| `null` \| `undefined` | Array of objects with score property |

##### Returns

`number`

Average score rounded to 1 decimal, or 0 if no evaluations

##### Example

```tsx
calculateRating([{ score: 4 }, { score: 5 }]); // 4.5
calculateRating([]); // 0
calculateRating(null); // 0
```

***

#### validate()

> **validate**\<`T`\>(`schema`, `formData`, `setErrors`): `boolean`

Defined in: [lib/utils.ts:130](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L130)

Validate form data against a Zod schema and update error state.

Parses data with Zod schema and sets field-level errors in React state.
Only keeps the first error per field for better UX.

##### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | Form data type |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `schema` | `ZodType`\<`T`\> | Zod validation schema |
| `formData` | `T` | Data to validate |
| `setErrors` | `Dispatch`\<`SetStateAction`\<`Partial`\<`Record`\<keyof `T`, `string`\>\>\>\> | React state setter for errors |

##### Returns

`boolean`

`true` if valid, `false` if validation failed

##### Example

```tsx
const [errors, setErrors] = useState({});

const handleSubmit = () => {
  if (validate(loginSchema, formData, setErrors)) {
    await api.login(formData);
  }
};
```

***

#### displayError()

> **displayError**(`err`): `void`

Defined in: [lib/utils.ts:173](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L173)

Display error message as toast notification.

Extracts message from Error objects or uses default message.
Shows error toast using Sonner library.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `err` | `unknown` | Error to display (Error object or unknown) |

##### Returns

`void`

##### Example

```tsx
try {
  await api.login(data);
} catch (err) {
  displayError(err);
}
```
