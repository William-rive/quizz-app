import React from 'react';
import MultiplayerQuizView from './views/MultiplayerQuizView';

interface MultiplayerQuizProps {
  roomId?: string;
}

const MultiplayerQuiz: React.FC<MultiplayerQuizProps> = ({ roomId }) => {
  return <MultiplayerQuizView roomId={roomId} />;
};

export default MultiplayerQuiz;
