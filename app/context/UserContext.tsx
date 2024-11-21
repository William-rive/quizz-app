'use client';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import socket from '../lib/socket';

interface UserContextProps {
  playerName: string;
  setPlayerName: Dispatch<SetStateAction<string>>;
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

  useEffect(() => {
    if (playerName) {
      localStorage.setItem('playerName', playerName);
    }
  }, [playerName]);

  return (
    <UserContext.Provider value={{ playerName, setPlayerName, socket }}>
      {children}
    </UserContext.Provider>
  );
};
