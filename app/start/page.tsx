'use client';
import React, { useEffect, useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import fetchDatabase from '../lib/api';
import { Question, getAllAnswers } from '../model/question';

const Start: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questions.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDatabase();
        if (data.length === 0) {
          setError(
            'Impossible de récupérer les questions. Veuillez réessayer plus tard.',
          );
        } else {
          const filteredData = data.map((item: Question) => ({
            ...item,
            reponses: getAllAnswers(item),
          }));
          setQuestions(filteredData);
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des données.');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        questions.length > 0 && (
          <div>
            <QuestionCard question={questions[currentQuestionIndex]} />
            <button onClick={handleNextQuestion} className="next-button">
              Suivant
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Start;
