import cors from 'cors';
import express from 'express';
import http from 'http';
import { nanoid } from 'nanoid';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// Middleware CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'my-custom-header'],
    credentials: true,
  }),
);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'my-custom-header'],
    credentials: true,
  },
});

const rooms = {};

io.on('connection', socket => {
  console.log('Nouveau client connecté :', socket.id);

  // Gestionnaire pour créer une salle
  socket.on('createRoom', ({ playerName }, callback) => {
    if (!playerName.trim()) {
      callback({ error: 'Un nom est obligatoire pour créer une salle.' });
      return;
    }

    const roomId = nanoid(6); // Génère un ID unique pour la salle
    rooms[roomId] = {
      players: [
        { id: socket.id, name: playerName, isReady: false, isCreator: true },
      ],
    };

    socket.join(roomId);
    callback({ roomId });
    console.log(`Salle créée : ${roomId} par ${playerName}`);

    // Émettre la liste des joueurs au créateur
    io.to(roomId).emit('updatePlayers', rooms[roomId].players);
  });

  // Gestionnaire pour rejoindre une salle
  socket.on('joinRoom', ({ roomId, playerName }, callback) => {
    console.log(
      `Requête de rejoindre la salle : ${roomId} par : ${playerName}`,
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
    const existingPlayer = room.players.find(p => p.id === socket.id);
    if (!existingPlayer) {
      room.players.push({
        id: socket.id,
        name: playerName,
        isReady: false,
        isCreator: false,
      });
    }

    socket.join(roomId);

    // Émettre la liste mise à jour des joueurs à tous les membres de la salle
    io.to(roomId).emit('updatePlayers', room.players);
    callback({ success: true });
    console.log(`${playerName} a rejoint la salle : ${roomId}`);
  });

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

  // Gestionnaire pour la déconnexion
  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
    // Supprimer le joueur des salles
    for (const [roomId, room] of Object.entries(rooms)) {
      room.players = room.players.filter(player => player.id !== socket.id);
      if (room.players.length === 0) {
        delete rooms[roomId];
        console.log(`Salle supprimée : ${roomId}`);
      } else {
        // Émettre la liste mise à jour des joueurs
        io.to(roomId).emit('updatePlayers', room.players);
      }
    }
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
