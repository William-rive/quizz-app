// page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import fetchDatabase from '../lib/api';
import { Question, getAllAnswers } from '../model/question';

const Start: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      <h1>Commencez le Quiz</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        questions.map((q, index) => <QuestionCard key={index} question={q} />)
      )}
    </div>
  );
};

export default Start;
