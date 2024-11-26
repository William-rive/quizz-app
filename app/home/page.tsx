'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import FilterQuiz from '../components/FilterQuiz';
import RulesDialog from '../components/RulesDialog';

const Home: React.FC = ({}) => {
  const router = useRouter();

  // Fonction pour démarrer le quiz
  const startSoloQuiz = () => {
    // Vérifier si category et difficulty sont sélectionnés
    if (!category || !difficulty) {
      alert('Veuillez sélectionner une catégorie et une difficulté');
      return;
    }

    // Naviguer vers la page de démarrage du quiz avec les paramètres sélectionnés
    router.push(`/start?category=${category}&difficulty=${difficulty}`);
  };

  const startMultiplayerQuiz = () => router.push('/multiplayer');

  // Définir les états pour category et difficulty
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');

  return (
    <div className="flex flex-col-reverse md:flex-row text-center gap-8">
      <div className="flex-1 w-full md:flex-auto md:w-1/2 xl:w-[50rem]">
        <h1 className="text-6xl">Bienvenue sur le quiz</h1>
        <span className="text-xl mt-5 text-primary">Testez vos limites : </span>
        <p className="text-xl text-center">
          plongez dans notre Quiz Interactif et hissez-vous au sommet du
          classement !
          <br />
          Êtes-vous prêt à relever le défi ?
        </p>
        <FilterQuiz
          category={category}
          difficulty={difficulty}
          setCategory={setCategory}
          setDifficulty={setDifficulty}
        />

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
          onConfirm={startSoloQuiz}
        />
        <RulesDialog
          title="Quiz Multijoueur"
          description="Affrontez vos amis dans un quiz interactif."
          contenu={
            <>
              Chaque joueur doit répondre à une série de questions.
              <br />
              Les réponses correctes rapportent des points.
              <br />
              Le joueur avec le plus de points à la fin gagne.
              <br />
              En cas d&apos;égalité, une question supplémentaire sera posée pour
              départager les joueurs.
              <p>Bonne chance à tous !</p>
            </>
          }
          onConfirm={startMultiplayerQuiz}
        />
      </div>
      <div className=" h-[40vh] md:h-auto flex items-center justify-center relative md:flex-auto">
        <Image
          src="/images/perso-1.png"
          alt="Quiz"
          width={200}
          height={200}
          className="max-w-40 top-28 absolute md:max-w-prose md:top-60 right-60"
        />
        <Image
          src="/images/icon.png"
          alt="Quiz"
          width={200}
          height={200}
          className="max-w-32 md:max-w-prose z-10 transform md:-translate-x-16 md:translate-y-16"
        />
        <Image
          src="/images/perso-2.png"
          alt="Quiz"
          width={200}
          height={200}
          className=" max-w-40 absolute left-60 top-12 md:max-w-prose md:left-24 md:top-8"
        />
      </div>
    </div>
  );
};

export default Home;
