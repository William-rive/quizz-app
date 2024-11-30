// app/lib/socket.ts
"use client"
import { io, Socket } from 'socket.io-client';
import { getUserId } from './userId';

const userId = getUserId();

const socket: Socket = io('http://localhost:3001', {
  autoConnect: false,
  auth: {
    userId, // Envoyer l'ID utilisateur lors de la connexion
  },
});

export default socket;