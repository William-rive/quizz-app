'use client';
import React, { Suspense } from 'react';
import QuestionCard from '../components/QuestionCard';
import useQuizController from '../controller/quizController';

// Composant qui gère le rendu du quiz
const QuizContent: React.FC = () => {
  const {
    questions,
    score,
    currentQuestionIndex,
    showResult,
    correctAnswer,
    error,
    isLoading,
    handleAnswerValidation,
  } = useQuizController();

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader" />
        <div className="loader border-t-white border-4 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col my-20 items-center px-4">
      <h2 className="text-2xl">Score : <span className="text-primary">{score}</span></h2>
      <h3 className="text-xl mb-2">
        Questions restantes : {questions.length - currentQuestionIndex === 1 ? 'Dernière question' : questions.length - currentQuestionIndex}
      </h3>
      <div className="w-full lg:w-[35rem] bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-primary h-2.5 rounded-full"
          style={{ width: `${progress}%` }}></div>
      </div>
      {questions.length > 0 && (
        <QuestionCard
          key={currentQuestionIndex}
          question={questions[currentQuestionIndex]}
          onAnswerValidation={handleAnswerValidation}
          showResult={showResult}
          correctAnswer={correctAnswer}
        />
      )}
    </div>
  );
};

const Start: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizContent />
    </Suspense>
  );
};

export default Start;
