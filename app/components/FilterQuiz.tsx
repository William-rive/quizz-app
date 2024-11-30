// app/components/FilterQuiz.tsx
'use client';

import React from 'react';

interface FilterQuizProps {
  category: string;
  difficulty: string;
  setCategory: (category: string) => void;
  setDifficulty: (difficulty: string) => void;
  onChange: () => void;
}

const FilterQuiz: React.FC<FilterQuizProps> = ({
  category,
  difficulty,
  setCategory,
  setDifficulty,
  onChange,
}) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    onChange();
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
    onChange();
  };

  return (
    <div className="flex justify-center content-center gap-8">
      <div className="flex flex-col items-start w-full max-w-xs">
        <label className="block text-xl text-primary mb-2">Catégorie :</label>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="all">Toutes</option>
          <option value="art_litterature">Art et Littérature</option>
          <option value="tv_cinema">TV et Cinéma</option>
          <option value="jeux_videos">Jeux Vidéos</option>
          <option value="musique">Musique</option>
          <option value="culture_generale">Culture Générale</option>
          <option value="sport">Sport</option>
        </select>
      </div>
      <div className="flex flex-col items-start w-full max-w-xs">
        <label className="block text-xl text-primary mb-2">Difficulté :</label>
        <select
          value={difficulty}
          onChange={handleDifficultyChange}
          className="block w-full px-4 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
