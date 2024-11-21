// app/components/Multiplayer/CreateRoomForm.tsx
import React from 'react';
import { Button } from '../ui/button';

interface CreateRoomFormProps {
  handleCreateRoom: () => void;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({
  handleCreateRoom,
}) => {
  return (
    <div>
      <Button onClick={handleCreateRoom}>Créer une salle</Button>
    </div>
  );
};

export default CreateRoomForm;
