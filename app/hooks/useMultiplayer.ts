// app/hooks/useMultiplayer.ts
'use client';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';

interface Player {
  id: string;
  name: string;
}

const useMultiplayer = (roomId?: string) => {
  const { playerName, setPlayerName, socket } = useContext(UserContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [joinRoomId, setJoinRoomId] = useState<string>('');
  const router = useRouter();

  // Log de socket.id pour débogage après connexion
  useEffect(() => {
    const handleConnect = () => {
      console.log('Client Socket ID:', socket.id);
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('connect', handleConnect);
    };
  }, [socket]);

  // Rejoindre la salle si roomId est présent
  useEffect(() => {
    if (roomId && playerName.trim()) {
      socket.emit(
        'joinRoom',
        { roomId, playerName },
        (response: { success?: boolean; error?: string }) => {
          if (response.error) {
            setError(response.error);
          } else {
            console.log('Rejoint la salle :', roomId);
          }
        },
      );
    }
  }, [roomId, playerName, socket]);

  // Écouteurs d'événements configurés une seule fois
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

    // Nettoyage lors du démontage du composant
    return () => {
      socket.off('updatePlayers', handleUpdatePlayers);
      socket.off('error', handleError);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, roomId, playerName]);

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
          // Rediriger immédiatement après la création de la salle
          router.push(`/multiplayer/${response.roomId}`);
          console.log('Redirection vers la salle :', response.roomId);
        } else {
          console.error(
            'Réponse inattendue lors de la création de la salle :',
            response,
          );
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

  const handleLeaveRoom = () => {
    if (roomId) {
      socket.emit(
        'leaveRoom',
        { roomId, playerName },
        (response: { success?: boolean; error?: string }) => {
          if (response.error) {
            setError(response.error);
          } else {
            router.push('/multiplayer');
          }
        },
      );
    }
  };

  return {
    players,
    error,
    isJoining,
    setIsJoining,
    joinRoomId,
    setJoinRoomId,
    playerName,
    setPlayerName,
    handleCreateRoom,
    handleJoinRoom,
    submitJoinRoom,
    handleLeaveRoom,
  };
};

export default useMultiplayer;
