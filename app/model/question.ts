export enum Difficulty {
  EASY = 'facile',
  NORMAL = 'normal',
  HARD = 'difficile',
}

export enum Category {
  ART_LITERATURE = 'art_litterature',
  TV_CINEMA = 'tv_cinema',
}

export interface Question {
  _id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  answer: string;
  badAnswers: string[];
}

export function getShuffledAnswers(question: Question): string[] {
  const answers = [question.answer, ...question.badAnswers];
  return answers.sort(() => Math.random() - 0.5);
}