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