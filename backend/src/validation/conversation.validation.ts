import z from 'zod';

export const CreateConversationSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(256, 'Le titre contient trop de caractere'),

  receiverId: z.coerce
    .number('Veuillez sélectionner un destinataire')
    .int()
    .min(1, 'Le destinataire est requis'),
});

export const ConversationIdParamSchema = z.object({
  id: z.coerce.number().int().positive('Invalid conversation id'),
});

export const UpdateConversationStatusSchema = z.object({
  status: z.enum(['Open', 'Close'], {
    message: 'Invalid status',
  }),
});

export const CreateMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Le message est requis')
    .max(2000, 'Le message est trop long'),
});

export const GetMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  cursor: z.coerce.number().int().positive().optional(),
});

export const UpdateMessageParamSchema = z.object({
  id: z.coerce.number().int().positive('Invalid conversation id'),
  messageId: z.coerce.number().int().positive('Invalid message id'),
});

export const UpdateMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Le message est requis')
    .max(2000, 'Le message est trop long'),
});

export type CreateConversationData = z.infer<typeof CreateConversationSchema>;
export type ConversationIdParams = z.infer<typeof ConversationIdParamSchema>;
export type UpdateConversationStatusData = z.infer<
  typeof UpdateConversationStatusSchema
>;
export type GetMessagesQuery = z.infer<typeof GetMessagesQuerySchema>;
export type CreateMessageData = z.infer<typeof CreateMessageSchema>;
export type UpdateMessageParams = z.infer<typeof UpdateMessageParamSchema>;
export type UpdateMessageData = z.infer<typeof UpdateMessageSchema>;
