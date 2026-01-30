[**SkillSwap Frontend API**](../../index.md)

***

[SkillSwap Frontend API](../../index.md) / lib/validation/auth.validation

# lib/validation/auth.validation

## Type Aliases

### LoginData

> **LoginData** = `z.infer`\<*typeof* [`LoginFormSchema`](#loginformschema)\>

Defined in: [lib/validation/auth.validation.ts:46](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/auth.validation.ts#L46)

***

### RegisterData

> **RegisterData** = `z.infer`\<*typeof* [`RegisterFormSchema`](#registerformschema)\>

Defined in: [lib/validation/auth.validation.ts:47](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/auth.validation.ts#L47)

## Variables

### LoginFormSchema

> `const` **LoginFormSchema**: `ZodObject`\<\{ `email`: `ZodString`; `password`: `ZodString`; \}, `$strip`\>

Defined in: [lib/validation/auth.validation.ts:3](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/auth.validation.ts#L3)

***

### RegisterFormSchema

> `const` **RegisterFormSchema**: `ZodObject`\<\{ `email`: `ZodString`; `firstname`: `ZodString`; `lastname`: `ZodString`; `password`: `ZodString`; `confirmation`: `ZodString`; \}, `$strip`\>

Defined in: [lib/validation/auth.validation.ts:15](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/auth.validation.ts#L15)
