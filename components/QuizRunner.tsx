'use client';

import React, { useEffect } from 'react';
import { QuizConfig } from '@/config/quizzes';
import ViewfinderFrame from './ViewfinderFrame';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ScanSequence from './ScanSequence';
import ResultReveal from './ResultReveal';

interface QuizRunnerProps {
  quiz: QuizConfig;
}

export default function QuizRunner({ quiz }: QuizRunnerProps) {
  const [result, setResult] = React.useState<{ label: string; accuracy: number; rarityText: string } | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (quiz.slug === 'blood-type') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsScanning(true);
    } else {
      console.log('Selected file:', file.name);
      
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

  const handleReset = () => {
    setResult(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  if (isScanning && previewUrl && quiz.slug === 'blood-type') {
    return (
      <ScanSequence 
        imageUrl={previewUrl}
        statusMessages={['얼굴 윤곽 분석 중...', '색상 패턴 대조 중...', '혈액형 패턴 매칭 중...']}
        durationMs={2400}
        accentColor={quiz.accentColor}
        labNumber={quiz.labNumber}
        onComplete={() => {
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
            setIsScanning(false);
          };
          img.src = previewUrl;
        }}
      />
    );
  }

  if (result) {
    return (
      <ResultReveal
        accentColor={quiz.accentColor}
        labNumber={quiz.labNumber}
        label={result.label}
        accuracy={result.accuracy}
        rarityText={result.rarityText}
        imageUrl={previewUrl || undefined}
        onReset={handleReset}
        shareUrl={`/api/og?quiz=${quiz.slug}&result=${result.label}&accuracy=${result.accuracy}`}
      />
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
          <div className="relative w-full h-full min-h-[200px] flex flex-col items-center justify-center">
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
