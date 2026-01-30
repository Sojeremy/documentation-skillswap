[**SkillSwap Frontend API**](../../index.md)

***

[SkillSwap Frontend API](../../index.md) / lib/validation/conversation.validation

# lib/validation/conversation.validation

## Type Aliases

### AddConversationData

> **AddConversationData** = `z.infer`\<*typeof* [`AddConversationSchema`](#addconversationschema)\>

Defined in: [lib/validation/conversation.validation.ts:24](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/conversation.validation.ts#L24)

***

### AddConversationWithMessageData

> **AddConversationWithMessageData** = `z.infer`\<*typeof* [`AddConversationWithMessageSchema`](#addconversationwithmessageschema)\>

Defined in: [lib/validation/conversation.validation.ts:25](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/conversation.validation.ts#L25)

## Variables

### AddConversationSchema

> `const` **AddConversationSchema**: `ZodObject`\<\{ `title`: `ZodString`; `receiverId`: `ZodCoercedNumber`\<`unknown`\>; \}, `$strip`\>

Defined in: [lib/validation/conversation.validation.ts:3](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/conversation.validation.ts#L3)

***

### AddConversationWithMessageSchema

> `const` **AddConversationWithMessageSchema**: `ZodObject`\<\{ `title`: `ZodString`; `message`: `ZodString`; \}, `$strip`\>

Defined in: [lib/validation/conversation.validation.ts:15](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/conversation.validation.ts#L15)
