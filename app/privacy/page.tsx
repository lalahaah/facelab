import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="catalog-tag text-xs text-scan font-medium mb-2">[ PRIVACY ]</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-ink">개인정보처리방침</h1>
      </div>

      <div className="space-y-8 text-inkfade font-body leading-relaxed">
        <div className="bg-paper border-2 border-ink p-6 rounded-2xl">
          <h2 className="font-semibold text-ink text-lg mb-2">가장 중요한 안내: 사진은 절대 저장되지 않습니다</h2>
          <p className="text-ink font-medium">
            FaceLab은 업로드된 사진을 서버로 전송하거나 저장하지 않습니다. 모든 AI 분석은 사용자의 브라우저 내에서만 처리되며, 분석이 끝나면 이미지는 즉시 메모리에서 사라집니다.
          </p>
        </div>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">수집하는 정보</h2>
          <p>
            FaceLab은 서비스 개선 및 통계 목적으로 퀴즈 결과 라벨(어떤 혈액형, 나이대, 관상 결과가 나왔는지)만 익명으로 데이터베이스(Firebase)에 저장합니다. 이 과정에서 사용자의 IP 주소, 개인 식별 정보, 업로드한 이미지 등은 일절 수집되거나 저장되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">Google AdSense 및 쿠키 사용 안내</h2>
          <p>
            본 사이트는 Google AdSense를 통해 광고를 게재하며, Google 및 파트너는 쿠키를 사용해 사용자의 이전 방문 기록이나 다른 웹사이트 방문 기록을 기반으로 맞춤 광고를 제공할 수 있습니다. 사용자는 언제든지 쿠키 사용을 거부할 수 있으며, 자세한 내용은 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-scan hover:underline font-medium">Google의 광고 정책</a>을 참고하세요.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">통계 도구 (GA4) 활용</h2>
          <p>
            FaceLab은 서비스 접속 및 이용 통계를 파악하기 위해 Google Analytics 4 (GA4)를 사용합니다. 이 과정에서 브라우저 정보, 기기 정보, 방문 기록 등이 익명화된 형태로 수집될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">문의처</h2>
          <p>
            개인정보 처리와 관련된 문의 사항은 다음 이메일로 연락해 주시기 바랍니다:<br />
            <a href="mailto:contact@facelab.app" className="text-ink font-medium hover:underline">contact@facelab.app</a>
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-ink text-lg mb-2">부칙</h2>
          <p>이 개인정보처리방침은 2026년 8월 9일부터 시행됩니다.</p>
        </section>
      </div>

      <div className="mt-16 text-sm text-inkfade">
        <Link href="/" className="hover:text-ink transition-colors">← 홈으로 돌아가기</Link>
      </div>
    </main>
  );
}
