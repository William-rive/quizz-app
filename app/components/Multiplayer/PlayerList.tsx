// app/components/Multiplayer/PlayerList.tsx
import React from 'react';
import { Player } from '../../models/model';

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div>
      <h3 className="text-xl">Joueurs ({players.length}) :</h3>
      <ul>
        {players.length > 0 ? (
          players.map(player => <li key={player.id}>{player.name}</li>)
        ) : (
          <li>Aucun joueur pour le moment.</li>
        )}
      </ul>
    </div>
  );
};

export default PlayerList;
