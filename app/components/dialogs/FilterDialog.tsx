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

  // Réinitialiser les filtres à l'ouverture du dialogue
  useEffect(() => {
    if (isOpen) {
      setCategory('all');
      setDifficulty('all');
    }
  }, [isOpen]);

  const handleStart = () => {
    onStart(category, difficulty); // Passer les filtres sélectionnés
    onClose(); // Fermer le dialogue
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Choisir les Filtres</AlertDialogTitle>
          <AlertDialogDescription>
            Sélectionnez les filtres pour votre quiz :
          </AlertDialogDescription>
        </AlertDialogHeader>

        <FilterQuiz
          category={category}
          difficulty={difficulty}
          setCategory={setCategory}
          setDifficulty={setDifficulty}
          onChange={() => {}} // Fonction vide ou ajoutez une logique si nécessaire
        />

        <div className="flex justify-center items-baseline gap-4 mt-4">
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleStart}>Commencer</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FilterDialog;
