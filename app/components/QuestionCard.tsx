import React, { useEffect, useMemo, useState } from 'react';
import { Question } from '../model/question';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Timer from './ui/timer';
import { Card } from './ui/card';

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
      <Card className="max-w-sm md:max-w-full px-2">
        <div className="flex flex-col gap-4 my-8 text-center items-center py-6 flex-wrap">
          <Badge>{formatCategory(question.category)}</Badge>
          <h2 className="text-lg">{question.question}</h2>
          <Timer initialSeconds={10} onTimeUp={handleTimeUp} />
          <ul className="flex text-wrap flex-wrap justify-center gap-6">
            {shuffledAnswers.map((answer, index) => (
              <li key={index}>
                <Button
                  variant={'outline'}
                  onClick={() => handleAnswer(answer)}
                  className={
                    selectedAnswer === answer
                      ? !timeUp
                        ? 'bg-primary text-secondary' // Couleur temporaire après sélection
                        : showResult
                          ? isCorrect
                            ? 'bg-green-500 text-white' // Couleur si la réponse est correcte
                            : 'bg-red-500 text-white' // Couleur si la réponse est incorrecte
                          : ''
                      : ''
                  }>
                  {answer}
                </Button>
              </li>
            ))}
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
      </Card>
    </div>
  );
};

export default QuestionCard;
