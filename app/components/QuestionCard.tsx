import React from 'react';
import { Question } from '../model/question';
import { Button } from './ui/button';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const answers = [...question.incorrect_answers, question.correct_answer];

  console.log(question);

  return (
    <div className="question-card">
      <div className="flex flex-col gap-4 my-8 text-center items-center bg-slate-500">
        <h2 className="text-lg">{question.question}</h2>
        <ul className="flex gap-6">
          {answers.map((answer, index) => (
            <li key={index}>
              <Button>{answer}</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionCard;
