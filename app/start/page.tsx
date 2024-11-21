"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import fetchDatabase from '../lib/api';
import { Question } from '../model/question';
import QuestionCard from '../components/QuestionCard';

const Start: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const limit = 10; // Nombre de questions à récupérer

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDatabase(category, difficulty, limit);
        if (data.length === 0) {
          setError('Impossible de récupérer les questions. Veuillez réessayer plus tard.');
        } else {
          setQuestions(data);
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des données.');
      }
    };

    fetchData();
  }, [category, difficulty]);

  const handleAnswerValidation = (isCorrect: boolean) => {
    setShowResult(true);
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowResult(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Logique pour terminer le quiz ou réinitialiser
        alert(`Quiz terminé ! Votre score est de ${score + (isCorrect ? 1 : 0)}.`);
        setCurrentQuestionIndex(0);
        setScore(0);
      }
    }, 5000); // Délai de 5 secondes
  };

  return (
    <div className="my-20">
      <h2>Score : {score}</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        questions.length > 0 && (
          <QuestionCard
            key={currentQuestionIndex}
            question={questions[currentQuestionIndex]}
            onAnswerValidation={handleAnswerValidation}
            showResult={showResult}
          />
        )
      )}
    </div>
  );
};

export default Start;