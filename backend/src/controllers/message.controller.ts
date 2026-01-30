import type { Request, Response, NextFunction } from 'express';
import { ConversationIdParamSchema } from '../validation/conversation.validation.ts';
import {
  CreateMessageSchema,
  GetMessagesQuerySchema,
  UpdateMessageParamSchema,
  UpdateMessageSchema,
} from '../validation/conversation.validation.ts';
import {
  createMessageService,
  getConversationMessagesService,
  updateMessageService,
  deleteMessageService,
} from '../services/message.service.ts';

export async function createMessageController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = ConversationIdParamSchema.parse(req.params);
    const { message } = CreateMessageSchema.parse(req.body);

    const created = await createMessageService({
      conversationId: id,
      senderId: req.userId,
      content: message,
    });

    return res.created(created);
  } catch (err) {
    next(err);
  }
}

export async function getConversationMessagesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = ConversationIdParamSchema.parse(req.params);
    const { limit, cursor } = GetMessagesQuerySchema.parse(req.query);

    const result = await getConversationMessagesService({
      conversationId: id,
      viewerId: req.userId,
      limit,
      cursor,
    });

    return res.success(result);
  } catch (err) {
    next(err);
  }
}

export async function updateMessageController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id, messageId } = UpdateMessageParamSchema.parse(req.params);
    const { message } = UpdateMessageSchema.parse(req.body);

    const updated = await updateMessageService({
      conversationId: id,
      messageId,
      userId: req.userId,
      content: message,
    });

    return res.success(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteMessageController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id, messageId } = UpdateMessageParamSchema.parse(req.params);

    await deleteMessageService({
      conversationId: id,
      messageId,
      userId: req.userId,
    });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
