import React, { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { AccentColor } from '@/types/quiz';

interface ShareButtonsProps {
  cardRef: React.RefObject<HTMLElement | null>;
  quizSlug: string;
  cardNumber: string;
  accentColor: AccentColor;
  onReset: () => void;
}

const ACCENT_COLOR_MAP: Record<AccentColor, string> = {
  blood: '#E63950',
  amber: '#F2A93C',
  jade: '#1FA37D',
  scan: '#2D5BFF',
};

export default function ShareButtons({ cardRef, quizSlug, cardNumber, accentColor, onReset }: ShareButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const accentColorValue = ACCENT_COLOR_MAP[accentColor] || '#2D5BFF';
  const accentVar = `var(--color-${accentColor}, ${accentColorValue})`;

  const handleDownload = async () => {
    if (!cardRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `facelab-${quizSlug}-${cardNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || isExporting) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const fileName = `facelab-${quizSlug}-${cardNumber}.png`;

      // navigator.share 지원 여부 확인
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/png');
        });

        if (blob) {
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'FaceLab 결과',
              text: 'FaceLab에서 내 결과를 확인해보세요!',
              files: [file],
            });
            return;
          }
        }
      }

      // navigator.share 미지원 또는 파일 공유 미지원 시 다운로드로 폴백
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Failed to share image', err);
        // 공유 실패 시 다운로드로 폴백
        try {
          if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current, {
              backgroundColor: null,
              scale: 2,
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `facelab-${quizSlug}-${cardNumber}.png`;
            link.href = dataUrl;
            link.click();
          }
        } catch (downloadErr) {
          console.error('Failed fallback download after share error', downloadErr);
        }
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
