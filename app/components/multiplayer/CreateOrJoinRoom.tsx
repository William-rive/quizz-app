// app/components/CreateOrJoinRoom.tsx
import React from 'react';
import { Button } from '../ui/button';

interface CreateOrJoinRoomProps {
  visible: boolean;
  playerName: string;
  setPlayerName: (name: string) => void;
  isJoining: boolean;
  joinRoomId: string;
  setJoinRoomId: (id: string) => void;
  setIsJoining: (joining: boolean) => void;
  handleCreateRoom: () => void;
  handleJoinRoom: () => void;
  submitJoinRoom: () => void;
  handleReset: () => void;
}

const CreateOrJoinRoom: React.FC<CreateOrJoinRoomProps> = ({
  visible,
  playerName,
  setPlayerName,
  isJoining,
  joinRoomId,
  setJoinRoomId,
  setIsJoining,
  handleCreateRoom,
  handleJoinRoom,
  submitJoinRoom,
}) => {
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
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
  );
};

export default CreateOrJoinRoom;
