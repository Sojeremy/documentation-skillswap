import z from 'zod';

export const GetTopUserCategoriesQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int('La limite doit être un entier')
    .positive('La limite doit être positive')
    .max(100, 'La limite ne peut pas dépasser 100')
    .optional(),
});

export type GetTopUserCategoriesQuery = z.infer<
  typeof GetTopUserCategoriesQuerySchema
>;
