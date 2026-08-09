import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="catalog-tag text-xs text-scan font-medium mb-2">[ TERMS ]</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-ink">이용약관</h1>
      </div>

      <div className="space-y-8 text-inkfade font-body leading-relaxed">
        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">서비스 정의</h2>
          <p>
            FaceLab은 사용자가 업로드한 얼굴 사진을 기반으로 혈액형, 나이, 관상 등을 AI가 추정해주는 "엔터테인먼트 목적의 서비스"입니다.
          </p>
        </section>

        <div className="bg-paper border-2 border-ink p-6 rounded-2xl">
          <h2 className="font-semibold text-ink text-lg mb-2">결과에 대한 책임 한계 (주의사항)</h2>
          <p className="text-ink font-medium">
            FaceLab이 제공하는 모든 분석 결과(특히 관상 리포트)는 과학적, 의학적 근거가 전혀 없는 단순한 재미 목적의 콘텐츠입니다. 어떠한 경우에도 본 서비스의 결과가 의학적 진단, 심리적 분석, 또는 중대한 의사결정의 근거로 사용될 수 없음을 명확히 밝힙니다. 혈액형 분석 및 나이 측정 결과 역시 단순 참고용이며, 정확도를 보장하지 않습니다.
          </p>
        </div>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">이용 제한</h2>
          <p>
            FaceLab 서비스는 원칙적으로 만 14세 이상의 사용자만 이용할 수 있습니다. 만 14세 미만의 아동은 법정대리인의 동의가 없는 한 본 서비스의 이용이 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">서비스의 변경 및 중단</h2>
          <p>
            본 서비스는 회사(팀)의 사정이나 기술적 필요에 따라 언제든지 사전 고지 없이 일부 또는 전체 기능이 변경되거나 중단될 수 있습니다. 서비스 중단으로 인해 발생할 수 있는 데이터 손실 등에 대해 FaceLab 팀은 법적 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">기타 규정</h2>
          <p>
            본 약관에 명시되지 않은 사항은 관계 법령 및 일반적인 상관례에 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">부칙</h2>
          <p>이 약관은 2026년 8월 9일부터 시행됩니다.</p>
        </section>
      </div>

      <div className="mt-16 text-sm text-inkfade">
        <Link href="/" className="hover:text-ink transition-colors">← 홈으로 돌아가기</Link>
      </div>
    </main>
  );
}
