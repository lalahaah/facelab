import { AccentColor } from '@/types/quiz';

export interface QuizConfig {
  slug: string;
  labNumber: string;
  title: string;
  description: string;
  accentColor: AccentColor;
  modelUrl: string;
  resultCopyIntro: string;
  disclaimer: string;
}

export const bloodTypeConfig: QuizConfig = {
  slug: 'blood-type',
  labNumber: 'LAB-01',
  title: '혈액형 분석',
  description: 'AI가 얼굴 특징에서 혈액형 패턴을 찾아드려요. 결과는 인스타 스토리로 바로 공유 가능.',
  accentColor: 'blood',
  modelUrl: '',
  resultCopyIntro: '당신의 혈액형은',
  disclaimer: '혈액형과 성격은 과학적 근거가 없어요, 재미로만 봐주세요 🩸',
};
