// app/components/Multiplayer/MultiplayerQuizView.tsx
'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import JoinRoomForm from './JoinRoomForm';

interface Player {
  id: string;
  name: string;
}

interface MultiplayerQuizViewProps {
  players: Player[];
  error: string | null;
  isJoining: boolean;
  setIsJoining: Dispatch<SetStateAction<boolean>>;
  roomId: string;
  setJoinRoomId: Dispatch<SetStateAction<string>>;
  playerName: string;
  setPlayerName: Dispatch<SetStateAction<string>>;
  handleCreateRoom: () => void;
  handleJoinRoom: () => void;
  submitJoinRoom: () => void;
  handleLeaveRoom: () => void;
}

const MultiplayerQuizView: React.FC<MultiplayerQuizViewProps> = ({
  players,
  error,
  isJoining,
  setIsJoining,
  roomId,
  setJoinRoomId,
  playerName,
  setPlayerName,
  handleCreateRoom,
  handleJoinRoom,
  submitJoinRoom,
  handleLeaveRoom,
}) => {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] =
    React.useState<boolean>(false);

  const confirmLeaveRoom = () => {
    handleLeaveRoom();
    setIsLeaveDialogOpen(false);
  };

  const closeLeaveDialog = () => {
    setIsLeaveDialogOpen(false);
  };

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      {!error && (
        <>
          {!roomId ? (
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="text-3xl">Créer ou rejoindre une salle</h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  className="border rounded p-2"
                />
                {!isJoining ? (
                  <div className="flex gap-4">
                    <Button onClick={handleCreateRoom}>Créer une salle</Button>
                    <Button onClick={handleJoinRoom}>Rejoindre la salle</Button>
                  </div>
                ) : (
                  <JoinRoomForm
                    joinRoomId={roomId}
                    setJoinRoomId={setJoinRoomId}
                    submitJoinRoom={submitJoinRoom}
                    cancelJoin={() => setIsJoining(false)}
                  />
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl">Salle : {roomId}</h2>
              <h3 className="text-xl">Joueurs ({players.length}) :</h3>
              <ul className="list-disc ml-5">
                {players.length > 0 ? (
                  players.map(player => <li key={player.id}>{player.name}</li>)
                ) : (
                  <li>Aucun joueur pour le moment.</li>
                )}
              </ul>
              <Button
                onClick={() => setIsLeaveDialogOpen(true)}
                className="mt-4">
                Quitter la salle
              </Button>

              {/* Boîte de dialogue pour confirmer la sortie de la salle */}
              {isLeaveDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl mb-4">Quitter la salle</h3>
                    <p>Êtes-vous sûr de vouloir quitter la salle actuelle ?</p>
                    <div className="flex justify-end gap-4 mt-4">
                      <Button onClick={closeLeaveDialog}>Non</Button>
                      <Button onClick={confirmLeaveRoom}>Oui</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MultiplayerQuizView;
