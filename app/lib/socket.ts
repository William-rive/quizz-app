// app/lib/socket.ts
'use client';
import { io, Socket } from 'socket.io-client';
import { getUserId } from './userId';

interface CustomSocket extends Socket {
  auth: Auth;
}

const userId = getUserId();

const socket = io('http://localhost:3001', {
  autoConnect: false,
  auth: {
    userId, // Envoyer l'ID utilisateur lors de la connexion
  },
}) as CustomSocket;

export default socket;
export type { CustomSocket };