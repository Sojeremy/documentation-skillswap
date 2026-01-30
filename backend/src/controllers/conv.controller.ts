import type { Request, Response, NextFunction } from 'express';
import {
  createConversationService,
  getAllUserConversationsService,
  getConversationByIdService,
  leaveConversationService,
  closeConversationService,
} from '../services/conv.service.ts';
import {
  CreateConversationSchema,
  ConversationIdParamSchema,
} from '../validation/conversation.validation.ts';

export async function getAllUserConversationsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const conversations = await getAllUserConversationsService(req.userId);
    return res.success(conversations);
  } catch (err) {
    next(err);
  }
}

export async function createConversationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { title, receiverId } = CreateConversationSchema.parse(req.body);

    const { conversation, created } = await createConversationService({
      title,
      viewerId: req.userId,
      receiverId,
    });

    if (created) {
      return res.created(conversation); // 201
    }

    return res.success(conversation); // 200
  } catch (err) {
    next(err);
  }
}

export async function getConversationByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = ConversationIdParamSchema.parse(req.params);

    const conversation = await getConversationByIdService(id, req.userId);
    return res.success(conversation);
  } catch (err) {
    next(err);
  }
}

export async function deleteConversationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = ConversationIdParamSchema.parse(req.params);

    await leaveConversationService({
      conversationId: id,
      userId: req.userId,
    });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function closeConversationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = ConversationIdParamSchema.parse(req.params);

    const result = await closeConversationService({
      conversationId: id,
      userId: req.userId,
    });

    return res.success(result);
  } catch (err) {
    next(err);
  }
}
