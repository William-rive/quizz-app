'use client';

import { io, Socket } from 'socket.io-client';

// Créez une instance unique de Socket.IO
const socket: Socket = io('http://localhost:3001', {
  autoConnect: false, // Empêche la connexion automatique
});

export default socket;
