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
  showResult,
  correctAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [validationSent, setValidationSent] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Fonction utilitaire pour capitaliser la première lettre de chaque mot et enlever les underscores
  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fonction utilitaire pour mélanger les éléments d'un tableau
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

  // Mélange les réponses
  const shuffledAnswers = useMemo(
    () => shuffleArray([question.answer, ...question.badAnswers]),
    [question],
  );

  const handleAnswer = (answer: string) => {
    if (timeUp) return; // Empêche les interactions après expiration du timer
    setSelectedAnswer(answer); // Permet de changer le choix tant que le timer n'est pas écoulé
  };

  useEffect(() => {
    if (timeUp && !validationSent) {
      // Valide une seule fois après expiration du timer
      const correct = selectedAnswer === question.answer;
      setIsCorrect(correct);
      onAnswerValidation(correct); // Notifie le parent si la réponse est correcte
      setValidationSent(true); // Empêche les appels multiples
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
