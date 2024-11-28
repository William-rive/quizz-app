'use client';

import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { useMultiplayerQuizController } from '../../controller/multiplayerQuizController';
import socket from '../../lib/socket';
import FilterQuiz from '../FilterQuiz';
import { Button } from '../ui/button';

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
  } = useMultiplayerQuizController(roomId);

  // État local pour les filtres
  const [category, setCategory] = useState<string>(currentFilters.category);
  const [difficulty, setDifficulty] = useState<string>(
    currentFilters.difficulty,
  );

  // Synchroniser les états locaux avec les filtres actuels reçus
  useEffect(() => {
    setCategory(currentFilters.category);
    setDifficulty(currentFilters.difficulty);
  }, [currentFilters]);

  // Fonction pour gérer les changements de filtres
  const handleFilterChange = () => {
    setFilters(category, difficulty);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Champ de saisie modifié :', e.target.value);
    setPlayerName(e.target.value);
  };

  const handleReset = () => {
    resetPlayerName();
  };

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
              value={playerName}
              onChange={handleInputChange}
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
                  className="border rounded p-2 text-black"
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
              players.map(player => (
                <li key={player.id}>
                  <span>{player.name}</span>{' '}
                  <span className="text-sm ">
                    {player.isReady ? '(Prêt)' : '(Pas prêt)'}
                  </span>
                  {player.id === socket.id ? (
                    <Button
                      onClick={() => togglePlayerReady(player.id)}
                      className="ml-4">
                      {player.isReady ? 'Annuler Prêt' : 'Prêt'}
                    </Button>
                  ) : null}
                </li>
              ))
            ) : (
              <li>Aucun joueur pour le moment.</li>
            )}
          </ul>
          {/* Bouton pour lancer le quiz (visible uniquement si tous les joueurs sont prêts) */}
          {players.every(player => player.isReady) && isCreator && (
            <Button
              onClick={startQuiz}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              Lancer le Quiz
            </Button>
          )}
          {/* Afficher ou configurer les filtres selon que l'utilisateur est le créateur */}
          {isCreator ? (
            <div className="mt-4">
              <h3 className="text-xl">Configurer les Filtres du Quiz :</h3>
              <FilterQuiz
                category={category}
                difficulty={difficulty}
                setCategory={setCategory}
                setDifficulty={setDifficulty}
                onChange={handleFilterChange}
              />
            </div>
          ) : (
            <div className="mt-4">
              <h3 className="text-xl">Filtres du Quiz :</h3>
              <p>
                <strong>Catégorie :</strong> {currentFilters.category}
              </p>
              <p>
                <strong>Difficulté :</strong> {currentFilters.difficulty}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiplayerQuizView;
