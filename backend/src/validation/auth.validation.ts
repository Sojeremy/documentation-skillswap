import z from 'zod';

export const registerSchema = z
  .object({
    lastname: z
      .string()
      .min(1, '✖ Le nom est requis')
      .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, '✖ Caractères invalides dans le nom'),
    firstname: z
      .string()
      .min(1, '✖ Le prénom est requis')
      .regex(/^[A-Za-zÀ-ÿ\s\-']+$/, '✖ Caractères invalides dans le prénom'),
    email: z.email('✖ Adresse e-mail invalide'),
    password: z
      .string()
      .min(8, '✖ Le mot de passe doit contenir au moins 8 caractères'),
    confirmation: z.string(),
  })
  .refine((data) => data.password === data.confirmation, {
    message: '✖ Les mots de passe ne correspondent pas',
    path: ['confirmation'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email('✖ Adresse e-mail invalide'),
  password: z.string().min(1, '✖ Le mot de passe est requis'),
});

export type LoginInput = z.infer<typeof loginSchema>;
