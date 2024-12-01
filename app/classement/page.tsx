'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';

interface QuizResult {
  score: number;
  totalQuestions: number;
  category: string;
  difficulty: string;
  quizId: string;
  userId: string;
}

const Classement: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    const allResults: QuizResult[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quizResults_')) {
        const savedResults = localStorage.getItem(key);
        if (savedResults) {
          const parsedResults = JSON.parse(savedResults);
          allResults.push({
            ...parsedResults,
            quizId: key.replace('quizResults_', ''),
          });
        }
      }
    }
    allResults.sort((a, b) => b.score - a.score);
    setResults(allResults);
  }, []);

  const clearResults = () => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('quizResults_') || key.startsWith('quizState_'))
      ) {
        localStorage.removeItem(key);
      }
    }
    setResults([]);
  };

  if (results.length === 0) {
    return (
      <div className="card-center flex flex-col justify-center items-center gap-4">
        <p className="text-3xl">Pas encore de resultat ;(</p>
        <Button
          onClick={() => router.push('/')}>
          Retour à la page d&apos;accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="my-20">
      <h2 className="text-3xl font-bold mb-6">Classement des Quiz récents:</h2>
      <div className="grid grid-cols-1 gap-4">
        {results.map((result, index) => (
          <div
            key={result.quizId}
            className="p-4 rounded-lg shadow-md bg-white border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-secondary mb-2">
              #{index + 1} - Quiz ID: {result.quizId}
            </h3>
            <p className="text-lg text-secondary mb-1">
              Score : {result.score} / {result.totalQuestions}
            </p>
            <p className="text-lg text-secondary mb-1">
              Catégorie : {result.category}
            </p>
            <p className="text-lg text-secondary mb-1">
              Difficulté : {result.difficulty}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push('/')}
        className="mt-6 px-4 py-2 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-950 transition duration-300">
        Retour à la page d&apos;accueil
      </button>
      <button
        onClick={clearResults}
        className="mt-6 ml-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300">
        Vider le classement
      </button>
    </div>
  );
};

export default Classement;
