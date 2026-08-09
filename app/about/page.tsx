import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="catalog-tag text-xs text-scan font-medium mb-2">[ ABOUT ]</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-ink">About FaceLab</h1>
      </div>

      <div className="space-y-8 text-inkfade font-body leading-relaxed">
        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">FaceLab이란?</h2>
          <p className="mb-4">
            FaceLab은 사진 한 장으로 당신의 혈액형, 추정 나이, 그리고 관상까지 재미로 알아보는 AI 분석 서비스입니다. 
            무겁고 복잡한 절차 없이 브라우저 상에서 바로 얼굴의 특징을 잡아내어, 소소한 즐거움을 드릴 수 있도록 설계되었습니다.
          </p>
          <p>
            결과는 친구들과 함께 공유하고 웃어넘길 수 있는 가벼운 엔터테인먼트 목적으로만 만들어졌습니다.
          </p>
        </section>

        <div className="bg-paper border-2 border-scan/20 p-6 rounded-2xl">
          <h2 className="font-semibold text-scan text-lg mb-2">프라이버시가 먼저입니다</h2>
          <p className="text-ink font-medium">
            가장 중요한 점은, 당신의 사진은 절대 저장되지 않는다는 것입니다. AI 모델이 사용자 본인의 브라우저 내에서 즉각적으로 연산만 수행하며, 서버로 단 한 장의 이미지도 전송하지 않습니다. 편안하고 안전하게 서비스를 즐겨주세요.
          </p>
        </div>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">만든 사람</h2>
          <p>
            FaceLab 팀<br />
            <a href="mailto:contact@facelab.app" className="text-ink font-medium hover:underline">contact@facelab.app</a>
          </p>
        </section>
      </div>

      <div className="mt-16 text-sm text-inkfade">
        <Link href="/" className="hover:text-ink transition-colors">← 홈으로 돌아가기</Link>
      </div>
    </main>
  );
}
