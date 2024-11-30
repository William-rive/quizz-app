'use client';

import React, { useEffect, useState } from 'react';
import FilterQuiz from '../FilterQuiz';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (category: string, difficulty: string) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');

  // Réinitialise les filtres à l'ouverture du dialogue
  useEffect(() => {
    if (isOpen) {
      setCategory('all');
      setDifficulty('all');
    }
  }, [isOpen]);

  const handleStart = () => {
    onStart(category, difficulty); // Passe les filtres sélectionnés
    onClose(); // Ferme le dialogue
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Choisir les Filtres</AlertDialogTitle>
          <AlertDialogDescription>
            {/* Le composant de sélection de filtres */}
            <FilterQuiz
              category={category}
              difficulty={difficulty}
              setCategory={setCategory}
              setDifficulty={setDifficulty}
              onChange={() => {}} // Pas besoin de cette fonction ici
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          {/* Bouton pour fermer le dialogue */}
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          {/* Bouton pour démarrer avec les filtres */}
          <AlertDialogAction onClick={handleStart}>Commencer</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FilterDialog;
