import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { prisma } from '../models/index.ts';
import { config } from '../../config.ts';

type SocketData = {
  userId: number;
};

type ClientToServerEvents = {
  'conversation:join': (payload: { conversationId: number }) => void;
  'conversation:leave': (payload: { conversationId: number }) => void;
  'message:send': (payload: {
    conversationId: number;
    message: string;
  }) => void;
  'conversation:close': (payload: { conversationId: number }) => void;
};

type ServerToClientEvents = {
  'conversation:joined': (payload: { conversationId: number }) => void;
  'message:new': (payload: {
    conversationId: number;
    message: MessageDTO;
  }) => void;
  'conversation:updated': (payload: {
    conversationId: number;
    lastMessage: MessageDTO;
  }) => void;
  'conversation:closed': (payload: {
    conversationId: number;
    closedBy: {
      id: number;
      firstname: string;
      lastname: string;
    } | null;
  }) => void;
  'conversation:new': (payload: {
    conversation: {
      id: number;
      title: string;
      status: 'Open' | 'Close';
      participant: {
        id: number;
        firstname: string;
        lastname: string;
        avatarUrl?: string;
        isFollowing: boolean;
        isRated: boolean;
      };
      lastMessage: MessageDTO;
    };
  }) => void;
  error: (payload: {
    code: 'FORBIDDEN' | 'VALIDATION';
    message: string;
  }) => void;
};

type MessageDTO = {
  id: number;
  sender?: {
    id: number;
    firstname: string;
    lastname: string;
    avatarUrl?: string;
  };
  content: string;
  timestamp: string;
};

export function initSocket(httpServer: HttpServer) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    Record<string, never>,
    SocketData
  >(httpServer, {
    cors: {
      origin: config.allowedOrigin,
      credentials: true,
    },
  });

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie ?? '';
      const cookies = cookie.parse(cookieHeader);

      const token = cookies.accessToken;
      if (!token) {
        return next(new Error('Unauthorized'));
      }

      const secret = config.jwtSecret;
      if (!secret) {
        return next(new Error('Missing JWT_SECRET'));
      }

      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

      // Accept id | userId | sub as user identifier
      const rawUserId =
        decoded.id ??
        decoded.userId ??
        (typeof decoded.sub === 'string' ? Number(decoded.sub) : decoded.sub);

      const userId = Number(rawUserId);

      if (!Number.isInteger(userId) || userId <= 0) {
        return next(new Error('Unauthorized'));
      }

      socket.data.userId = userId;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;

    // Join personal user room for global updates
    socket.join(`user:${userId}`);

    // Handle joining a conversation
    socket.on('conversation:join', async (payload) => {
      const conversationId = Number(payload?.conversationId);
      if (!Number.isInteger(conversationId) || conversationId <= 0) return;

      // Check if the user is a participant in the conversation
      const isParticipant = await prisma.userHasConversation.findUnique({
        where: {
          userId_conversationId: {
            userId,
            conversationId,
          },
        },
        select: { userId: true },
      });

      if (!isParticipant) {
        socket.emit('error', {
          code: 'FORBIDDEN',
          message: 'Not a participant',
        });
        return;
      }

      // Join the conversation room
      socket.join(room(conversationId));
      socket.emit('conversation:joined', { conversationId });
    });

    // Handle leaving a conversation
    socket.on('conversation:leave', (payload) => {
      const conversationId = Number(payload?.conversationId);
      if (!Number.isInteger(conversationId) || conversationId <= 0) return;
      socket.leave(room(conversationId));
    });

    // Handle sending a message
    socket.on('message:send', async (payload) => {
      const conversationId = Number(payload?.conversationId);
      const content = String(payload?.message ?? '').trim();

      // Validate input
      if (!Number.isInteger(conversationId) || conversationId <= 0) {
        socket.emit('error', {
          code: 'VALIDATION',
          message: 'Invalid conversationId',
        });
        return;
      }

      if (!content || content.length > 2000) {
        socket.emit('error', {
          code: 'VALIDATION',
          message: 'Invalid message',
        });
        return;
      }

      // Get conversation with participants and message count
      const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: {
          id: true,
          title: true,
          status: true,
          users: {
            select: {
              userId: true,
              user: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  avatarUrl: true,
                },
              },
            },
          },
          _count: {
            select: { messages: true },
          },
        },
      });

      if (!conv || conv.status === 'Close') {
        socket.emit('error', {
          code: 'FORBIDDEN',
          message: 'Conversation closed',
        });
        return;
      }

      // Verify that the sender is a participant in the conversation
      const userIds = conv.users.map((u) => u.userId);
      if (!userIds.includes(userId)) {
        socket.emit('error', {
          code: 'FORBIDDEN',
          message: 'Not a participant',
        });
        return;
      }

      const participantIds = new Set(userIds);
      const receiverId = userIds.find((id) => id !== userId);

      if (!receiverId) {
        socket.emit('error', { code: 'FORBIDDEN', message: 'No receiver' });
        return;
      }

      // Check if this is the first message
      const isFirstMessage = conv._count.messages === 0;

      // Create the message AND update conversation's updatedAt
      const [msg] = await Promise.all([
        prisma.message.create({
          data: {
            conversationId,
            senderId: userId,
            receiverId,
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
        }),
        prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        }),
      ]);

      // Prepare DTO
      const dto: MessageDTO = {
        id: msg.id,
        sender:
          msg.sender && participantIds.has(msg.sender.id)
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

      // Emit message to conversation room (for users actively viewing)
      io.to(room(conversationId)).emit('message:new', {
        conversationId,
        message: dto,
      });

      // If first message, notify the receiver about the new conversation
      if (isFirstMessage) {
        // Get follow/rating status for the receiver
        const [followStatus, ratingStatus] = await Promise.all([
          prisma.follow.findUnique({
            where: {
              followedId_followerId: {
                followerId: receiverId,
                followedId: userId,
              },
            },
          }),
          prisma.rating.findUnique({
            where: {
              evaluatorId_evaluatedId: {
                evaluatorId: receiverId,
                evaluatedId: userId,
              },
            },
          }),
        ]);

        // Get sender info for the receiver's perspective
        const senderUser = conv.users.find((u) => u.userId === userId)?.user;

        if (senderUser) {
          // Emit new conversation to receiver only
          io.to(`user:${receiverId}`).emit('conversation:new', {
            conversation: {
              id: conv.id,
              title: conv.title,
              status: conv.status as 'Open' | 'Close',
              participant: {
                id: senderUser.id,
                firstname: senderUser.firstname,
                lastname: senderUser.lastname,
                avatarUrl: senderUser.avatarUrl ?? undefined,
                isFollowing: !!followStatus,
                isRated: !!ratingStatus,
              },
              lastMessage: dto,
            },
          });
        }
      }

      // Emit conversation update to all participants (via user rooms)
      userIds.forEach((participantId) => {
        io.to(`user:${participantId}`).emit('conversation:updated', {
          conversationId,
          lastMessage: dto,
        });
      });
    });
    // Handle closing a conversation
    socket.on('conversation:close', async (payload) => {
      const conversationId = Number(payload?.conversationId);

      if (!Number.isInteger(conversationId) || conversationId <= 0) {
        socket.emit('error', {
          code: 'VALIDATION',
          message: 'Invalid conversationId',
        });
        return;
      }

      // Check if the user is a participant in the conversation
      const conv = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          users: { some: { userId } },
        },
        select: {
          id: true,
          status: true,
          users: {
            select: {
              userId: true,
              user: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          },
        },
      });

      if (!conv) {
        socket.emit('error', {
          code: 'FORBIDDEN',
          message: 'Conversation not found',
        });
        return;
      }

      if (conv.status === 'Close') {
        // Already closed, just notify
        socket.emit('conversation:closed', {
          conversationId,
          closedBy: null, // Already closed
        });
        return;
      }

      // Close the conversation
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { status: 'Close' },
      });

      // Get the user who closed it (the current user)
      const closedByUser = conv.users.find((u) => u.userId === userId)?.user;

      // Get all participant IDs
      const userIds = conv.users.map((u) => u.userId);

      // Emit to conversation room (for users actively viewing this conversation)
      io.to(room(conversationId)).emit('conversation:closed', {
        conversationId,
        closedBy: closedByUser
          ? {
              id: closedByUser.id,
              firstname: closedByUser.firstname,
              lastname: closedByUser.lastname,
            }
          : null,
      });

      // Emit to ALL participants individually (via their user rooms)
      userIds.forEach((participantId) => {
        io.to(`user:${participantId}`).emit('conversation:closed', {
          conversationId,
          closedBy: closedByUser
            ? {
                id: closedByUser.id,
                firstname: closedByUser.firstname,
                lastname: closedByUser.lastname,
              }
            : null,
        });
      });
    });
  });

  return io;
}

function room(conversationId: number) {
  return `conversation:${conversationId}`;
}
