// app/controllers/multiplayerController.ts
import { Player } from '../models/model';
import socketService from '../services/socketService';

type UpdatePlayersCallback = (players: Player[]) => void;
type ErrorCallback = (error: string) => void;

export const initializeSocket = (
  updatePlayers: UpdatePlayersCallback,
  handleError: ErrorCallback,
) => {
  socketService.connect();

  socketService.onUpdatePlayers(updatePlayers);
  socketService.onError(handleError);

  socketService.onConnect(() => {
    console.log('Connecté au serveur Socket.io');
  });

  socketService.onDisconnect(() => {
    console.log('Déconnecté du serveur Socket.io');
  });
};

export const cleanupSocket = (
  updatePlayers: UpdatePlayersCallback,
  handleError: ErrorCallback,
) => {
  socketService.offUpdatePlayers(updatePlayers);
  socketService.offError(handleError);
  socketService.disconnect();
};
