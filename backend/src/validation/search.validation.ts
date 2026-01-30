import z from 'zod';

export const SearchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  sort: z.string().optional(),
});

export type SearchParamsType = z.infer<typeof SearchParamsSchema>;

export const TopRatedSchema = z.object({
  limit: z.string().transform(Number),
});

export type TopRatedSchemaType = z.infer<typeof TopRatedSchema>;
