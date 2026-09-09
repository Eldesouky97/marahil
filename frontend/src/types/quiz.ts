export interface QuizQuestion {
  id: string;
  question: string;
  choices: string[];
  correct: number;
  explanation?: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: Record<string, number>;
}
