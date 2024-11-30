'use client';

// app/components/dialogs/RulesDialog.tsx

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface RulesDialogProps {
  title: string;
  description: string;
  contenu?: React.ReactNode; // Nouveau contenu supplémentaire
  onConfirm: () => void;
}

const RulesDialog: React.FC<RulesDialogProps> = ({
  title,
  description,
  onConfirm,
  contenu,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <Button onClick={openDialog}>{title}</Button>
      {isOpen && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
              <div>{contenu}</div>
            </AlertDialogHeader>
            <div className="flex justify-end gap-4 mt-4">
              <AlertDialogCancel onClick={closeDialog}>
                Annuler
              </AlertDialogCancel>
              {/* Appeler onConfirm pour ouvrir le FilterDialog */}
              <AlertDialogAction onClick={() => onConfirm()}>
                Commencer
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default RulesDialog;
