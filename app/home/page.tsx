'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import FilterDialog from '../components/dialogs/FilterDialog';
import RulesDialog from '../components/dialogs/RulesDialog';
import Images from '../components/home/Images';
import useClearQuizState from '../hook/useClearQuizState';

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
      <div className="flex-1 w-full md:flex-auto md:w-1/2 xl:w-[50rem]">
        <h1 className="text-6xl">Bienvenue sur le quiz</h1>
        <span className="text-xl mt-5 text-primary">Testez vos limites :</span>
        <p className="text-xl text-center">
          Plongez dans notre Quiz Interactif et hissez-vous au sommet du
          classement !
          <br />
          Êtes-vous prêt à relever le défi ?
        </p>

        {/* Dialogue des règles pour le Quiz Solo */}
        <RulesDialog
          title="Quiz Solo"
          description="Le quiz est composé de 10 questions."
          contenu={
            <>
              <p>Vous avez 10 secondes pour répondre à chaque question.</p>
              <p>
                Vous gagnez des points en fonction de la rapidité de votre
                réponse.
              </p>
              <p>Les réponses correctes rapportent des points.</p>
              <p>Bonne chance !</p>
            </>
          }
          onConfirm={() => setIsFilterDialogOpen(true)} // Ouvre le FilterDialog
        />

        {/* Dialogue des règles pour le Quiz Multijoueur */}
        <RulesDialog
          title="Quiz Multijoueur"
          description="Affrontez vos amis dans un quiz interactif."
          contenu={
            <>
              <p>Chaque joueur doit répondre à une série de questions.</p>
              <p>Les réponses correctes rapportent des points.</p>
              <p>Le joueur avec le plus de points à la fin gagne.</p>
              <p>Bonne chance à tous !</p>
            </>
          }
          onConfirm={() => router.push('/multiplayer')}
        />
        <button
          onClick={() => router.push('/classement')}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-lg shadow-md">
          Classement
        </button>
      </div>

      <Images />

      {/* Composant FilterDialog */}
      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)} // Fermer le dialogue
        onStart={handleStartQuiz} // Passer la fonction de démarrage
      />
    </div>
  );
};

export default Home;
