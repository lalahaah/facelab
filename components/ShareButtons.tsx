import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { AccentColor } from '@/types/quiz';

interface ShareButtonsProps {
  cardRef: React.RefObject<HTMLElement | null>;
  quizSlug: string;
  cardNumber: string;
  accentColor: AccentColor;
  onReset: () => void;
}

export default function ShareButtons({ cardRef, quizSlug, cardNumber, accentColor, onReset }: ShareButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const accentVar = `var(--color-${accentColor})`;

  const handleDownload = async () => {
    if (!cardRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `facelab-${quizSlug}-${cardNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('이미지 생성에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || isExporting) return;
    
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      if (navigator.share && navigator.canShare) {
        // Convert base64 to blob
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], `facelab-${quizSlug}-${cardNumber}.png`, { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'FaceLab 결과',
            text: 'FaceLab에서 내 결과를 확인해보세요!',
            files: [file],
          });
          return;
        }
      }
      
      // Fallback to download if Web Share API is not supported or sharing files is not allowed
      const link = document.createElement('a');
      link.download = `facelab-${quizSlug}-${cardNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to share image', err);
        alert('공유하기에 실패했습니다. 대신 다운로드됩니다.');
        // Fallback to download
        handleDownload();
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-8">
      <button 
        onClick={onReset}
        disabled={isExporting}
        className="flex-1 py-3.5 rounded-full font-semibold border-2 border-line hover:border-ink transition-colors text-sm disabled:opacity-50"
      >
        다시 스캔하기
      </button>
      <button
        onClick={handleShare}
        disabled={isExporting}
        className="flex-1 py-3.5 rounded-full font-semibold text-white hover:opacity-90 transition-opacity text-sm text-center disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: accentVar }}
      >
        {isExporting ? '처리 중...' : '결과 공유하기'}
      </button>
      <button
        onClick={handleDownload}
        disabled={isExporting}
        className="flex-1 py-3.5 rounded-full font-semibold border-2 text-sm transition-colors disabled:opacity-50 hover:opacity-80"
        style={{ borderColor: accentVar, color: accentVar }}
      >
        이미지 저장
      </button>
    </div>
  );
}
