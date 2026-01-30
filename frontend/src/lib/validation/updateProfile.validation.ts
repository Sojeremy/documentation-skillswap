import { z } from 'zod';

export const UpdateUserProfileSchema = z
  .object({
    lastname: z
      .string()
      .min(1, '✖ Le nom est requis')
      .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, '✖ Caractères invalides dans le nom')
      .optional(),
    firstname: z
      .string()
      .min(1, '✖ Le prénom est requis')
      .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, '✖ Caractères invalides dans le prénom')
      .optional(),
    email: z.email('✖ Adresse e-mail invalide').optional(),
    address: z
      .string()
      .min(5, '✖ Adresse trop courte')
      .max(100, '✖ Adresse trop longue')
      .optional(),
    postalCode: z.coerce
      .number('✖ Le code postal doit être un nombre')
      .int('✖ Code postal invalide')
      .min(1000, '✖ Code postal invalide')
      .max(99999, '✖ Code postal invalide')
      .optional(),
    city: z.string().min(1).optional(),
    age: z.coerce
      .number('✖ ✖ Âge invalide')
      .int('✖ ✖ Âge invalide')
      .positive('✖ ✖ Âge invalide')
      .max(200, '✖ Âge invalide')
      .optional(),
    description: z
      .string()
      .min(10, '✖ La description doit contenir au moins 10 caractères')
      .max(500, '✖ La description ne peut pas dépasser 500 caractères')
      .optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some((value) => value !== undefined && value !== ''),
    {
      message: '✖ Vous devez remplir au moins un champ',
      path: [],
    },
  );

export type UpdateUserProfileData = z.infer<typeof UpdateUserProfileSchema>;

export const UpdateDescriptionSchema = z.object({
  description: z
    .string()
    .min(10, '✖ La description doit contenir au moins 10 caractères')
    .max(500, '✖ La description ne peut pas dépasser 500 caractères')
    .optional(),
});

export type UpdateDescriptionData = z.infer<typeof UpdateDescriptionSchema>;

export const UpdatePrivateSchema = z.object({
  lastname: z
    .string()
    .min(1, '✖ Le nom est requis')
    .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, '✖ Caractères invalides dans le nom'),
  firstname: z
    .string()
    .min(1, '✖ Le prénom est requis')
    .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, '✖ Caractères invalides dans le prénom'),
  email: z.email('✖ Adresse e-mail invalide'),
  address: z
    .string()
    .min(5, '✖ Adresse trop courte')
    .max(100, '✖ Adresse trop longue')
    .optional(),
  postalCode: z.coerce
    .number('✖ Le code postal doit être un nombre')
    .int('✖ Code postal invalide')
    .min(1000, '✖ Code postal invalide')
    .max(99999, '✖ Code postal invalide')
    .optional(),
  city: z.string().min(1).optional(),
  age: z.coerce
    .number('✖ ✖ Âge invalide')
    .int('✖ ✖ Âge invalide')
    .positive('✖ ✖ Âge invalide')
    .max(200, '✖ Âge invalide')
    .optional(),
});

export type UpdatePrivateData = z.infer<typeof UpdatePrivateSchema>;

export const AddUserSkillSchema = z.object({
  skillId: z.number().int().positive(),
});

export type AddUserSkillData = z.infer<typeof AddUserSkillSchema>;

export const AddUserInterestSchema = z.object({
  skillId: z.number().int().positive(),
});

export type AddUserInterestData = z.infer<typeof AddUserInterestSchema>;

export const AddUserAvailabilitySchema = z.object({
  day: z.enum([
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ]),
  timeSlot: z.enum(['Morning', 'Afternoon']),
});

export type AddUserAvailabilityData = z.infer<typeof AddUserAvailabilitySchema>;
