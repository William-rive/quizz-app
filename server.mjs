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
    console.log(`Requête de création de salle par : ${playerName}`);
    if (!playerName.trim()) {
      callback({ error: 'Un nom est obligatoire pour créer une salle.' });
      return;
    }

    const roomId = nanoid(6); // ID court pour la salle
    rooms[roomId] = { 
      players: [{ id: socket.id, name: playerName, isReady: false}] 
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
      room.players.push({ id: socket.id, name: playerName, isReady: false });
    }

    socket.join(roomId);

    // Émettre la liste mise à jour des joueurs à tous les membres de la salle
    io.to(roomId).emit('updatePlayers', room.players);
    callback({ success: true });
    console.log(`${playerName} a rejoint la salle : ${roomId}`);
  });

  socket.on('playerReady', ({ playerId, isReady }) => {
    // Trouver le joueur dans la liste et mettre à jour son état "Prêt"
    const player = player.find((player) => player.id === playerId);
    if (player) {
      player.isReady = isReady;
    }
    // Émettre l'événement pour informer tous les clients
    io.emit('updatePlayers', player); // Émet les joueurs mis à jour
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
