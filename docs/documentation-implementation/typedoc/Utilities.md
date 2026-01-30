[**SkillSwap Frontend API**](index.md)

***

[SkillSwap Frontend API](index.md) / Utilities

# Utilities

## Description

Utility functions for SkillSwap frontend application.

Includes:
- **Styling**: Tailwind CSS class merging
- **User helpers**: Initials generation, rating calculation
- **Validation**: Zod schema validation with state management
- **Error handling**: Toast notifications for errors

## Functions

### Utilities

#### cn()

> **cn**(...`inputs`): `string`

Defined in: [lib/utils.ts:38](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L38)

Merge Tailwind CSS classes with clsx and tailwind-merge.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`inputs` | `ClassValue`[] | Class values to merge (strings, arrays, objects) |

##### Returns

`string`

Merged class string

##### Description

Combines multiple class values and resolves Tailwind conflicts.
Useful for component styling with conditional classes.

##### Example

```tsx
<div className={cn('p-4 bg-blue-500', isActive && 'bg-green-500', className)} />
```

***

#### getInitialsFromUser()

> **getInitialsFromUser**(`user`): `string`

Defined in: [lib/utils.ts:55](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L55)

Get user initials from UserInfo object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `user` | [`UserInfo`](lib/api-types.md#userinfo) | User object with firstname and lastname |

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

Defined in: [lib/utils.ts:75](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L75)

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

Defined in: [lib/utils.ts:98](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L98)

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

Defined in: [lib/utils.ts:132](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L132)

Validate form data against a Zod schema and update error state.

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

##### Description

Parses data with Zod schema and sets field-level errors in React state.
Only keeps the first error per field for better UX.

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

Defined in: [lib/utils.ts:176](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L176)

Display error message as toast notification.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `err` | `unknown` | Error to display (Error object or unknown) |

##### Returns

`void`

##### Description

Extracts message from Error objects or uses default message.
Shows error toast using Sonner library.

##### Example

```tsx
try {
  await api.login(data);
} catch (err) {
  displayError(err);
}
```

***

#### getChangedFields()

> **getChangedFields**\<`T`\>(`originalData`, `newData`): `Partial`\<`T`\> \| `null`

Defined in: [lib/utils.ts:159](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L159)

Compare original and new form data, return only changed fields.

##### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | Form data type |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `originalData` | `Partial`\<`T`\> | Original form values |
| `newData` | `Partial`\<`T`\> | New form values |

##### Returns

`Partial`\<`T`\> \| `null`

Object containing only changed fields, or `null` if no changes

##### Description

Useful for PATCH requests where you only want to send modified fields.
Compares values using strict equality.

##### Example

```tsx
const original = { firstname: 'John', city: 'Paris' };
const updated = { firstname: 'John', city: 'Lyon' };

const changes = getChangedFields(original, updated);
// { city: 'Lyon' }

if (changes) {
  await api.updateProfile(userId, changes);
}
```

***

#### logError()

> **logError**(`err`): `void`

Defined in: [lib/utils.ts:223](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/utils.ts#L223)

Log error message to console.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `err` | `unknown` | Error to log |

##### Returns

`void`

##### Description

Extracts and logs error message from various error types.
Used for debugging without showing toast to user.

##### Example

```tsx
try {
  await riskyOperation();
} catch (err) {
  logError(err); // Logs to console only
  // Don't show toast for expected errors
}
```
