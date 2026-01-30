[**SkillSwap Frontend API**](../../index.md)

***

[SkillSwap Frontend API](../../index.md) / lib/validation/updatePassword.validation

# lib/validation/updatePassword.validation

## Type Aliases

### UpdatePasswordData

> **UpdatePasswordData** = `z.infer`\<*typeof* [`UpdatePasswordSchema`](#updatepasswordschema)\>

Defined in: [lib/validation/updatePassword.validation.ts:24](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updatePassword.validation.ts#L24)

## Variables

### UpdatePasswordSchema

> `const` **UpdatePasswordSchema**: `ZodObject`\<\{ `currentPassword`: `ZodString`; `newPassword`: `ZodString`; `confirmation`: `ZodString`; \}, `$strip`\>

Defined in: [lib/validation/updatePassword.validation.ts:3](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updatePassword.validation.ts#L3)
