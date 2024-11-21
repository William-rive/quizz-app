'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';

const Home: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="text-3xl">Bienvenue sur le quiz</h1>
      <span className="text-xl mt-5 text-primary">Testez vos limites : </span>
      <p className="text-xl text-center">
        plongez dans notre Quiz Interactif et hissez-vous au sommet du
        classement !
        <br />
        Êtes-vous prêt à relever le défi ?
      </p>
      <span className="text-xl mt-5 text-primary">Règles du jeu : </span>
      <p className="text-xl text-center">
        Le quiz est composé de 10 questions.
        <br />
        Vous avez 10 secondes pour répondre à chaque question.
        <br />
        Vous gagnez des points en fonction de la rapidité de votre réponse.
        <br />
        Bonne chance !
      </p>
      <div className="mt-8">
        <label className="block text-xl text-primary">Catégorie :</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 p-2 border rounded-lg text-black"
        >
          <option value="all">Toutes</option>
          <option value="art_litterature">Art et Littérature</option>
          <option value="tv_cinema">TV et Cinéma</option>
          <option value="jeux_videos">Jeux Vidéos</option>
          <option value="musique">Musique</option>
          <option value="culture_generale">Culture Générale</option>
          <option value="sport">Sport</option>
        </select>
      </div>
      <div className="mt-4">
        <label className="block text-xl text-primary">Difficulté :</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="mt-2 p-2 border rounded-lg text-black"
        >
          <option value="all">Toutes</option>
          <option value="facile">Facile</option>
          <option value="normal">Normal</option>
          <option value="difficile">Difficile</option>
        </select>
      </div>
      <Link href={`/start?category=${category}&difficulty=${difficulty}`}>
        <Button className="mt-8">Start Quiz</Button>
      </Link>
    </div>
  );
};

export default Home;