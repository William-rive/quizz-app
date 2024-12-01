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
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const limit = 10; // Nombre de questions à récupérer
  
  const router = useRouter();

  // Gestion de l'identifiant unique pour chaque quiz
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
      }
    };

    const savedQuizState = localStorage.getItem(`quizState_${quizId}`);
    if (savedQuizState) {
      const { savedQuestions, savedScore, savedCurrentQuestionIndex, isFinished }: QuizState = JSON.parse(savedQuizState);
      setQuestions(savedQuestions);
      setScore(savedScore);
      setCurrentQuestionIndex(savedCurrentQuestionIndex);
      setShowResult(isFinished);
    } else {
      fetchData();
    }
  }, [category, difficulty, limit, quizId]);

  // Sauvegarder l'état du quiz
  useEffect(() => {
    const quizState: QuizState = {
      savedQuestions: questions,
      savedScore: score,
      savedCurrentQuestionIndex: currentQuestionIndex,
      isFinished: showResult,
    };
    if (showResult === false) {
    localStorage.setItem(`quizState_${quizId}`, JSON.stringify(quizState));
    }
  }, [questions, score, currentQuestionIndex, showResult, quizId]);

  // Gestion du bouton "Retour"
  useEffect(() => {
    const handlePopState = () => {
      localStorage.removeItem(`quizState_${quizId}`);
      console.log(`QuizState ${quizId} supprimé après retour en arrière`);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [quizId]);

  // Validation de la réponse
  const handleAnswerValidation = (isCorrect: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newScore = isCorrect ? score + 1 : score;
    setCorrectAnswer(currentQuestion.answer); // Toujours définir la bonne réponse

    if (isCorrect) {
      setScore(newScore);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCorrectAnswer(null);
      }, 3000); // Délai de 3 secondes avant de passer à la question suivante
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
      }, 3000); // Délai de 3 secondes avant de montrer les résultats
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
  };
};

export default useQuizController;
