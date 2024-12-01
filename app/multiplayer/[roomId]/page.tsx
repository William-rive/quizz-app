// app/multiplayer/[roomId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import MultiplayerQuiz from '../../components/MultiplayerQuiz';

const MultiplayerRoomPage = () => {
  const params = useParams();
  const roomId = params?.roomId;

  if (!roomId || Array.isArray(roomId)) {
    return <div>ID de salle invalide</div>;
  }

  console.log('Room ID reçu dans MultiplayerRoomPage :', roomId);

  return <MultiplayerQuiz roomId={roomId} />;
};

export default MultiplayerRoomPage;
