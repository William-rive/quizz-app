'use client';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Player } from '../model/player';

export const useMultiplayerQuizController = (roomId?: string) => {
  const { playerName, setPlayerName, socket } = useContext(UserContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [joinRoomId, setJoinRoomId] = useState<string>('');
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [currentFilters, setCurrentFilters] = useState<{
    category: string;
    difficulty: string;
  }>({
    category: 'all',
    difficulty: 'all',
  });
  const router = useRouter();

  useEffect(() => {
    const handleUpdatePlayers = (data: Player[]) => {
      console.log('Événement updatePlayers reçu :', data);
      setPlayers(data);
      const currentPlayer = data.find(p => p.id === socket.id);
      if (currentPlayer) {
        setIsCreator(currentPlayer.isCreator);
      }
    };

    const handleFiltersUpdated = (filters: {
      category: string;
      difficulty: string;
    }) => {
      console.log('Filtres mis à jour reçus :', filters);
      setCurrentFilters(filters);
    };

    const handleError = (message: string) => {
      console.error('Erreur Socket.IO :', message);
      setError(message);
    };

    const handleConnect = () => {
      console.log('Connecté au serveur Socket.io');
      if (roomId && playerName.trim()) {
        socket.emit(
          'joinRoom',
          { roomId, playerName },
          (response: { success?: boolean; error?: string }) => {
            if (response.error) {
              setError(response.error);
            } else {
              console.log(`Rejoint la salle : ${roomId}`);
              router.push(`/multiplayer/${roomId}`);
            }
          },
        );
      }
    };

    const handleDisconnect = () => {
      console.log('Déconnecté du serveur Socket.io');
    };

    // Ajout des écouteurs d'événements
    socket.on('updatePlayers', handleUpdatePlayers);
    socket.on('filtersUpdated', handleFiltersUpdated);
    socket.on('error', handleError);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Initial join room si roomId est présent
    if (roomId && playerName.trim()) {
      socket.emit(
        'joinRoom',
        { roomId, playerName },
        (response: { success?: boolean; error?: string }) => {
          if (response.error) {
            setError(response.error);
          } else {
            console.log('Rejoint la salle initialement :', roomId);
          }
        },
      );
    }

    return () => {
      // Nettoyage des écouteurs d'événements
      socket.off('updatePlayers', handleUpdatePlayers);
      socket.off('filtersUpdated', handleFiltersUpdated);
      socket.off('error', handleError);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, roomId, playerName, router]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('Veuillez entrer un nom pour créer une salle.');
      return;
    }

    console.log('Création de la salle avec le nom :', playerName);

    socket.emit(
      'createRoom',
      { playerName },
      (response: { roomId?: string; error?: string }) => {
        if (response.error) {
          console.error(
            'Erreur lors de la création de la salle :',
            response.error,
          );
          setError(response.error);
        } else if (response.roomId) {
          console.log("Salle créée avec l'ID :", response.roomId);

          const handleUpdatePlayersOnce = (data: Player[]) => {
            console.log('Événement updatePlayers reçu :', data);
            if (data.length === 1 && data[0].id === socket.id) {
              console.log('Navigating to the created room:', response.roomId);
              router.push(`/multiplayer/${response.roomId}`);
              socket.off('updatePlayers', handleUpdatePlayersOnce);
            }
          };

          socket.on('updatePlayers', handleUpdatePlayersOnce);
        }
      },
    );
  };

  const handleJoinRoom = () => {
    setIsJoining(true);
    console.log('Affichage du champ de saisie pour rejoindre une salle');
  };

  const submitJoinRoom = () => {
    if (!playerName.trim() || !joinRoomId.trim()) {
      alert('Veuillez entrer un nom et un code de salle.');
      return;
    }

    console.log('Tentative de rejoindre la salle :', joinRoomId);

    socket.emit(
      'joinRoom',
      { roomId: joinRoomId, playerName },
      (response: { success?: boolean; error?: string }) => {
        if (response.error) {
          console.error(
            'Erreur lors de la jonction de la salle :',
            response.error,
          );
          setError(response.error);
        } else {
          console.log('Rejoint la salle :', joinRoomId);
          console.log(`Redirection vers /multiplayer/${joinRoomId}`);
          router.push(`/multiplayer/${joinRoomId}`);
        }
      },
    );
  };

  const handlePlayerReady = (playerId: string, isReady: boolean) => {
    if (roomId) {
      socket.emit('playerReady', { roomId, playerId, isReady });
    }
  };

  const togglePlayerReady = (playerId: string) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === playerId
          ? { ...player, isReady: !player.isReady }
          : player,
      ),
    );

    const player = players.find(player => player.id === playerId);
    if (player) {
      handlePlayerReady(playerId, !player.isReady);
      console.log('Événement playerReady envoyé :', {
        playerId,
        isReady: !player.isReady,
      });
    }
  };

  const startQuiz = () => {
    if (roomId) {
      socket.emit(
        'startQuiz',
        { roomId },
        (response: { success?: boolean; error?: string }) => {
          if (response.error) {
            console.error('Erreur lors du démarrage du quiz :', response.error);
            setError(response.error);
          } else {
            console.log('Quiz démarré avec succès dans la salle :', roomId);
          }
        },
      );
    }
  };

  const setFilters = (category: string, difficulty: string) => {
    if (roomId && isCreator) {
      socket.emit(
        'setFilters',
        { roomId, category, difficulty },
        (response: { success?: boolean; error?: string }) => {
          if (response.error) {
            console.error(
              'Erreur lors de la mise à jour des filtres :',
              response.error,
            );
            setError(response.error);
          } else {
            console.log('Filtres mis à jour :', { category, difficulty });
          }
        },
      );
    }
  };

  return {
    players,
    error,
    isJoining,
    joinRoomId,
    setJoinRoomId,
    setPlayerName,
    setIsJoining,
    handleCreateRoom,
    handleJoinRoom,
    submitJoinRoom,
    togglePlayerReady,
    startQuiz,
    isCreator,
    currentFilters,
    setFilters,
    roomId,
  };
};
