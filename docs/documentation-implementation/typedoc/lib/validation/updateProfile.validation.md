[**SkillSwap Frontend API**](../../index.md)

***

[SkillSwap Frontend API](../../index.md) / lib/validation/updateProfile.validation

# lib/validation/updateProfile.validation

## Type Aliases

### UpdateUserProfileData

> **UpdateUserProfileData** = `z.infer`\<*typeof* [`UpdateUserProfileSchema`](#updateuserprofileschema)\>

Defined in: [lib/validation/updateProfile.validation.ts:45](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updateProfile.validation.ts#L45)

***

### AddUserSkillData

> **AddUserSkillData** = `z.infer`\<*typeof* [`AddUserSkillSchema`](#adduserskillschema)\>

Defined in: [lib/validation/updateProfile.validation.ts:51](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updateProfile.validation.ts#L51)

***

### AddUserInterestData

> **AddUserInterestData** = `z.infer`\<*typeof* [`AddUserInterestSchema`](#adduserinterestschema)\>

Defined in: [lib/validation/updateProfile.validation.ts:57](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updateProfile.validation.ts#L57)

***

### AddUserAvailabilityData

> **AddUserAvailabilityData** = `z.infer`\<*typeof* [`AddUserAvailabilitySchema`](#adduseravailabilityschema)\>

Defined in: [lib/validation/updateProfile.validation.ts:72](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updateProfile.validation.ts#L72)

## Variables

### UpdateUserProfileSchema

> `const` **UpdateUserProfileSchema**: `ZodObject`\<\{ `lastname`: `ZodOptional`\<`ZodString`\>; `firstname`: `ZodOptional`\<`ZodString`\>; `email`: `ZodOptional`\<`ZodEmail`\>; `password`: `ZodOptional`\<`ZodString`\>; `confirmation`: `ZodOptional`\<`ZodString`\>; `address`: `ZodOptional`\<`ZodString`\>; `postalCode`: `ZodOptional`\<`ZodCoercedNumber`\<`unknown`\>\>; `city`: `ZodOptional`\<`ZodString`\>; `age`: `ZodOptional`\<`ZodCoercedNumber`\<`unknown`\>\>; `avatarUrl`: `ZodOptional`\<`ZodString`\>; `description`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>

Defined in: [lib/validation/updateProfile.validation.ts:3](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updateProfile.validation.ts#L3)

***

### AddUserSkillSchema

> `const` **AddUserSkillSchema**: `ZodObject`\<\{ `skillId`: `ZodNumber`; \}, `$strip`\>

Defined in: [lib/validation/updateProfile.validation.ts:47](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updateProfile.validation.ts#L47)

***

### AddUserInterestSchema

> `const` **AddUserInterestSchema**: `ZodObject`\<\{ `skillId`: `ZodNumber`; \}, `$strip`\>

Defined in: [lib/validation/updateProfile.validation.ts:53](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updateProfile.validation.ts#L53)

***

### AddUserAvailabilitySchema

> `const` **AddUserAvailabilitySchema**: `ZodObject`\<\{ `day`: `ZodEnum`\<\{ `Lundi`: `"Lundi"`; `Mardi`: `"Mardi"`; `Mercredi`: `"Mercredi"`; `Jeudi`: `"Jeudi"`; `Vendredi`: `"Vendredi"`; `Samedi`: `"Samedi"`; `Dimanche`: `"Dimanche"`; \}\>; `timeSlot`: `ZodEnum`\<\{ `Morning`: `"Morning"`; `Afternoon`: `"Afternoon"`; \}\>; \}, `$strip`\>

Defined in: [lib/validation/updateProfile.validation.ts:59](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/validation/updateProfile.validation.ts#L59)
