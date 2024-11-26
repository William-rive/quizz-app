// app/components/FilterQuiz.tsx

import React, { Dispatch, SetStateAction } from 'react';

interface FilterQuizProps {
  category: string;
  difficulty: string;
  setCategory: Dispatch<SetStateAction<string>>;
  setDifficulty: Dispatch<SetStateAction<string>>;
}

const FilterQuiz: React.FC<FilterQuizProps> = ({
  category,
  difficulty,
  setCategory,
  setDifficulty,
}) => {
  return (
    <div className="flex justify-center content-center gap-8">
      <div>
        <label className="block text-xl text-primary">Catégorie :</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="mt-2 p-2 border rounded-lg text-black">
          <option value="all">Toutes</option>
          <option value="art_litterature">Art et Littérature</option>
          <option value="tv_cinema">TV et Cinéma</option>
          <option value="jeux_videos">Jeux Vidéos</option>
          <option value="musique">Musique</option>
          <option value="culture_generale">Culture Générale</option>
          <option value="sport">Sport</option>
        </select>
      </div>
      <div>
        <label className="block text-xl text-primary">Difficulté :</label>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="mt-2 p-2 border rounded-lg text-black">
          <option value="all">Toutes</option>
          <option value="facile">Facile</option>
          <option value="normal">Normal</option>
          <option value="difficile">Difficile</option>
        </select>
      </div>
    </div>
  );
};

export default FilterQuiz;
