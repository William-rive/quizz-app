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
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
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
      setCorrectAnswer(null); // Réinitialiser la bonne réponse si la réponse est correcte
    } else {
      setCorrectAnswer(questions[currentQuestionIndex].answer); // Stocker la bonne réponse si la réponse est incorrecte
    }

    setTimeout(() => {
      setShowResult(false);
      setCorrectAnswer(null); // Réinitialiser la bonne réponse après l'affichage
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Logique pour terminer le quiz ou réinitialiser
        alert(`Quiz terminé ! Votre score est de ${score + (isCorrect ? 1 : 0)}.`);
        localStorage.clear(); // Vider le cache
        // Rediriger vers la page d'accueil
        window.location.href = '/';
      }
    }, 5000); // Délai de 5 secondes
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="my-20">
      <h2>Score : {score}</h2>
      <h3>Questions restantes : {questions.length - currentQuestionIndex - 1}</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      {error ? (
        <p>{error}</p>
      ) : (
        questions.length > 0 && (
          <QuestionCard
            key={currentQuestionIndex}
            question={questions[currentQuestionIndex]}
            onAnswerValidation={handleAnswerValidation}
            showResult={showResult}
            correctAnswer={correctAnswer}
          />
        )
      )}
    </div>
  );
};

export default Start;