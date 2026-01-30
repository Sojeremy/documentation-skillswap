import { prisma } from '../models/index.ts';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
} from '../lib/error.ts';

type ParticipantDTO = {
  id: number;
  firstname: string;
  lastname: string;
  avatarUrl?: string;
  isFollowing: boolean;
  isRated: boolean;
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

type CreateConversationParams = {
  title: string;
  viewerId: number;
  receiverId: number;
};

export async function getAllUserConversationsService(userId: number) {
  const conversations = await prisma.conversation.findMany({
    where: {
      users: {
        some: { userId },
      },
    },
    select: {
      id: true,
      status: true,
      title: true,
      updatedAt: true,
      users: {
        select: {
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
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
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
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Gather other participant IDs
  const otherIdsSet = new Set<number>();
  for (const c of conversations) {
    for (const p of c.users) {
      const pid = p.user.id;
      if (pid !== userId) otherIdsSet.add(pid);
    }
  }
  // Convert to array for queries
  const otherUserIds = [...otherIdsSet];

  let followingSet = new Set<number>();
  let ratedSet = new Set<number>();

  // Fetch follow and rating status in bulk
  if (otherUserIds.length > 0) {
    const [follows, ratings] = await Promise.all([
      prisma.follow.findMany({
        where: {
          followerId: userId,
          followedId: { in: otherUserIds },
        },
        select: { followedId: true },
      }),
      prisma.rating.findMany({
        where: {
          evaluatorId: userId,
          evaluatedId: { in: otherUserIds },
        },
        select: { evaluatedId: true },
      }),
    ]);

    followingSet = new Set(follows.map((f) => f.followedId));
    ratedSet = new Set(ratings.map((r) => r.evaluatedId));
  }

  return conversations.map((c) => {
    const other = c.users.find((u) => u.user.id !== userId)?.user ?? null;

    // Check follow and rating status
    const participant: ParticipantDTO | undefined = other
      ? {
          id: other.id,
          firstname: other.firstname,
          lastname: other.lastname,
          avatarUrl: other.avatarUrl ?? undefined,
          isFollowing: followingSet.has(other.id),
          isRated: ratedSet.has(other.id),
        }
      : undefined;

    // Map last message
    const lastMessage: MessageDTO | undefined = c.messages[0]
      ? {
          id: c.messages[0].id,
          sender: c.messages[0].sender
            ? {
                id: c.messages[0].sender.id,
                firstname: c.messages[0].sender.firstname,
                lastname: c.messages[0].sender.lastname,
                avatarUrl: c.messages[0].sender.avatarUrl ?? undefined,
              }
            : undefined,
          content: c.messages[0].content,
          timestamp: c.messages[0].createdAt.toISOString(),
        }
      : undefined;

    return {
      id: c.id,
      participant,
      title: c.title,
      lastMessage,
      status: c.status,
    };
  });
}

export async function createConversationService({
  title,
  viewerId,
  receiverId,
}: CreateConversationParams): Promise<{
  conversation: {
    id: number;
    status: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    participant: {
      id: number;
      firstname: string;
      lastname: string;
      avatarUrl?: string;
      isFollowing: boolean;
      isRated: boolean;
    };
  };
  created: boolean;
}> {
  if (viewerId === receiverId) {
    throw new UnprocessableEntityError(
      'Cannot create a conversation with yourself',
    );
  }

  return prisma.$transaction(async (tx) => {
    // 1) Viewer must follow receiver
    const isFollowing = await tx.follow.findUnique({
      where: {
        followedId_followerId: {
          followedId: receiverId,
          followerId: viewerId,
        },
      },
      select: { id: true },
    });

    if (!isFollowing) {
      throw new ForbiddenError(
        'You must follow this user to create a conversation',
      );
    }

    // 2) Load receiver + rating
    const [receiver, rating] = await Promise.all([
      tx.user.findUnique({
        where: { id: receiverId },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatarUrl: true,
        },
      }),
      tx.rating.findUnique({
        where: {
          evaluatorId_evaluatedId: {
            evaluatorId: viewerId,
            evaluatedId: receiverId,
          },
        },
        select: { id: true },
      }),
    ]);

    if (!receiver) {
      throw new NotFoundError('Resource not found');
    }

    const participant = {
      id: receiver.id,
      firstname: receiver.firstname,
      lastname: receiver.lastname,
      avatarUrl: receiver.avatarUrl ?? undefined,
      isFollowing: true,
      isRated: Boolean(rating),
    };

    // 3) Count existing conversations with SAME title between the same users
    const existingCount = await tx.conversation.count({
      where: {
        title: {
          startsWith: title,
        },
        users: {
          some: { userId: viewerId },
        },
        AND: {
          users: {
            some: { userId: receiverId },
          },
        },
      },
    });

    // 4) Compute final title
    const finalTitle =
      existingCount > 0 ? `${title} (${existingCount + 1})` : title;

    // 5) Create new conversation
    const conversation = await tx.conversation.create({
      data: {
        title: finalTitle,
        users: {
          create: [{ userId: viewerId }, { userId: receiverId }],
        },
      },
      select: {
        id: true,
        status: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      conversation: {
        id: conversation.id,
        status: conversation.status,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        participant,
      },
      created: true,
    };
  });
}

export async function getConversationByIdService(
  conversationId: number,
  userId: number,
) {
  // Verify that the user is a participant of the conversation
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      users: { some: { userId } },
    },
    select: {
      id: true,
      status: true, // 'Open' | 'Close'
      title: true,
      users: {
        select: {
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
      // Fetch last 30 messages with sender info
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 30,
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
      },
    },
  });

  if (!conversation) {
    throw new NotFoundError('Conversation not found');
  }

  // Identify the other participant
  const other =
    conversation.users.find((u) => u.user.id !== userId)?.user ?? null;

  // Check follow and rating status
  let participant: ParticipantDTO | undefined = undefined;

  if (other) {
    const [follow, rating] = await Promise.all([
      prisma.follow.findUnique({
        where: {
          followedId_followerId: {
            followedId: other.id,
            followerId: userId,
          },
        },
        select: { id: true },
      }),
      prisma.rating.findUnique({
        where: {
          evaluatorId_evaluatedId: {
            evaluatorId: userId,
            evaluatedId: other.id,
          },
        },
        select: { id: true },
      }),
    ]);

    participant = {
      id: other.id,
      firstname: other.firstname,
      lastname: other.lastname,
      avatarUrl: other.avatarUrl ?? undefined,
      isFollowing: Boolean(follow),
      isRated: Boolean(rating),
    };
  }

  // Map messages
  const messages: MessageDTO[] = conversation.messages
    .slice()
    .reverse()
    .map((m) => ({
      id: m.id,
      sender: m.sender
        ? {
            id: m.sender.id,
            firstname: m.sender.firstname,
            lastname: m.sender.lastname,
            avatarUrl: m.sender.avatarUrl ?? undefined,
          }
        : undefined,
      content: m.content,
      timestamp: m.createdAt.toISOString(),
    }));

  return {
    id: conversation.id,
    participant,
    title: conversation.title,
    status: conversation.status,
    messages,
  };
}

export async function leaveConversationService(params: {
  conversationId: number;
  userId: number;
}) {
  const { conversationId, userId } = params;

  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      users: { some: { userId } },
    },
    select: { id: true, status: true },
  });

  if (!conv) {
    throw new NotFoundError('Conversation not found');
  }

  if (conv.status !== 'Close') {
    throw new BadRequestError('Conversation must be closed before leaving');
  }

  await prisma.userHasConversation.delete({
    where: {
      userId_conversationId: {
        userId,
        conversationId,
      },
    },
  });
  return;
}

export async function closeConversationService(params: {
  conversationId: number;
  userId: number;
}) {
  const { conversationId, userId } = params;

  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      users: { some: { userId } },
    },
    select: { id: true, status: true },
  });

  if (!conv) {
    throw new NotFoundError('Conversation not found');
  }

  if (conv.status === 'Close') {
    throw new BadRequestError('Conversation is already closed');
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: 'Close' },
    select: { id: true },
  });

  return { closed: true };
}
