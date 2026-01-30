import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "✖ L'email est requis")
    .email("✖ Format d'email invalide"),

  password: z
    .string()
    .min(1, '✖ Le mot de passe est requis')
    .min(8, '✖ Le mot de passe doit contenir au moins 8 caractères'),
});

export const RegisterFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "✖ L'email est requis")
      .email("✖ Format d'email invalide"),

    firstname: z
      .string()
      .min(1, '✖ Le prénom est requis')
      .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, '✖ Caractères invalides dans le prenom')
      .trim(),

    lastname: z
      .string()
      .min(1, '✖ Le nom est requis')
      .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, '✖ Caractères invalides dans le nom')
      .trim(),

    password: z
      .string()
      .min(1, '✖ Le mot de passe est requis')
      .min(8, '✖ Le mot de passe doit contenir au moins 8 caractères'),

    confirmation: z.string(),
  })
  .refine((data) => data.password === data.confirmation, {
    message: '✖ Les mots de passe ne correspondent pas',
    path: ['confirmation'],
  });

export type LoginData = z.infer<typeof LoginFormSchema>;
export type RegisterData = z.infer<typeof RegisterFormSchema>;
