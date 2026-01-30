[**SkillSwap Frontend API**](index.md)

***

[SkillSwap Frontend API](index.md) / DateTimeUtilities

# DateTimeUtilities

## Description

Date and time formatting utilities for SkillSwap.

All functions use French locale (date-fns/locale/fr) for localization.

## Functions

### Utilities

#### formatMessageDate()

> **formatMessageDate**(`timestamp?`): `string`

Defined in: [lib/dateTime.utils.ts:41](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/dateTime.utils.ts#L41)

Format a timestamp for message display with smart date labels.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timestamp?` | `string` | ISO 8601 timestamp string |

##### Returns

`string`

Formatted date string in French, or empty string if no timestamp

##### Description

Returns human-readable date formats:
- Today: "Aujourd'hui 11:47"
- Yesterday: "Hier 11:47"
- Other: "10/01/2026 11:47"

##### Example

```tsx
formatMessageDate('2026-01-23T11:47:00Z'); // "Aujourd'hui 11:47" (if today)
formatMessageDate('2026-01-22T14:30:00Z'); // "Hier 14:30" (if yesterday)
formatMessageDate('2026-01-10T11:10:00Z'); // "10/01/2026 11:10"
formatMessageDate(); // ""
```

***

#### formatConversationDate()

> **formatConversationDate**(`timestamp?`): `string`

Defined in: [lib/dateTime.utils.ts:78](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/dateTime.utils.ts#L78)

Format a timestamp as relative time for conversation lists.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timestamp?` | `string` | ISO 8601 timestamp string |

##### Returns

`string`

Relative time string in French, or empty string if no timestamp

##### Description

Returns relative time in French:
- "il y a 5 minutes"
- "il y a 2 heures"
- "il y a 3 jours"

##### Example

```tsx
formatConversationDate('2026-01-23T11:00:00Z'); // "il y a 47 minutes"
formatConversationDate('2026-01-20T10:00:00Z'); // "il y a 3 jours"
formatConversationDate(); // ""
```
