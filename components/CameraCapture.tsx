'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AccentColor } from '@/types/quiz';
import ViewfinderFrame from './ViewfinderFrame';

const ACCENT_COLOR_MAP: Record<AccentColor, string> = {
  blood: '#E63950',
  amber: '#F2A93C',
  jade: '#1FA37D',
  scan: '#2D5BFF',
};

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
  accentColor: AccentColor;
}

export default function CameraCapture({ onCapture, onCancel, accentColor }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const accentColorHex = ACCENT_COLOR_MAP[accentColor] || '#2D5BFF';

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('이 브라우저에서는 카메라를 지원하지 않습니다.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const handleReady = () => {
            if (mounted) {
              videoRef.current?.play().catch((e) => console.error('Video play failed', e));
              setIsReady(true);
            }
          };

          videoRef.current.onloadedmetadata = handleReady;
          videoRef.current.oncanplay = handleReady;
          if (videoRef.current.readyState >= 1) {
            handleReady();
          }
        }
      } catch (err: any) {
        if (!mounted) return;
        console.error('Camera access error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 접근을 허용해주세요.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('사용 가능한 카메라 기기를 찾을 수 없습니다.');
        } else {
          setError(err.message || '카메라를 사용할 수 없어요.');
        }
      }
    }

    initCamera();

    return () => {
      mounted = false;
      stopStream();
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 전면 카메라 셀카 미러 드로잉
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        stopStream();
        onCapture(file);
      },
      'image/jpeg',
      0.92
    );
  };

  const handleCancel = () => {
    stopStream();
    onCancel();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center max-w-sm mx-auto">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-paper border-2 shadow-sm"
          style={{ borderColor: accentColorHex }}
        >
          <span className="text-2xl">📷</span>
        </div>
        <h2 className="font-display font-bold text-xl mb-3 text-ink">
          카메라를 사용할 수 없어요
        </h2>
        <p className="text-sm text-inkfade mb-8 leading-relaxed">
          {error}
        </p>
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-3 rounded-full text-sm font-semibold text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
          style={{ backgroundColor: accentColorHex }}
        >
          사진 업로드로 진행하기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto relative flex flex-col items-center">
      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={handleCancel}
        aria-label="카메라 닫기"
        className="absolute -top-12 right-0 w-8 h-8 rounded-full bg-white border border-line text-ink flex items-center justify-center text-sm font-bold shadow-sm transition-transform active:scale-90 hover:bg-paper cursor-pointer z-10"
      >
        ✕
      </button>

      <ViewfinderFrame caption="정면을 바라보고 촬영해주세요" accentColor={accentColor}>
        <div className="relative w-full h-full bg-black overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs">
              카메라 연결 중...
            </div>
          )}
        </div>
      </ViewfinderFrame>

      {/* 원형 셔터 버튼 */}
      <div className="mt-8 flex flex-col items-center">
        <button
          type="button"
          onClick={handleCapture}
          disabled={!isReady}
          aria-label="사진 촬영"
          className="w-18 h-18 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-transform active:scale-90 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: accentColorHex }}
        >
          <div className="w-14 h-14 rounded-full border-2 border-white/60 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/30" />
          </div>
        </button>
        <span className="catalog-tag text-[11px] text-inkfade mt-3">촬영 버튼을 눌러주세요</span>
      </div>
    </div>
  );
}
