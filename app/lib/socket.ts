// app/lib/socket.ts
'use client';

import { io, Socket } from 'socket.io-client';
import { getUserId } from './userId';

interface Auth {
  userId: string;
}

interface CustomSocket extends Socket {
  auth: Auth;
}

let socket: CustomSocket | null = null;

export const initializeSocket = (): CustomSocket => {
  if (!socket) {
    const userId = getUserId();
    socket = io('http://localhost:3001', {
      autoConnect: false,
      auth: {
        userId, // Envoyer l'ID utilisateur lors de la connexion
      },
    }) as CustomSocket;
  }
  return socket;
};

export default socket;
export type { CustomSocket };
