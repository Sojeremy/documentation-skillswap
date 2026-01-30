import { z } from 'zod';

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, '✖ Vous devez renseigner votre ancien mot de passe')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),

    newPassword: z
      .string()
      .min(1, '✖ Vous devez renseigner le nouveau mot de passe')
      .min(8, '✖ Le mot de passe doit contenir au moins 8 caractères'),

    confirmation: z
      .string()
      .min(1, '✖ Vous dez confirmer le nouveau mot de passe'),
  })
  .refine((data) => data.newPassword === data.confirmation, {
    message: '✖ Les nouveaux mots de passe ne correspondent pas',
    path: ['confirmation'],
  });

export type UpdatePasswordData = z.infer<typeof UpdatePasswordSchema>;
