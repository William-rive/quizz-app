'use client';

import React, { createContext, ReactNode, useEffect, useState } from 'react';
import socket from '../lib/socket';
import { getUserId } from '../lib/userId';

interface UserContextProps {
  userId: string;
  playerName: string;
  setPlayerName: (name: string) => void;
  resetPlayerName: () => void;
  socket: typeof socket;
  isCreator: boolean;
  setIsCreator: (value: boolean) => void;
  isReady: boolean;
  setIsReady: (value: boolean) => void;
}

export const UserContext = createContext<UserContextProps>({
  userId: '',
  playerName: '',
  setPlayerName: () => {},
  resetPlayerName: () => {},
  socket: socket,
  isCreator: false,
  setIsCreator: () => {},
  isReady: false,
  setIsReady: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playerName, setPlayerNameState] = useState<string>('');
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const userId = getUserId();

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerNameState(storedName);
    }

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // socket.disconnect(); // Commenté pour persister la connexion
    };
  }, []);

  const updatePlayerName = (name: string) => {
    setPlayerNameState(name);
    if (name.trim()) {
      localStorage.setItem('playerName', name);
    } else {
      localStorage.removeItem('playerName');
    }
  };

  const resetPlayerName = () => {
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
        isCreator,
        setIsCreator,
        isReady,
        setIsReady,
      }}>
      {children}
    </UserContext.Provider>
  );
};
