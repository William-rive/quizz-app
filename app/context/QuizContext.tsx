// app/context/QuizContext.tsx
'use client';
import React, { createContext, ReactNode, useState } from 'react';
import { Question } from '../model/question';

interface QuizContextProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  isCreator: boolean;
  setIsCreator: React.Dispatch<React.SetStateAction<boolean>>;
  isReady: boolean;
  setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export const QuizContext = createContext<QuizContextProps | undefined>(
  undefined,
);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  return (
    <QuizContext.Provider
      value={{
        questions,
        setQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        score,
        setScore,
        isCreator,
        setIsCreator,
        isReady,
        setIsReady,
      }}>
      {children}
    </QuizContext.Provider>
  );
};
