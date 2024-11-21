// app/components/Multiplayer/JoinRoomForm.tsx
import React from 'react';
import { Button } from '../ui/button';

interface JoinRoomFormProps {
  joinRoomId: string;
  setJoinRoomId: (id: string) => void;
  submitJoinRoom: () => void;
  cancelJoin: () => void;
}

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({
  joinRoomId,
  setJoinRoomId,
  submitJoinRoom,
  cancelJoin,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Code de la salle"
        value={joinRoomId}
        onChange={e => setJoinRoomId(e.target.value)}
        className="border rounded p-2"
      />
      <Button onClick={submitJoinRoom}>Valider</Button>
      <Button variant="outline" onClick={cancelJoin}>
        Annuler
      </Button>
    </div>
  );
};

export default JoinRoomForm;
