import React from 'react';
import Link from 'next/link';
import ViewfinderFrame from '@/components/ViewfinderFrame';
import QuizCard from '@/components/QuizCard';

export default function Home() {
  return (
    <>
      {/* NAV */}
      <header className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-scan"></div>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">FaceLab</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-inkfade font-medium">
          <Link href="#catalog" className="hover:text-ink transition-colors">혈액형</Link>
          <Link href="#catalog" className="hover:text-ink transition-colors">나이 측정</Link>
          <Link href="#catalog" className="hover:text-ink transition-colors">관상</Link>
          <Link href="#how" className="hover:text-ink transition-colors">이용 방법</Link>
        </nav>
        <Link href="#catalog" className="text-sm font-semibold bg-ink text-paper px-4 py-2 rounded-full hover:opacity-85 transition-opacity">
          스캔 시작하기
        </Link>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="catalog-tag text-xs text-scan font-medium mb-4">[ FACELAB · SCAN LAB ]</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight">
            당신의 얼굴,<br />데이터로 읽어드립니다.
          </h1>
          <p className="mt-5 text-inkfade text-base md:text-lg leading-relaxed max-w-md">
            사진 한 장이면 충분해요. 혈액형, 나이, 관상까지 —
            AI가 브라우저에서 바로 분석하고, <span className="text-ink font-medium">사진은 서버에 저장하지 않습니다.</span>
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="#catalog" className="bg-scan text-white font-semibold px-6 py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity">
              지금 스캔하기 →
            </Link>
            <span className="text-xs text-inkfade catalog-tag">3종 분석 · 무료 · 저장 없음</span>
          </div>
        </div>

        <ViewfinderFrame caption="사진을 올려주세요">
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none" className="text-line">
            <circle cx="70" cy="55" r="30" stroke="currentColor" strokeWidth="2" />
            <path d="M25 130c5-30 22-45 45-45s40 15 45 45" stroke="currentColor" strokeWidth="2" />
          </svg>
        </ViewfinderFrame>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="max-w-6xl mx-auto px-6 md:px-10 py-16 border-t border-line">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="catalog-tag text-xs text-inkfade mb-2">[ CATALOG ]</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">3가지 스캔 중 골라보세요</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <QuizCard
            labNumber="LAB-01"
            accentColor="blood"
            title="혈액형 분석"
            description="AI가 얼굴 특징에서 혈액형 패턴을 찾아드려요. 결과는 인스타 스토리로 바로 공유 가능."
            href="/quiz/blood-type"
          />
          <QuizCard
            labNumber="LAB-02"
            accentColor="amber"
            title="나이 측정"
            description="동안일까, 노안일까? AI 추정 연령대와 실제 나이를 비교해보세요."
            href="/quiz/age-estimate"
          />
          <QuizCard
            labNumber="LAB-03"
            accentColor="jade"
            title="관상 리포트"
            description="전통 관상학 x AI 재해석. 과학적 근거보다는 재미로 즐겨주세요."
            href="/quiz/face-reading"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-6xl mx-auto px-6 md:px-10 py-16 border-t border-line">
        <p className="catalog-tag text-xs text-inkfade mb-2">[ PROCESS ]</p>
        <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-10">이용 방법 3단계</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <p className="font-mono text-scan text-sm mb-2">01</p>
            <h3 className="font-semibold mb-1">사진 업로드</h3>
            <p className="text-sm text-inkfade leading-relaxed">정면 얼굴 사진 한 장을 올려주세요. 웹캠 촬영도 가능해요.</p>
          </div>
          <div>
            <p className="font-mono text-scan text-sm mb-2">02</p>
            <h3 className="font-semibold mb-1">AI 즉시 분석</h3>
            <p className="text-sm text-inkfade leading-relaxed">사진은 브라우저 안에서만 처리돼요. 서버로 전송되거나 저장되지 않아요.</p>
          </div>
          <div>
            <p className="font-mono text-scan text-sm mb-2">03</p>
            <h3 className="font-semibold mb-1">결과 카드 공유</h3>
            <p className="text-sm text-inkfade leading-relaxed">인스타 스토리용 카드로 바로 저장하고 공유하세요.</p>
          </div>
        </div>
      </section>

      {/* RESULT PREVIEW */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 border-t border-line grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="catalog-tag text-xs text-inkfade mb-2">[ SHARE CARD PREVIEW ]</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-4">결과는 이렇게 공유돼요</h2>
          <p className="text-inkfade text-sm leading-relaxed max-w-sm">
            인스타그램 스토리 비율(9:16)에 맞춘 결과 카드가 자동 생성돼요.
            브랜드 로고와 재분석 유도 문구가 포함되어 바이럴 루프를 만듭니다.
          </p>
        </div>
        <div className="w-48 mx-auto aspect-[9/16] rounded-3xl bg-ink text-paper p-5 flex flex-col justify-between shadow-xl">
          <p className="catalog-tag text-[10px] text-scan">FACELAB · LAB-01</p>
          <div className="text-center">
            <p className="text-xs text-paper/60 mb-1">당신의 혈액형은</p>
            <p className="font-display font-extrabold text-4xl">B형</p>
            <p className="text-xs text-paper/60 mt-2">일치율 87%</p>
          </div>
          <p className="catalog-tag text-[9px] text-paper/50 text-center">facelab.app</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between gap-4 text-xs text-inkfade">
          <p>© FaceLab. 사진은 저장되지 않으며 브라우저에서만 처리됩니다.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-ink">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-ink">이용약관</Link>
            <Link href="/about" className="hover:text-ink">About</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
