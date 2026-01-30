import { Router } from 'express';
import { checkAuth, validate } from '../middlewares/auth.middleware.ts';
import { requireSimpleFollow } from '../middlewares/conv.middleware.ts';
import {
  getAllUserConversationsController,
  createConversationController,
  getConversationByIdController,
  deleteConversationController,
  closeConversationController,
} from '../controllers/conv.controller.ts';
import {
  CreateConversationSchema,
  ConversationIdParamSchema,
  CreateMessageSchema,
  GetMessagesQuerySchema,
  UpdateMessageParamSchema,
  UpdateMessageSchema,
} from '../validation/conversation.validation.ts';
import {
  createMessageController,
  getConversationMessagesController,
  updateMessageController,
  deleteMessageController,
} from '../controllers/message.controller.ts';

export const convRouter = Router();

// Conversations
// Get all conversations of the authenticated user
convRouter.get('/', checkAuth, getAllUserConversationsController);
// Create a new conversation
convRouter.post(
  '/',
  validate('body', CreateConversationSchema),
  checkAuth,
  requireSimpleFollow,
  createConversationController,
);
// Get conversation by id
convRouter.get(
  '/:id',
  validate('params', ConversationIdParamSchema),
  checkAuth,
  getConversationByIdController,
);
// Delete conversation by id
convRouter.delete(
  '/:id',
  validate('params', ConversationIdParamSchema),
  checkAuth,
  deleteConversationController,
);

// Messages
// Get all messages in a conversation
convRouter.get(
  '/:id/messages',
  validate('params', ConversationIdParamSchema),
  validate('query', GetMessagesQuerySchema),
  checkAuth,
  getConversationMessagesController,
);
// Post a message in a conversation
convRouter.post(
  '/:id/messages',
  validate('params', ConversationIdParamSchema),
  validate('body', CreateMessageSchema),
  checkAuth,
  createMessageController,
);
// Update a message in a conversation
convRouter.patch(
  '/:id/message/:messageId',
  validate('params', UpdateMessageParamSchema),
  validate('body', UpdateMessageSchema),
  checkAuth,
  updateMessageController,
);
// Delete a message in a conversation
convRouter.delete(
  '/:id/message/:messageId',
  validate('params', UpdateMessageParamSchema),
  checkAuth,
  deleteMessageController,
);
convRouter.patch(
  '/:id/close',
  validate('params', ConversationIdParamSchema),
  checkAuth,
  closeConversationController,
);
