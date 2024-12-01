import React, { useEffect, useMemo, useState } from 'react';
import { Question } from '../model/question';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Timer from './ui/timer';

interface QuestionCardProps {
  question: Question;
  onAnswerValidation: (isCorrect: boolean) => void;
  showResult: boolean;
  correctAnswer: string | null;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerValidation,
  correctAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [validationSent, setValidationSent] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const shuffledAnswers = useMemo(
    () => shuffleArray([question.answer, ...question.badAnswers]),
    [question],
  );

  const handleAnswer = (answer: string) => {
    if (timeUp) return;
    setSelectedAnswer(answer);
  };

  useEffect(() => {
    if (timeUp && !validationSent) {
      const correct = selectedAnswer === question.answer;
      setIsCorrect(correct);
      onAnswerValidation(correct);
      setValidationSent(true);
    }
  }, [
    timeUp,
    validationSent,
    selectedAnswer,
    question.answer,
    onAnswerValidation,
  ]);

  const handleTimeUp = () => {
    setTimeUp(true);
  };

  return (
    <div className="question-card">
      <div className="flex flex-col gap-4 my-8 text-center items-center bg-slate-500 py-6">
        <Badge>{formatCategory(question.category)}</Badge>
        <h2 className="text-lg">{question.question}</h2>
        <Timer initialSeconds={10} onTimeUp={handleTimeUp} />
        <ul className="flex gap-6">
          {shuffledAnswers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrectAnswer = correctAnswer === answer;
            const isWrongAnswer = isSelected && !isCorrectAnswer;

            return (
              <li key={index}>
                <Button
                  variant={'outline'}
                  onClick={() => handleAnswer(answer)}
                  className={`${
                    isSelected && !timeUp
                      ? 'bg-primary text-secondary'
                      : timeUp
                      ? isCorrectAnswer
                        ? 'bg-green-500 text-white'
                        : isWrongAnswer
                        ? 'bg-red-500 text-white'
                        : ''
                      : ''
                  }`}
                >
                  {answer}
                </Button>
              </li>
            );
          })}
        </ul>
        {isCorrect !== null && timeUp && (
          <p>{isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse.'}</p>
        )}
        {correctAnswer && !isCorrect && (
          <p className="text-red-500 mt-2">
            La bonne réponse était : {correctAnswer}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
