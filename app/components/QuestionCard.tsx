import React, { useState, useEffect } from 'react';
import { Question } from '../model/question';
import { Badge } from './ui/badge';
import Timer from './ui/timer';
import { Button } from './ui/button';

interface QuestionCardProps {
  question: Question;
  onAnswerValidation: (isCorrect: boolean) => void;
  showResult: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswerValidation, showResult }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [validationSent, setValidationSent] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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
  }, [timeUp, validationSent, selectedAnswer, question.answer, onAnswerValidation]);

  const handleTimeUp = () => {
    setTimeUp(true);
  };

  return (
    <div className="question-card">
      <div className="flex flex-col gap-4 my-8 text-center items-center bg-slate-500 py-6">
        <Badge>{question.category}</Badge>
        <h2 className="text-lg">{question.question}</h2>
        <Timer initialSeconds={20} onTimeUp={handleTimeUp} />
        <ul className="flex gap-6">
          {[question.answer, ...question.badAnswers].map((answer, index) => (
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
                }
              >
                {answer}
              </Button>
            </li>
          ))}
                  </ul>
        {isCorrect !== null && timeUp && (
          <p>{isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse.'}</p>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;