import { z } from 'zod';

export const changeOwnProfileSchema = z
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
    password: z
      .string()
      .min(8, '✖ Le mot de passe doit contenir au moins 8 caractères')
      .optional(),
    confirmation: z.string().optional,
    address: z
      .string()
      .min(5, '✖ Adresse trop courte')
      .max(100, '✖ Adresse trop longue')
      .optional(),
    postalCode: z.coerce.number().min(1000).max(99999).optional(),
    city: z.string().min(1).optional(),
    age: z.coerce
      .number()
      .int("✖ L'âge doit être un nombre entier")
      .positive("✖ L'âge doit être positif")
      .optional(),
    avatarUrl: z.string().min(1).max(200).optional(),
    description: z
      .string()
      .min(10, 'La description doit contenir au moins 10 caractères')
      .max(500, 'La description ne peut pas dépasser 500 caractères')
      .optional(),
  })
  .refine((data) => data.password === data.confirmation, {
    message: '✖ Les mots de passe ne correspondent pas',
    path: ['confirmation'],
  });

export type ChangeOwnProfileSchemaInput = z.infer<
  typeof changeOwnProfileSchema
>;

export const addSkillsProfileSchema = z.object({
  skillId: z.number().int().positive(),
});

export type addSkillsProfileSchemaInput = z.infer<
  typeof addSkillsProfileSchema
>;

export const addProfileAvailabilitiesSchema = z.object({
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

export type addProfileAvailabilitiesSchemaInput = z.infer<
  typeof addProfileAvailabilitiesSchema
>;

export const addRatingToUserSchema = z.object({
  score: z.number().min(0).max(5),
  comment: z.string().min(1).optional(),
});

export type addRatingToUserSchemaInput = z.infer<typeof addRatingToUserSchema>;

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Vous devez renseigner votre ancien mot de passe')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),

    newPassword: z
      .string()
      .min(1, 'Vous devez renseigner le nouveau mot de passe')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),

    confirmation: z
      .string()
      .min(1, 'Vous devez confirmer le nouveau mot de passe'),
  })
  .refine((data) => data.newPassword === data.confirmation, {
    message: 'Les nouveaux mots de passe ne correspondent pas',
    path: ['confirmation'],
  });

export type updatePasswordData = z.infer<typeof updatePasswordSchema>;
