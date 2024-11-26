'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

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

  const handleConfirm = () => {
    closeDialog();
    onConfirm();
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={openDialog}>
        {title}
      </button>
      {isOpen && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
              <div>
                {/* Ajouter des règles supplémentaires ici */}
                {contenu}
              </div>
            </AlertDialogHeader>
            <div className="flex justify-end gap-4 mt-4">
              <AlertDialogCancel onClick={closeDialog}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
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
