import { bloodTypeConfig, QuizConfig } from './blood-type';
import { ageEstimateConfig } from './age-estimate';
import { faceReadingConfig } from './face-reading';

export const quizzes: QuizConfig[] = [
  bloodTypeConfig,
  ageEstimateConfig,
  faceReadingConfig,
];

export function getQuizBySlug(slug: string): QuizConfig | undefined {
  return quizzes.find((q) => q.slug === slug);
}

export type { QuizConfig };
