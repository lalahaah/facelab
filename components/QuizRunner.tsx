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
  // TODO TASK-005: TensorFlow.js 모델 연동
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
      // 예측 로직 연동 예정
      
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

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <p className="catalog-tag text-xs font-medium mb-2" style={{ color: `var(--color-${quiz.accentColor})` }}>
        [{quiz.labNumber}]
      </p>
      <h1 className="font-display font-bold text-3xl mb-8">{quiz.title}</h1>
      
      <div className="w-full max-w-sm">
        <ViewfinderFrame caption="사진을 올려주세요" accentColor={quiz.accentColor}>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
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
          </div>
        </ViewfinderFrame>
      </div>
      
      <p className="mt-8 text-sm text-inkfade max-w-sm text-center leading-relaxed">
        {quiz.description}
      </p>
    </div>
  );
}
