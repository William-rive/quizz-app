// app/multiplayer/[roomId]/page.tsx
'use client';

import React, { use } from 'react';
import MultiplayerRoomView from '../../components/Multiplayer/MultiplayerQuizView';
import useMultiplayer from '../../hooks/useMultiplayer';

const MultiplayerRoomPage: React.FC<{ params: { roomId: string } }> = ({
  params,
}) => {
  const { roomId } = use(params); // Utiliser React.use() pour déstructurer params
  const {
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
  } = useMultiplayer(roomId);

  return (
    <MultiplayerRoomView
      players={players}
      error={error}
      isJoining={isJoining}
      setIsJoining={setIsJoining}
      roomId={roomId!} // Utiliser une assertion non nulle
      joinRoomId={joinRoomId}
      setJoinRoomId={setJoinRoomId}
      playerName={playerName}
      setPlayerName={setPlayerName}
      handleCreateRoom={handleCreateRoom}
      handleJoinRoom={handleJoinRoom}
      submitJoinRoom={submitJoinRoom}
      handleLeaveRoom={handleLeaveRoom}
    />
  );
};

export default MultiplayerRoomPage;
