'use client';

import React, { useState } from 'react';
import { useMultiplayerQuizController } from '../../controller/multiplayerQuizController';
import FilterQuiz from '../FilterQuiz';
import socket from '../../lib/socket'; // Adjust the path as necessary
import { Button } from '../ui/button';

interface MultiplayerQuizViewProps {
  roomId?: string;
}

const MultiplayerQuizView: React.FC<MultiplayerQuizViewProps> = ({
  roomId,
}) => {
  const {
    players,
    error,
    isJoining,
    joinRoomId,
    setJoinRoomId,
    setPlayerName,
    setIsJoining,
    handleCreateRoom,
    handleJoinRoom,
    submitJoinRoom,
    togglePlayerReady,
    startQuiz,
  } = useMultiplayerQuizController(roomId);

  // Définir les états pour category et difficulty
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      {!roomId ? (
        <div className="flex flex-col justify-center items-center gap-4">
          <h2 className="text-3xl">Créer ou rejoindre une salle</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Votre nom"
              onChange={e => setPlayerName(e.target.value)}
              className="border rounded p-2"
            />
            {!isJoining ? (
              <div className="flex gap-4">
                <Button onClick={handleCreateRoom}>Créer une salle</Button>
                <Button onClick={handleJoinRoom}>Rejoindre la salle</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Code de la salle"
                  value={joinRoomId}
                  onChange={e => setJoinRoomId(e.target.value)}
                  className="border rounded p-2"
                />
                <Button onClick={submitJoinRoom}>Valider</Button>
                <Button onClick={() => setIsJoining(false)}>Annuler</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2>Salle : {roomId}</h2>
          <h3 className="text-xl">Joueurs ({players.length}) :</h3>
          <ul>
            {players.length > 0 ? (
              players.map(player => 
              <li key={player.id}>
                  <span>{player.name}</span>{' '}
                  <span className="text-sm ">
                    {player.isReady ? '(Prêt)' : '(Pas prêt)'}
                  </span>
                  {player.id === socket.id ? ( // Permettre uniquement au joueur actuel de modifier son état
                    <Button
                      onClick={() => togglePlayerReady(player.id)}
                      className="ml-4"
                    >
                      {player.isReady ? 'Annuler Prêt' : 'Prêt'}
                    </Button>
                  ) : null}
                </li>
              )
            ) : (
              // Afficher un message si aucun joueur n'est présent
              <li>Aucun joueur pour le moment.</li>
            )}
          </ul>
          {/* Bouton pour lancer le quiz (visible uniquement si tous les joueurs sont prêts) */}
          {players.every((player) => player.isReady) && (
            <Button
              onClick={startQuiz}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Lancer le Quiz
            </Button>
          )}
          {/* Passer category et difficulty en plus de setCategory et setDifficulty */}
          <FilterQuiz
            category={category}
            difficulty={difficulty}
            setCategory={setCategory}
            setDifficulty={setDifficulty}
          />
        </div>
      )}
    </div>
  );
};

export default MultiplayerQuizView;
