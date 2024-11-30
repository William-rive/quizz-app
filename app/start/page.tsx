'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import fetchDatabase from '../lib/api';
import { Question } from '../model/question';

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
        const filters = {
          category,
          difficulty,
          limit,
        };
        const data = await fetchDatabase(filters);
        if (data.length === 0) {
          setError(
            'Impossible de récupérer les questions. Veuillez réessayer plus tard.',
          );
        } else {
          setQuestions(data);
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des données.');
      }
    };

    fetchData();
  }, [category, difficulty, limit]);

  const handleAnswerValidation = (isCorrect: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (isCorrect) {
      setScore(score + 1);
      setCorrectAnswer(currentQuestion.answer);
    } else {
      setCorrectAnswer(currentQuestion.answer);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCorrectAnswer(null);
      }, 1000);
    } else {
      setTimeout(() => {
        setShowResult(true);
        // Rediriger vers la page d'accueil après 5 secondes
        setTimeout(() => {
          window.location.href = '/';
        }, 5000);
      }, 1000);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="my-20">
      <h2>Score : {score}</h2>
      <h3>
        Questions restantes : {questions.length - currentQuestionIndex - 1}
      </h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}></div>
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