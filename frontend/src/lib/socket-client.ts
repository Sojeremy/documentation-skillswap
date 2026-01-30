import { io, Socket } from 'socket.io-client';

type ServerToClientEvents = {
  'conversation:joined': (payload: { conversationId: number }) => void;
  'message:new': (payload: {
    conversationId: number;
    message: {
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
  }) => void;
  'conversation:updated': (payload: {
    conversationId: number;
    lastMessage: {
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
      lastMessage: {
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
    };
  }) => void;
  error: (payload: {
    code: 'FORBIDDEN' | 'VALIDATION';
    message: string;
  }) => void;
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

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true, // cookies
      autoConnect: false,
      path: '/socket.io',
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
