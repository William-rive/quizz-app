'use client';

import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Socket } from 'socket.io-client';
import getSocket from '../lib/socket';

interface UserContextProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  resetPlayerName: () => void;
  socket: Socket;
}

export const UserContext = createContext<UserContextProps>({
  playerName: '',
  setPlayerName: () => {},
  resetPlayerName: () => {},
  socket: getSocket,
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playerName, setPlayerNameState] = useState<string>('');
  const socket = getSocket;

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    console.log('Nom stocké dans localStorage:', storedName);
    if (storedName) {
      setPlayerNameState(storedName);
    }

    if (!socket.connected) {
      console.log('Connexion au socket...');
      socket.connect();
    } else {
      console.log('Socket déjà connecté.');
    }

    return () => {
      console.log('UserProvider démonté.');
      // Optionnel : Déconnecter le socket lors du démontage
      // socket.disconnect();
    };
  }, [socket]);

  const updatePlayerName = (name: string) => {
    console.log('Mise à jour du nom du joueur:', name);
    setPlayerNameState(name);
    if (name.trim()) {
      localStorage.setItem('playerName', name);
    } else {
      localStorage.removeItem('playerName');
    }
  };

  const resetPlayerName = () => {
    console.log('Réinitialisation du nom du joueur.');
    setPlayerNameState('');
    localStorage.removeItem('playerName');
  };

  const contextValue = useMemo(
    () => ({
      playerName,
      setPlayerName: updatePlayerName,
      resetPlayerName,
      socket,
    }),
    [playerName, socket],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
