'use client';
import React from 'react';
import QuestionCard from '../components/QuestionCard';
import useQuizController from '../controller/quizController';

const Start: React.FC = () => {
  const {
    questions,
    score,
    currentQuestionIndex,
    showResult,
    correctAnswer,
    error,
    handleAnswerValidation,
  } = useQuizController();

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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

export default Start;
