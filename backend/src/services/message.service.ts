import { prisma } from '../models/index.ts';
import { ForbiddenError, NotFoundError } from '../lib/error.ts';

// Service to get messages from a conversation (GET /conversations/:id/message)
export async function getConversationMessagesService(params: {
  conversationId: number;
  viewerId: number;
  limit?: number;
  cursor?: number; // ID of the oldest message already loaded by the client
}) {
  const { conversationId, viewerId } = params;

  // Clamp limit to avoid abuse and keep pagination predictable
  // - default: 50
  // - min: 1
  // - max: 100
  const limit = Math.min(Math.max(params.limit ?? 50, 1), 100);

  // Ensure the requesting user is a participant of the conversation.
  // We intentionally return 404 if not, to avoid leaking conversation existence.
  const isParticipant = await prisma.userHasConversation.findUnique({
    where: {
      userId_conversationId: {
        userId: viewerId,
        conversationId,
      },
    },
    select: { userId: true },
  });

  if (!isParticipant) {
    throw new NotFoundError('Conversation not found');
  }

  // Fetch current participants of the conversation.
  // This allows us to determine whether a message sender is still part
  // of the conversation (sender is optional in the response).
  const participants = await prisma.userHasConversation.findMany({
    where: { conversationId },
    select: { userId: true },
  });

  const participantIds = new Set(participants.map((p) => p.userId));

  // Fetch messages for the conversation
  // - Ordered by ID descending (newest first)
  // - Cursor pagination: fetch messages older than the given cursor
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      // Apply cursor if provided
      ...(params.cursor ? { id: { lt: params.cursor } } : {}),
    },
    orderBy: { id: 'desc' },
    take: limit,
    select: {
      id: true,
      content: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatarUrl: true,
        },
      },
    },
  });

  // Transform messages for frontend consumption:
  // - Reverse the list to return messages in chronological order
  //   (oldest -> newest) for direct rendering in a chat UI
  // - Include sender info only if the sender is still a participant
  const data = messages
    .slice()
    .reverse()
    .map((m) => ({
      id: m.id,
      sender:
        m.sender && participantIds.has(m.sender.id)
          ? {
              id: m.sender.id,
              firstname: m.sender.firstname,
              lastname: m.sender.lastname,
              avatarUrl: m.sender.avatarUrl ?? undefined,
            }
          : undefined, // sender is undefined if no longer a participant
      content: m.content,
      timestamp: m.createdAt.toISOString(),
    }));

  // Compute the cursor for the next page:
  // - messages are currently in DESC order
  // - the last element is the oldest message of this page
  // - its ID becomes the cursor to fetch older messages
  const nextCursor =
    messages.length > 0 ? messages[messages.length - 1].id : null;

  // If nextCursor is null, the client knows there are no more messages to load
  return { messages: data, nextCursor };
}

// Service to create a message in a conversation (POST /conversations/:id/message)
export async function createMessageService(params: {
  conversationId: number;
  senderId: number;
  content: string;
}) {
  const { conversationId, senderId, content } = params;
  // We verify that the conversation exists and is not closed
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, users: { some: { userId: senderId } } },
    select: { status: true },
  });
  if (!conv) throw new NotFoundError('Conversation not found');
  if (conv.status === 'Close') throw new ForbiddenError('Conversation closed');
  // We verify that the sender is a participant in the conversation
  const isParticipant = await prisma.userHasConversation.findUnique({
    where: {
      userId_conversationId: { userId: senderId, conversationId },
    },
    select: { userId: true },
  });

  if (!isParticipant) {
    throw new NotFoundError('Conversation not found');
  }

  // We get the receiver (the other participant)
  const receiverLink = await prisma.userHasConversation.findFirst({
    where: {
      conversationId,
      userId: { not: senderId },
    },
    select: { userId: true },
  });

  if (!receiverLink) {
    throw new NotFoundError('Conversation not found');
  }

  // We create the message
  const msg = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      receiverId: receiverLink.userId,
      content,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatarUrl: true,
        },
      },
    },
  });

  return {
    id: msg.id,
    sender: msg.sender
      ? {
          id: msg.sender.id,
          firstname: msg.sender.firstname,
          lastname: msg.sender.lastname,
          avatarUrl: msg.sender.avatarUrl ?? undefined,
        }
      : undefined,
    content: msg.content,
    timestamp: msg.createdAt.toISOString(),
  };
}

// Service to update a message (PUT /messages/:id)
export async function updateMessageService(params: {
  conversationId: number;
  messageId: number;
  userId: number;
  content: string;
}) {
  const { conversationId, messageId, userId, content } = params;

  // We verify that the message exists and that the user is the sender
  const existing = await prisma.message.findFirst({
    where: {
      id: messageId,
      conversationId,
      senderId: userId, // only the sender can update the message
    },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError('Message not found');
  }

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { content },
    select: {
      id: true,
      content: true,
      updatedAt: true,
      sender: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatarUrl: true,
        },
      },
    },
  });

  return {
    id: updated.id,
    sender: updated.sender
      ? {
          id: updated.sender.id,
          firstname: updated.sender.firstname,
          lastname: updated.sender.lastname,
          avatarUrl: updated.sender.avatarUrl ?? undefined,
        }
      : undefined,
    content: updated.content,
    timestamp: updated.updatedAt.toISOString(), // timestamp = date of last update
  };
}

// Delete a message (DELETE /messages/:id)
export async function deleteMessageService(params: {
  conversationId: number;
  messageId: number;
  userId: number;
}) {
  const { conversationId, messageId, userId } = params;

  // We verify that the message exists and that the user is the sender
  const existing = await prisma.message.findFirst({
    where: {
      id: messageId,
      conversationId,
      senderId: userId, // only the sender can delete the message
    },
    select: { id: true },
  });

  if (!existing) {
    throw new NotFoundError('Message not found');
  }

  await prisma.message.delete({
    where: { id: messageId },
  });

  return;
}
