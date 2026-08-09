'use client';

import React, { useEffect, useState } from 'react';
import ViewfinderFrame from './ViewfinderFrame';

interface ResultRevealProps {
  accentColor: string;
  labNumber: string;
  label: string;
  accuracy: number;
  rarityText?: string;
  imageUrl?: string;
  onReset: () => void;
  shareUrl: string;
}

export default function ResultReveal({
  accentColor,
  labNumber,
  label,
  accuracy,
  rarityText,
  imageUrl,
  onReset,
  shareUrl,
}: ResultRevealProps) {
  const [displayAccuracy, setDisplayAccuracy] = useState(0);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    // Label appears immediately after component mounts
    setShowLabel(true);

    // Accuracy count up
    let start = 0;
    const end = accuracy;
    const duration = 900;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuad
      const easeOut = progress * (2 - progress);
      
      setDisplayAccuracy(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayAccuracy(end);
      }
    };

    requestAnimationFrame(animate);
  }, [accuracy]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="catalog-tag text-xs font-medium mb-2" style={{ color: `var(--color-${accentColor})` }}>
        [{labNumber} · RESULT]
      </p>
      <h1 className="font-display font-bold text-3xl mb-8">분석 완료</h1>
      
      <div className="w-full max-w-sm mb-8">
        <ViewfinderFrame caption="결과 리포트" accentColor={accentColor}>
          <div className="relative w-full aspect-[9/16] rounded-2xl bg-ink text-paper p-6 flex flex-col justify-between shadow-xl my-4 mx-auto max-w-[240px] overflow-hidden">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={imageUrl} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm mix-blend-screen"
              />
            )}
            
            <p className="relative z-10 catalog-tag text-[10px]" style={{ color: `var(--color-${accentColor})` }}>
              FACELAB · {labNumber}
            </p>
            
            <div className="relative z-10 text-center flex-1 flex flex-col items-center justify-center">
              <p className="text-sm text-paper/60 mb-2">당신의 결과는</p>
              <div 
                className={`font-display font-extrabold text-5xl mb-4 transition-all duration-700 ease-out ${showLabel ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
              >
                {label}
              </div>
              
              {rarityText && (
                <div 
                  className="px-3 py-1.5 rounded-full text-[10px] mb-4 text-white animate-in fade-in zoom-in duration-500 fill-mode-both delay-300"
                  style={{ backgroundColor: `var(--color-${accentColor})` }}
                >
                  {rarityText}
                </div>
              )}
              
              <p className="text-sm text-paper/80 font-medium">일치율 {displayAccuracy}%</p>
            </div>
            
            <p className="relative z-10 catalog-tag text-[10px] text-paper/50 text-center">
              facelab.app
            </p>
          </div>
        </ViewfinderFrame>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm animate-in fade-in delay-700 duration-500 fill-mode-both">
        <button 
          onClick={onReset}
          className="flex-1 py-3.5 rounded-full font-semibold border-2 border-line hover:border-ink transition-colors text-sm"
        >
          다시 스캔하기
        </button>
        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-3.5 rounded-full font-semibold text-white hover:opacity-90 transition-opacity text-sm text-center"
          style={{ backgroundColor: `var(--color-${accentColor})` }}
        >
          결과 공유하기
        </a>
      </div>
    </div>
  );
}
