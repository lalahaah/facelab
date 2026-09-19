'use client';

import React, { useEffect, useRef, useState } from 'react';
import { QuizConfig } from '@/config/quizzes';
import ViewfinderFrame from './ViewfinderFrame';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ScanSequence from './ScanSequence';
import ResultReveal from './ResultReveal';
import SpecimenCard from './SpecimenCard';
import ShareButtons from './ShareButtons';

interface QuizRunnerProps {
  quiz: QuizConfig;
}

type QuizStep = 'upload' | 'scanning' | 'result';

export default function QuizRunner({ quiz }: QuizRunnerProps) {
  const [step, setStep] = useState<QuizStep>('upload');
  const [result, setResult] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setStep('scanning');
    } else if (quiz.slug === 'age-estimate') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsScanning(true);
      setStep('scanning');
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
    setIsScanning(false);
    setStep('upload');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 1. Scanning Step
  if (step === 'scanning' && previewUrl && quiz.slug === 'blood-type') {
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
            setStep('result');
          };
          img.src = previewUrl;
        }}
      />
    );
  }

  if (step === 'scanning' && previewUrl && quiz.slug === 'age-estimate') {
    return (
      <ScanSequence 
        imageUrl={previewUrl}
        statusMessages={['피부 텍스처 분석 중...', '얼굴 윤곽 비교 중...', '연령대 매칭 중...']}
        durationMs={2400}
        accentColor={quiz.accentColor}
        labNumber={quiz.labNumber}
        onComplete={() => {
          const img = new Image();
          img.onload = async () => {
            try {
              const { predictAge } = await import('@/lib/predictors/ageEstimate');
              const prediction = await predictAge(img);
              
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
              setStep('result');
            } catch (error) {
              console.error('Failed to predict age', error);
              setIsScanning(false);
            }
          };
          img.src = previewUrl;
        }}
      />
    );
  }

  // 2. Result Step (결과 화면에서는 업로드 input이 전혀 렌더링되지 않음)
  if (step === 'result' && result) {
    if (quiz.slug === 'blood-type' || quiz.slug === 'age-estimate') {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6 w-full">
          <SpecimenCard
            ref={cardRef}
            imageUrl={previewUrl || undefined}
            quiz={quiz}
            label={result.label}
            accuracy={result.accuracy}
            rarityText={result.rarityText}
            cardNumber={result.cardNumber}
            stats={result.stats}
            rarityTier={result.rarityTier}
          />
          {quiz.disclaimer && (
            <div className="mt-4 px-3 py-1 rounded-full bg-line/50 text-xs text-inkfade text-center font-medium">
              {quiz.disclaimer}
            </div>
          )}
          <ShareButtons
            cardRef={cardRef}
            quizSlug={quiz.slug}
            cardNumber={result.cardNumber}
            accentColor={quiz.accentColor}
            onReset={handleReset}
          />
        </div>
      );
    }

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

  // 3. Upload Step (업로드 단계에서만 input[type="file"] 렌더링)
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
              ref={fileInputRef}
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
