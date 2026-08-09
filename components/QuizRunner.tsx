'use client';

import React from 'react';
import { QuizConfig } from '@/config/quizzes';
import ViewfinderFrame from './ViewfinderFrame';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface QuizRunnerProps {
  quiz: QuizConfig;
}

export default function QuizRunner({ quiz }: QuizRunnerProps) {
  const [result, setResult] = React.useState<{ label: string; accuracy: number } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // TODO TASK-005: TensorFlow.js 모델 연동
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (quiz.slug === 'blood-type') {
      setIsLoading(true);
      const img = new Image();
      img.onload = async () => {
        const { predictBloodType } = await import('@/lib/predictors/bloodType');
        const prediction = predictBloodType(img);
        
        try {
          await addDoc(collection(db, 'quiz_results'), {
            quizSlug: quiz.slug,
            resultLabel: prediction.label,
            createdAt: serverTimestamp(),
          });
        } catch (error) {
          console.error('Failed to log quiz result to Firestore', error);
        }
        
        setResult(prediction);
        setIsLoading(false);
      };
      img.src = URL.createObjectURL(file);
    } else {
      console.log('Selected file:', file.name);
      
      // TODO TASK-005: 예측 완료 시 실제 라벨로 교체
      const predictedLabel = '테스트';
      try {
        await addDoc(collection(db, 'quiz_results'), {
          quizSlug: quiz.slug,
          resultLabel: predictedLabel,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Failed to log quiz result to Firestore', error);
      }
    }
  };

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <p className="catalog-tag text-xs font-medium mb-2" style={{ color: `var(--color-${quiz.accentColor})` }}>
          [{quiz.labNumber} · RESULT]
        </p>
        <h1 className="font-display font-bold text-3xl mb-8">분석 완료</h1>
        
        <div className="w-full max-w-sm mb-8">
          <ViewfinderFrame caption="결과 리포트" accentColor={quiz.accentColor}>
            <div className="w-full aspect-[9/16] rounded-2xl bg-ink text-paper p-6 flex flex-col justify-between shadow-xl my-4 mx-auto max-w-[240px]">
              <p className="catalog-tag text-[10px]" style={{ color: `var(--color-${quiz.accentColor})` }}>FACELAB · {quiz.labNumber}</p>
              <div className="text-center">
                <p className="text-sm text-paper/60 mb-2">당신의 혈액형은</p>
                <p className="font-display font-extrabold text-5xl mb-3">{result.label}</p>
                <p className="text-sm text-paper/60">일치율 {result.accuracy}%</p>
              </div>
              <p className="catalog-tag text-[10px] text-paper/50 text-center">facelab.app</p>
            </div>
          </ViewfinderFrame>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button 
            onClick={() => setResult(null)}
            className="flex-1 py-3.5 rounded-full font-semibold border-2 border-line hover:border-ink transition-colors text-sm"
          >
            다시 스캔하기
          </button>
          <a
            href={`/api/og?quiz=${quiz.slug}&result=${result.label}&accuracy=${result.accuracy}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3.5 rounded-full font-semibold bg-scan text-white hover:opacity-90 transition-opacity text-sm text-center"
            style={{ backgroundColor: `var(--color-${quiz.accentColor})` }}
          >
            결과 공유하기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <p className="catalog-tag text-xs font-medium mb-2" style={{ color: `var(--color-${quiz.accentColor})` }}>
        [{quiz.labNumber}]
      </p>
      <h1 className="font-display font-bold text-3xl mb-8">{quiz.title}</h1>
      
      <div className="w-full max-w-sm">
        <ViewfinderFrame caption="사진을 올려주세요" accentColor={quiz.accentColor}>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center text-scan" style={{ color: `var(--color-${quiz.accentColor})` }}>
                <svg className="animate-spin h-8 w-8 mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">분석 중...</span>
              </div>
            ) : (
              <>
                <svg width="64" height="64" viewBox="0 0 140 140" fill="none" className="text-line mb-4">
                  <circle cx="70" cy="55" r="30" stroke="currentColor" strokeWidth="2" />
                  <path d="M25 130c5-30 22-45 45-45s40 15 45 45" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-sm text-inkfade">터치하여 사진 업로드</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
              </>
            )}
          </div>
        </ViewfinderFrame>
      </div>
      
      <p className="mt-8 text-sm text-inkfade max-w-sm text-center leading-relaxed">
        {quiz.description}
      </p>
    </div>
  );
}
