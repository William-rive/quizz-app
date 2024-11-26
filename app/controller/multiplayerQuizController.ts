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
  const router = useRouter();

  useEffect(() => {
    const handleUpdatePlayers = (data: Player[]) => {
      console.log('Événement updatePlayers reçu :', data);
      setPlayers(data);
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
            }
          },
        );
      }
    };

    const handleDisconnect = () => {
      console.log('Déconnecté du serveur Socket.io');
    };

    socket.on('updatePlayers', handleUpdatePlayers);
    socket.on('error', handleError);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('updatePlayers', handleUpdatePlayers);
      socket.off('error', handleError);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, roomId, playerName]);

  useEffect(() => {
    if (roomId && playerName.trim()) {
      socket.emit(
        'joinRoom',
        { roomId, playerName },
        (response: { success?: boolean; error?: string }) => {
          if (response.error) {
            setError(response.error);
          }
        },
      );
    }
  }, [roomId, playerName, socket]);

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
          router.push(`/multiplayer/${joinRoomId}`);
        }
      },
    );
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
  };
};
