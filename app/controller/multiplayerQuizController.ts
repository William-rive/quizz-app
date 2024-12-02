'use client';

// app/controller/multiplayerQuizController.ts
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Player } from '../model/player';

export const useMultiplayerQuizController = (roomId?: string) => {
  const { userId, playerName, setPlayerName, socket } = useContext(UserContext);
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
    if (!socket) return;

    const handleUpdatePlayers = (data: Player[]) => {
      setPlayers(data);
      const currentPlayer = data.find(p => p.id === userId);
      if (currentPlayer) {
        setIsCreator(currentPlayer.isCreator);
      }
    };

    const handleFiltersUpdated = (filters: {
      category: string;
      difficulty: string;
    }) => {
      setCurrentFilters(filters);
    };

    const handleError = (message: string) => {
      setError(message);
    };

    const handleConnect = () => {
      if (roomId && playerName.trim()) {
        socket.emit(
          'joinRoom',
          { roomId, playerName },
          (response: { success?: boolean; error?: string }) => {
            if (response.error) {
              setError(response.error);
            } else {
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
      socket.connect();
    }

    return () => {
      // Nettoyage des écouteurs d'événements
      socket.off('updatePlayers', handleUpdatePlayers);
      socket.off('filtersUpdated', handleFiltersUpdated);
      socket.off('error', handleError);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, roomId, playerName, router, userId]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('Veuillez entrer un nom pour créer une salle.');
      return;
    }

    socket.emit(
      'createRoom',
      { playerName },
      (response: { roomId?: string; error?: string }) => {
        if (response.error) {
          setError(response.error);
        } else if (response.roomId) {
          router.push(`/multiplayer/${response.roomId}`);
        }
      },
    );
  };

  const handleJoinRoom = () => {
    setIsJoining(true);
  };

  const submitJoinRoom = () => {
    if (!playerName.trim() || !joinRoomId.trim()) {
      alert('Veuillez entrer un nom et un code de salle.');
      return;
    }

    socket.emit(
      'joinRoom',
      { roomId: joinRoomId, playerName },
      (response: { success?: boolean; error?: string }) => {
        if (response.error) {
          setError(response.error);
        } else {
          router.push(`/multiplayer/${joinRoomId}`);
        }
      },
    );
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
      socket.emit('playerReady', { roomId, playerId, isReady: !player.isReady });
    }
  };

  const startQuiz = () => {
    if (roomId) {
      socket.emit(
        'startQuiz',
        { roomId },
        (response: { success?: boolean; error?: string }) => {
          if (response.error) {
            setError(response.error);
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
            setError(response.error);
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
