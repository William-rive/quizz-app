'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import FilterDialog from '../components/dialogs/FilterDialog';
import Images from '../components/home/Images';
import SoloRules from '../components/home/SoloRules';
import MultiplayerRules from '../components/home/MultiplayerRules';
import useClearQuizState from '../hook/useClearQuizState';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home: React.FC = () => {
  const router = useRouter();
  useClearQuizState();

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);

  const handleStartQuiz = (
    selectedCategory: string,
    selectedDifficulty: string,
  ) => {
    setIsFilterDialogOpen(false); // Fermer le dialogue après la sélection
    router.push(
      `/quiz?category=${selectedCategory}&difficulty=${selectedDifficulty}`,
    );
  };

  return (
    <div className="flex flex-col-reverse md:flex-row text-center gap-8"> 
    <Card>
      <div className="flex flex-col gap-2 flex-1 w-full md:flex-auto md:w-1/2 xl:w-[50rem]">
        <h1 className="text-6xl">Bienvenue sur le quiz</h1>
        <span className="text-2xl mt-5 text-primary">Testez vos limites :</span>
        <p className="text-xl text-center">
          Plongez dans notre Quiz Interactif et hissez-vous au sommet du
          classement !
          <br />
          Êtes-vous prêt à relever le défi ?
        </p>
        <div>
          {/* Dialogue des règles pour le Quiz Solo */}
          <SoloRules onOpenFilterDialog={() => setIsFilterDialogOpen(true)} />
          <MultiplayerRules />
          <Button
            onClick={() => router.push('/classement')}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md">
            Classement
          </Button>
        </div>
      </div>

      <Images />

      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)} // Fermer le dialogue
        onStart={handleStartQuiz} // Passer la fonction de démarrage
      />
     </Card>
    </div>
  );
};

export default Home;
