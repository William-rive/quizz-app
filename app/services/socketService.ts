// app/services/socketService.ts
import { io, Socket } from 'socket.io-client';
import { Player } from '../models/model';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3001', {
      autoConnect: false,
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinRoom(
    roomId: string,
    playerName: string,
    callback: (response: { success?: boolean; error?: string }) => void,
  ) {
    this.socket.emit('joinRoom', { roomId, playerName }, callback);
  }

  createRoom(
    playerName: string,
    callback: (response: { roomId?: string; error?: string }) => void,
  ) {
    this.socket.emit('createRoom', { playerName }, callback);
  }

  onUpdatePlayers(callback: (players: Player[]) => void) {
    this.socket.on('updatePlayers', callback);
  }

  offUpdatePlayers(callback: (players: Player[]) => void) {
    this.socket.off('updatePlayers', callback);
  }

  onError(callback: (message: string) => void) {
    this.socket.on('error', callback);
  }

  offError(callback: (message: string) => void) {
    this.socket.off('error', callback);
  }

  onConnect(callback: () => void) {
    this.socket.on('connect', callback);
  }

  offConnect(callback: () => void) {
    this.socket.off('connect', callback);
  }

  onDisconnect(callback: () => void) {
    this.socket.on('disconnect', callback);
  }

  offDisconnect(callback: () => void) {
    this.socket.off('disconnect', callback);
  }
}

const socketService = new SocketService();
export default socketService;
