import React from 'react';
import MultiplayerQuizView from './views/MultiplayerQuizView';
import { UserProvider } from '../context/UserContext';

interface MultiplayerQuizProps {
  roomId?: string;
}

const MultiplayerQuiz: React.FC<MultiplayerQuizProps> = ({ roomId }) => {
  return (
  <UserProvider>
      <MultiplayerQuizView roomId={roomId} />
  </UserProvider>
  );
};

export default MultiplayerQuiz;
