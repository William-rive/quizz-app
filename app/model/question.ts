export interface Question {
  id: number;
  category: string;
  type: string | boolean;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export function getAllAnswers(question: Question): string[] {
  return [question.correct_answer, ...question.incorrect_answers];
}
