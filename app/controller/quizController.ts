import { useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { useRouter, useSearchParams } from 'next/navigation';
import fetchDatabase from '../lib/api';
import { Question } from '../model/question';

interface QuizState {
  savedQuestions: Question[];
  savedScore: number;
  savedCurrentQuestionIndex: number;
  isFinished: boolean;
}

const useQuizController = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const limit = 10; // Nombre de questions à récupérer

  const router = useRouter();

  // Générer ou récupérer un identifiant unique pour le quiz
  const existingQuizId = useMemo(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quizState_')) {
        return key.replace('quizState_', '');
      }
    }
    return null;
  }, []);

  const quizId = useMemo(() => existingQuizId || nanoid(6), [existingQuizId]);

  // Charger ou initialiser l'état du quiz
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Toujours activer le chargement avant de commencer
        const filters = { category, difficulty, limit };
        const data = await fetchDatabase(filters);
        if (data.length === 0) {
          setError('Impossible de récupérer les questions. Veuillez réessayer plus tard.');
        } else {
          setQuestions(data);
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setIsLoading(false); // Fin du chargement, succès ou échec
      }
    };

    const loadQuizState = async () => {
      const savedQuizState = localStorage.getItem(`quizState_${quizId}`);
      if (savedQuizState) {
        try {
          const {
            savedQuestions,
            savedScore,
            savedCurrentQuestionIndex,
            isFinished,
          }: QuizState = JSON.parse(savedQuizState);

          if (!isFinished && savedQuestions.length > 0) {
            setQuestions(savedQuestions);
            setScore(savedScore);
            setCurrentQuestionIndex(savedCurrentQuestionIndex);
          } else {
            await fetchData(); // Charger de nouvelles données si l'état est terminé ou invalide
          }
        } catch (err) {
          console.error('Erreur lors de la restauration de l’état:', err);
          await fetchData(); // Charger de nouvelles données en cas de problème
        } finally {
          setIsLoading(false); // Toujours désactiver le chargement après
        }
      } else {
        fetchData();
      }
    };

    loadQuizState();
  }, [category, difficulty, limit, quizId]);

  // Sauvegarder l'état du quiz
  useEffect(() => {
    const quizState: QuizState = {
      savedQuestions: questions,
      savedScore: score,
      savedCurrentQuestionIndex: currentQuestionIndex,
      isFinished: showResult,
    };
    if (!showResult) {
      localStorage.setItem(`quizState_${quizId}`, JSON.stringify(quizState));
    }
  }, [questions, score, currentQuestionIndex, showResult, quizId]);

  // Validation de la réponse
  const handleAnswerValidation = (isCorrect: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newScore = isCorrect ? score + 1 : score;
    setCorrectAnswer(currentQuestion.answer);

    if (isCorrect) {
      setScore(newScore);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCorrectAnswer(null);
      }, 3000);
    } else {
      setTimeout(() => {
        setShowResult(true);
        const results = {
          score: newScore,
          totalQuestions: questions.length,
          category,
          difficulty,
          quizId,
        };
        localStorage.setItem(`quizResults_${quizId}`, JSON.stringify(results));
        localStorage.removeItem(`quizState_${quizId}`);
        router.push('/classement');
      }, 3000);
    }
  };

  return {
    questions,
    score,
    currentQuestionIndex,
    showResult,
    correctAnswer,
    error,
    handleAnswerValidation,
    isLoading,
  };
};

export default useQuizController;
