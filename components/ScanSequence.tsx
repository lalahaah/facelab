'use client';

import React, { useEffect, useState } from 'react';
import ViewfinderFrame from './ViewfinderFrame';
import { AccentColor } from '@/types/quiz';

interface ScanSequenceProps {
  imageUrl: string;
  statusMessages: string[];
  durationMs?: number;
  onComplete: () => void;
  accentColor?: AccentColor;
  labNumber?: string;
}

export default function ScanSequence({
  imageUrl,
  statusMessages,
  durationMs = 2400,
  onComplete,
  accentColor = 'scan',
  labNumber = 'LAB',
}: ScanSequenceProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const intervalMs = durationMs / statusMessages.length;
    
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < statusMessages.length) {
        setMsgIndex(currentIdx);
      }
    }, intervalMs);

    const timeout = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [durationMs, statusMessages.length, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 w-full animate-in fade-in duration-500">
      <p className="catalog-tag text-xs font-medium mb-2" style={{ color: `var(--color-${accentColor})` }}>
        [{labNumber} · SCANNING]
      </p>
      <h1 className="font-display font-bold text-3xl mb-8">분석 진행 중</h1>
      
      <div className="w-full max-w-sm mb-8">
        <ViewfinderFrame caption="AI 스캔 중..." accentColor={accentColor}>
          <div className="relative w-full h-full min-h-[300px] bg-ink rounded-lg overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt="Scan preview" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="scanline"></div>
          </div>
        </ViewfinderFrame>
      </div>

      <div className="h-8 flex items-center justify-center">
        <p 
          key={msgIndex}
          className="text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ color: `var(--color-${accentColor})` }}
        >
          {statusMessages[msgIndex]}
        </p>
      </div>
    </div>
  );
}
