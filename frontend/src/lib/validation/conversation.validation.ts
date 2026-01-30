import { z } from 'zod';

export const AddConversationSchema = z.object({
  title: z
    .string()
    .min(1, '✖ Le titre est requis')
    .max(256, 'Le titre contient trop de caractères'),

  receiverId: z.coerce
    .number('✖ Veuillez sélectionner un destinataire')
    .int()
    .min(1, '✖ Le destinataire est requis'),
});

export const AddConversationWithMessageSchema = z.object({
  title: z
    .string()
    .min(1, '✖ Le titre est requis')
    .max(256, '✖ Le titre contient trop de caractères'),

  message: z.string().min(1, 'Le message est requis'),
});

export type AddConversationData = z.infer<typeof AddConversationSchema>;
export type AddConversationWithMessageData = z.infer<
  typeof AddConversationWithMessageSchema
>;
