import cors from 'cors';
import express from 'express';
import http from 'http';
import { nanoid } from 'nanoid';
import { Server } from 'socket.io';

const app = express();
app.use(cors());

const rooms = {};

// Créer une fonction serverless pour gérer les connexions Socket.io
export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // CORS pré-vol
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Configurez le serveur socket.io
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

// Gestion des connexions Socket.io
io.on('connection', socket => {
  const { userId } = socket.handshake.auth;
  if (!userId) {
    console.log('Connexion refusée : absence de userId');
    socket.disconnect(true);
    return;
  }

  console.log(`Nouveau client connecté : ${socket.id}, UserID: ${userId}`);

  // Rejoindre ou réassocier les salles existantes
  for (const [roomId, room] of Object.entries(rooms)) {
    const existingPlayer = room.players.find(p => p.id === userId);
    if (existingPlayer) {
      existingPlayer.socketId = socket.id; // Mettre à jour le socketId
      socket.join(roomId);
      io.to(roomId).emit('updatePlayers', room.players); // Émettre la liste des joueurs
      console.log(`Reconnecté à la salle : ${roomId}`);
      break;
    }
  }

  // Gestionnaire pour créer une salle
  socket.on('createRoom', ({ playerName }, callback) => {
    if (!playerName.trim()) {
      callback({ error: 'Un nom est obligatoire pour créer une salle.' });
      return;
    }

    const roomId = nanoid(4); // Génère un ID unique pour la salle
    rooms[roomId] = {
      players: [
        {
          id: userId,
          socketId: socket.id,
          name: playerName,
          isReady: false,
          isCreator: true,
        },
      ],
      currentFilters: {
        category: 'all',
        difficulty: 'all',
      },
    };

    socket.join(roomId);
    callback({ roomId });

    console.log(`Salle créée : ${roomId} par ${playerName}`);
    io.to(roomId).emit('updatePlayers', rooms[roomId].players);
  });

  // Gestionnaire pour rejoindre une salle
  socket.on('joinRoom', ({ roomId, playerName }, callback) => {
    console.log(
      `Requête de rejoindre la salle : ${roomId} par : ${playerName}, UserID: ${userId}`,
    );
    if (!playerName.trim()) {
      callback({ error: 'Un nom est obligatoire pour rejoindre une salle.' });
      return;
    }

    const room = rooms[roomId];
    if (!room) {
      callback({ error: 'Salle introuvable.' });
      return;
    }

    // Vérifiez si le joueur est déjà dans la salle
    const existingPlayer = room.players.find(p => p.id === userId);
    if (!existingPlayer) {
      room.players.push({
        id: userId,
        socketId: socket.id,
        name: playerName,
        isReady: false,
        isCreator: false,
      });
    } else {
      // Mettre à jour le socketId si l'utilisateur est déjà dans la salle
      existingPlayer.socketId = socket.id;
    }

    socket.join(roomId);
    callback({ success: true });
    console.log(`${playerName} a rejoint la salle : ${roomId}`);
    io.to(roomId).emit('updatePlayers', room.players);
  });

  // Gestionnaire pour l'état de préparation du joueur
  socket.on('playerReady', ({ playerId, isReady }) => {
    console.log(
      `Received playerReady for player ID: ${playerId} with isReady: ${isReady}`,
    );

    // Trouver la salle à laquelle appartient le joueur
    const roomId = Array.from(socket.rooms).find(r => r !== socket.id);
    if (roomId && rooms[roomId]) {
      const room = rooms[roomId];
      const player = room.players.find(p => p.id === playerId);

      if (player) {
        player.isReady = isReady;
        console.log(
          `${player.name} est maintenant ${player.isReady ? 'Prêt' : 'Pas prêt'}`,
        );

        // Émettre la liste mise à jour des joueurs à tous les membres de la salle
        io.to(roomId).emit('updatePlayers', room.players);
      } else {
        console.log(
          `Joueur avec ID ${playerId} non trouvé dans la salle ${roomId}.`,
        );
      }
    } else {
      console.log(`Salle non trouvée pour le joueur ID ${playerId}.`);
    }
  });

  // Gestionnaire pour basculer l'état de prêt
  socket.on('togglePlayerReady', playerId => {
    console.log(`Received togglePlayerReady for player ID: ${playerId}`);

    // Trouver la salle à laquelle appartient le joueur
    const roomId = Array.from(socket.rooms).find(r => r !== socket.id);
    if (roomId && rooms[roomId]) {
      const room = rooms[roomId];
      const player = room.players.find(p => p.id === playerId);

      if (player) {
        player.isReady = !player.isReady;
        console.log(
          `${player.name} est maintenant ${player.isReady ? 'Prêt' : 'Pas prêt'}`,
        );

        // Émettre la liste mise à jour des joueurs à tous les membres de la salle
        io.to(roomId).emit('updatePlayers', room.players);
      } else {
        console.log(
          `Joueur avec ID ${playerId} non trouvé dans la salle ${roomId}.`,
        );
      }
    } else {
      console.log(`Salle non trouvée pour le joueur ID ${playerId}.`);
    }
  });

  // Gestionnaire pour démarrer le quiz
  socket.on('startQuiz', roomId => {
    const room = rooms[roomId];
    const roomPlayers = room.players;
    if (roomPlayers.every(p => p.isReady)) {
      io.to(roomId).emit('quizStarted');
      console.log(`Quiz démarré dans la salle : ${roomId}`);
    } else {
      console.log(
        `Tous les joueurs ne sont pas prêts dans la salle : ${roomId}`,
      );
    }
  });

  // Gestionnaire pour définir les filtres du quiz
  socket.on('setFilters', ({ roomId, category, difficulty }, callback) => {
    const room = rooms[roomId];
    if (room) {
      const creator = room.players.find(p => p.isCreator);
      if (creator && creator.id === userId) {
        room.currentFilters = { category, difficulty };
        io.to(roomId).emit('filtersUpdated', room.currentFilters);
        console.log(
          `Filtres mis à jour dans la salle ${roomId} : Catégorie=${category}, Difficulté=${difficulty}`,
        );
        callback({ success: true });
      } else {
        callback({ error: 'Seul le créateur peut définir les filtres.' });
      }
    } else {
      callback({ error: 'Salle introuvable.' });
    }
  });

  // Gestionnaire pour démarrer le quiz
  socket.on('startQuiz', ({ roomId }, callback) => {
    const room = rooms[roomId];
    if (room) {
      const creator = room.players.find(p => p.isCreator);
      if (creator && creator.id === userId) {
        io.to(roomId).emit('quizStarted', { message: 'Le quiz a commencé!' });
        console.log(`Quiz démarré dans la salle : ${roomId}`);
        callback({ success: true });
      } else {
        callback({ error: 'Seul le créateur peut démarrer le quiz.' });
      }
    } else {
      callback({ error: 'Salle introuvable.' });
    }
  });

  // Gestionnaire pour la déconnexion
  socket.on('disconnect', () => {
    console.log(`Client déconnecté : ${socket.id}, UserID: ${userId}`);
    // Supprimer le joueur des salles
    for (const [roomId, room] of Object.entries(rooms)) {
      const playerIndex = room.players.findIndex(p => p.id === userId);
      if (playerIndex !== -1) {
        const removedPlayer = room.players.splice(playerIndex, 1)[0];
        console.log(
          `Joueur ${removedPlayer.name} retiré de la salle : ${roomId}`,
        );

        if (room.players.length === 0) {
          // Ajout d'une temporisation avant de supprimer la salle
          setTimeout(() => {
            if (rooms[roomId] && rooms[roomId].players.length === 0) {
              delete rooms[roomId];
              console.log(`Salle supprimée : ${roomId}`);
            }
          }, 5000); // 5 secondes de délai
        } else {
          // Si le créateur a quitté, attribuer un nouveau créateur
          if (removedPlayer.isCreator) {
            room.players[0].isCreator = true;
            io.to(roomId).emit('updatePlayers', room.players);
            console.log(
              `Nouveau créateur de la salle ${roomId} : ${room.players[0].name}`,
            );
          } else {
            // Émettre la liste mise à jour des joueurs
            io.to(roomId).emit('updatePlayers', room.players);
          }
        }
      }
    }
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
}