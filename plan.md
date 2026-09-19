# plan.md — FaceLab 실행 계획

> Source of Truth. `architecture_research.md` + `wireframe_main.html` 확정 기준.
> 워크플로우: Claude(설계) → Antigravity CLI(실행) → Laha(검증) → git commit/push → 다음 태스크
> **"구현해" 명령 전까지 코드 작성 금지.** 완료된 태스크는 `[x]`로 표시하며 이 문서를 갱신.

## 0. 사전 준비

- [x] Vercel 신규 프로젝트 생성 (`facelab`)
- [x] Firebase 신규 프로젝트 생성 (Firestore 활성화)
- [x] GitHub 신규 레포 생성 (`lalahaah/facelab`)
- [ ] `facelab.app` 도메인 연결 — 구매는 완료, **연결은 의도적으로 보류**. 현재
      `https://facelab-eosin.vercel.app`로 운영 중. AdSense 심사 신청 전에는
      반드시 연결 필요 (vercel.app 서브도메인은 승인 어려움)

## 1. 프로젝트 구조

```
facelab/
├── AGENTS.md
├── app/
│   ├── layout.tsx                  # 메타데이터, GA4, AdSense, 검색엔진 인증 태그
│   ├── page.tsx                    # 홈 (히어로 + 카탈로그 + 프로세스 + 푸터)
│   ├── quiz/[slug]/page.tsx        # 퀴즈 실행 페이지
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── about/page.tsx
│   ├── sitemap.ts
│   └── api/
│       └── og/route.tsx
├── components/
│   ├── ViewfinderFrame.tsx         # 브라켓+스캔라인 시그니처 컴포넌트
│   ├── QuizCard.tsx
│   ├── QuizRunner.tsx              # 업로드/촬영→스캔 연출→예측→결과 공통 로직
│   ├── CameraCapture.tsx           # 실시간 카메라 촬영
│   ├── ScanSequence.tsx            # 스캔 연출 (재사용)
│   ├── ResultReveal.tsx            # 결과 리빌 애니메이션 (재사용)
│   ├── SpecimenCard.tsx            # 표본 카드 (stats 모드 / narrative 모드)
│   └── ShareButtons.tsx            # 이미지 저장 / 공유
├── config/
│   ├── quizzes/
│   │   ├── blood-type.ts
│   │   ├── age-estimate.ts
│   │   ├── face-reading.ts
│   │   └── index.ts
│   └── face-reading-phrases.ts     # 관상 문구뱅크 (Claude 작성)
├── lib/
│   ├── firebase.ts
│   └── predictors/
│       ├── hash.ts                 # 공유 해시 유틸 (카드 번호 등)
│       ├── bloodType.ts            # 결정론적 함수
│       ├── ageEstimate.ts          # Teachable Machine 모델 연동
│       └── faceReading.ts          # 랜드마크 추출 + 문구 조합
└── public/
    ├── models/age-estimate/        # Teachable Machine export (model.json 등)
    ├── ads.txt
    └── robots.txt
```

## 2. DB 스키마 (Firebase Firestore)

```
컬렉션: quiz_results
  quizSlug: string
  resultLabel: string
  createdAt: Timestamp (serverTimestamp)
```

이미지/PII 없음. `quizzes` 메타데이터는 DB 대신 `config/quizzes/*.ts` 정적 파일로 관리.
서버 API 라우트 없이 `QuizRunner`에서 Firestore 클라이언트 SDK로 직접 write (보안 규칙: create만 허용).

## 3. API 스펙

| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| GET | `/api/og` | `?quiz=&result=` | PNG (OG 이미지, 링크 미리보기용) |

사용자 사진이 들어간 실제 공유 이미지는 서버 API가 아니라 `ShareButtons`가
브라우저에서 `SpecimenCard`를 캡처해서 만든다 (서버로 사진 전송 없음).

## 4. 태스크 목록 — 뼈대/인프라

- [x] **TASK-001** Next.js 14 프로젝트 초기화 + `AGENTS.md` 생성
- [x] **TASK-002** 디자인 토큰 이식 (paper/ink/scan/blood/amber/jade, Sora+IBM Plex Sans KR+Mono)
- [x] **TASK-003** 홈페이지 정적 마크업 (`wireframe_main.html` → JSX)
- [x] **TASK-004** `quizzes` config 구조 + `/quiz/[slug]` 라우팅
- [x] **TASK-006** OG 이미지 공유카드 API
  - 📌 백로그(TASK-006B): 브랜드 폰트(IBM Plex Sans KR) 임베딩 — 지금은 기본 폰트로 fallback, 한글 깨짐은 없음
- [x] **TASK-007** Firebase Firestore 연결 + write-only 결과 로그
- [x] **TASK-008** 정책 페이지 3종 (개인정보처리방침/이용약관/About)
- [x] **TASK-009** AdSense Auto Ads 스크립트 삽입
  - 📌 심사 신청은 보류 중 — 트래픽 확보 + 도메인 연결 후 진행 예정
- [x] **TASK-010** Vercel 배포 + env 변수 설정
  - 도메인은 `NEXT_PUBLIC_SITE_URL` 환경변수로 관리 (하드코딩 제거 완료)

## 5. 태스크 목록 — 퀴즈별 예측 로직

- [x] **TASK-005-A** 혈액형: 결정론적 함수 (픽셀 해시 → A/B/O/AB 분포 매핑)
- [x] **TASK-005-A2** 스캔 연출 / 사진 활용 / 결과 리빌 애니메이션 / 희귀도 프레이밍
- [x] **TASK-005-A3** 표본 카드(Specimen Card) + 공유 기능
  - ⚠️ **재확인 필요**: html2canvas-pro 교체 수정 프롬프트를 전달했으나, 이후 실제
    "이미지 저장" 테스트로 성공 확인한 기록이 없음. 다음 세션에서 재검증 권장.
- [x] **TASK-005-B** 나이 측정: Teachable Machine 모델 연동 (UTKFace 동양인 필터 학습)
  - 정확도는 계속 관찰 중 — 학습 데이터 보강 여지 있음 (추후 필요시 논의)
- [x] **TASK-005-C** 관상: 랜드마크 추출 + 서술형 문구뱅크
  - 2단계 파이프라인(얼굴 탐지 BlazeFace → 크롭 → FaceMesh)으로 상반신/전신 사진도 대응
- [x] **부가 기능** 카메라 실시간 촬영 (업로드와 병행, 3개 퀴즈 공유 지점에 통합)
- [x] **부가 기능** 결과 화면 퀴즈별 "재미로만 봐주세요" 안내 문구

## 6. 태스크 목록 — SEO/트래픽 준비

- [x] 홈페이지 네비게이션 퀴즈 링크 실제 연결
- [x] Google Analytics 4 연동 (측정 ID: G-SP1H48E4HB)
- [x] Google Search Console 등록 (URL 접두어: facelab-eosin.vercel.app, HTML 태그 인증)
- [x] 네이버 서치어드바이저 등록 (HTML 태그 인증)
- [x] `NEXT_PUBLIC_SITE_URL` 환경변수 도입 — 도메인 하드코딩 제거 (metadataBase, sitemap.ts, robots.txt, 카드 워터마크 등)

## 7. 남은 것 / 다음에 결정할 것

- [ ] TASK-005-A3 이미지 캡처 정상 동작 재확인
- [ ] TASK-006B 공유카드 API 브랜드 폰트 임베딩 (선택)
- [ ] 나이 측정 모델 정확도 보강 여부 판단 (데이터 추가 학습 등)
- [ ] `facelab.app` 도메인 연결 시점 결정 → 연결 시 `NEXT_PUBLIC_SITE_URL` 값 변경 +
      `public/robots.txt`의 Sitemap 라인 수동 수정 필요 (정적 파일이라 env 자동 반영 안 됨)
- [ ] 트래픽 확보 후 AdSense 심사 신청

## 8. 사전 커밋 체크 (매 태스크 공통)

```
[ ] .env, .env.local, google-services.json 등 미포함 확인
[ ] 지정된 파일 외 변경 없음 확인 (git diff 확인)
[ ] pnpm build 성공 확인
```
