import React from 'react';
import { Question } from '../model/question';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Timer from './ui/timer';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const answers = [...question.incorrect_answers, question.correct_answer];

  console.log(question);

  return (
    <div className="question-card">
      <div className="flex flex-col gap-4 my-8 text-center items-center bg-slate-500 py-6">
        <Badge>{question.category}</Badge>
        <h2 className="text-lg">{question.question}</h2>
        <Timer initialSeconds={20} onTimeUp={() => console.log('Time up!')} />
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
