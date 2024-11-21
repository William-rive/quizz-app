'use client';

import React from 'react';
import { useMultiplayerQuizController } from '../../controller/multiplayerQuizController';
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
  } = useMultiplayerQuizController(roomId);

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
              players.map(player => <li key={player.id}>{player.name}</li>)
            ) : (
              <li>Aucun joueur pour le moment.</li>
            )}
          </ul>
          <p>En attente de la question...</p>
        </div>
      )}
    </div>
  );
};

export default MultiplayerQuizView;
