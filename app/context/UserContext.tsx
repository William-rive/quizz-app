'use client';

import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import socket from '../lib/socket';
import { getUserId } from '../lib/userId';

interface UserContextProps {
  userId: string;
  playerName: string;
  setPlayerName: (name: string) => void;
  resetPlayerName: () => void;
  socket: Socket;
}

export const UserContext = createContext<UserContextProps>({
  userId: '',
  playerName: '',
  setPlayerName: () => {},
  resetPlayerName: () => {},
  socket: socket,
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playerName, setPlayerNameState] = useState<string>('');
  const userId = getUserId();

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    console.log('Nom stocké dans localStorage :', storedName);
    if (storedName) {
      setPlayerNameState(storedName);
    }

    if (!socket.connected) {
      console.log('Connexion au socket...');
      socket.connect();
    }

    // Ne déconnectez pas le socket lors du nettoyage
    return () => {
      console.log('UserProvider démonté');
      // socket.disconnect(); // Commenté pour persister la connexion
    };
  }, []);

  const updatePlayerName = (name: string) => {
    console.log('Mise à jour du nom du joueur :', name);
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

  return (
    <UserContext.Provider
      value={{
        userId,
        playerName,
        setPlayerName: updatePlayerName,
        resetPlayerName,
        socket,
      }}>
      {children}
    </UserContext.Provider>
  );
};
