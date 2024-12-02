"use client"
import { UserProvider } from '../context/UserContext';
import MultiplayerQuizView from './views/MultiplayerQuizView';

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
