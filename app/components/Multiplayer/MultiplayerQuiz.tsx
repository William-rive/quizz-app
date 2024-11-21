// app/components/MultiplayerQuiz.tsx
'use client';

import React from 'react';
import useMultiplayer from '../../hooks/useMultiplayer';
import MultiplayerQuizView from './MultiplayerQuizView';

const MultiplayerQuiz: React.FC<{ roomId?: string }> = ({ roomId }) => {
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
    <MultiplayerQuizView
      players={players}
      error={error}
      isJoining={isJoining}
      setIsJoining={setIsJoining}
      roomId={roomId || joinRoomId}
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

export default MultiplayerQuiz;
