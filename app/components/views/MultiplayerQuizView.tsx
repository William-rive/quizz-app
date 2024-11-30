// app/components/views/MultiplayerQuizView.tsx
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { useMultiplayerQuizController } from '../../controller/multiplayerQuizController';
import CreateOrJoinRoom from '../multiplayer/CreateOrJoinRoom';
import RoomInterface from '../multiplayer/RoomInterface';

interface MultiplayerQuizViewProps {
  roomId?: string;
}

const MultiplayerQuizView: React.FC<MultiplayerQuizViewProps> = ({
  roomId,
}) => {
  const { playerName, setPlayerName, resetPlayerName } =
    useContext(UserContext);
  const {
    players,
    error,
    isJoining,
    joinRoomId,
    setJoinRoomId,
    setIsJoining,
    handleCreateRoom,
    handleJoinRoom,
    submitJoinRoom,
    togglePlayerReady,
    startQuiz,
    isCreator,
    currentFilters,
    setFilters,
    roomId: controllerRoomId,
  } = useMultiplayerQuizController(roomId);

  const [category, setCategory] = useState<string>(currentFilters.category);
  const [difficulty, setDifficulty] = useState<string>(
    currentFilters.difficulty,
  );

  useEffect(() => {
    setCategory(currentFilters.category);
    setDifficulty(currentFilters.difficulty);
  }, [currentFilters]);

  const handleFilterChange = () => {
    setFilters(category, difficulty);
  };

  const handleReset = () => {
    resetPlayerName();
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <CreateOrJoinRoom
        visible={!controllerRoomId}
        playerName={playerName}
        setPlayerName={setPlayerName}
        isJoining={isJoining}
        joinRoomId={joinRoomId}
        setJoinRoomId={setJoinRoomId}
        setIsJoining={setIsJoining}
        handleCreateRoom={handleCreateRoom}
        handleJoinRoom={handleJoinRoom}
        submitJoinRoom={submitJoinRoom}
        handleReset={handleReset}
      />
      <RoomInterface
        visible={!!controllerRoomId}
        roomId={controllerRoomId || ''}
        players={players}
        isCreator={isCreator}
        currentFilters={currentFilters}
        category={category}
        difficulty={difficulty}
        setCategory={setCategory}
        setDifficulty={setDifficulty}
        handleFilterChange={handleFilterChange}
        togglePlayerReady={togglePlayerReady}
        startQuiz={startQuiz}
      />
    </div>
  );
};

export default MultiplayerQuizView;
