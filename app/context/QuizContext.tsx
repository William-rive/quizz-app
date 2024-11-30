// app/context/QuizContext.tsx
'use client';
import React, { createContext, useState } from 'react';
import { Question } from '../model/question';

interface QuizContextProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  // Ajoutez d'autres états nécessaires (timer, etc.)
}

export const QuizContext = createContext<QuizContextProps | undefined>(
  undefined,
);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  // Autres états...

  return (
    <QuizContext.Provider
      value={{
        questions,
        setQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        score,
        setScore,
        // Autres états...
      }}>
      {children}
    </QuizContext.Provider>
  );
};
