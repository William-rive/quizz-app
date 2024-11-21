export interface Question {
  id: number;
  category: string;
  type: string | boolean;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

// app/models/Player.ts
export interface Player {
  id: string;
  name: string;
}

// app/models/MultiplayerQuizProps.ts
export interface MultiplayerQuizProps {
  roomId?: string;
}

export function getAllAnswers(question: Question): string[] {
  return [question.correct_answer, ...question.incorrect_answers];
}
