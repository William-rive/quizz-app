// app/components/RoomInterface.tsx
import React from 'react';
import { Button } from '../ui/button';
import socket from '../../lib/socket';
import { Player } from '../../model/player';
import FilterQuiz from '../FilterQuiz';

interface RoomInterfaceProps {
  visible: boolean;
  roomId: string;
  players: Player[];
  isCreator: boolean;
  currentFilters: { category: string; difficulty: string };
  category: string;
  difficulty: string;
  setCategory: (category: string) => void;
  setDifficulty: (difficulty: string) => void;
  handleFilterChange: () => void;
  togglePlayerReady: (playerId: string) => void;
  startQuiz: () => void;
}

const RoomInterface: React.FC<RoomInterfaceProps> = ({
  visible,
  roomId,
  players,
  isCreator,
  currentFilters,
  category,
  difficulty,
  setCategory,
  setDifficulty,
  handleFilterChange,
  togglePlayerReady,
  startQuiz,
}) => {
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
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
              {/* Si c'est le joueur actuel, afficher le bouton */}
              {player.id === socket.auth.userId && (
                <Button onClick={() => togglePlayerReady(player.id)}>
                  {player.isReady ? 'Se déclarer non prêt' : 'Se déclarer prêt'}
                </Button>
              )}
            </li>
          ))
        ) : (
          <li>Aucun joueur pour le moment.</li>
        )}
      </ul>
      {players.every(player => player.isReady) && isCreator && (
        <Button onClick={startQuiz} className="mt-4">
          Lancer le Quiz
        </Button>
      )}
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
  );
};

export default RoomInterface;
