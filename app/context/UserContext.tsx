'use client';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import socket from '../lib/socket';

interface UserContextProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  socket: typeof socket;
}

export const UserContext = createContext<UserContextProps>({
  playerName: '',
  setPlayerName: () => {},
  socket,
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playerName, setPlayerName] = useState<string>('');

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerName(storedName);
    }
    socket.connect(); // Connecte le socket une seule fois
  }, []);

  const updatePlayerName = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('playerName', name);
  };

  return (
    <UserContext.Provider
      value={{ playerName, setPlayerName: updatePlayerName, socket }}>
      {children}
    </UserContext.Provider>
  );
};
