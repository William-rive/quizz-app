import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  autoConnect: false, // Empêche la connexion automatique
});

export default socket;
