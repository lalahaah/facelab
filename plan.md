# plan.md — FaceLab 실행 계획

> Source of Truth. `architecture_research.md` + `wireframe_main.html` 확정 기준.
> 워크플로우: Claude(설계) → Antigravity CLI(실행) → Laha(검증) → git commit/push → 다음 태스크
> **"구현해" 명령 전까지 코드 작성 금지.** 완료된 태스크는 `[x]`로 표시하며 이 문서를 갱신.

## 0. 사전 준비 (Laha 직접 수행)

- [ ] Vercel 신규 프로젝트 생성 (`facelab`)
- [ ] `facelab.app` 도메인 구매 + Vercel 연결
- [ ] Firebase 신규 프로젝트 생성 (Firestore 활성화)
- [ ] GitHub 신규 레포 생성 (`lalahaah/facelab`)
- [ ] 로컬에 `cd facelab` 후 `agy` 실행 준비

## 1. 프로젝트 구조

```
facelab/
├── AGENTS.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # 홈 (히어로 + 카탈로그 + 프로세스 + 푸터)
│   ├── quiz/[slug]/page.tsx        # 퀴즈 실행 페이지
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── about/page.tsx
│   └── api/
│       └── og/route.tsx
├── components/
│   ├── ViewfinderFrame.tsx         # 브라켓+스캔라인 시그니처 컴포넌트
│   ├── QuizCard.tsx
│   ├── QuizRunner.tsx              # 업로드→추론→결과 공통 로직
│   └── ShareCard.tsx
├── config/
│   └── quizzes/
│       ├── blood-type.ts
│       ├── age-estimate.ts
│       └── face-reading.ts
├── lib/
│   └── firebase.ts
└── public/
    └── models/                     # TM 모델 export (모델 학습 완료 후)
```

## 2. DB 스키마 (Firebase Firestore) — architecture_research.md 기준 확정

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
| GET | `/api/og` | `?quiz=&result=` | PNG (OG 이미지) |

## 4. 태스크 목록

### Day 1 — 뼈대 + 홈페이지

- [ ] **TASK-001** Next.js 14 프로젝트 초기화 (TS, App Router, Tailwind, shadcn/ui) + `AGENTS.md` 생성
  - 파일: 전체 스캐폴딩, `AGENTS.md`
  - 검증: `pnpm dev` 로컬 구동 확인
- [ ] **TASK-002** 디자인 토큰 이식 (`tailwind.config.ts`, `app/globals.css`, 폰트 로드)
  - 파일: `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`
  - 값: paper #F5F6F2 / ink #12141A / scan #2D5BFF / blood #E63950 / amber #F2A93C / jade #1FA37D, Sora + IBM Plex Sans KR + IBM Plex Mono
  - 검증: 와이어프레임과 색/폰트 육안 대조
- [ ] **TASK-003** 홈페이지 정적 마크업 (`wireframe_main.html` → JSX 변환)
  - 파일: `app/page.tsx`, `components/ViewfinderFrame.tsx`, `components/QuizCard.tsx`
  - 검증: 데스크톱/모바일 반응형, 와이어프레임과 레이아웃 일치

### Day 2 — 퀴즈 플로우 + 공유카드 (모델 학습 전까지 진행 가능한 것들만)

- [ ] **TASK-004** `quizzes` config 구조 + `/quiz/[slug]` 라우트 스캐폴딩 (UI만, 모델 미연동)
  - 파일: `config/quizzes/*.ts`, `app/quiz/[slug]/page.tsx`
  - 검증: 3개 슬러그 모두 라우팅 정상, 업로드 UI 표시
- [x] **TASK-006** OG 이미지 공유카드 API (쿼리 파라미터 결과값 기준, 모델 불필요)
  - 파일: `app/api/og/route.tsx`, `components/ShareCard.tsx`
  - 검증: `/api/og?quiz=blood-type&result=B형` 접속 시 9:16 이미지 생성 확인
  - ✅ 완료. 한글 깨짐 없음(edge 런타임 기본 폰트로 fallback). 단, IBM Plex Sans KR 브랜드 폰트는 아님
  - 📌 백로그: 브랜드 폰트 임베딩 (TASK-006B, 배포 전 아무 때나 진행 가능, 안 막힘)
- [x] **TASK-007** Firebase 연결 + Firestore write-only 결과 로그
  - 파일: `lib/firebase.ts`, `components/QuizRunner.tsx` (결과 확정 시 write 호출 추가)
  - API 라우트 없음 — 클라이언트에서 직접 Firestore write
  - ✅ 완료. Firestore에 quizSlug/resultLabel/createdAt 정상 적재 확인

### Day 3 — 정책 페이지 + 수익화 + 배포 (모델 없이 완료 가능)

- [x] **TASK-008** 정책 페이지 3종 (개인정보처리방침 / 이용약관 / About)
  - 파일: `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/about/page.tsx`
  - 필수 문구: "사진은 서버로 전송/저장되지 않으며 브라우저에서만 처리됩니다"
  - ✅ 완료
- [x] **TASK-009** AdSense Auto Ads 스크립트 삽입 (심사 신청은 트래픽 확보 후 별도 진행)
  - 파일: `app/layout.tsx`, `public/ads.txt`
  - ✅ 완료. 심사 신청은 보류 (콘텐츠 부족 상태에서 신청 시 반려 경험 있음 — 트래픽 확보 후 신청 예정)
- [ ] **TASK-010** Vercel 배포 + `facelab.app` 도메인 연결 + env 변수 설정
  - 검증: 실제 도메인 접속 확인, Lighthouse 모바일 점수 체크

### 모델/결과 로직 완성 (TASK-005 분리 — 퀴즈별 방식이 다름)

- [x] **TASK-005-A** 혈액형: 결정론적 함수로 결과 생성
  - 파일: `lib/predictors/bloodType.ts`, `components/QuizRunner.tsx`
  - 방식: 업로드된 이미지를 canvas에 그려서 픽셀 데이터 추출 → 평균 색상/명도 등 특징값 계산 →
    해시로 A/B/O/AB 중 하나에 결정론적으로 매핑 (같은 사진 = 항상 같은 결과)
  - ✅ 완료

- [x] **TASK-005-A2** 혈액형 재미 요소(스캔 연출/사진 활용/리빌 애니메이션/희귀도)
  - 파일: `components/ScanSequence.tsx`, `components/ResultReveal.tsx`, `lib/predictors/bloodType.ts`, `components/QuizRunner.tsx`
  - ✅ 완료 (커밋 89a86ed)

- [x] **TASK-005-A3** 혈액형 결과 카드 — "표본 카드(Specimen Card)" 스타일 + 공유 기능
  - 파일: `components/SpecimenCard.tsx`(신규), `components/ShareButtons.tsx`(신규), `lib/predictors/bloodType.ts`(수정), `components/QuizRunner.tsx`(수정)
  - ✅ 기본 구현 완료 (커밋 201b479)
  - ⚠️ **미해결 버그**: 이미지 캡처 실패("이미지 생성에 실패했습니다") + 결과 화면에 "선택된 파일 없음" 텍스트 노출
    - 원인: html-to-image가 Tailwind v4의 oklch() 색상을 못 읽음 / file input 조건부 렌더링 누락 추정
    - 수정 프롬프트 전달됨(html2canvas-pro로 교체 지시) — **컴퓨터 이전 중 실행 안 된 것으로 확인, 재실행 필요**

- [x] **TASK-005-B** 나이 측정: Teachable Machine 실제 모델 연동
  - 전제조건: UTKFace(동양인 필터링) 데이터셋으로 Teachable Machine 학습 완료, `public/models/age-estimate/`에 model.json/metadata.json/weights.bin 배치 ✅ 완료
  - 파일: `components/QuizRunner.tsx`, `lib/predictors/ageEstimate.ts`(신규)
  - 검증: 업로드 시 연령대 예측 결과 정상 표시
  - ✅ 완료. Teachable Machine 모델 연동 및 확률 분포 바 표시, 카드 번호 해시 함수 분리 및 공유

- [x] **TASK-005-C** 관상: 랜드마크 추출 + 서술형 문구뱅크 조합
  - 전제조건: `config/face-reading-phrases.ts` 문구뱅크 (Claude가 별도로 작성해서 전달 예정)
  - 파일: `lib/predictors/faceReading.ts`, `config/face-reading-phrases.ts`, `components/QuizRunner.tsx`
  - 방식: MediaPipe FaceMesh(@mediapipe/tasks-vision 또는 TensorFlow.js face-landmarks-detection)로
    얼굴 랜드마크 추출 → 눈/코/입/얼굴형 비율 계산 → 문구뱅크에서 특징 구간별 문장 조합 →
    2~3문단 서술형 결과 생성
  - 검증: 업로드 시 서술형 리포트(여러 문단) 정상 표시, 얼굴 미검출 시 에러 처리
  - ✅ 완료. MediaPipe FaceMesh 랜드마크 추출, 4개 비율 계산 및 문구뱅크 조합, 서술형 결과 카드 및 미검출 에러 상태 구현

## 5. 사전 커밋 체크 (매 태스크 공통)

```
[ ] .env, .env.local, google-services.json 등 미포함 확인
[ ] 지정된 파일 외 변경 없음 확인 (git diff 확인)
[ ] pnpm build 성공 확인
```

## 6. 병행 트랙

- [x] 나이 측정용 UTKFace 데이터셋으로 Teachable Machine 학습 (TASK-005-B 전제조건)
- [ ] 관상 문구뱅크 설계 (Claude 작업, TASK-005-C 전제조건)

혈액형(TASK-005-A)은 별도 준비 없이 바로 진행 가능.
